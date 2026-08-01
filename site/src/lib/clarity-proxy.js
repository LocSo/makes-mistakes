const CLARITY_LOADER_PATH = '/_analytics/clarity/loader.js';
const CLARITY_PROXY_PREFIX = '/_analytics/clarity/p/';
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);
const ALLOWED_METHODS = new Set(['GET', 'HEAD', 'POST']);
const MAX_UPLOAD_BYTES = 1024 * 1024;

const CLARITY_LOADER = String.raw`(() => {
  const bootstrap = document.currentScript;
  const projectId = bootstrap?.dataset.projectId;
  if (!projectId || ['localhost', '127.0.0.1', '::1'].includes(location.hostname)) return;
  if (window.clarity?.v) return;

  const prefix = '/_analytics/clarity/p/';
  const allowed = (hostname) => hostname === 'c.bing.com'
    || hostname === 'www.clarity.ms'
    || hostname.endsWith('.clarity.ms');
  const proxyUrl = (value) => {
    try {
      const url = new URL(typeof value === 'string' ? value : value.url, location.href);
      if (!allowed(url.hostname) || url.pathname.startsWith(prefix)) return value;
      return prefix + encodeURIComponent(url.hostname) + url.pathname + url.search + url.hash;
    } catch {
      return value;
    }
  };

  const nativeFetch = window.fetch;
  if (nativeFetch) {
    window.fetch = function (input, init) {
      if (input instanceof Request) {
        const nextUrl = proxyUrl(input.url);
        input = nextUrl === input.url ? input : new Request(nextUrl, input);
      } else input = proxyUrl(input);
      return nativeFetch.call(this, input, init);
    };
  }

  const nativeOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    return nativeOpen.call(this, method, proxyUrl(url), ...rest);
  };

  if (navigator.sendBeacon) {
    const nativeBeacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = (url, data) => nativeBeacon(proxyUrl(url), data);
  }

  const patchUrlProperty = (prototype, property) => {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, property);
    if (!descriptor?.get || !descriptor?.set) return;
    Object.defineProperty(prototype, property, {
      ...descriptor,
      set(value) { descriptor.set.call(this, proxyUrl(value)); },
    });
  };
  patchUrlProperty(HTMLScriptElement.prototype, 'src');
  patchUrlProperty(HTMLImageElement.prototype, 'src');
  patchUrlProperty(HTMLLinkElement.prototype, 'href');

  const nativeSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name, value) {
    const tag = this.tagName;
    if ((name === 'src' && (tag === 'SCRIPT' || tag === 'IMG')) || (name === 'href' && tag === 'LINK')) {
      value = proxyUrl(value);
    }
    return nativeSetAttribute.call(this, name, value);
  };

  window.clarity = window.clarity || function (...args) {
    (window.clarity.q = window.clarity.q || []).push(args);
  };

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = prefix + 'www.clarity.ms/tag/' + encodeURIComponent(projectId);
  if (bootstrap?.nonce) tag.nonce = bootstrap.nonce;
  bootstrap?.parentNode?.insertBefore(tag, bootstrap.nextSibling);
})();`;

function isAllowedClarityHost(hostname) {
  return hostname === 'c.bing.com' || hostname === 'www.clarity.ms' || /^[a-z0-9-]+\.clarity\.ms$/i.test(hostname);
}

function anonymizeIp(value) {
  const ip = String(value || '').trim();
  if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
    const parts = ip.split('.');
    return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  }
  if (ip.includes(':')) {
    const [left = '', right = ''] = ip.split('::', 2);
    const leftParts = left ? left.split(':') : [];
    const rightParts = right ? right.split(':') : [];
    const missing = Math.max(0, 8 - leftParts.length - rightParts.length);
    const parts = [...leftParts, ...Array(missing).fill('0'), ...rightParts].map((part) => part || '0');
    return `${parts.slice(0, 3).join(':')}::`;
  }
  return '0.0.0.0';
}

function sameOriginRequest(request, url) {
  const site = request.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin' && site !== 'none') return false;
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).origin === url.origin; } catch { return false; }
}

function upstreamHeaders(request) {
  const headers = new Headers();
  for (const name of ['accept', 'content-type', 'user-agent']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const language = String(request.headers.get('accept-language') || '').split(',', 1)[0].split(';', 1)[0].split('-', 1)[0].trim();
  if (language) headers.set('accept-language', language);
  const ip = anonymizeIp(request.headers.get('x-forwarded-for')?.split(',', 1)[0] || request.headers.get('cf-connecting-ip'));
  headers.set('x-real-ip', ip);
  headers.set('x-forwarded-for', ip);
  return headers;
}

async function fetchAllowed(url, init, redirectsLeft = 2) {
  const response = await fetch(url, { ...init, redirect: 'manual' });
  if (response.status < 300 || response.status >= 400) return response;
  if (redirectsLeft <= 0) return new Response('Too many upstream redirects', { status: 502 });
  const location = response.headers.get('location');
  if (!location) return response;
  const next = new URL(location, url);
  if (next.protocol !== 'https:' || !isAllowedClarityHost(next.hostname)) return new Response('Forbidden upstream redirect', { status: 502 });
  return fetchAllowed(next, init, redirectsLeft - 1);
}

export async function handleClarityRequest(request) {
  const url = new URL(request.url);
  if (LOCAL_HOSTNAMES.has(url.hostname)) return null;

  if (url.pathname === CLARITY_LOADER_PATH) {
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
    return new Response(request.method === 'HEAD' ? null : CLARITY_LOADER, {
      headers: {
        'cache-control': 'public, max-age=86400, stale-while-revalidate=604800',
        'content-type': 'text/javascript; charset=utf-8',
        'cross-origin-resource-policy': 'same-origin',
        'x-content-type-options': 'nosniff',
      },
    });
  }

  if (!url.pathname.startsWith(CLARITY_PROXY_PREFIX)) return null;
  if (!sameOriginRequest(request, url)) return new Response('Forbidden', { status: 403 });
  if (!ALLOWED_METHODS.has(request.method)) return new Response('Method not allowed', { status: 405, headers: { allow: 'GET, HEAD, POST' } });

  const remainder = url.pathname.slice(CLARITY_PROXY_PREFIX.length);
  const slash = remainder.indexOf('/');
  if (slash <= 0) return new Response('Invalid proxy path', { status: 400 });
  let hostname;
  try { hostname = decodeURIComponent(remainder.slice(0, slash)).toLowerCase(); } catch { return new Response('Invalid proxy host', { status: 400 }); }
  if (!isAllowedClarityHost(hostname)) return new Response('Forbidden upstream', { status: 403 });

  const upstream = new URL(`https://${hostname}${remainder.slice(slash)}`);
  upstream.search = url.search;
  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > MAX_UPLOAD_BYTES) return new Response('Payload too large', { status: 413 });
  let body;
  if (request.method === 'POST') {
    body = await request.arrayBuffer();
    if (body.byteLength > MAX_UPLOAD_BYTES) return new Response('Payload too large', { status: 413 });
  }

  let response;
  try {
    response = await fetchAllowed(upstream, { method: request.method, headers: upstreamHeaders(request), body });
  } catch {
    return new Response('Clarity upstream unavailable', { status: 502 });
  }

  const headers = new Headers();
  for (const name of ['content-type', 'etag', 'last-modified']) {
    const value = response.headers.get(name);
    if (value) headers.set(name, value);
  }
  const isAsset = request.method !== 'POST' && /(?:javascript|json|image|font|css)/i.test(headers.get('content-type') || '');
  headers.set('cache-control', isAsset ? 'public, max-age=300, stale-while-revalidate=86400' : 'no-store');
  headers.set('cross-origin-resource-policy', 'same-origin');
  headers.set('x-content-type-options', 'nosniff');
  return new Response(request.method === 'HEAD' ? null : response.body, { status: response.status, statusText: response.statusText, headers });
}

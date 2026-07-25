// Only the hedge itself is matched, never the model name. The same verb phrase turns up
// across hosts — "peut faire des erreurs" is how both ChatGPT and Claude word it — so one
// line usually covers several, and whatever precedes it is left alone. It also sidesteps
// the trap where two hosts spell the same word with different diacritics.
//
// This is safe only because the rewrite is confined to the disclaimer element; a bare
// phrase loose in the page would match the conversation too.
//
// Wording collected from the live interfaces. The grammar of dropping a hedge differs
// per language — sometimes a conjugation, sometimes a whole word, in Hungarian a suffix —
// and outside the languages the author reads, these are careful but unverified. Native
// corrections are welcome.
const HEDGES = [
  // English — every host, plus Google's own phrasing.
  [/can make mistakes/i, "makes mistakes"],
  [/may include mistakes/i, "include mistakes"],

  // German
  [/kann Fehler machen/i, "macht Fehler"],
  [/können Fehler enthalten/i, "enthalten Fehler"],
  // French
  [/peut faire des erreurs/i, "fait des erreurs"],
  [/peuvent contenir des erreurs/i, "contiennent des erreurs"],
  // Spanish
  [/puede cometer errores/i, "comete errores"],
  [/pueden contener errores/i, "contienen errores"],
  [/pueden incluir errores/i, "incluyen errores"],
  // Portuguese
  [/pode cometer erros/i, "comete erros"],
  [/podem conter erros/i, "contêm erros"],
  [/podem incluir erros/i, "incluem erros"],
  // Italian
  [/può commettere errori/i, "commette errori"],
  [/potrebbero contenere errori/i, "contengono errori"],
  // Catalan
  [/pot cometre errors/i, "comet errors"],
  [
    /És possible que les respostes de la IA incloguin errors/i,
    "Les respostes de la IA inclouen errors",
  ],
  // Dutch
  [/kan fouten maken/i, "maakt fouten"],
  [/kunnen fouten bevatten/i, "bevatten fouten"],
  // Afrikaans
  [/kan foute insluit/i, "sluit foute in"],
  // Swedish
  [/kan begå misstag/i, "begår misstag"],
  [/kan innehålla fel/i, "innehåller fel"],
  // Danish
  [/kan tage fejl/i, "tager fejl"],
  [/kan indeholde fejl/i, "indeholder fejl"],
  // Norwegian
  [/kan gjøre feil/i, "gjør feil"],
  [/kan inneholde feil/i, "inneholder feil"],
  // Icelandic
  [/getur gert mistök/i, "gerir mistök"],
  [/kunna að innihalda mistök/i, "innihalda mistök"],

  // Polish
  [/może popełniać błędy/i, "popełnia błędy"],
  [/mogą zawierać błędy/i, "zawierają błędy"],
  // Czech
  [/může dělat chyby/i, "dělá chyby"],
  [/můžou obsahovat chyby/i, "obsahují chyby"],
  // Slovak
  [/môže robiť chyby/i, "robí chyby"],
  [/môžu byť chyby/i, "sú chyby"],
  // Slovenian
  [/se lahko moti/i, "se moti"],
  [/morda vsebujejo napake/i, "vsebujejo napake"],
  // Croatian
  [/može pogriješiti/i, "griješi"],
  [/mogu sadržavati pogreške/i, "sadrže pogreške"],
  // Bosnian
  [/može napraviti greške/i, "pravi greške"],
  // Serbian
  [/може да прави грешке/i, "прави грешке"],
  [/могу да садрже грешке/i, "садрже грешке"],
  // Bulgarian
  [/може да прави грешки/i, "прави грешки"],
  [/може да съдържат грешки/i, "съдържат грешки"],
  // Macedonian
  [/може да направи грешки/i, "прави грешки"],
  [/може да содржат грешки/i, "содржат грешки"],
  // Russian
  [/может допускать ошибки/i, "допускает ошибки"],
  [/могут быть ошибки/i, "есть ошибки"],
  // Ukrainian
  [/може помилятися/i, "помиляється"],
  [/можуть містити помилки/i, "містять помилки"],

  // Romanian
  [/poate face greșeli/i, "face greșeli"],
  [/pot include greșeli/i, "includ greșeli"],
  // Greek
  [/μπορεί να κάνει λάθη/i, "κάνει λάθη"],
  [/μπορεί να περιλαμβάνουν λάθη/i, "περιλαμβάνουν λάθη"],
  // Hungarian — the hedge is a suffix, so the verb is replaced outright.
  [/hibázhat/i, "hibázik"],
  [/előfordulhatnak hibák/i, "előfordulnak hibák"],
  // Finnish
  [/voi tehdä virheitä/i, "tekee virheitä"],
  [/voivat sisältää virheitä/i, "sisältävät virheitä"],
  // Estonian
  [/võib teha vigu/i, "teeb vigu"],
  [/võivad sisaldada vigu/i, "sisaldavad vigu"],
  // Latvian
  [/var pieļaut kļūdas/i, "pieļauj kļūdas"],
  [/var būt kļūdas/i, "ir kļūdas"],
  // Lithuanian
  [/gali suklysti/i, "klysta"],
  [/gali būti klaidų/i, "yra klaidų"],
  // Albanian
  [/mund të bëjë gabime/i, "bën gabime"],
  [/mund të përfshijnë gabime/i, "përfshijnë gabime"],

  // Turkish
  [/hata yapabilir/i, "hata yapar"],
  [/hata olabilir/i, "hata var"],
  // Azerbaijani
  [/səhvlər ola bilər/i, "səhvlər var"],
  // Kazakh
  [/қателесуі мүмкін/i, "қателеседі"],
  [/қате болуы мүмкін/i, "қате бар"],
  // Kyrgyz
  [/каталар болушу мүмкүн/i, "каталар бар"],
  // Uzbek
  [/xatolar boʻlishi mumkin/i, "xatolar bor"],
  // Mongolian
  [/алдаа гаргаж болно/i, "алдаа гаргадаг"],
  [/алдаатай байж болзошгүй/i, "алдаатай байдаг"],

  // Indonesian
  [/dapat membuat kesalahan/i, "membuat kesalahan"],
  [/bisa keliru/i, "keliru"],
  [/mungkin berisi kesalahan/i, "berisi kesalahan"],
  // Malay
  [/boleh melakukan kesilapan/i, "melakukan kesilapan"],
  [/mungkin mengandungi kesilapan/i, "mengandungi kesilapan"],
  // Filipino
  [/Maaaring magkamali/i, "Nagkakamali"],
  [/Posibleng magkaroon ng mga pagkakamali/i, "May mga pagkakamali"],
  // Vietnamese
  [/có thể mắc lỗi/i, "mắc lỗi"],
  [/có thể chứa thông tin không chính xác/i, "chứa thông tin không chính xác"],
  // Thai
  [/อาจมีข้อผิดพลาด/i, "มีข้อผิดพลาด"],
  // Swahili
  [/inaweza kufanya makosa/i, "hufanya makosa"],
  [/Huenda majibu ya AI yakawa na makosa/i, "Majibu ya AI yana makosa"],
  // Somali
  [/sameyn karaa/i, "sameeyaa"],

  // Japanese
  [/必ずしも正しいとは限りません/i, "正しくありません"],
  [/誤りを含む可能性があります/i, "誤りを含みます"],
  [/間違いが含まれている場合があります/i, "間違いが含まれています"],
  // Korean
  [/실수를 할 수 있습니다/i, "실수를 합니다"],
  [/실수할 수 있습니다/i, "실수합니다"],
  [/오류가 있을 수 있습니다/i, "오류가 있습니다"],
  // Chinese
  [/可能会犯错/i, "会犯错"],
  [/可能包含错误/i, "包含错误"],
  [/可能會出錯/i, "會出錯"],
  [/可能有誤/i, "有誤"],

  // Arabic
  [/يمكن أن تصدر/i, "تصدر"],
  [/قد تتضمّن/i, "تتضمّن"],
  // Hebrew
  [/עלולות לכלול/i, "כוללות"],
  // Persian
  [/ممکن است اشتباه کند/i, "اشتباه می‌کند"],
  [/ممکن است اشتباه وجود داشته باشد/i, "اشتباه وجود دارد"],
  // Urdu
  [/غلطیاں کر سکتا ہے/i, "غلطیاں کرتا ہے"],
  [/غلطیاں ہو سکتی ہیں/i, "غلطیاں ہوتی ہیں"],

  // Hindi — matching only the verb dodges the two spellings of "mistakes".
  [/कर सकता है/i, "करता है"],
  [/हो सकती हैं/i, "होती हैं"],
  // Marathi
  [/चुकू शकते/i, "चुकते"],
  [/चुका असू शकतात/i, "चुका असतात"],
  // Nepali
  [/समावेश हुन सक्छन्/i, "समावेश हुन्छन्"],
  // Bengali
  [/ভুল করতে পারে/i, "ভুল করে"],
  [/ভুল থাকতে পারে/i, "ভুল থাকে"],
  // Punjabi
  [/ਕਰ ਸਕਦਾ ਹੈ/i, "ਕਰਦਾ ਹੈ"],
  [/ਹੋ ਸਕਦੀਆਂ ਹਨ/i, "ਹੁੰਦੀਆਂ ਹਨ"],
  // Gujarati
  [/કરી શકે છે/i, "કરે છે"],
  [/હોઈ શકે છે/i, "હોય છે"],
  // Tamil
  [/தவறு செய்யலாம்/i, "தவறு செய்கிறது"],
  [/தவறுகள் இருக்கலாம்/i, "தவறுகள் உள்ளன"],
  // Telugu
  [/తప్పులు చేయగలదు/i, "తప్పులు చేస్తుంది"],
  [/తప్పులు ఉండవచ్చు/i, "తప్పులు ఉంటాయి"],
  // Kannada
  [/ಮಾಡಬಹುದು/i, "ಮಾಡುತ್ತದೆ"],
  [/ಒಳಗೊಂಡಿರಬಹುದು/i, "ಒಳಗೊಂಡಿವೆ"],
  // Malayalam
  [/തെറ്റുകൾ സംഭവിക്കാം/i, "തെറ്റുകൾ സംഭവിക്കുന്നു"],
  [/തെറ്റുകൾ ഉൾപ്പെട്ടേക്കാം/i, "തെറ്റുകൾ ഉൾപ്പെടുന്നു"],
  // Sinhala
  [/ඇතුළත් විය හැක/i, "ඇතුළත් වේ"],
  // Lao
  [/ອາດມີຂໍ້ຜິດພາດ/i, "ມີຂໍ້ຜິດພາດ"],
  // Burmese
  [/ပြုလုပ်နိုင်ပါသည်/i, "ပြုလုပ်ပါသည်"],
  // Amharic
  [/ሊሠራ ይችላል/i, "ይሠራል"],
  [/ሊያካትቱ ይችላሉ/i, "ያካትታሉ"],
  // Georgian
  [/შეიძლება შეცდეს/i, "ცდება"],
  [/შესაძლოა, შეცდომებს შეიცავდეს/i, "შეცდომებს შეიცავს"],
  // Armenian
  [/կարող է սխալներ թույլ տալ/i, "սխալներ է թույլ տալիս"],
  [/կարող են սխալներ պարունակել/i, "սխալներ են պարունակում"],
]

// The rewrite is confined to the host's own disclaimer element. Matching anywhere in the
// page also caught the composer and the messages themselves, so quoting the sentence in
// a prompt silently edited what you were about to send.
const FOOTERS = [
  '[data-testid="thread-disclaimer"]', // ChatGPT
  "[data-disclaimer]", // Claude
  "hallucination-disclaimer", // Gemini
  // Google AI Mode. Its class names are generated and rotate between releases; the
  // support link under the answer is the one stable thing about that footer.
  'div:has(> a[href*="websearch?p=aimode"])',
].join(", ")

const CLOWN = "\u{1F921}"
const GILDED = "mm-gilded"
const CLOWN_CLASS = "mm-clown"

const NUDGE = "YOU'RE WRONG. DOUBLE-CHECK THE INFORMATION. DON'T LIE TO ME!"
const COMPOSER = [
  "#prompt-textarea", // ChatGPT
  '[contenteditable="true"][data-testid="chat-input"]', // Claude
  '[data-testid="chat-input"] [contenteditable="true"]', // Grok, where the testid is on the wrapper
  '.ql-editor[contenteditable="true"]', // Gemini
  '[data-xid="aim-mars-input-plate"] textarea', // Google AI Mode, a plain textarea
].join(", ")

// Each host gets its own anchor inside its own layout — chasing the composer with
// fixed coordinates lagged a frame behind every scroll.
const MOUNTS = [
  // Not the header slot: ChatGPT puts its own disclaimer there, and in an empty chat
  // that slot lives somewhere else entirely.
  {
    selector: 'form[data-type="unified-composer"]',
    variant: "mm-button--flow",
    beside: "form",
    // ChatGPT's own disclaimer shares this column, so the rail takes no height and the
    // button floats above the form instead of pushing the text up.
    float: true,
    // Nothing to improve until the assistant has actually said something.
    needs: '[data-message-author-role="assistant"]',
  }, // ChatGPT
  {
    selector: "[data-chat-input-container]",
    variant: "mm-button--overlay",
    // Claude marks the answer itself, so this also waits out the stream rather than
    // appearing on the first token like the other hosts.
    needs: '[data-is-streaming="false"]',
  }, // Claude
  {
    selector: "input-container",
    variant: "mm-button--flow",
    // Measured off the fieldset, not the editable: the editable widens as you type.
    beside: "fieldset",
    needs: "model-response",
  }, // Gemini
  {
    selector: ".query-bar",
    variant: "mm-button--flow",
    beside: ".query-bar",
    needs: '[data-testid="assistant-message"]',
  }, // Grok
  {
    selector: '[data-xid="aim-mars-input-plate"]',
    variant: "mm-button--flow",
    beside: '[data-xid="aim-mars-input-plate"]',
    // That link only exists in the footer under a finished answer.
    needs: 'a[href*="websearch?p=aimode"]',
  }, // Google AI Mode
]

// Grok ships no disclaimer at all, so it does not get to look innocent — we write one.
const GRAFTED = "mm-grafted"
const RAIL = "mm-rail"
const GRAFT = {
  host: "grok.com",
  anchor: ".query-bar",
  needs: '[data-testid="assistant-message"]',
  text: "Grok makes mistakes. Check important info.",
}

// lucide "zap"
const ZAP =
  "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"

// Each host carries its own theme, independent of the OS: ChatGPT and Grok set
// `color-scheme` on <html>, Claude uses data-mode, Gemini a class on <body>. Reading the
// OS preference instead put white text on a white footer whenever the two disagreed.
function theme() {
  const html = document.documentElement
  const scheme = getComputedStyle(html).colorScheme

  const dark =
    scheme === "dark" ||
    html.dataset.mode === "dark" ||
    html.classList.contains("dark") ||
    document.body.classList.contains("dark-theme") ||
    unlit()

  html.dataset.mmTheme = dark ? "dark" : "light"
}

// Last resort for a host that advertises its theme nowhere: read what the page is
// actually painted, since that is the thing the disclaimer has to stay legible against.
function unlit() {
  for (const node of [document.body, document.documentElement]) {
    const [r, g, b, a = 1] =
      getComputedStyle(node)
        .backgroundColor.match(/[\d.]+/g)
        ?.map(Number) ?? []
    if (r === undefined || a === 0) continue
    return r * 0.299 + g * 0.587 + b * 0.114 < 128
  }
  return false
}

function gild(textNode) {
  const text = textNode.nodeValue
  if (!text) return

  const hedge = HEDGES.find(([pattern]) => pattern.test(text))
  if (!hedge) return

  const parent = textNode.parentElement
  if (!parent) return

  // Google's footer continues into a "Learn more" link, so a trailing space is load
  // bearing — it moves to the far side of the clown rather than being trimmed away.
  const spaced = /\s$/.test(text)
  textNode.nodeValue = text.replace(hedge[0], hedge[1]).replace(/\s+$/, "")
  parent.classList.add(GILDED)

  // The clown lives in its own span: `background-clip: text` would otherwise mask it
  // into a gold silhouette instead of letting it render as an emoji.
  if (parent.querySelector(`.${CLOWN_CLASS}`)) return
  const clown = document.createElement("span")
  clown.className = CLOWN_CLASS
  clown.textContent = spaced ? ` ${CLOWN} ` : ` ${CLOWN}`
  textNode.after(clown)
}

function graft() {
  if (location.hostname !== GRAFT.host) return

  // Only once there is an answer to disclaim; drop it again on an empty screen.
  if (!document.querySelector(GRAFT.needs)) {
    document.querySelector(`.${GRAFTED}`)?.remove()
    return
  }
  if (document.querySelector(`.${GRAFTED}`)) return

  const anchor = document.querySelector(GRAFT.anchor)
  if (!anchor) return

  const note = document.createElement("p")
  note.className = `${GRAFTED} ${GILDED}`
  note.textContent = GRAFT.text

  const clown = document.createElement("span")
  clown.className = CLOWN_CLASS
  clown.textContent = ` ${CLOWN}`
  note.append(clown)

  anchor.after(note)
}

function gildFooter(footer) {
  const walker = document.createTreeWalker(footer, NodeFilter.SHOW_TEXT)
  const found = []
  while (walker.nextNode()) found.push(walker.currentNode)
  found.forEach(gild)
}

// Resolves whatever the observer handed us to the footers it belongs to or contains,
// and rewrites only those.
function sweep(root) {
  if (root.nodeType === Node.TEXT_NODE) {
    const footer = root.parentElement?.closest(FOOTERS)
    if (footer) gild(root)
    return
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return

  if (root.closest(FOOTERS)) {
    gildFooter(root.closest(FOOTERS))
    return
  }
  root.querySelectorAll(FOOTERS).forEach(gildFooter)
}

function insertNudge() {
  const composer = document.querySelector(COMPOSER)
  if (!composer) return

  composer.focus()

  // Google AI Mode composes in a plain textarea, where a Range does not apply; the
  // caret is moved with the field's own selection API instead.
  if (composer instanceof HTMLTextAreaElement) {
    const end = composer.value.length
    composer.setSelectionRange(end, end)
    document.execCommand("insertText", false, composer.value.trim() ? ` ${NUDGE}` : NUDGE)
    return
  }

  // execCommand fires beforeinput/input, which is how ProseMirror learns about the text
  const selection = window.getSelection()
  selection.removeAllRanges()
  const range = document.createRange()
  range.selectNodeContents(composer)
  range.collapse(false)
  selection.addRange(range)
  document.execCommand("insertText", false, composer.textContent.trim() ? ` ${NUDGE}` : NUDGE)
}

function buildButton() {
  const element = document.createElement("button")
  element.type = "button"
  element.className = "mm-button"
  element.title = "Improve answer"
  element.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ZAP}"/></svg><span>Improve answer</span>`
  return element
}

const button = buildButton()
let flashed = false

button.addEventListener("click", () => {
  insertNudge()
  button.classList.remove("mm-button--fired")
  void button.offsetWidth
  button.classList.add("mm-button--fired")
})

async function flashOnce() {
  if (flashed) return
  flashed = true

  // Read when it is needed rather than once at startup, so toggling the popup setting
  // takes effect in tabs that were already open.
  const { flash } = await chrome.storage.sync.get({ flash: true })
  if (flash) button.classList.add("mm-button--flash")
}

// These hosts centre a narrower composer inside a wide container, so "align left" would
// put the button at the edge of the screen. This lays a rail the same width as the
// composer itself and hangs the button off its left edge.
function row(anchor, measured, float) {
  const box = anchor.querySelector(measured) ?? anchor
  const existing = anchor.previousElementSibling
  const rail = existing?.classList.contains(RAIL) ? existing : document.createElement("div")

  rail.className = float ? `${RAIL} ${RAIL}--float` : RAIL

  // Only written when it actually changed: this runs on every frame the host streams a
  // token into, and assigning a width unconditionally forces a layout each time.
  const width = `${box.getBoundingClientRect().width}px`
  if (rail.style.width !== width) rail.style.width = width
  if (!rail.isConnected) anchor.before(rail)

  return rail
}

function mount() {
  const target = MOUNTS.map((m) => ({ host: document.querySelector(m.selector), ...m })).find(
    (m) => m.host
  )

  // Nothing to improve until the assistant has actually answered.
  const answered = target && (!target.needs || document.querySelector(target.needs))

  if (!answered) {
    button.remove()
    // All of them: a host that rebuilds its composer elsewhere leaves the old rail behind.
    document.querySelectorAll(`.${RAIL}`).forEach((rail) => rail.remove())
    return
  }

  const host = target.beside ? row(target.host, target.beside, target.float) : target.host
  if (button.parentElement === host) return

  button.classList.remove("mm-button--flow", "mm-button--overlay")
  button.classList.add(...target.variant.split(" "))
  host.prepend(button)
  flashOnce()
}

const pending = new Set()
let scheduled = false

function flush() {
  scheduled = false
  const roots = [...pending]
  pending.clear()
  roots.forEach(sweep)
  theme()
  graft()
  mount()
}

function schedule(node) {
  pending.add(node)
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(flush)
}

sweep(document.body)
theme()
graft()
mount()

// The disclaimer and the composer are re-rendered on every navigation and stream, so watch instead of patching once.
new MutationObserver((records) => {
  for (const record of records) {
    if (record.type === "characterData") schedule(record.target)
    else if (record.addedNodes.length) record.addedNodes.forEach(schedule)
    // A cleared thread only removes nodes; without this the button would stay behind
    // until some unrelated mutation happened to schedule a flush.
    else if (record.removedNodes.length) schedule(record.target)
  }
}).observe(document.body, { childList: true, subtree: true, characterData: true })

// Switching theme inside the app only flips an attribute, which the observer above does
// not watch — without this the colours would stay on the previous theme until some
// unrelated mutation happened to run a flush. `data-mm-theme` is not in the filter, so
// writing it cannot retrigger this.
const themed = new MutationObserver(theme)
const watched = { attributes: true, attributeFilter: ["class", "style", "data-mode"] }
themed.observe(document.documentElement, watched)
themed.observe(document.body, watched)

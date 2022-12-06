const styles = {
    convertButton: 'hover:cursor-pointer bg-indigo-500 hover:bg-emerald-600 font-bold hover:scale-105'
};

var elements = () => {
    const HTMLInput = document
        .getElementById('html-input');
    const convertButton = document
        .getElementById('convert-button');
    const convertedParentContainer = document
        .getElementById('converted-parent');
    const convertedHTMLContainer = document
        .getElementById('converted-html');
    const copyConvertedHTMLButton = document
        .getElementById('copy-converted-html');
    const resetButton = document.getElementById('clear');
    return {
        HTMLInput,
        resetButton,
        convertButton,
        convertedParentContainer,
        convertedHTMLContainer,
        copyConvertedHTMLButton
    };
};

const IGNORE = 'ignore';
const REPLACEMENT = 'replace';
const Mappings = {
    'a': REPLACEMENT,
    'abbr': REPLACEMENT,
    'address': REPLACEMENT,
    'area': IGNORE,
    'article': REPLACEMENT,
    'aside': REPLACEMENT,
    'audio': IGNORE,
    'b': REPLACEMENT,
    'base': IGNORE,
    'bdi': REPLACEMENT,
    'bdo': REPLACEMENT,
    'blockquote': REPLACEMENT,
    'body': REPLACEMENT,
    'br': REPLACEMENT,
    'button': IGNORE,
    'canvas': IGNORE,
    'caption': REPLACEMENT,
    'cite': REPLACEMENT,
    'code': REPLACEMENT,
    'col': IGNORE,
    'colgroup': IGNORE,
    'data': IGNORE,
    'datalist': REPLACEMENT,
    'dd': REPLACEMENT,
    'del': REPLACEMENT,
    'details': REPLACEMENT,
    'dfn': REPLACEMENT,
    'dialog': REPLACEMENT,
    'div': REPLACEMENT,
    'dl': REPLACEMENT,
    'dt': REPLACEMENT,
    'em': REPLACEMENT,
    'embed': IGNORE,
    'fieldset': IGNORE,
    'figcaption': REPLACEMENT,
    'figure': REPLACEMENT,
    'footer': REPLACEMENT,
    'form': IGNORE,
    'h1': REPLACEMENT,
    'h2': REPLACEMENT,
    'h3': REPLACEMENT,
    'h4': REPLACEMENT,
    'h5': REPLACEMENT,
    'h6': REPLACEMENT,
    'head': IGNORE,
    'header': REPLACEMENT,
    'hgroup': REPLACEMENT,
    'hr': REPLACEMENT,
    'html': REPLACEMENT,
    'i': REPLACEMENT,
    'iframe': IGNORE,
    'img': REPLACEMENT,
    'input': IGNORE,
    'ins': REPLACEMENT,
    'kbd': REPLACEMENT,
    'label': IGNORE,
    'legend': IGNORE,
    'li': REPLACEMENT,
    'link': REPLACEMENT,
    'main': REPLACEMENT,
    'map': IGNORE,
    'mark': REPLACEMENT,
    'menu': REPLACEMENT,
    'menuitem': REPLACEMENT,
    'meta': IGNORE,
    'meter': IGNORE,
    'nav': REPLACEMENT,
    'noscript': IGNORE,
    'object': IGNORE,
    'ol': REPLACEMENT,
    'optgroup': IGNORE,
    'option': IGNORE,
    'output': IGNORE,
    'p': REPLACEMENT,
    'param': REPLACEMENT,
    'picture': REPLACEMENT,
    'pre': REPLACEMENT,
    'progress': IGNORE,
    'q': REPLACEMENT,
    'rp': REPLACEMENT,
    'rt': REPLACEMENT,
    'ruby': REPLACEMENT,
    's': REPLACEMENT,
    'samp': REPLACEMENT,
    'script': IGNORE,
    'section': REPLACEMENT,
    'select': IGNORE,
    'small': REPLACEMENT,
    'source': IGNORE,
    'span': REPLACEMENT,
    'strong': REPLACEMENT,
    'style': IGNORE,
    'sub': REPLACEMENT,
    'summary': REPLACEMENT,
    'sup': REPLACEMENT,
    'svg': IGNORE,
    'table': REPLACEMENT,
    'tbody': REPLACEMENT,
    'td': REPLACEMENT,
    'template': REPLACEMENT,
    'textarea': IGNORE,
    'tfoot': REPLACEMENT,
    'th': REPLACEMENT,
    'thead': REPLACEMENT,
    'time': REPLACEMENT,
    'title': IGNORE,
    'tr': REPLACEMENT,
    'track': IGNORE,
    'u': REPLACEMENT,
    'ul': REPLACEMENT,
    'var': REPLACEMENT,
    'video': REPLACEMENT,
    'wbr': IGNORE
};

function parse(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    for (const [key, value] of Object.entries(Mappings)) {
        if (value === IGNORE) {
            const elements = doc.querySelectorAll(key);
            elements.forEach(el => el.remove());
        }
    }
    return doc.body.outerHTML;
}
async function converter(html) {
    const converter = new TurndownService();
    converter.use(turndownPluginGfm.gfm);
    return converter.turndown(parse(html));
}

function addStylesToEl(el, styles) {
    styles.split(' ').forEach(style => el.classList.add(style));
    return el;
}
function removeStylesFromEl(el, styles) {
    styles.split(' ').forEach(style => el.classList.remove(style));
    return el;
}

const hasHTMLRegex = /<[^>]*>/;
const hasHTML = (text) => hasHTMLRegex.test(text);
var init = () => {
    if (typeof document !== 'undefined') {
        document.addEventListener('DOMContentLoaded', () => {
            const { HTMLInput, resetButton, convertButton, convertedHTMLContainer, copyConvertedHTMLButton, convertedParentContainer } = elements();
            const showConvertedHTML = (convertedHTML) => {
                convertedHTMLContainer.innerHTML = convertedHTML;
                convertedParentContainer.classList.remove('hidden');
                copyConvertedHTMLButton.scrollIntoView();
                copyConvertedHTMLButton
                    .addEventListener('click', handleCopyClick);
                resetButton.addEventListener('click', handleResetClick);
            };
            const hideConvertedHTMLEl = () => {
                convertedHTMLContainer.innerHTML = '';
                convertedHTMLContainer.innerHTML = '';
                convertedParentContainer.classList.add('hidden');
                copyConvertedHTMLButton
                    .removeEventListener('click', handleCopyClick);
                resetButton.removeEventListener('click', handleResetClick);
            };
            const convertBtnValidInputReceived = (inputReceived) => {
                addStylesToEl(convertButton, styles.convertButton);
                convertButton.disabled = false;
                convertButton.addEventListener('click', (e) => handleConvertButtonClick(inputReceived, e));
            };
            const resetConvertBtn = (inputReceived) => {
                convertButton.disabled = true;
                removeStylesFromEl(convertButton, styles.convertButton);
                convertButton.removeEventListener('click', (e) => handleConvertButtonClick(inputReceived, e));
            };
            const handleCopyClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const text = convertedHTMLContainer;
                text.select();
                text.setSelectionRange(0, 99999);
                navigator.clipboard.writeText(text.value);
            };
            const handleResetClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                HTMLInput.value = '';
                hideConvertedHTMLEl();
            };
            const handleConvertButtonClick = async (value, e) => {
                e.preventDefault();
                e.stopPropagation();
                const converted = await converter(value);
                showConvertedHTML(converted);
            };
            const htmlInputManager = (event) => {
                const target = event.target;
                const value = target.value;
                if (hasHTML(value)) {
                    convertBtnValidInputReceived(value);
                }
                else {
                    resetConvertBtn(value);
                    hideConvertedHTMLEl();
                }
            };
            HTMLInput.addEventListener('input', htmlInputManager);
        });
    }
};

init();
//# sourceMappingURL=index.esm.js.map

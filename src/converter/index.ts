import Mappings, { IGNORE } from './SyntaxMapper';

function parse(html: string): string {
    // use the DOMParser to parse the HTML
    const parser: DOMParser = new DOMParser();

    // create a new document from the HTML
    const doc: Document = parser.parseFromString(html, 'text/html');

    // loop over our syntaxMap to see which elements need to be removed
    for (const [key, value] of Object.entries(Mappings)) {
        // get all the elements that need to be removed
        if (value === IGNORE) {
            const elements = doc.querySelectorAll(key);
            elements.forEach(el => el.remove());
        }
    }

    return doc.body.outerHTML;
}


export default async function converter(html: string): Promise<string> {
    //eslint-disable-next-line
    // @ts-ignore
    const converter = new TurndownService();

    //eslint-disable-next-line
    // @ts-ignore
    converter.use(turndownPluginGfm.gfm);

    return converter.turndown(parse(html));
}

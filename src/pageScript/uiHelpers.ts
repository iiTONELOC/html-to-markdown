export function addStylesToEl(el: HTMLElement, styles: string): HTMLElement {
    styles.split(' ').forEach(style => el.classList.add(style));
    return el;
}

export function removeStylesFromEl(el: HTMLElement, styles: string): HTMLElement {
    styles.split(' ').forEach(style => el.classList.remove(style));
    return el;
}

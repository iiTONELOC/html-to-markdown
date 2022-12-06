export default () => {
    const HTMLInput = document
        .getElementById('html-input') as HTMLTextAreaElement;

    // CONVERT BUTTON
    const convertButton = document
        .getElementById('convert-button') as HTMLButtonElement;

    // CONVERTED PARENT CONTAINER
    const convertedParentContainer = document
        .getElementById('converted-parent') as HTMLDivElement;

    // CONVERTED HTML CONTAINER
    const convertedHTMLContainer = document
        .getElementById('converted-html') as HTMLTextAreaElement;

    // COPY CONVERTED HTML BUTTON
    const copyConvertedHTMLButton = document
        .getElementById('copy-converted-html') as HTMLButtonElement;

    // RESET BUTTON
    const resetButton = document.getElementById('clear') as HTMLButtonElement;

    return {
        HTMLInput,
        resetButton,
        convertButton,
        convertedParentContainer,
        convertedHTMLContainer,
        copyConvertedHTMLButton
    };
};

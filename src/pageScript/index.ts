import { styles } from './styles';
import elements from './domElements';
import HTMLtoMarkdown from '../converter';
import {
    addStylesToEl,
    removeStylesFromEl
} from './uiHelpers';

const hasHTMLRegex = /<[^>]*>/;
// function to check if the string contains HTML
const hasHTML = (text: string): boolean => hasHTMLRegex.test(text);

export default () => {
    if (typeof document !== 'undefined') {
        document.addEventListener('DOMContentLoaded', (): void => {
            //______ DOM ELEMENT CONSTANTS _______//
            const {
                HTMLInput,
                resetButton,
                convertButton,
                convertedHTMLContainer,
                copyConvertedHTMLButton,
                convertedParentContainer
            } = elements();

            // ______ UI HELPER FUNCTIONS ______ //

            const showConvertedHTML = (convertedHTML: string): void => {
                // set the converted HTML to the converted HTML container
                convertedHTMLContainer.innerHTML = convertedHTML;

                // remove the hidden class from the converted HTML container
                convertedParentContainer.classList.remove('hidden');

                // scroll to the button into view for a more seamless
                // experience
                copyConvertedHTMLButton.scrollIntoView();

                // attach the event listener to the copy button
                copyConvertedHTMLButton
                    .addEventListener('click', handleCopyClick);

                // attach the event listener to the reset button
                resetButton.addEventListener('click', handleResetClick);
            };

            const hideConvertedHTMLEl = (): void => {
                // remove the converted HTML from the converted HTML container
                convertedHTMLContainer.innerHTML = '';

                // remove any text and hide the parent container
                convertedHTMLContainer.innerHTML = '';
                convertedParentContainer.classList.add('hidden');

                // remove the event listener from the copy button
                copyConvertedHTMLButton
                    .removeEventListener('click', handleCopyClick);

                // remove the event listener from the reset button
                resetButton.removeEventListener('click', handleResetClick);
            };

            const convertBtnValidInputReceived = (inputReceived: string): void => {
                // add the styles to the convert button
                addStylesToEl(convertButton, styles.convertButton);
                convertButton.disabled = false;

                // attach the event listener to the convert button
                convertButton.addEventListener(
                    'click',
                    (e: Event) => handleConvertButtonClick(inputReceived, e)
                );
            };

            const resetConvertBtn = (inputReceived: string): void => {
                // remove the styles and disable the button
                convertButton.disabled = true;
                removeStylesFromEl(convertButton, styles.convertButton);

                // remove the event listener from the convert button
                convertButton.removeEventListener(
                    'click',
                    (e: Event) => handleConvertButtonClick(inputReceived, e)
                );
            };

            //_____EVENT HANDLER FUNCTIONS_____//

            // copies the converted HTML to the clipboard
            const handleCopyClick = (e: Event): void => {
                e.preventDefault();
                e.stopPropagation();

                // copy the converted HTML to the clipboard
                const text = convertedHTMLContainer;

                // copy the text to the clipboard
                text.select();
                // For mobile devices
                text.setSelectionRange(0, 99999);

                navigator.clipboard.writeText(text.value);
            };

            // resets the UI
            const handleResetClick = (e: Event): void => {
                e.preventDefault();
                e.stopPropagation();

                // reset the HTML input
                HTMLInput.value = '';

                // reset the converted HTML container
                hideConvertedHTMLEl();
            };

            // Coverts Markdown to HTML and displays it in the convertedHTMLContainer
            const handleConvertButtonClick = async (value: string, e: Event) => {
                e.preventDefault();
                e.stopPropagation();

                // parse the HTML and convert it to Markdown
                // const converted = parseHTML(value);
                const converted = await HTMLtoMarkdown(value);

                // display the converted HTML
                showConvertedHTML(converted);
            };

            // Handles the input event on the HTMLInput and any input changes
            // Manages the state for the buttons and the convertedHTMLContainer
            const htmlInputManager = (event: Event) => {
                const target = event.target as HTMLTextAreaElement;
                const value = target.value;


                // if the value contains HTML then attach our event listeners
                if (hasHTML(value)) {

                    convertBtnValidInputReceived(value);
                } else {
                    resetConvertBtn(value);
                    hideConvertedHTMLEl();
                }
            };

            // add event listener to the html input and manage any changes
            HTMLInput.addEventListener('input', htmlInputManager);
        });
    }
};

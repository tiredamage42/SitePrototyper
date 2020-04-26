/*
    handle setting up the menu DOM elements for the editor

    (AKA the menu above the code editor on the
        right hand side of the screen)
*/

import { themes, defualtTheme, defualtFontSize } from './editor-setup.js';

// initialize a selector, then programatically 'select' the default value
function initSelector (id, collection, defaultOption, onSelect) {
    // get the selector
    const selector = document.getElementById(id);

    // add an option for each element in the selection
    collection.forEach((c) => {

        // crete an option element
        let option = document.createElement("option");

        // set the value and display text to the collection element
        option.value = c;
        option.innerText = c;

        // define if teh option element should have the 'selected' attribute
        if (c === defaultOption)
            option.setAttribute('selected', '');

        // add option to the selector
        selector.appendChild(option);
    });

    // initilalize change callback
    selector.addEventListener( "change", e => onSelect(e.target.value) );
    onSelect(defaultOption);
}

export function initializeThemeSelector (onSelect) {
    initSelector ('theme-select', themes, defualtTheme, onSelect);
}
export function initializeFontSizeSelector (onSelect) {
    initSelector ('font-size-select', [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], defualtFontSize, onSelect);
}

export function initializeWrapButton (toggleWrap) {
    // get the wrap button
    let btn = document.getElementById('wrap-button');

    // initialize the event listener
    btn.addEventListener('click', (evt) => {
        // toggleWrap should return true when wrap is enabled
        if (toggleWrap())
            btn.className += " active"; // add the 'active' class
        else
            btn.className = btn.className.replace(" active", ""); // remove the 'active' class
    });

    // wrap defaults to true
    btn.className += " active";
    toggleWrap(true);
}





export function initializeFileImport (onFileReceived) {
    // initialize the event listener
    document.getElementById('file-import').addEventListener('click', (evt) => {


        onFileReceived (textFromFile);
    });
}
export function initializeFileExport (getLanguageFileTexts) {
    // initialize the event listener
    document.getElementById('file-export').addEventListener('click', (evt) => {
        let { html, css, js, cssFileName, jsFileName } = getLanguageFileTexts();

    });
}


let keyboardShortcutsView = document.getElementById('keyboard-shortcuts');
export function initializeKeyboardShortcutShower (shortcuts, populateShortcut) {
    // get the wrap button
    let btn = document.getElementById('show-key-shortcuts');

    // initialize the event listener
    btn.addEventListener('click', (evt) => {
        let isActive = btn.className.indexOf(' active') !== -1;

        // toggleWrap should return true when wrap is enabled
        if (!isActive) {
            keyboardShortcutsView.className += " active";
            btn.className += " active"; // add the 'active' class


        }
        else{
            keyboardShortcutsView.className = keyboardShortcutsView.className.replace(" active", ""); // remove the 'active' class
            btn.className = btn.className.replace(" active", ""); // remove the 'active' class
        }
    });

    shortcuts.forEach((sc, i) => {

        let d = document.createElement('div');
        d.className = 'keyboard-shortcut';

        function createSpanDiv (className) {
            let s = document.createElement('span');
            s.className = className;
            d.appendChild(s);
            return s;
        }

        let s1 = createSpanDiv ('keyboard-shortcut-name');
        let s2 = createSpanDiv ('keyboard-shortcut-bindKey');



        // let s1 = document.createElement('span');
        // s1.className = 'keyboard-shortcut-name';
        // let s2 = document.createElement('span');
        // s2.className = 'keyboard-shortcut-bindKey';
        // d.appendChild(s1);
        // d.appendChild(s2);

        populateShortcut(sc, i, s1, s2);
        keyboardShortcutsView.appendChild(d);
    });
}











// language select (html, css, or js) is set up with "tabs" buttons
export function initializeLanguageSelection (languages, onLanguageSelect) {
    // get the container
    let container = document.getElementById('language-select');

    languages.forEach( (l, i) => {
        // for each language specified, create a tab button
        let btn = document.createElement('button');

        // add it to the container
        container.appendChild(btn);

        // add teh tablinks class
        btn.className = "tablinks";

        // set the button text to the language name
        btn.innerText = l;

        // the first language is teh default active one
        if (i == 0)
            btn.className += " active";
    });

    // initialize the event listener for button clicks
    container.addEventListener('click', (e) => {
        // make sure we clicked a button
        if (e.target.tagName === 'BUTTON') {

            // call teh callback with the language (stored in 'innerText')
            onLanguageSelect(e.target.innerText);

            // unselect all the tabs in teh container (remove the 'active' class)
            Array.from(container.children).forEach(b => b.className = b.className.replace(" active", "") );

            // add teh active class to the selected language tab button
            e.target.className += " active";
        }
    });

    // default to the first language specified (currently HTML)
    onLanguageSelect(languages[0]);
}

/*

    Site Prototyper (an in-browser html/css/js editor)
    Copyright (C) 2020  Andres Gomez

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/


/*
    handle setting up the menu DOM elements for the editor

    (AKA the menu above the code editor on the
        right hand side of the screen)
*/

import { themes, defualtTheme, defualtFontSize } from './editor-setup.js';
import { setElementActive, getElementActive, addChildToElement } from './dom-utils.js';

// initialize a selector, then programatically 'select' the default value
function initSelector (id, collection, defaultOption, onSelect) {
    // get the selector
    const selector = document.getElementById(id);

    // add an option for each element in the selection
    collection.forEach((c) => {

        // crete an option element
        let option = addChildToElement(selector, 'option');

        // set the value and display text to the collection element
        option.value = c;
        option.innerText = c;

        // define if teh option element should have the 'selected' attribute
        if (c === defaultOption)
            option.setAttribute('selected', '');
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
    // toggleWrap should return true when wrap is enabled
    btn.addEventListener('click', (evt) => setElementActive(btn, toggleWrap()) );

    // wrap defaults to true
    setElementActive(btn, true);
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
        let isActive = getElementActive(btn);
        setElementActive(keyboardShortcutsView, !isActive);
        setElementActive(btn, !isActive);
    });

    shortcuts.forEach((sc, i) => {
        let d = addChildToElement(keyboardShortcutsView, 'div', 'keyboard-shortcut');
        let s1 = addChildToElement (d, 'span', 'keyboard-shortcut-name');
        let s2 = addChildToElement (d, 'span', 'keyboard-shortcut-bindKey');
        populateShortcut(sc, i, s1, s2);
    });
}

// language select (html, css, or js) is set up with "tabs" buttons
export function initializeLanguageSelection (languages, onLanguageSelect) {
    // get the container
    let container = document.getElementById('language-select');

    languages.forEach( (l, i) => {
        // for each language specified, create a tab button
        let btn = addChildToElement(container, 'button', 'tablinks');

        // set the button text to the language name
        btn.innerText = l;

        // the first language is teh default active one
        if (i == 0)
            setElementActive(btn, true);
    });

    // initialize the event listener for button clicks
    container.addEventListener('click', (e) => {
        // make sure we clicked a button
        if (e.target.tagName === 'BUTTON') {

            // call teh callback with the language (stored in 'innerText')
            onLanguageSelect(e.target.innerText);

            // unselect all the tabs in teh container
            Array.from(container.children).forEach(b => setElementActive(b, false) );

            setElementActive(e.target, true);
        }
    });

    // default to the first language specified (currently HTML)
    onLanguageSelect(languages[0]);
}

/*

    Wingman (an in-browser html/css/js editor)
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

import {
    buildSelector,
    buildTabs,
    buildToggleButton,
    initializeResizableElement,
    toggleElementsActive,
    initButton,
    disableOnOutsideAreaClick
} from './scripts/dom-utils.js';
import { initializeEditor, themes, defaultTheme, defaultFontSize, defaultTabSize } from './scripts/editor-setup.js';
import { initResultDisplay } from './scripts/result-display.js';




import { initializeKeyboardShortcuts } from './scripts/keyboard-shortcuts.js';

import { importFile } from './scripts/io-utils.js';

import { initializeProjectExporter } from './scripts/export-project.js';
import { initializeConsole } from  './scripts/console-window-setup.js';


import { HotKey, initializeHotKeys } from './scripts/hotkeys.js';

const appName = 'Wingman';
const appURL = 'https://tiredamage42.github.io/SitePrototyper/';

const defaultHTML = `
<html>
    <head>
        <title>Site Prototype</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
        <h1>Welcome To Wingman!</h1>
        <button type="submit" id="demo-button">Demo Button</button>
    </body>
</html>
`;

const defaultCSS = `
body {
    text-align: center;
}
`;
const defaultJS = `
console.log('Testing console.log');
console.warn('Testing console.warn');
console.error('Testing console.error');

const btn = document.getElementById('demo-button');
btn.addEventListener('click', (e) => {
    alert("JS is functional!");
});
`;


let { editor, name2sess } = initializeEditor(defaultHTML, defaultCSS, defaultJS);

/*
    build settings menu
*/
let settingsMenuBtn = document.getElementById('settings-button');
let settingsOverlay = document.getElementById('settings-overlay');

let onSettingsToggle = disableOnOutsideAreaClick (settingsOverlay, [settingsMenuBtn, settingsOverlay]);
settingsMenuBtn.addEventListener('click', (e) => {
    toggleElementsActive([settingsMenuBtn, settingsOverlay]);
    onSettingsToggle();
});

buildSelector ('theme-select', themes, defaultTheme, (theme) => editor.setTheme(`ace/theme/${theme}`) );
buildSelector ('font-size-select', [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], defaultFontSize, (fontSize) => editor.setFontSize(fontSize) );
buildSelector ('tab-size-select', [2,4], defaultTabSize, (tabSize) => editor.setOption('tabSize', tabSize) );
buildToggleButton ('wrap-button', 'Toggle text wrap in the editor.', () => name2sess.HTML.getUseWrapMode(), (v) => Object.values(name2sess).forEach (s => s.setUseWrapMode(v)), true);


let clearConsoleOnUpdate = true;
buildToggleButton ('log-window-clear-on-update', 'Should the console clear every time the view is updated?', () => clearConsoleOnUpdate, (v) => clearConsoleOnUpdate = v, true);

buildTabs ('language-select', Object.keys(name2sess), 0, (language) => editor.setSession(name2sess[language]));

let keyboardShortcutsView = initializeKeyboardShortcuts (Object.values(editor.commands.byName));
let keyboardShortcutToggleButton = initButton('show-key-shortcuts', 'Show Editor Keyboard Shortcuts');
let onKeyboardShortcutsToggle = disableOnOutsideAreaClick (keyboardShortcutsView, [ keyboardShortcutsView, keyboardShortcutToggleButton ]);
keyboardShortcutToggleButton.addEventListener('click', (e) => {
    toggleElementsActive ( [ keyboardShortcutsView, keyboardShortcutToggleButton ]);
    onKeyboardShortcutsToggle();
});

initializeResizableElement ('code-area', 'code-area-resizer-click-area', false);

let hot_keys = initializeHotKeys();
const importFileHotkey = hot_keys.addHotKey( new HotKey ('command+i', 'ctrl+i') );
const exportProjectHotkey = hot_keys.addHotKey( new HotKey ('command+e', 'ctrl+e') );
const toggleConsoleHotKey = hot_keys.addHotKey( new HotKey ('command+shift+c', 'ctrl+shift+c') );
const updateViewHotkey = hot_keys.addHotKey( new HotKey ('command+s', 'ctrl+s') );

const sessionValuesGet = () => { return { html: name2sess.HTML.getValue(), css: name2sess.CSS.getValue(), js: name2sess.JS.getValue() }; };


const importFileToEditor = () => importFile(t => editor.session.setValue(t));
let fileImportButton = initButton('file-import', 'Import File ' + importFileHotkey.toString());
fileImportButton.addEventListener('click', (e) => importFileToEditor());

let projectExporter = initializeProjectExporter (sessionValuesGet, appName, appURL);
let projectExportButton = initButton ('file-export', 'Export Project ' + exportProjectHotkey.toString());
projectExportButton.addEventListener('click', (e) => projectExporter.exportProject());

let consoleWindow = initializeConsole (toggleConsoleHotKey.toString());

let resultDisplay = initResultDisplay (hot_keys.allHotKeysString(), 'https://unpkg.com/hotkeys-js/dist/hotkeys.min.js', sessionValuesGet );

function updateView () {
    if (clearConsoleOnUpdate)
        consoleWindow.clearConsole();
    resultDisplay.updateDisplay ();
}

let updateViewButton = initButton ('update-view-button', 'Update View ' + updateViewHotkey.toString());
updateViewButton.addEventListener('click', updateView);

function handleHotkey (key) {
    if (updateViewHotkey.match(key))
        updateView();
    else if (toggleConsoleHotKey.match(key))
        consoleWindow.toggleConsole();
    else if (importFileHotkey.match(key))
        importFileToEditor();
    else if (exportProjectHotkey.match(key))
        projectExporter.exportProject();
}

hot_keys.finishHotkeyInitialization(handleHotkey);

// prepare to receive a message from the iframe with the hotkey arguments
window.addEventListener("message", (event) => {
    if (event.data[1] !== 'HOTKEY')
        return;
    handleHotkey(event.data[0]);
});

updateView();

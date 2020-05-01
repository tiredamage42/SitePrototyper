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
    disableOnOutsideAreaClick,
    toggleElementActive
} from './scripts/dom-utils.js';
import { initializeEditor, themes, defaultTheme, defaultFontSize, defaultTabSize } from './scripts/editor-setup.js';
import { initResultDisplay } from './scripts/result-display.js';

// import { initializeKeyboardShortcuts } from './scripts/keyboard-shortcuts.js';

import { importFile } from './scripts/io-utils.js';

import { initializeProjectExporter } from './scripts/export-project.js';
import { initializeConsole } from  './scripts/console-window-setup.js';


import { HotKey, initializeHotKeys } from './scripts/hotkeys.js';

const appName = 'Wingman';
const appURL = 'https://tiredamage42.github.io/Wingman/';

const defaultHTML = `
<html>
    <head>
        <title>Site Prototype</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
        <h1>Welcome To Wingman!</h1>
        <p>Code result will be displayed in this window.</p>
        <button type="submit" id="clear-button">Click Here To Start From A Blank Project</button>
    </body>
</html>
`;

const defaultCSS = `
body {
    text-align: center;
}
button {
    border: 1px solid rgb(82, 112, 165);
    color: #ccc;
    background-color: rgb(65, 62, 60);
    padding: 5px 10px;
    cursor: pointer;
}
button:hover {
    background-color: rgb(105,102,100);
}
button:active {
    background-color: rgb(82, 112, 165);
    transform: translate(0, 1px);
}
`;
const defaultJS = `
const btn = document.getElementById('clear-button');

btn.addEventListener('click', (e) => {
    window.parent.postMessage([ 'NEW_PROJECT_BLANK' ], '*');
});

console.log('console.[log / warn / error], and any errors will display here');
`;


let { editor, name2sess, getSessionValues, setSessionValues } = initializeEditor(defaultHTML, defaultCSS, defaultJS);

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

buildTabs ('language-select', Object.keys(name2sess), 0, (language) => editor.setSession(name2sess[language]));

// let keyboardShortcutsView = initializeKeyboardShortcuts (Object.values(editor.commands.byName));
// let keyboardShortcutToggleButton = initButton('show-key-shortcuts', 'Show Editor Keyboard Shortcuts');
// let onKeyboardShortcutsToggle = disableOnOutsideAreaClick (keyboardShortcutsView, [ keyboardShortcutsView, keyboardShortcutToggleButton ]);
// keyboardShortcutToggleButton.addEventListener('click', (e) => {
    // toggleElementsActive ( [ keyboardShortcutsView, keyboardShortcutToggleButton ]);
    // onKeyboardShortcutsToggle();
// });

initializeResizableElement ('code-area', 'code-area-resizer-click-area', false);

let hot_keys = initializeHotKeys();
const importFileHotkey = hot_keys.addHotKey( new HotKey ('command+i', 'ctrl+i') );
const exportProjectHotkey = hot_keys.addHotKey( new HotKey ('command+e', 'ctrl+e') );
const toggleConsoleHotKey = hot_keys.addHotKey( new HotKey ('command+shift+c', 'ctrl+shift+c') );
const updateViewHotkey = hot_keys.addHotKey( new HotKey ('command+s', 'ctrl+s') );

const importFileToEditor = () => importFile(t => editor.session.setValue(t));
let fileImportButton = initButton('file-import', 'Import File ' + importFileHotkey.toString());
fileImportButton.addEventListener('click', importFileToEditor);

let projectExporter = initializeProjectExporter (getSessionValues, appName, appURL);
let projectExportButton = initButton ('file-export', 'Export Project ' + exportProjectHotkey.toString());
projectExportButton.addEventListener('click', projectExporter.exportProject);

let consoleWindow = initializeConsole ();

/*
    handle resizing the console messages section by
    clicking and dragging the top of the title bar
*/
// pixel offset since we're dragigng form the top, but resizing the messages,
// which are below the drag point
let pixelOffset = document.getElementById('log-window-title').getBoundingClientRect().height;
initializeResizableElement ('log-window-messages', 'log-window-resizer-click-area', true, pixelOffset);


let consoleWindowToggle = initButton ('log-window-toggle', 'Toggle Console ' + toggleConsoleHotKey.toString());
function toggleConsole () {
    toggleElementActive(consoleWindowToggle);
    consoleWindow.toggleConsole();
};
consoleWindowToggle.addEventListener('click', toggleConsole);
toggleConsole ();


hot_keys.finishHotkeyInitialization(handleHotkey);

let resultDisplay = initResultDisplay (hot_keys.allHotKeysString(), 'https://unpkg.com/hotkeys-js/dist/hotkeys.min.js', getSessionValues, consoleWindow, handleHotkey);

function updateView () {
    if (consoleWindow.clearConsoleOnUpdate)
        consoleWindow.clearConsole();
    resultDisplay.updateDisplay ();
}

let updateViewButton = initButton ('update-view-button', 'Update View ' + updateViewHotkey.toString());
updateViewButton.addEventListener('click', updateView);

function handleHotkey (key) {
    if (updateViewHotkey.match(key))
        updateView();
    else if (toggleConsoleHotKey.match(key))
        toggleConsole();
    else if (importFileHotkey.match(key))
        importFileToEditor();
    else if (exportProjectHotkey.match(key))
        projectExporter.exportProject();
}


updateView();



const newProjectBlank = (event) => {
    if (event.data[0] !== 'NEW_PROJECT_BLANK')
        return;
    setSessionValues("", "", "");
    updateView();
    window.removeEventListener('message', newProjectBlank);
};
window.addEventListener("message", newProjectBlank);

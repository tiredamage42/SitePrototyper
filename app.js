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





import { buildSelector, buildTabs, buildToggleButton, initializeResizableElement } from './scripts/dom-utils.js';
import { initializeEditor, themes, defaultTheme, defaultFontSize, defaultTabSize } from './scripts/editor-setup.js';
import { exportProject } from './scripts/export-project.js';
import { importFile } from './scripts/import-file.js';
import { updateDisplay } from './scripts/result-display.js';
import { toggleConsole, clearLogs } from  './scripts/logs-setup.js';
import { initializeKeyboardShortcuts } from './scripts/keyboard-shortcuts.js';


const defaultHTML = `
<html>
    <head>
        <title>Site Prototype</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
        <h1>Site Prototyper</h1>

        <p><code>[Ctrl/Cmd]-S</code> to update the view.</p>
        <p><code>[Ctrl/Cmd]-Shift-S</code> to update the view and clear the output console.</p>
        <p><code>[Ctrl/Cmd]-Shift-C</code> to toggle the output console.</p>
        <p><code>[Ctrl/Cmd]-E</code> to export and download the project files.</p>
        <p><code>[Ctrl/Cmd]-I</code> to upload a file into the current editor</p>

        <button type="submit" id="demo-button">Demo Button</button>

        <br><br>

        <a href="https://github.com/tiredamage42/SitePrototyper">View The Source Code Here</a>
    </body>
</html>
`;

const defaultCSS = `
body {
    text-align: center;
}
p {
    text-align: left;
}
code {
    background-color: rgba(0,0,0,.25);
    padding: 0 5px;
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

let { editor, name2sess } = initializeEditor(defaultHTML, defaultCSS, defaultJS, updateDisplay, clearLogs, toggleConsole);


buildSelector ('theme-select', themes, defaultTheme, (theme) => editor.setTheme(`ace/theme/${theme}`) );
buildSelector ('font-size-select', [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], defaultFontSize, (fontSize) => editor.setFontSize(fontSize) );
buildSelector ('tab-size-select', [2,4], defaultTabSize, (tabSize) => editor.setOption('tabSize', tabSize) );

buildToggleButton ('wrap-button',
    () => { return name2sess['HTML'].getUseWrapMode(); },
    (val) => { Object.values(name2sess).forEach (s => s.setUseWrapMode(val) ); },
    true
);

buildTabs ('language-select', Object.keys(name2sess), 0, (language) => editor.setSession(name2sess[language]));

initializeKeyboardShortcuts (Object.values(editor.commands.byName));

initializeResizableElement ('code-area', 'code-area-resizer-click-area', false);

function importFileToCurrentSession () {
    importFile ( (txt) => editor.session.setValue(txt) );
}
document.getElementById('file-import').addEventListener('click', (evt) => importFileToCurrentSession() );

function exportSessionFiles () {
    exportProject ( name2sess['HTML'].getValue(), name2sess['CSS'].getValue(), name2sess['JS'].getValue() );
}
document.getElementById('file-export').addEventListener('click', (evt) => exportSessionFiles() );

function updateViewWithSessions () {
    updateDisplay (name2sess.HTML.getValue(), name2sess.CSS.getValue(), name2sess.JS.getValue());
}

function handleHotkey (key) {
    if (key == 'command+s' || key == 'ctrl+s') {
        updateViewWithSessions();
    }
    else if (key == 'command+shift+s' || key == 'ctrl+shift+s') {
        clearLogs();
        updateViewWithSessions();
    }
    else if (key == 'command+shift+c' || key == 'ctrl+shift+c') {
        toggleConsole();
    }
    else if (key == 'command+i' || key == 'ctrl+i') {
        importFileToCurrentSession();
    }
    else if (key == 'command+e' || key == 'ctrl+e') {
        exportSessionFiles();
    }
}



hotkeys.filter = function(event){
    return true;
}
hotkeys('ctrl+s, command+s, ctrl+shift+s, command+shift+s, ctrl+shift+c, command+shift+c, ctrl+i, command+i, ctrl+e, command+e', function(event, handler) {
    handleHotkey(handler.key);
    return false;
});

// prepare to receive a message from the iframe with the hotkey arguments
window.addEventListener("message", (event) => {

    let type = event.data.pop();
    if (type !== 'HOTKEY') {
        event.data.push(type);
        return;
    }
    let key = event.data.pop();
    handleHotkey(key);
});

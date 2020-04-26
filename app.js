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


import { initializeEditor } from './scripts/editor-setup.js';
import { initializeKeyboardShortcutShower, initializeThemeSelector, initializeFontSizeSelector, initializeWrapButton, initializeLanguageSelection } from './scripts/menu-setup.js';
import { updateDisplay } from './scripts/result-display.js';

import { toggleConsole, clearLogs } from  './scripts/logs-setup.js';

import { intiializeResizableElement } from './scripts/resize-elements.js';

const defaultHTML = `
<html>
    <head>
        <title>Site Prototype</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
        <h1>Site Prototyper</h1>
        <p>
            Press <code>Ctrl-S</code> (<code>Cmd-S</code> on OS-X)
            to update the view.
        </p>
        <p id="source-link">
            <b>
                <a href="https://github.com/tiredamage42/SitePrototyper">View The Source Code Here</a>
            </b>
        </p>
        <button type="submit" id="demo-button">Click Here To Test JS</button>
    </body>
</html>
`;

const defaultCSS = `
body {
    text-align: center;
}
code {
    background-color: rgba(0,0,0,.5);
    color: rgba(230, 230, 230, 255);
    padding: 0 5px;
}
#source-link {
    margin: 25px;
}
`;
const defaultJS = `
const btn = document.getElementById('demo-button');

console.log('A normal console log');
console.warn('A warning message');
console.error('An error message!');

btn.addEventListener('click', (e) => {
    alert("JS is functional!");
});
`;

let { editor, name2session } = initializeEditor(defaultHTML, defaultCSS, defaultJS, updateDisplay, clearLogs, toggleConsole);

initializeThemeSelector ( (theme) => editor.setTheme(`ace/theme/${theme}`) );

initializeFontSizeSelector ( (fontSize) => editor.setFontSize(fontSize) );

initializeWrapButton ( (wrap) => {
    if (!wrap)
        wrap = !name2session['HTML'].getUseWrapMode();

    Object.values(name2session).forEach (s => s.setUseWrapMode(wrap) );
    return wrap;
} );

initializeLanguageSelection (Object.keys(name2session), (language) => editor.setSession(name2session[language]) );


// shortcuts that didnt work for me
const skipShortcuts = [
    'showSettingsMenu',
    'toggleParentFoldWidget',
    'toggleFoldWidget',
    'goToNextError',
    'openCommandPallete'
];

let shortcutsWithBindings = Object.values(editor.commands.byName).filter(sc => (!(skipShortcuts.includes(sc.name))) && ('bindKey' in sc) && (sc.bindKey.mac != null || sc.bindKey.win != null)).map(sc => { return { name: sc.name, bindKey: sc.bindKey } } );

initializeKeyboardShortcutShower (shortcutsWithBindings, (shortcut, i, s1, s2) => {

    s1.innerText = `${shortcut.name}:`;

    let mac = shortcut.bindKey.mac;

    // shorten the strign a little
    if (mac)
        mac = shortcut.bindKey.mac.replace(/Command/g, 'Cmd');

    s2.innerText = `Mac: ${mac || shortcut.bindKey.win}\nWin: ${shortcut.bindKey.win || mac}`;
});

intiializeResizableElement(
    document.getElementById('code-area'),
    document.getElementById('code-area-resizer-click-area'),
    .5, .75
);

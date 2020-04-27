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
    handle teh iframe element that displays the finished product
    of the html, css, and js code

    ( AKA left half of the screen )

    we do this by formatting the supplied html, css, and js code into our own
    custom built html source code (with some special considerations for being displayed within the iframe)

    and then settings the iframe's source to this built html string
*/

import { assertHTMLIsWithinHTMLTags } from './html-parsing.js';

// an iframe element
let resultDisplay = document.getElementById("result-display");

// insert a script that overrides the iframe's console logs
// to instead send a message to the parent window, with the arguments
// then logs are printed to our custom console
const consoleOverrideScript = `
    function postMessageToParentWindow (args, severity) {
        Array.prototype.push.call(args, severity);
        Array.prototype.push.call(args, 'LOG');
        window.parent.postMessage(Array.from(args), '*');
    }
    console.log = function() { postMessageToParentWindow (arguments, 0); };
    console.warn = function() { postMessageToParentWindow (arguments, 1); };
    console.error = function() { postMessageToParentWindow (arguments, 2); };
`;

// we need to define hotkeys manually in the iframe,
// since hotkeys assigned outside dont work within iframe context
const allHotKeys = 'ctrl+e, command+e, ctrl+i, command+i, ctrl+shift+c, command+shift+c, ctrl+shift+s, command+shift+s, ctrl+s, command+s';
const hotkeysScript =`
    <script src="https://unpkg.com/hotkeys-js/dist/hotkeys.min.js"></script>
    <script>
        hotkeys('${allHotKeys}', function(event, handler) {

            // let args = [ handler.key, 'HOTKEY' ];
            // console.log(args);
            window.parent.postMessage([ handler.key, 'HOTKEY' ], '*');
            return false;
        });
    </script>
`;

export function updateDisplay (htmlString, cssString, jsString) {

    let htmlNode = assertHTMLIsWithinHTMLTags (htmlString);

    // fix links to always open in a new tab,
    // links inside iframes generate CORS errors when going to a differnt domain
    // TODO: waht if user wants link to open in editor?
    let links = htmlNode.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++)
        links[i].setAttribute('target', '_base');

    // surround the js script section in a try catch, so that any
    // errors get propogated up to our custom console
    const jsTryCatch = `
        try {
            ${jsString}
        }
        catch(e) {
            console.error(e);
        }
    `;
    // reconstruct html as string
    let finalHTML = `
        <html>
            <head>
                ${htmlNode.getElementsByTagName('head')[0].innerHTML}
                <style>${cssString}</style>
            </head>
            <body>
                ${htmlNode.getElementsByTagName('body')[0].innerHTML}
                <script>
                    ${consoleOverrideScript}
                    ${jsTryCatch}
                </script>
                ${hotkeysScript}
            </body>
        </html>
    `;
    resultDisplay.srcdoc = finalHTML;
}

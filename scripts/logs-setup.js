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
    handle the log window in the bottom left section of the screen

    we intercept the result display's iframe console.logs (and warns / errors)

    by injecting a script into the formatted final display html that overrides the iframe context's
    console.log/warn/error to send a message to our outer window wiht the arguments instead

    then we display them in our custom log window, this way logs from the
    in browser editor dont get confused with normal developer console logs
*/

import {
    setElementsActive, getElementActive, addChildToElement,
    initializeResizableElement, triggerWindowResizeEvent
} from './dom-utils.js';


let logWindow = document.getElementById('log-window');
let logWindowMsgs = document.getElementById('log-window-messages');

const deleteLogIcon = 'highlight_off';

// handle when user wants to delete a single message
logWindowMsgs.addEventListener('click', (e) => {
    if (e.target.innerText === deleteLogIcon)
         logWindowMsgs.removeChild(e.target.parentElement);
});

// prepare to receive a message from the iframe with the log arguments
window.addEventListener("message", (event) => {
    let type = event.data.pop();
    if (type !== 'LOG') {
        event.data.push(type);
        return;
    }
    console.log("got log message");
    // first element is the severity
    let severity = event.data.pop();

    // parse obj to string
    function obj2String (obj) {

        if (Array.isArray(obj)) {
            return `[ ${obj.toString()} ]`;
        }
        else if (typeof obj === 'object') {
            // check if it has a custom 'toString' method
            if (obj.toString !== Object.prototype.toString)
                return obj.toString();

            return JSON.stringify(obj);
        }
        return String(obj);
    }
    // add a string representation to the log messages element
    addLog ( event.data.map( d => obj2String (d) ).join(' - '), severity );
});

/*
    adds a log elemnt to the messages list:
    <div>
        <span> the log text </span>
        <i> the delete icon </i>
    </div>
*/
const severitySuffixes = [ 'log', 'warn', 'err' ];
function addLog (logTxt, severity) {
    let msg = addChildToElement(logWindowMsgs, 'div', 'log-message ' + severitySuffixes[severity]);
    addChildToElement(msg, 'span', '', logTxt);
    addChildToElement(msg, 'i', 'material-icons', deleteLogIcon);
}

// deletes all console messages
export function clearLogs () {
    logWindowMsgs.innerHTML = '';
}
// set up the clear console button
document.getElementById('log-window-clear').addEventListener('click', (event) => clearLogs() );

// set up the log window toggle
let toggleButton = document.getElementById('log-window-toggle');

export function toggleConsole (active) {
    // just toggle to opposite if active parameter is not supplied
    if (active === undefined)
        active = !getElementActive(logWindow);

    setElementsActive([toggleButton, logWindow], active);
    // need to trigger a delayed window resize event or size of scrollable area in editor goes funky
    triggerWindowResizeEvent();
}
toggleButton.addEventListener('click', (event) => toggleConsole () );


/*
    handle resizing the console logs section by
    clicking and dragging the title bar
*/

let resizePixelOffset = document.getElementById('log-window-title-container').getBoundingClientRect().height;
initializeResizableElement ('log-window-messages', 'log-window-resizer-click-area', true, resizePixelOffset);
toggleConsole (true);




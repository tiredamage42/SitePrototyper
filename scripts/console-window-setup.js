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





/*
    handle the console window in the bottom section of the screen

    we intercept the result display's iframe console.logs (and warns / errors)

    by injecting a script into the formatted final display html that overrides the iframe context's
    console.log/warn/error to send a message to our outer window wiht the arguments instead

    then we display them in our custom console window, this way logs from the
    in browser editor dont get confused with normal developer console logs
*/

import {
    setElementsActive, getElementActive, addChildToElement,
    initializeResizableElement, triggerWindowResizeEvent,
    initButton
} from './dom-utils.js';


export function initializeConsole (toggleConsoleHotKey) {
    const consoleMsgsID = 'log-window-messages';

    let consoleWindow = document.getElementById('log-window');
    let consoleWindowMsgs = document.getElementById(consoleMsgsID);
    const deleteLogIcon = 'highlight_off';


    // handle when user wants to delete a single message
    consoleWindowMsgs.addEventListener('click', (e) => {
        if (e.target.innerText === deleteLogIcon)
            consoleWindowMsgs.removeChild(e.target.parentElement);
    });

    // prepare to receive a message from the iframe with the log arguments
    window.addEventListener("message", (event) => {
        if (event.data[event.data.length - 1] !== 'LOG')
            return;

        let type = event.data.pop();
        let severity = event.data.pop();

        // parse obj to string
        function obj2String (obj) {
            if (Array.isArray(obj))
                return `[ ${obj.toString()} ]`;
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
        let msg = addChildToElement(consoleWindowMsgs, 'div', 'log-message ' + severitySuffixes[severity]);
        addChildToElement(msg, 'span', '', logTxt);
        addChildToElement(msg, 'i', 'material-icons', deleteLogIcon);
    }

    // deletes all console messages
    function clearConsole () {
        consoleWindowMsgs.innerHTML = '';
    }

    // set up the clear console button
    let logWindowClear = initButton ('log-window-clear', 'Clear console messages.');
    logWindowClear.addEventListener('click', clearConsole);

    let btn = initButton ('log-window-toggle', 'Toggle Console ' + toggleConsoleHotKey);

    // set up the console window toggle
    function toggleConsole (active) {
        // just toggle to opposite if active parameter is not supplied
        if (active === undefined)
            active = !getElementActive(consoleWindow);

        setElementsActive([btn, consoleWindow], active);
        // need to trigger a delayed window resize event or size of scrollable area in editor goes funky
        triggerWindowResizeEvent();
    }
    btn.addEventListener('click', (e) => toggleConsole (undefined, e))

    /*
        handle resizing the console messages section by
        clicking and dragging the top of the title bar
    */
    // pixel offset since we're dragigng form the top, but resizing the messages,
    // which are below the drag point
    let pixelOffset = document.getElementById('log-window-title').getBoundingClientRect().height;
    initializeResizableElement (consoleMsgsID, 'log-window-resizer-click-area', true, pixelOffset);
    toggleConsole (true);

    return {
        toggleConsole,
        clearConsole
    };
}

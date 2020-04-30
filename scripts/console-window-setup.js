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
    addChildToElement, initializeResizableElement, triggerWindowResizeEvent,
    initButton, toggleElementActive, buildToggleButton
} from './dom-utils.js';


/*
    handle the console window in the bottom section of the screen
*/
export function initializeConsole () {
    const consoleMsgsID = 'log-window-messages';

    let consoleWindow = document.getElementById('log-window');
    let msgs = document.getElementById(consoleMsgsID);
    const deleteIcon = 'highlight_off';

    // handle when user wants to delete a single message
    msgs.addEventListener('click', (e) => {
        if (e.target.innerText === deleteIcon)
            msgs.removeChild(e.target.parentElement);
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
        let msg = addChildToElement(msgs, 'div', 'log-message ' + severitySuffixes[severity]);
        addChildToElement(msg, 'span', '', logTxt);
        addChildToElement(msg, 'i', 'material-icons', deleteIcon);
    }
    // deletes all console messages
    function clearConsole () {
        msgs.innerHTML = '';
    }
    // set up the console window toggle
    function toggleConsole () {
        toggleElementActive(consoleWindow);
        // need to trigger a delayed window resize event or size of scrollable area in editor goes funky
        triggerWindowResizeEvent();
    }

    let result = {
        toggleConsole, clearConsole, addLog,
        clearConsoleOnUpdate: true,
    };

    buildToggleButton ('log-window-clear-on-update', 'Should the console clear every time the view is updated?', () => result.clearConsoleOnUpdate, (v) => result.clearConsoleOnUpdate = v, true);

    // set up the clear console button
    let logWindowClear = initButton ('log-window-clear', 'Clear console messages.');
    logWindowClear.addEventListener('click', clearConsole);

    /*
        handle resizing the console messages section by
        clicking and dragging the top of the title bar
    */
    // pixel offset since we're dragigng form the top, but resizing the messages,
    // which are below the drag point
    let pixelOffset = document.getElementById('log-window-title').getBoundingClientRect().height;
    initializeResizableElement (consoleMsgsID, 'log-window-resizer-click-area', true, pixelOffset);

    return result;
}

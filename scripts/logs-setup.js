
/*
    handle the log window in the bottom left section of the screen

    we intercept the result display's iframe console.logs (and warns / errors)

    by injecting a script into the formatted final display html that overrides the iframe context's
    console.log/warn/error to send a message to our outer window wiht the arguments instead

    then we display them in our custom log window, this way logs from the
    in browser editor dont get confused with normal developer console logs
*/

import { intiializeResizableElement, triggerWindowResizeEvent } from './resize-elements.js';

import { setElementActive } from './dom-utils.js';

let logWindow = document.getElementById('log-window');

function logWindowActive () {
    return logWindow.className.indexOf(' active') !== -1;
}


let logWindowMsgs = document.getElementById('log-window-messages');
// let logWindowTitleBar = document.getElementById("log-window-title-container");

const deleteLogIcon = 'highlight_off';

// handle when user wants to delete a single message
logWindowMsgs.addEventListener('click', (e) => {
    if (e.target.innerText === deleteLogIcon)
         logWindowMsgs.removeChild(e.target.parentElement);
});

// prepare to receive a message from the iframe with the log arguments
window.addEventListener("message", (event) => {

    // first element is the severity
    let severity = event.data.shift();

    // parse obj to string
    function obj2String (obj) {
        if (Array.isArray(obj))
            return `[ ${String(obj)} ]`;
        else if (typeof obj === 'object')
            return JSON.stringify(obj);
        return String(obj);
    }
    // add a string representation to the log messages element
    addLog ( event.data.map( d => obj2String (d) ).join(' - '), severity );
});

/*
    adds a log elemnt to the messages list:

    structure is:

    <div>
        <span> the log text </span>
        <i> the delete icon </i>
    </div>
*/
function addLog (logTxt, severity) {
    let msg = document.createElement('div');
    logWindowMsgs.appendChild(msg);

    let span = document.createElement('span');
    msg.appendChild(span);
    let deleteIcon = document.createElement('i');
    msg.appendChild(deleteIcon);

    msg.className = 'log-message ';

    if      (severity === 0) msg.className += 'log';
    else if (severity === 1) msg.className += 'warn';
    else if (severity === 2) msg.className += 'err';

    span.innerText = logTxt;

    deleteIcon.className = 'material-icons';
    deleteIcon.innerText = deleteLogIcon;
}

// deletes all console messages
export function clearLogs () {
    logWindowMsgs.innerHTML = '';
}
// set up the clear console button
document.getElementById('log-window-clear').addEventListener('click', (event) => {
    clearLogs();
});

// set up the log window toggle
let toggleButton = document.getElementById('log-window-toggle');




export function toggleConsole (active) {

    // just toggle to opposite if active parameter is not supplied
    if (active === undefined)
        active = !logWindowActive();

    setElementActive (toggleButton, active);
    setElementActive (logWindow, active);

    // need to trigger a delayed window resize event or size of scrollable area in editor goes funky
    triggerWindowResizeEvent();
}
toggleButton.addEventListener('click', (event) => toggleConsole () );


/*
    handle resizing the console logs section by
    clicking and dragging the title bar
*/

const maxHeight = .5;
const initialHeight = .15;


intiializeResizableElement(
    logWindowMsgs,
    document.getElementById('log-window-resizer-click-area'),
    initialHeight, maxHeight, true
);
toggleConsole (true);




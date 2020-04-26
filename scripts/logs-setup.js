
/*
    handle the log window in the bottom left section of the screen

    we intercept the result display's iframe console.logs (and warns / errors)

    by injecting a script into the formatted final display html that overrides the iframe context's
    console.log/warn/error to send a message to our outer window wiht the arguments instead

    then we display them in our custom log window, this way logs from the
    in browser editor dont get confused with normal developer console logs
*/


let logWindow = document.getElementById('log-window');
let logWindowMsgs = document.getElementById('log-window-messages');
let logWindowTitleBar = document.getElementById("log-window-title-container");
let resultDisplay = document.getElementById("result-display");

const deleteLogIcon = 'highlight_off';

// handle when user wants to delete a single message
logWindow.addEventListener('click', (e) => {
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

function toggleConsole (active) {
    if (active) {
        toggleButton.className += " active";
        logWindow.className += " active"; // add the 'active' class
    }
    else {
        toggleButton.className = toggleButton.className.replace(" active", ""); // remove the 'active' class
        logWindow.className = logWindow.className.replace(" active", ""); // remove the 'active' class
    }
    // need to trigger a delayed window resize event or size of scrollable area in editor goes funky
    triggerWindowResizeEvent();
}
// set up the log window toggle
let toggleButton = document.getElementById('log-window-toggle');
toggleButton.addEventListener('click', (event) => {
    let isActive = logWindow.className.indexOf(' active') !== -1;
    toggleConsole (!isActive);

});


function triggerWindowResizeEvent() {
    setTimeout( () => window.dispatchEvent(new Event('resize')) , 10);
}



/*
    handle resizing the console logs section by
    clicking and dragging the title bar
*/

const maxHeight = .5;

const setConsoleHeight = (height) => {
    logWindowMsgs.style.setProperty('--resizeable-height', `${Math.floor(Math.min(height, maxHeight) * 100)}%`);
    triggerWindowResizeEvent();
};



const getConsoleHeight = () => {
    const curMaxHeight = getComputedStyle(logWindowMsgs).getPropertyValue('--resizeable-height');
    return parseInt(curMaxHeight, 10) / 100.0;
};

const startDragging = (event) => {
    event.preventDefault();

    const mouseDragHandler = (moveEvent) => {
        moveEvent.preventDefault();



        function clamp01 (v) {
            return Math.min(Math.max(v, 0), 1);
        }

        // calculate the mouse positions y percentage, and set the max height to that
        let percent = 1.0 - clamp01(moveEvent.pageY / document.body.clientHeight);

        setConsoleHeight(percent);


        const primaryButtonPressed = moveEvent.buttons === 1;

        if (!primaryButtonPressed) {
            // setConsoleHeight(getConsoleHeight());

            document.removeEventListener('pointermove', mouseDragHandler);
            // restore result display pointer events to normal
            resultDisplay.style.pointerEvents = "auto";
            // restore mouse cursor to normal
            logWindowMsgs.style.cursor = 'auto';
            return;
        }
    };

    document.addEventListener('pointermove', mouseDragHandler);

    // temporarily disable pointer events for the result display
    // if we dont do this, the drag event doesnt trigger if the cursor
    // is dragging over teh result display iframe
    resultDisplay.style.pointerEvents = "none";

    // change the cursor for the whole log window to resize cursor
    logWindowMsgs.style.cursor = 'ns-resize';
};

logWindowTitleBar.addEventListener('mousedown', startDragging);

setConsoleHeight(.15);
toggleConsole (true);

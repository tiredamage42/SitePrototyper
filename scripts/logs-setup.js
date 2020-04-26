
/*
    handle the log window in the bottom left section of the screen
*/


let logWindow = document.getElementById('log-window');

let logWindowMsgs = document.getElementById('log-window-messages');

const icon = 'highlight_off';

logWindow.addEventListener('click', (e) => {
    if (e.target.innerText === icon) {
         logWindowMsgs.removeChild(e.target.parentElement);
    }
 });

// let iframe = document.getElementById('result-display');
// console.log(iframe.contentWindow);


// export let cons = {
//     log (val) {
//         addLog(String(val), 0);
//     },
//     warn (val) {
//         addLog(String(val), 1);

//     },
//     error (val) {
//         addLog(String(val), 2);
//     }
// };

// export cons;

// iframe.contentWindow.console = cons;
// iframe.contentWindow.console.log = function(val) {
//     console.log('HEHEEH');
//     addLog(String(val), 0);
// };
// iframe.contentWindow.console.warn = function(val) {
//     console.log('HEHEEH');
//     addLog(String(val), 1);
// };
// iframe.contentWindow.console.error = function(val) {
//     console.log('HEHEEH');
//     addLog(String(val), 2);
// };


window.addEventListener("message", (event) => {

    let sev = event.data.shift();

    function obj2String (obj) {
        if (Array.isArray(obj)) {
            return `[ ${String(obj)} ]`;
        }
        if (typeof obj === 'object') {
            return JSON.stringify(obj);
        }
        return String(obj);
    }

    addLog ( event.data.map( d => obj2String (d) ).join(' - '), sev );
    // console.log(...event.data);

    // console.log(event);
});



/*


console.log("log in here");
console.warn("warn in here");

console.error("Some super long error\n that shoud take\n up severla\nlines");

console.warn("another wwarning");
*/



function addLog (logTxt, severity) {
    let msg = document.createElement('div');

    let span = document.createElement('span');
    span.innerText = logTxt;
    msg.appendChild(span);
    msg.className = 'log-message ';
    if (severity === 0)
        msg.className += 'log';
    else if (severity === 1)
        msg.className += 'warn';
    else if (severity === 2)
        msg.className += 'err';

    logWindowMsgs.appendChild(msg);

    let closeIcon = document.createElement('i');
    closeIcon.className = 'material-icons';
    closeIcon.innerText = icon;

    msg.appendChild(closeIcon);





    // <i id="log-window-toggle-info" class="material-icons">highlight_off</i>
}




function clearLogs () {
    logWindowMsgs.innerHTML = '';
}

document.getElementById('log-window-clear').addEventListener('click', (event) => {
    clearLogs();
});

let toggleButton = document.getElementById('log-window-toggle');
toggleButton.addEventListener('click', (event) => {
    // clearLogs();
    let isActive = logWindow.className.indexOf(' active') !== -1;

    // toggleWrap should return true when wrap is enabled
    if (!isActive) {
        // console.log('activating messages');
        toggleButton.className += " active";
        logWindow.className += " active"; // add the 'active' class
    }
    else{
        // console.log('de- activating messages');
        toggleButton.className = toggleButton.className.replace(" active", ""); // remove the 'active' class
        logWindow.className = logWindow.className.replace(" active", ""); // remove the 'active' class
    }

    // need to trigger resize or size of scrollable area in editor goes funky
    // triggerWindowResizeEvent();
    // document.dispatchEvent(new Event('resize'));
    // console.log('resize');

    // // call again after .5 second, jsut in case there was a transition (was also bugging out)
    setTimeout( () => window.dispatchEvent(new Event('resize')) , 10);
});

// let editorElement = document.getElementById('editor');


// const resizeEvent = new Event('resize');

// function triggerWindowResizeEvent () {
//     document.dispatchEvent(new Event('resize'));
// }



// for (let i = 0; i < 15; i++) {
//     addLog(`log ${i}\nsome other stuff too`, Math.min(2, i));
// }




{/* <button id="log-window-min">_</button>
<button id="log-window-close">X</button> */}









const getResizeableElement = () => { return logWindowMsgs; };
const getHandleElement = () => { return document.getElementById("log-window-title-container"); };

// const maxPaneSize = 50;
// getResizeableElement().style.setProperty('--max-height', `${maxPaneSize}%`);


const setPaneWidth = (width) => {

    width = Math.min(width, .5);
    width = Math.floor(width * 100);
    // console.log('setting height to: ' + width);
//   getResizeableElement().style.setProperty('--resizeable-height', `${width}px`);
  getResizeableElement().style.setProperty('--resizeable-height', `${width}%`);
//   document.dispatchEvent(new Event('resize'));
  setTimeout( () => window.dispatchEvent(new Event('resize')) , 10);
    // console.log('resize');

};


// setPaneWidth(document.body.clientHeight * .3);
setPaneWidth(.3);

const getPaneWidth = () => {
  const pxWidth = getComputedStyle(getResizeableElement()).getPropertyValue('--resizeable-height');
  return parseInt(pxWidth, 10) / 100.0;
};

const startDragging = (event) => {
  event.preventDefault();
//   const host = getResizeableElement();
//   const startingPaneWidth = getPaneWidth();
//   console.log("starting pane: " + startingPaneWidth);
//   const xOffset = event.pageY;

//   console.log(xOffset);

  const mouseDragHandler = (moveEvent) => {
    moveEvent.preventDefault();
    const primaryButtonPressed = moveEvent.buttons === 1;
    if (!primaryButtonPressed) {
    //   setPaneWidth(Math.min(getPaneWidth(), maxPaneSize));
      setPaneWidth(getPaneWidth());
      document.removeEventListener('pointermove', mouseDragHandler);
    //   console.log('worng button');



      document.getElementById("result-display").style.pointerEvents = "auto";
      return;
    }

    let percent = 1.0 - Math.max(Math.min((moveEvent.pageY / document.body.clientHeight), 1), 0);

    // let h = (xOffset - moveEvent.pageY) + startingPaneWidth;
    // console.log(moveEvent.pageY / document.body.clientHeight);
    // const paneOriginAdjustment = 'left' === 'right' ? 1 : -1;
    // setPaneWidth(h);
    setPaneWidth(percent);
  };
//   const remove =
  document.addEventListener('pointermove', mouseDragHandler);

  document.getElementById("result-display").style.pointerEvents = "none";
};

getHandleElement().addEventListener('mousedown', startDragging);

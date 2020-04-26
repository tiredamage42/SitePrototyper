
/*
    handle the log window in the bottom left section of the screen
*/

let logWindow = document.getElementById('log-window');

function addLog (logTxt, severity) {
    let lg = document.createElement('p');
    lg.innerText = logTxt;

    if (severity === 0)
        lg.className += 'log';
    else if (severity === 1)
        lg.className += 'warn';
    else if (severity === 2)
        lg.className += 'err';

    logWindow.appendChild(lg);
}

for (let i = 0; i < 5; i++) {
    addLog(`log ${i}`, Math.min(2, i));
}



{/* <button id="log-window-min">_</button>
<button id="log-window-close">X</button> */}


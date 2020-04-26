
/*
    handle teh iframe element that displays the finished product
    of the html, css, and js code

    ( AKA left half of the screen )
*/

function assertFormatting (htmlString, cssString, jsString) {
    // create a temprorary html node with our html string
    let htmlNode = document.createElement('html');

    // remove white space
    let trim = htmlString.trim();

    // assert it's surrounded by an <html> tag
    htmlNode.innerHTML = trim.startsWith('<html>') ? trim.substring(6, trim.length - 7) : trim;

    // fix links to always open in a new tab,
    // links inside iframes generate CORS errors when going to a differnt domain
    // TODO: waht if user wants link to open in editor?
    let links = htmlNode.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++)
        links[i].setAttribute('target', '_base');

    // insert a script that overrides the iframe's console logs
    // to instead send a message to the parent window, with the arguments
    // then logs are printed to the console in browser
    let consoleOverrideString = `<script>
        function postMessage (args, type) {
            Array.prototype.unshift.call(args, type);
            window.parent.postMessage(Array.from(args), '*');
        }
        console.log = function() { postMessage (arguments, 0); };
        console.warn = function() { postMessage (arguments, 1); };
        console.error = function() { postMessage (arguments, 2); };
        </script>
    `;

    // reconstruct html as string
    let head = `<head>${htmlNode.getElementsByTagName('head')[0].innerHTML}<style>${cssString}</style>${consoleOverrideString}</head>`;
    let body = `<body>${htmlNode.getElementsByTagName('body')[0].innerHTML}<script>${jsString}</script></body>`;
    let final = `<html>${head}${body}</html>`;
    return final;
}

// an iframe element
let resultDisplay = document.getElementById("result-display");

export function updateDisplay (htmlString, cssString, jsString) {
    resultDisplay.srcdoc = assertFormatting (htmlString, cssString, jsString);
}

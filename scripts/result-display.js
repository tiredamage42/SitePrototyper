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



    // reconstruct html as string
    let head = `<head>${htmlNode.getElementsByTagName('head')[0].innerHTML}<style>${cssString}</style></head>`;
    let body = `<body>${htmlNode.getElementsByTagName('body')[0].innerHTML}<script>${jsString}</script></body>`;
    let final = `<html>${head}${body}</html>`;
    return final;
}

// an iframe element
let resultDisplay = document.getElementById("result-display");

export function updateDisplay (htmlString, cssString, jsString) {
    resultDisplay.srcdoc = assertFormatting (htmlString, cssString, jsString);
    // console.log(resultDisplay.srcdoc);
}

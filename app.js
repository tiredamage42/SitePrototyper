
import { themes, defualtTheme } from './scripts/themes.js';
import { initializeEditor } from './scripts/editorSetup.js';

// TODO: document uploading...

const themeSelector = document.getElementById('theme-select');
themes.forEach((t) => {
    let opt = document.createElement("option");
    opt.value = t;
    opt.innerText = t;
    if (t === defualtTheme)
        opt.setAttribute('selected', '');
    themeSelector.appendChild(opt);
});

let showIFrame = document.getElementById("code");

var editor = ace.edit("editor");

var EditSession = require("ace/edit_session").EditSession;
let editSession_html = new EditSession('', `ace/mode/html`);
let editSession_css = new EditSession('', `ace/mode/css`);
let editSession_js = new EditSession('', `ace/mode/javascript`);

editSession_html.setValue(`
<h1>Site Prototyper</h1>
<p>
    Press <code>Ctrl-S</code> (<code>Cmd-S</code> on OS-X)
    to update the view.
</p>
<p id="source-link">
    <b>
        <a href="https://github.com/tiredamage42/SitePrototyper">View The Source Code Here</a>
    </b>
</p>
`);

editSession_css.setValue(`
body {
    text-align: center;
}
code {
    background-color: rgba(0,0,0,.5);
    color: rgba(230, 230, 230, 255);
    padding: 0 5px;
}
#source-link {
    margin: 25px;
}
`);

onUpdateView();

function createTemporaryNode (html) {
    // create a temprorary html node with our html string
    var div = document.createElement('div');
    div.innerHTML = html;
    return div;
}

function extractHeadAndBodyHTML (html) {
    let htmlNode = createTemporaryNode (html);
    let headText = '';

    // needs to start off as null, not empty string, for || check when inserting in 'onUpdateView'
    let titleText = null;

    // get the head tag if it exists, remove it and get its contents
    let headNode = htmlNode.getElementsByTagName('head')[0];
    if (headNode) {
        headNode.parentNode.removeChild(headNode);
        headText = headNode.innerHTML;

        let titleNode = headNode.getElementsByTagName('title')[0];
        if (titleNode)
            titleText = titleNode.innerHTML;
    }

    // get the body tag and remove it if it exists, (it's included int eh final src string)
    let bodyNode = htmlNode.getElementsByTagName('body')[0];
    if (bodyNode) {
        bodyNode.parentNode.removeChild(bodyNode);
        htmlNode.innerText = headNode.innerHTML;
    }

    return { head: headText,  title: titleText, html: htmlNode.innerHTML };
}



function onUpdateView () {

    let { head, title, html } = extractHeadAndBodyHTML (editSession_html.getValue());

    showIFrame.srcdoc = `
        <html>
            <head>
                <title>${title || 'INSERT TITLE HERE'}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                ${head}
                <style>${editSession_css.getValue()}</style>
            </head>
            <body>
                ${html}
                <script>${editSession_js.getValue()}</script>
            </body>
        </html>`;
}

initializeEditor(editor, defualtTheme, onUpdateView);

themeSelector.addEventListener("change", (event) => {
    editor.setTheme(`ace/theme/${event.target.value}`);
});

editor.setSession(editSession_html);

const name2session =  {
    HTML: editSession_html,
    CSS: editSession_css,
    JS: editSession_js,
};


let tabContainer = document.getElementById('language-select');
Object.keys(name2session).forEach( (l, i) => {
    let btn = document.createElement('button');
    tabContainer.appendChild(btn);
    btn.className = "tablinks";
    btn.innerText = l;
    if (i == 0)
        btn.className += " active";

});

tabContainer.addEventListener('click', onLanguageTab);

function onLanguageTab(evt) {
    let clicked = evt.target;
    if (clicked.tagName === 'BUTTON') {
        if (clicked.innerText in name2session) {
            Array.from(tabContainer.children).forEach(b => b.className = b.className.replace(" active", "") );
            editor.setSession(name2session[evt.target.innerText]);
            clicked.className += " active";

            console.log(clicked);
        }
    }
}

// Set the font size:
// document.getElementById('editor').style.fontSize='12px';
// editor.setReadOnly(true);  // false to make it editable

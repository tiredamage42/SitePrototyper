
import { initializeEditor } from './scripts/editor-setup.js';
import { initializeThemeSelector, initializeFontSizeSelector, initializeWrapButton, initializeLanguageSelection } from './scripts/menu-setup.js';
import { updateDisplay } from './scripts/result-display.js';

const defaultHTML = `
<html>
    <head>
        <title>Site Prototype</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
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
        <button type="submit" id="demo-button">Click Here To Test JS</button>
    </body>
</html>
`;

const defaultCSS = `
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
`;
const defaultJS = `
const btn = document.getElementById('demo-button');

btn.addEventListener('click', (e) => {
   btn.style.color = btn.style.color === "red" ? "green" : "red";
});
`;

let { editor, name2session } = initializeEditor(defaultHTML, defaultCSS, defaultJS, updateDisplay);

initializeThemeSelector ( (theme) => editor.setTheme(`ace/theme/${theme}`) );

initializeFontSizeSelector ( (fontSize) => editor.setFontSize(fontSize) );

initializeWrapButton ( (wrap) => {
    if (!wrap)
        wrap = !name2session['HTML'].getUseWrapMode();

    Object.values(name2session).forEach (s => s.setUseWrapMode(wrap) );
    return wrap;
} );

initializeLanguageSelection (Object.keys(name2session), (language) => editor.setSession(name2session[language]) );


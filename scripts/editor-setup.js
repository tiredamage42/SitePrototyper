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
    Handle configuring and initializing the ACE editor
    and its sessions

    (AKA the text box on the right hand side of teh screen
        that the code gets typed into)
*/

// defaults
export const defaultFontSize = 12;
export const defaultTabSize = 4;
export const defaultTheme = 'tomorrow_night_eighties';

// initialize an ace editor, and start 3 sessions for html, css, js
export function initializeEditor (initialHTML, initialCSS, initialJS) {

    // create the editor
    let editor = ace.edit("editor");

    // create the sessions
    let EditSession = require("ace/edit_session").EditSession;

    function createSession (mode, defaultText) {
        let session = new EditSession('', `ace/mode/${mode}`);
        // set the text on the sessions to the default
        session.setValue(defaultText);
        session.setUndoManager(new ace.UndoManager());
        return session;
    }

    // create an object for the sessions
    const name2sess =  {
        HTML: createSession ('html', initialHTML),
        CSS: createSession ('css', initialCSS),
        JS: createSession ('javascript', initialJS),
    };

    const getSessionValues = () => { return { html: name2sess.HTML.getValue(), css: name2sess.CSS.getValue(), js: name2sess.JS.getValue() }; };



    // set configuration options
    editor.setOptions({
        // TODO: PUT THE FOLLOWING IN PUBLIC MENU / TOGGLE
        // fontFamily: css font-family value

        // editor options

        highlightActiveLine: true,
        highlightSelectedWord: true,

        // // this is needed if editor is inside scrollable page
        // autoScrollEditorIntoView: boolean (defaults to false)

        // mergeUndoDeltas: false|true|"always"
        // // copy/cut the full line if selection is empty, defaults to false
        // copyWithEmptySelection: boolean
        // useSoftTabs: boolean (defaults to false)
        // navigateWithinSoftTabs: boolean (defaults to false)
        // enableMultiselect: boolean   # on by default

        // renderer options
        hScrollBarAlwaysVisible: true,
        vScrollBarAlwaysVisible: true,
        highlightGutterLine: true,

        // animatedScroll: boolean
        // showInvisibles: boolean

        showPrintMargin: true,
        // printMarginColumn: number (defaults to 80)
        // // shortcut for showPrintMargin and printMarginColumn
        // printMargin: false|number

        // showGutter: boolean (defaults to true)
        // displayIndentGuides: boolean (defaults to true)
        // // resize editor based on the contents of the editor until the number of lines reaches maxLines
        // maxLines: number
        // minLines: number
        // // number of page sizes to scroll after document end (typical values are 0, 0.5, and 1)
        // scrollPastEnd: number|boolean
        // fixedWidthGutter: boolean (defaults to false)
        // mouseHandler options

        // scrollSpeed: number
        // dragDelay:  number
        // dragEnabled: boolean (defaults to true)
        // focusTimout: number
        tooltipFollowsMouse: true,

        // session options
        // overwrite: boolean
        // newLineMode: "auto" | "unix" | "windows"
        // useWorker: boolean
        useSoftTabs: false,

        // editor options defined by extensions
        // to use this options the corresponding extension file needs to be loaded in addition to the ace.js

        // following options require ext-language_tools.js
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
    });

    // add the callback to call when changed (if specified)
    // session.on('change', onEditorChange);

    // editor.setReadOnly(true);  // false to make it editable

    return { editor, name2sess, getSessionValues };
}

// all the possible editor color themes
export const themes = [
	'ambiance',
	'chaos',
	'chrome',
	'clouds',
	'clouds_midnight',
	'cobalt',
	'crimson_editor',
	'dawn',
	'dracula',
	'dreamweaver',
	'eclipse',
	'github',
	'gob',
	'gruvbox',
	'idle_fingers',
	'iplastic',
	'katzenmilch',
	'kr_theme',
	'kuroir',
	'merbivore',
	'merbivore_soft',
	'mono_industrial',
	'monokai',
	'nord_dark',
	'pastel_on_dark',
	'solarized_dark',
	'solarized_light',
	'sqlserver',
	'terminal',
	'textmate',
	'tomorrow',
	'tomorrow_night',
	'tomorrow_night_blue',
	'tomorrow_night_bright',
	'tomorrow_night_eighties',
	'twilight',
	'vibrant_ink',
	'xcode',
];

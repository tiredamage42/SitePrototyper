/*

    Site Prototyper (an in-browser html/css/js editor)
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
export const defualtFontSize = 12;
export const defualtTheme = 'tomorrow_night_eighties';

// initialize an ace editor, and start 3 sessions for html, css, js
export function initializeEditor (defaultHTML, defaultCSS, defaultJS, onUpdateView, clearLogsCommand, toggleConsoleCommand) {
    // update the result display with the default values
    onUpdateView (defaultHTML, defaultCSS, defaultJS);

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
    const name2session =  {
        HTML: createSession ('html', defaultHTML),
        CSS: createSession ('css', defaultCSS),
        JS: createSession ('javascript', defaultJS),
    };

    function updateViewWithSessions () {
        onUpdateView (name2session.HTML.getValue(), name2session.CSS.getValue(), name2session.JS.getValue());
    }

    // add teh update view command
    editor.commands.addCommand({
        name: 'Update View',
        bindKey: { win: 'Ctrl-S',  mac: 'Command-S' },
        exec: function(editor) {
            updateViewWithSessions();
        },
        // readOnly: true // false if this command should not apply in readOnly mode
    });
    // add teh update view command
    editor.commands.addCommand({
        name: 'Update View And Clear Console',
        bindKey: { win: 'Ctrl-Shift-S',  mac: 'Command-Shift-S' },
        exec: function(editor) {
            clearLogsCommand();
            updateViewWithSessions();
        },
    });

    // add teh update view command
    editor.commands.addCommand({
        name: 'Toggle Console',
        bindKey: { win: 'Ctrl-Shift-C',  mac: 'Command-Shift-C' },
        exec: function(editor) {
            toggleConsoleCommand();
        },
    });

    // add teh export command
    editor.commands.addCommand({
        name: 'Export',
        bindKey: { win: 'Ctrl-E',  mac: 'Command-E' },
        exec: function(editor) {
            alert('TODO: implement export');
        },
    });
    // add teh import command
    editor.commands.addCommand({
        name: 'Import',
        bindKey: { win: 'Ctrl-I',  mac: 'Command-I' },
        exec: function(editor) {
            alert('TODO: implement import');
        },
    });

    // add teh beautify key command
    let beautify = require("ace/ext/beautify");
    editor.commands.addCommands(beautify.commands);

    // set configuration options
    editor.setOptions({
        // TODO: PUT THE FOLLOWING IN PUBLIC MENU / TOGGLE
        tabSize: 2,
        // fontFamily: css font-family value
        // ================================================

        // editor options

        // selectionStyle: "line"|"text"
        cursorStyle: "ace", //"ace"|"slim"|"smooth"|"wide"

        highlightActiveLine: true,
        highlightSelectedWord: true,

        // // this is needed if editor is inside scrollable page
        // autoScrollEditorIntoView: boolean (defaults to false)

        // wrapBehavioursEnabled: true,
        // readOnly: true|false
        // mergeUndoDeltas: false|true|"always"
        // behavioursEnabled: boolean
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


        fadeFoldWidgets: false,
        // showFoldWidgets: boolean (defaults to true)
        showLineNumbers: true,
        // showGutter: boolean (defaults to true)
        // displayIndentGuides: boolean (defaults to true)
        // // resize editor based on the contents of the editor until the number of lines reaches maxLines
        // maxLines: number
        // minLines: number
        // // number of page sizes to scroll after document end (typical values are 0, 0.5, and 1)
        // scrollPastEnd: number|boolean
        // fixedWidthGutter: boolean (defaults to false)
        // theme: path to a theme e.g "ace/theme/textmate"
        // mouseHandler options

        // scrollSpeed: number
        // dragDelay:  number
        // dragEnabled: boolean (defaults to true)
        // focusTimout: number
        tooltipFollowsMouse: true,

        // session options
        // firstLineNumber: number defaults to 1
        // overwrite: boolean
        // newLineMode: "auto" | "unix" | "windows"
        // useWorker: boolean
        useSoftTabs: false,
        // foldStyle: "markbegin"|"markbeginend"|"manual"
        // mode: path to a mode e.g "ace/mode/text"

        // editor options defined by extensions
        // to use this options the corresponding extension file needs to be loaded in addition to the ace.js

        // following options require ext-language_tools.js
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,

        // // the following option requires ext-emmet.js and the emmet library
        // enableEmmet: true,
        // // the following option requires ext-elastic_tabstops_lite.js
        // useElasticTabstops: boolean
    });

    // add the callback to call when changed (if specified)
    // session.on('change', onEditorChange);

    // editor.setReadOnly(true);  // false to make it editable

    return { editor, name2session };
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

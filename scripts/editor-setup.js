/*
    Handle configuring and initializing the ACE editor
    and its sessions

    (AKA the text box on the right hand side of teh screen
        that the code gets typed into)
*/

// defaults
export const defualtFontSize = 12;
export const defualtTheme = 'monokai';

// initialize an ace editor, and start 3 sessions for html, css, js
export function initializeEditor (defaultHTML, defaultCSS, defaultJS, onUpdateView) {

    // create the editor
    let editor = ace.edit("editor");

    // create the sessions
    let EditSession = require("ace/edit_session").EditSession;
    let session_html = new EditSession('', `ace/mode/html`);
    let session_css = new EditSession('', `ace/mode/css`);
    let session_js = new EditSession('', `ace/mode/javascript`);

    // set the text on the sessions to the default
    session_html.setValue(defaultHTML);
    session_css.setValue(defaultCSS);
    session_js.setValue(defaultJS);

    session_html.setUndoManager(new ace.UndoManager());
    session_css.setUndoManager(new ace.UndoManager());
    session_js.setUndoManager(new ace.UndoManager());

    // update the result display with the default values
    onUpdateView (defaultHTML, defaultCSS, defaultJS);

    // create an object for the sessions
    const name2session =  {
        HTML: session_html,
        CSS: session_css,
        JS: session_js,
    };

    // add teh update view command
    editor.commands.addCommand({
        name: 'Update View',
        bindKey: { win: 'Ctrl-S',  mac: 'Command-S' },
        exec: function(editor) {
            onUpdateView (session_html.getValue(), session_css.getValue(), session_js.getValue());
        },
        // readOnly: true // false if this command should not apply in readOnly mode
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
        name: 'Export',
        bindKey: { win: 'Ctrl-I',  mac: 'Command-I' },
        exec: function(editor) {
            alert('TODO: implement import');
        },
    });

    // add teh beautify key command
    let beautify = require("ace/ext/beautify");
    editor.commands.addCommands(beautify.commands);

    // TODO: show keyboard shortcuts openers:
    // add command to show keybindings
    // editor.commands.addCommand({
    //     name: "showKeyboardShortcuts",
    //     bindKey: { win: "Ctrl-Alt-h", mac: "Command-Alt-h" },
    //     exec: function(editor) {
    //         // lazy load keybinding menu extension
    //         ace.config.loadModule("ace/ext/keybinding_menu", function(module) {
    //             module.init(editor);
    //             editor.showKeyboardShortcuts()
    //         })
    //     }
    // })
    // editor.execCommand("showKeyboardShortcuts")

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

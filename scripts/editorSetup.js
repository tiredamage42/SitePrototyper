
/*
    initialize one instance of a code editor window
*/

export function initializeEditor (editor, theme, onUpdate, onEditorChange) {

    // set the theme as the default
    editor.setTheme(`ace/theme/${theme}`);

    // add the callback to call when changed (if specified)
    if (onEditorChange)
        editor.session.on('change', onEditorChange);

    // add teh update command
    editor.commands.addCommand({
        name: 'Update View',
        bindKey: { win: 'Ctrl-S',  mac: 'Command-S' },
        exec: function(editor) {
            onUpdate();
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
    editor.commands.addCommand({
        name: "showKeyboardShortcuts",
        bindKey: { win: "Ctrl-Alt-h", mac: "Command-Alt-h" },
        exec: function(editor) {
            // lazy load keybinding menu extension
            ace.config.loadModule("ace/ext/keybinding_menu", function(module) {
                module.init(editor);
                editor.showKeyboardShortcuts()
            })
        }
    })
    // editor.execCommand("showKeyboardShortcuts")

    // set configuration options
    editor.setOptions({
        // TODO: PUT THE FOLLOWING IN PUBLIC MENU / TOGGLE
        wrap: true,
        tabSize: 2,
        // fontSize: number or css font-size string
        // fontFamily: css font-family value
        // ================================================

        // editor options

        // selectionStyle: "line"|"text"
        cursorStyle: "ace", //"ace"|"slim"|"smooth"|"wide"

        highlightActiveLine: true,
        highlightSelectedWord: true,

        // // this is needed if editor is inside scrollable page
        // autoScrollEditorIntoView: boolean (defaults to false)

        // readOnly: true|false
        // mergeUndoDeltas: false|true|"always"
        // behavioursEnabled: boolean
        // wrapBehavioursEnabled: boolean
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
}

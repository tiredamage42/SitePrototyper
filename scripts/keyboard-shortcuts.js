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
    handle displaying all teh keyboard shortcuts
*/

import { addChildToElement } from './dom-utils.js';

export function initializeKeyboardShortcuts (allShortcuts) {

    // shortcuts that didnt work for me
    const skip = [

    ];

    let view = document.getElementById('keyboard-shortcuts');

    // build the shortcuts view
    allShortcuts = allShortcuts.filter(
        sc => (!(skip.includes(sc.name))) && ('bindKey' in sc) && (sc.bindKey.mac != null || sc.bindKey.win != null)
    ).forEach((shortcut, i) => {

        let scElement = addChildToElement(view, 'div', 'keyboard-shortcut');
        addChildToElement (scElement, 'span', 'keyboard-shortcut-name', `${shortcut.name}:`);

        let win = shortcut.bindKey.win;
        if (win)
            win = win.trim();

        // shorten the strign a little
        let mac = shortcut.bindKey.mac;
        if (mac) {
            mac = mac.trim();
            mac = shortcut.bindKey.mac.replace(/Command/g, 'Cmd');
        }
        if (!mac) mac = win;
        if (!win) win = mac;

        let bind = (mac === win) ? mac : `Mac: ${mac || win}\nWin: ${win || mac}`;

        addChildToElement (scElement, 'span', 'keyboard-shortcut-bindKey', bind);
    });

    return view;
}

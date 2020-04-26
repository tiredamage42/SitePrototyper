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


export function setElementActive (element, active) {
    if (active) {
        element.className += " active";
    }
    else {
        // remove the 'active' class
        element.className = element.className.replace(" active", "");
    }
}

export function getElementActive(element) {
    return element.className.indexOf(' active') !== -1;
}

export function addChildToElement (element, tag, className='') {
    let child = document.createElement(tag);
    child.className = className;
    element.appendChild(child);

    return child;
}

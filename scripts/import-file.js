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
    handle importing a file into the current editor
*/
export function importFile (callback) {
    // create a temporary input element
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        // getting a hold of the file reference
        var file = e.target.files[0];
        if (file) {
            // setting up the reader
            var reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = evt => {
                callback (evt.target.result);
            }
        }
    }
    // 'click' the element
    input.click();
}

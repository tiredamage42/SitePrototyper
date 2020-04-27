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



export function assertHTMLIsWithinHTMLTags (htmlString) {
    // remove white space
    htmlString = htmlString.trim();
    // create a temprorary html node with our html string
    let htmlNode = document.createElement('html');
    // assert it's surrounded by an <html> tag
    htmlNode.innerHTML = htmlString.startsWith('<html>') ? htmlString.substring(6, htmlString.length - 7) : htmlString;
    return htmlNode;
}

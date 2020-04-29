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
    files: array of objects:
    {
        name, text
    }
*/

export function exportFilesToZip (zipName, files) {
    // zip the files into one directory
    let zip = new JSZip();

    // Generate a directory within the Zip file structure
    let project = zip.folder(zipName);

    files.forEach (f =>  project.file(f.name, f.text));

    // Generate the zip file asynchronously
    zip.generateAsync( { type:"blob" } ).then(
        (content) => {

            const url = URL.createObjectURL(content);

            // Create a new anchor element
            const a = document.createElement('a');

            // Set the href and download attributes for the anchor element
            a.href = url;
            a.download = zipName + ".zip";

            // Click handler that releases the object URL after the element has been clicked
            // This is required for one-off downloads of the blob content
            const linkClickHandler = () => {
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                    a.removeEventListener('click', linkClickHandler);
                }, 150);
            };

            // Add the click event listener on the anchor element
            a.addEventListener('click', linkClickHandler, false);

            // Programmatically trigger a click on the anchor element
            a.click();
        }
    );
}

export function importFile(onFileRead) {
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
            reader.onload = evt => onFileRead (evt.target.result);
        }
    }
    // 'click' the element
    input.click();
}

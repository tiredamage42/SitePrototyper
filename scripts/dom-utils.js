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
    utility functions for dom manipulation
*/

export function setElementActive (element, active) {
    if (active)
        element.classList.add("active");
    else
        element.classList.remove("active");
}

export function setElementsActive (elements, active) {
    elements.forEach( e => setElementActive(e, active) );
}

export function toggleElementActive(element) {
    element.classList.toggle('active');
}
export function toggleElementsActive (elements) {
    elements.forEach( e => toggleElementActive(e) );
}

export function getElementActive(element) {
    return element.classList.contains('active');
}

export function addChildToElement (element, tag, className, innerText) {
    let child = document.createElement(tag);
    if (className) child.className = className;
    if (innerText) child.innerText = innerText;
    element.appendChild(child);
    return child;
}

/*
    initialize a selector with options,
    then programatically 'select' the default value
*/
export function buildSelector (id, collection, defaultOption, onSelect) {
    // get the selector
    const selector = document.getElementById(id);
    // add an option for each element in the selection
    collection.forEach((c) => {
        // crete an option element
        let option = addChildToElement(selector, 'option', '', c);
        // set the value and display text to the collection element
        option.value = c;
        // define if teh option element should have the 'selected' attribute
        if (c === defaultOption)
            option.setAttribute('selected', '');
    });
    // initilalize change callback
    selector.addEventListener( "change", e => onSelect(e.target.value) );
    onSelect(defaultOption);
}

// set up "tabs" buttons
export function buildTabs (containerID, collection, defaultSelectedIndex, onSelect) {
    // get the container
    let container = document.getElementById(containerID);

    collection.forEach( (v, i) => {
        // for each language specified, create a tab button
        let btn = addChildToElement(container, 'button', 'button-menu-left', v);
        if (i == defaultSelectedIndex)
            setElementActive(btn, true);
    });
    // initialize the event listener for button clicks
    container.addEventListener('click', (e) => {
        // make sure we clicked a button
        if (e.target.tagName === 'BUTTON') {
            // call teh callback with the value (stored in 'innerText')
            onSelect(e.target.innerText);
            // unselect all the tabs in teh container
            Array.from(container.children).forEach(b => setElementActive(b, false) );
            // activate the selected one
            setElementActive(e.target, true);
        }
    });
    // default to the selected index
    onSelect(collection[defaultSelectedIndex]);
}

export function buildToggleButton (elementID, tooltip, getValue, setValue, defaultValue) {
    let tgl = initButton (elementID, tooltip);
    function setVal (active) {
        setValue(active);
        setElementActive(tgl, active)
    }
    tgl.addEventListener('click', (evt) => setVal(!getValue()));
    setVal(defaultValue);
}

// export function initButton (elementID, tooltip, onClick) {
export function initButton (elementID, tooltip) {
    let btn = document.getElementById(elementID);
    btn.title = tooltip;

    // btn.addEventListener( 'click', onClick );
    return btn;
}

// trigger the event that calls when a iwndow is resized
// used to update the text editor.
// wihtout this it bugs out when any element is resized
export function triggerWindowResizeEvent(delay=10) {
    setTimeout( () => window.dispatchEvent(new Event('resize')) , delay);
}

export function initializeResizableElement (resizeElementID, dragElementID, vertical, offsetPixels = 0) {

    let iframes = Array.from ( document.getElementsByTagName('iframe') );

    let element = document.getElementById(resizeElementID);
    let drag = document.getElementById(dragElementID);

    function getViewSize () {
        return vertical ? document.body.clientHeight : document.body.clientWidth;
    }

    // set the element's new size, and trigger the resize event
    const setElementSize = (sizePX, viewSize) => {
        let viewUnits = Math.floor( ( sizePX / viewSize ) * 100 );
        element.style.setProperty(vertical ? 'height' : 'width', `${viewUnits}v` + (vertical ? 'h': 'w'));
        triggerWindowResizeEvent();
    };

    const startDragging = (clickEvent) => {
        if (clickEvent.buttons !== 1)
            return;

        clickEvent.preventDefault();

        function stopDrag () {
            document.removeEventListener('pointermove', mouseDragHandler);
            document.removeEventListener('mouseup', stopDrag);
            // restore iframes' pointer events to normal
            iframes.forEach( i => i.style.pointerEvents = 'auto' );
            // restore mouse cursor to normal
            element.style.cursor = 'auto';
        }

        const mouseDragHandler = (event) => {
            event.preventDefault();

            let viewSize = getViewSize();
            let mousePos = (vertical ? event.pageY : event.pageX) + offsetPixels;
            setElementSize(viewSize - mousePos, viewSize);

            // if we let go of the button
            if (event.buttons !== 1) {
                stopDrag();
                return;
            }
        };

        document.addEventListener('pointermove', mouseDragHandler);
        document.addEventListener('mouseup', stopDrag);

        // temporarily disable pointer events for the iframes in the document
        // if we dont do this, the drag event doesnt trigger if the cursor
        // is dragging over teh iframe, which stops the resizing
        iframes.forEach( i => i.style.pointerEvents = 'none' );

        // change the cursor for the whole element to resize cursor
        element.style.cursor = vertical ? 'ns-resize' : 'ew-resize';
    };

    drag.addEventListener('mousedown', startDragging);
}


export function disableOnOutsideAreaClick (area, elements) {
    function closeIfOutisdeClick(e) {
        if (!area.contains(e.target)) {
            if (getElementActive(area))
                setElementsActive(elements, false);
            window.removeEventListener('click', closeIfOutisdeClick);
        }
    }
    function onAreaToggle (){
        if (getElementActive(area))
            setTimeout( () => window.addEventListener('click', closeIfOutisdeClick), 1);
        else
            window.removeEventListener('click', closeIfOutisdeClick);
    }
    return onAreaToggle;
}


// takes in an html string
export function assertHTMLIsWithinHTMLTags (html) {
    // remove white space
    html = html.trim();
    // create a temprorary html node with our html string
    let htmlNode = document.createElement('html');
    // assert it's surrounded by an <html> tag
    htmlNode.innerHTML = html.startsWith('<html>') ? html.substring(6, html.length - 7) : html;
    return htmlNode;
}


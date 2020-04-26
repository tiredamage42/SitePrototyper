
/*
    handle resizing dom elements
*/

let resultDisplay = document.getElementById("result-display");

// trigger the event that calls when a iwndow is resized
// used to update the text editor.
// wihtout this it bugs out when any element is resized
export function triggerWindowResizeEvent(delay=10) {
    setTimeout( () => window.dispatchEvent(new Event('resize')) , delay);
}

export function intiializeResizableElement (resizeElement, dragElement, initialSize, maxSize, isVertical) {
    // the css variable to use
    let resizeVar = isVertical ? '--resizeable-height' : '--resizeable-width';

    // set the element's new size, and trigger the resize event
    const setElementSize = (size01) => {
        resizeElement.style.setProperty(resizeVar, `${Math.floor(Math.min(size01, maxSize) * 100)}%`);
        triggerWindowResizeEvent();
    };

    const startDragging = (event) => {

        event.preventDefault();

        function stopDrag () {
            document.removeEventListener('pointermove', mouseDragHandler);
            document.removeEventListener('mouseup', stopDrag);

            // restore result display pointer events to normal
            resultDisplay.style.pointerEvents = "auto";
            // restore mouse cursor to normal
            resizeElement.style.cursor = 'auto';
        }

        const mouseDragHandler = (moveEvent) => {
            moveEvent.preventDefault();

            // calculate the mouse positions percentage, and set the max size to that
            let t = isVertical ? (moveEvent.pageY / document.body.clientHeight) : (moveEvent.pageX / document.body.clientWidth)

            // clamp to 0,1 range and invert
            let percent = 1.0 - Math.min(Math.max(t, 0), 1);

            setElementSize(percent);

            // if we let go of the button
            if (moveEvent.buttons !== 1) {
                stopDrag();
                return;
            }
        };

        document.addEventListener('pointermove', mouseDragHandler);
        document.addEventListener('mouseup', stopDrag);

        // temporarily disable pointer events for the result display
        // if we dont do this, the drag event doesnt trigger if the cursor
        // is dragging over teh result display iframe
        resultDisplay.style.pointerEvents = "none";

        // change the cursor for the whole element to resize cursor
        resizeElement.style.cursor = isVertical ? 'ns-resize' : 'ew-resize';
    };

    dragElement.addEventListener('mousedown', startDragging);

    setElementSize(initialSize);
}

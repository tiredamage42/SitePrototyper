

export function setElementActive (element, active) {
    if (active) {
        element.className += " active";
    }
    else {
        // remove the 'active' class
        element.className = element.className.replace(" active", "");
    }
}


export class HotKey {
    constructor(mac, win) {
        this.mac = mac;
        this.win = win;
    }
    match (key) {
        return key === this.mac || key === this.win;
    }
    toString() {
        return `[ ${this.mac.replace('command', 'Cmd/Ctrl').split('+').map( w => w.charAt(0).toUpperCase() + w.substring(1) ).join('+')} ]`;
    }
}

export function initializeHotKeys () {
    let allHotKeys = [];
    return {
        addHotKey (hk) {
            allHotKeys.push(hk.win);
            allHotKeys.push(hk.mac);
            return hk;
        },
        allHotKeysString () {
            return allHotKeys.join(', ');
        },
        finishHotkeyInitialization (onKeyPressed) {
            hotkeys.filter = function(event){
                return true;
            }
            hotkeys(this.allHotKeysString(), function(event, handler) {
                onKeyPressed(handler.key);
                return false;
            });
        }
    };
}

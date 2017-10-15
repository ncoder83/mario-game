const PRESSED = 1;
const RELEASE = 0;

export default class KeyboardState{
    constructor(){
        //hold the current state of a given key
        this.keyStates = new Map();

        //holds the callback function for a key code
        this.keyMap = new Map();
    }

    addMapping(code, callback){
        this.keyMap.set(code, callback);
    }

    handleEvent(event){
        const {code} = event;

        if(!this.keyMap.has(code)){
            return;
        }

        event.preventDefault();
        const keyState = event.type === 'keydown' ? PRESSED : RELEASE;

        if(this.keyStates.get(code) === keyState){
            return;
        }

        this.keyStates.set(code, keyState);
        this.keyMap.get(code)(keyState);
    }

    listenTo(window){
        ['keydown', 'keyup'].forEach(eventName =>{
            window.addEventListener(eventName, event => {
                this.handleEvent(event);
            });

        });
        
    }
}
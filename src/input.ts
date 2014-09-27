///<reference path="./object.ts"/>
///<reference path="./interface.ts"/>
module masao{
    export module input{
        //ユーザーの入力
        export class Input{
            private keyinput:KeyInput;
            constructor(){
                this.keyinput=new KeyInput();
            }
            getKeyInput():KeyInput{
                return this.keyinput;
            }
            start():void{
                this.keyinput.start();
            }
            end():void{
                this.keyinput.end();
            }
            //入力状況
            isJumpTrigger():boolean{
                //スペースまたはZ
                return this.keyinput.isTriggered(32) || this.keyinput.isTriggered(90);
            }
        }
        export class KeyInput extends EventEmitter implements GameObject{
            public renderLayer=Layers.BACKGROUND;
            public routineLayer=RLayers.STARTUP;
            public routine:KeyInputRoutine;
            public renderer:objects.renderer.None;
            constructor(){
                super();
                this.routine=new KeyInputRoutine(this);
                this.renderer=new objects.renderer.None();
            }
            //キー入力の
            start():void{
                this.routine.start();
            }
            end():void{
                this.routine.end();
            }
            //状態取得
            isPushed(keycode:number):boolean{
                return this.routine.isPushed(keycode);
            }
            isTriggered(keycode:number):boolean{
                return this.routine.isTriggered(keycode);
            }
        }
        export class KeyInputRoutine implements Doable{
            public keyMap:{
                [keycode:number]:number;
            }
            private framecount:number;
            private working:boolean;
            private keyuphandler:(e:KeyboardEvent)=>void;
            private keydownhandler:(e:KeyboardEvent)=>void;
            constructor(private keyinput:KeyInput){
                this.keyMap=<any>{};
                //フレームをカウント（トリガー判定）
                this.framecount=1;
                this.working=false;
            }
            start():void{
                if(this.working===true){
                    this.end();
                }
                this.keydownhandler=(e:KeyboardEvent)=>{
                    this.keyMap[e.keyCode]=this.framecount;
                };
                this.keyuphandler=(e:KeyboardEvent)=>{
                    this.keyMap[e.keyCode]=0;
                };
                document.addEventListener("keydown",this.keydownhandler,false);
                document.addEventListener("keyup",this.keyuphandler,false);
                this.working=true;
            }
            end():void{
                document.addEventListener("keydown",this.keydownhandler,false);
                document.addEventListener("keyup",this.keyuphandler,false);
                this.working=false;
            }
            main():void{
                //毎フレームごとの
                this.framecount++;
            }
            isPushed(keycode:number):boolean{
                return this.keyMap[keycode]!==0;
            }
            isTriggered(keycode:number):boolean{
                return this.keyMap[keycode]===this.framecount;
            }
        }
    }
}

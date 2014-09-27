///<reference path="./input.ts"/>
module masao{
    //ゲームの状態を保持するってなにそれ
    export class GameState{
        private input:input.Input;
        constructor(){
        }
        setInput(i:input.Input):void{
            this.input=i;
        }
        getInput():input.Input{
            return this.input;
        }
    }
}

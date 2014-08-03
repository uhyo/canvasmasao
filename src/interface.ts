//よくつかうinterface
declare module masao{
    //レイヤーの種類（数字が小さいほうが後ろ）
    export enum Layers{
        minBound = 0,
        //背景レイヤー
        BACKGROUND = 0,
        //情報レイヤー
        INFORMATION = 1,
        //障害物レイヤー
        ATHLETICS = 2,
        //キャラクターレイヤー
        CHARACTERS = 3,
        //全景レイヤー
        FOREGROUND = 4,
        maxBound = 4
    }
    export interface Point{
        x:number;
        y:number;
    }
    //物体を表すオブジェクト
    interface GameObject extends EventEmitter{
        //物体の情報とかもってる
        //動きはroutineで
        routine:Doable;
        //物体の描画担当
        renderer:Renderable;
    }
    interface Doable{
        main():void;
    }
    interface Renderable{
        render(ctx:CanvasRenderingContext2D,scroll:Point):void;
    }
}

///<reference path="./image.ts"/>
///<reference path="./status.ts"/>
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
    //ルーチンのレイヤー（処理順）
    export enum RLayers{
        minBound = 0,
        NONE     = 0,
        STARTUP  = 1,
        MAIN     = 2,
        CLEANUP  = 3,
        maxBound = 3,
    }
    //ベクトル
    export interface Point{
        x:number;
        y:number;
    }
    //長方形
    export interface Box{
        x:number;
        y:number;
        width:number;
        height:number;
    }
    //色
    export interface Color{
        r:number;
        g:number;
        b:number;
    }
    //物体を表すオブジェクト
    interface GameObject extends EventEmitter{
        //物体の情報とかもってる
        //動きはroutineで
        routine:Doable;
        //物体の描画担当
        renderer:Renderable;
        //レイヤー
        renderLayer:Layers;
        routineLayer:RLayers;
    }
    interface Doable{
        main(state:GameState):void;
    }
    interface Renderable{
        render(grc:GameRenderingContext):void;
    }
}

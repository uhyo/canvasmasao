//Sceneが保持する動くオブジェクト
///<reference path="./eventemitter3.d.ts"/>
///<reference path="./interface.ts"/>
///<reference path="./image.ts"/>
///<reference path="./status.ts"/>
module masao{
    export module objects{
        //画像を表示するだけのオブジェクト（タイトル画面、背景等）
        export class ImagePanel extends EventEmitter implements GameObject,Point{
            public routine:routine.doNothing;
            public renderer:renderer.Image;
            public routineLayer=RLayers.NONE;
            constructor(private image:ImageObject,public renderLayer:Layers,public x:number,public y:number){
                super();
                this.routine=new routine.doNothing(this);
                this.renderer=new renderer.Image(this,image);
            }
        }
        //単色の板を表示（背景用）
        export class ColorPanel extends EventEmitter implements GameObject,Box{
            public routine:routine.doNothing;
            public renderer:renderer.Rect;
            public routineLayer=RLayers.NONE;
            constructor(private color:Color,public renderLayer:Layers,public x:number,public y:number,public width:number,public height:number){
                super();
                this.routine=new routine.doNothing(this);
                this.renderer=new renderer.Rect(this,color);
            }
        }
        //マップ（地形情報を管理）
        export class Map extends EventEmitter implements GameObject{
            public routine:routine.doNothing;
            public renderer:renderer.Maptips;
            public renderLayer=Layers.BACKGROUND;
            public routineLayer=RLayers.NONE;
            public map:Array<Array<number>>;    //map[x][y]
            constructor(public width:number,public height:number,private maptip_size:number){
                super();
                this.initMap();
                this.routine=new routine.doNothing(this);
                this.renderer=new renderer.Maptips(this,maptip_size);
            }
            private initMap():void{
                //マップを空っぽで初期化する
                this.map=[];
                var arr:Array<number>;
                var width=this.width, height=this.height;
                for(var x=0;x<width;x++){
                    arr=[];
                    for(var y=0;y<height;y++){
                        arr[y]=0;
                    }
                    this.map[x]=arr;
                }
            }
            set(x:number,y:number,code:number):void{
                this.map[x][y]=code;
            }
        }

        //シーン進行管理
        export module sceneManagement{
            //タイトル画面
            export class Title extends EventEmitter implements GameObject{
                public renderer:renderer.None;
                public routine:TitleRoutine;
                public renderLayer=Layers.BACKGROUND;
                public routineLayer=RLayers.CLEANUP;
                constructor(){
                    super();
                    this.renderer=new renderer.None();
                    this.routine=new TitleRoutine(this);
                }
                nextScene():void{
                    //次のシーンに移行したい場合
                    this.emit("next");
                }
            }
            export class TitleRoutine implements Doable{
                constructor(private t:Title){
                }
                main(state:GameState):void{
                    var input=state.getInput();
                    //ジャンプキー押されたら次のシーンへ移行
                    if(input.isJumpTrigger()){
                        this.t.nextScene();
                    }

                }
            }
        }

        export module routine{
            export class doNothing implements Doable{
                constructor(private obj:GameObject){
                }
                main(state:GameState):void{
                }
            }
        }
        export module renderer{
            //描画しない
            export class None implements Renderable{
                render(grc:GameRenderingContext):void{
                }
            }
            //画像を描画するだけ
            export class Image{
                constructor(private obj:Point,private image:ImageObject){
                }
                render(grc:GameRenderingContext):void{
                    grc.renderImage(this.image,this.obj);
                }
            }
            //長方形
            export class Rect{
                constructor(private obj:Box,private color:Color){
                }
                render(grc:GameRenderingContext):void{
                    grc.renderRect(this.color,this.obj);
                }
            }
            //マップチップを描画
            export class Maptips{
                constructor(private obj:{
                    width:number;
                    height:number;
                    map:Array<Array<number>>;
                },private maptip_size:number){
                }
                render(grc:GameRenderingContext):void{
                    //マップを描画
                    var obj=this.obj, map=obj.map, scr=grc.scroll, mts=this.maptip_size;
                    //描画開始マップ座標
                    var sx=Math.max(0,Math.floor(scr.x/mts)), sy=Math.max(0,Math.floor(scr.y/mts));
                    //終了座標
                    var ex=Math.min(obj.width-1,Math.floor((grc.screen_width-1)/mts)), ey=Math.min(obj.height-1,Math.floor((grc.screen_height-1)/mts));
                    for(var x=sx;x<=ex;x++){
                        for(var y=sy;y<=ey;y++){
                            grc.renderPatternCell(map[x][y],{
                                x:x*mts,
                                y:y*mts
                            });
                        }
                    }
                }
            }
        }
    }
}

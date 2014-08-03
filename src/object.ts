//Sceneが保持する動くオブジェクト
///<reference path="./eventemitter3.d.ts"/>
///<reference path="./interface.ts"/>
///<reference path="./image.ts"/>
module masao{
    export module objects{
        //画像を表示するだけのオブジェクト（タイトル画面、背景等）
        export class ImagePanel extends EventEmitter implements GameObject,Point{
            public routine:routine.doNothing;
            public renderer:renderer.Image;
            constructor(private image:ImageObject,public x:number,public y:number){
                super();
                this.routine=new routine.doNothing(this);
                this.renderer=new renderer.Image(this,image);
            }
        }
        export module routine{
            export class doNothing implements Doable{
                constructor(private obj:GameObject){
                }
                main():void{
                }
            }
        }
        export module renderer{
            //画像を描画するだけ
            export class Image{
                constructor(private obj:Point,private image:ImageObject){
                }
                render(ctx:CanvasRenderingContext2D,scroll:Point):void{
                    this.image.renderOn(ctx,this.obj,scroll);
                }
            }
        }
    }
}

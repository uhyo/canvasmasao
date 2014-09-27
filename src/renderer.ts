//レンダラ（canvasへの描画を担当）
///<reference path="./eventemitter3.d.ts"/>
///<reference path="./factory.ts"/>
///<reference path="./interface.ts"/>
///<reference path="./image.ts"/>
module masao{
    export class Renderer{
        private canvas:HTMLCanvasElement;
        private context:CanvasRenderingContext2D;
        private grc:GameRenderingContext;
        private factoryfactory:factory.FactoryFactory;
        private view:View;
        constructor(ff:factory.FactoryFactory){
            this.factoryfactory=ff;
            this.view=new View(this);
        }
        //初期化
        init():void{
            var rf=this.factoryfactory.resourceFactory();
            var cf=this.factoryfactory.canvasFactory();
            var gf=this.factoryfactory.gameRenderingContextFactory();
            this.canvas=cf.canvas();
            this.context=this.canvas.getContext("2d");
            this.grc=gf.grc();
            this.grc.init(this.context,rf.pattern());
            this.grc.setScroll({x:0,y:0});
        }
        //getter
        getCanvas():HTMLCanvasElement{
            return this.canvas;
        }
        getView():View{
            return this.view;
        }
        //1回描画する
        render():void{
            this.view.render(this.grc);
        }
    }
    //描画対象オブジェクトをまとめておく
    export class View{
        private layers:Array<Array<Renderable>>;
        constructor(private renderer:Renderer){
            this.init();
        }
        init():void{
            this.layers=[];
            for(var i=Layers.minBound;i<=Layers.maxBound;i++){
                this.layers[i]=[];
            }
        }
        add(layer:Layers,obj:Renderable):void{
            //オブジェクトを追加する
            this.layers[layer].push(obj);
        }
        remove(layer:Layers,obj:Renderable):void{
            var ls:Array<Renderable>=this.layers[layer];
            //同じオブジェクトが2つ登録されていることはないだろうと思う
            for(var i=0,l=ls.length;i<l;i++){
                if(ls[i]===obj){
                    ls.splice(i,1);
                    break;
                }
            }
        }
        //描画する
        render(grc:GameRenderingContext):void{
            //奥のレイヤーから順番に
            var arr:Array<Renderable>;
            for(var i=Layers.minBound;i<=Layers.maxBound;i++){
                arr=this.layers[i];
                for(var j=0,l=arr.length;j<l;j++){
                    arr[j].render(grc);
                }
            }
        }
    }
}

//画像の読み込み等
///<reference path="./eventemitter3.d.ts"/>
///<reference path="./interface.ts"/>
module masao{
    /*
     * 発生イベント:
     *  load 画像の読み込み完了
     */
    export class ImageObject extends EventEmitter{
        private el:HTMLImageElement;
        public width:number;
        public height:number;
        constructor(path:string){
            super();
            //path:画像のパス
            this.width=null, this.height=null;
            var img:HTMLImageElement=this.el=document.createElement("img");
            img.src=path;
            img.addEventListener("load",(e:Event)=>{
                //ロード完了した
                this.width=img.naturalWidth, this.height=img.naturalHeight;
                this.emit("load");
            },false);
        }
        getImage():HTMLImageElement{
            return this.el;
        }
        //実際に描画する
        renderOn(ctx:CanvasRenderingContext2D,position:Point,scroll:Point):void{
            var p=this.screenPosition(position,scroll);
            ctx.drawImage(this.el,p.x,p.y);
        }
        //座標計算
        private screenPosition(position:Point,scroll:Point):Point{
            return {
                x:position.x-scroll.x,
                y:position.y-scroll.y
            };
        }

    }
}

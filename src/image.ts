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
                this.onImageLoad();
                this.emit("load");
            },false);
        }
        getImage():HTMLImageElement{
            return this.el;
        }
        private onImageLoad():void{
            this.width=this.el.naturalWidth;
            this.height=this.el.naturalHeight;
        }
        //ctxに描画
        renderOn(ctx:CanvasRenderingContext2D,screenPosition:Point):void{
            ctx.drawImage(this.el,screenPosition.x,screenPosition.y);
        }
    }
    //マップチップ的パターン画像オブジェクト
    export class CellImageObject{
        public image:ImageObject;
        public xnumber:number=1;  //横に何マス分あるのか
        public size:number
        constructor(path:string,size:number){
            this.image=new ImageObject(path);
            this.size=size;
            this.image.on("load",()=>{
                this.xnumber=Math.floor(this.image.width/this.size);
            });
        }
        renderOn(ctx:CanvasRenderingContext2D,tipnumber:number,screenPosition:Point):void{
            var size=this.size, xnumber=this.xnumber;
            var cx=tipnumber%xnumber, cy=(tipnumber-cx)/xnumber;
            console.log(this.image.getImage());
            ctx.drawImage(this.image.getImage(),cx*size,cy*size,size,size,screenPosition.x,screenPosition.y,size,size);
        }

    }

    //描画に必要な情報と描画
    export class GameRenderingContext{
        private context:CanvasRenderingContext2D;
        private pattern:CellImageObject;    //パターン画像
        public screen_width:number;
        public screen_height:number;
        public scroll:Point;
        constructor(screen_width:number,screen_height:number){
            this.screen_width=screen_width;
            this.screen_height=screen_height;
        }
        init(context:CanvasRenderingContext2D,pattern:CellImageObject):void{
            this.context=context;
            this.pattern=pattern;
        }
        setScroll(scroll:Point):void{
            this.scroll=scroll;
        }
        //単色の長方形を描画
        renderRect(color:Color,box:Box):void{
            var p=this.screenPosition(box);
            var context=this.context;
            context.fillStyle=this.colorString(color);
            context.fillRect(p.x,p.y,box.width,box.height);
        }
        //画像を描画する
        renderImage(img:ImageObject,position:Point):void{
            var p=this.screenPosition(position);
            img.renderOn(this.context,p);
        }
        //パターン画像から描画
        renderPatternCell(tipnumber:number,position:Point):void{
            var p=this.screenPosition(position);
            this.pattern.renderOn(this.context,tipnumber,p);
        }
        //座標計算
        private screenPosition(position:Point):Point{
            return {
                x:position.x-this.scroll.x,
                y:position.y-this.scroll.y
            };
        }
        //色文字列生成
        private colorString(color:Color):string{
            return "rgb("+color.r+","+color.g+","+color.b+")";
        }
    }
}

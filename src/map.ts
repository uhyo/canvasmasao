///<reference path="./object.ts"/>
module masao{
    //Mapを文字列から構築する
    export class MapBuilder{
        private data:Array<string>;
        private map:objects.Map;
        constructor(private width:number,private height:number,private maptip_size:number){
            //width,height: ステージのサイズ
        }
        load(data:Array<string>):void{
            var width=this.width, height=this.height;
            var x:number, y:number, code:number;
            this.data=data;
            //マップを作成
            this.map=new objects.Map(width,height,this.maptip_size);
            for(x=0;x<width;x++){
                for(y=0;y<height;y++){
                    code=data[y].charCodeAt(x);
                    if(97<=code && code<=106){
                        //a-j
                        //ブロック番号:20〜29である
                        this.map.set(x,y,code-77);
                    }
                }
            }
        }
        getMap():objects.Map{
            return this.map;
        }
    }
}

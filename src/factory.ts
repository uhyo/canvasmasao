///<reference path="./config.ts"/>
///<reference path="./image.ts"/>
///<reference path="./gameloop.ts"/>
///<reference path="./renderer.ts"/>
///<reference path="./map.ts"/>
///<reference path="./object.ts"/>
//Factory関連
module masao{
    export module factory{
        export class FactoryFactory{
            constructor(private config:Config){
            }
            public resourceFactory():ResourceFactory{
                return new ResourceFactory(new configInterface.Resourse(this.config));
            }
            public gameloopManagerFactory():GameloopManagerFactory{
                return new GameloopManagerFactory(new configInterface.Gameloop(this.config));
            }
            public canvasFactory():CanvasFactory{
                return new CanvasFactory(new configInterface.Canvas(this.config));
            }
            public gameRenderingContextFactory():GameRenderingContextFactory{
                return new GameRenderingContextFactory(new configInterface.Canvas(this.config));
            }
            public mapBuilderFactory():MapBuilderFactory{
                return new MapBuilderFactory(new configInterface.Map(this.config));
            }
            public backgroundFactory():BackgroundFactory{
                return new BackgroundFactory(new configInterface.Background(this.config));
            }
        }
        //////////Factory
        //メインループを生成しよう
        export class GameloopManagerFactory{
            constructor(private cf:configInterface.Gameloop){
            }
            public loop(rp:RoutineProcessor,renderer:Renderer):GameloopManager{
                return new GameloopManager(rp,renderer,this.cf.gameSpeed);
            }
        }
        //各種リソースのImageObjectを生成しよう
        export class ResourceFactory{
            constructor(private re:configInterface.Resourse){
            }
            public title():ImageObject{
                return new ImageObject(this.re.title);
            }
            public pattern():CellImageObject{
                return new CellImageObject(this.re.pattern,this.re.maptip_size);
            }
        }
        //canvasを生成しよう
        export class CanvasFactory{
            constructor(private cn:configInterface.Canvas){
            }
            public canvas():HTMLCanvasElement{
                var result=document.createElement("canvas");
                result.width=this.cn.screen_width;
                result.height=this.cn.screen_height;
                return result;
            }
        }
        //GameRenderingContextを生成
        export class GameRenderingContextFactory{
            constructor(private cn:configInterface.Canvas){
            }
            public grc():GameRenderingContext{
                return new GameRenderingContext(this.cn.screen_width,this.cn.screen_height);
            }
        }
        //MapBuilder
        export class MapBuilderFactory{
            constructor(private mp:configInterface.Map){
            }
            public mapBuilder(stage:number):MapBuilder{
                var result=new MapBuilder(this.mp.stage_width,this.mp.stage_height,this.mp.maptip_size);
                result.load(this.mp.getData(stage));
                return result;
            }
        }
        //背景を表示するためのオブジェクト
        export class BackgroundFactory{
            constructor(private bg:configInterface.Background){
            }
            public background(stage:number):GameObject{
                //単色の背景
                var bgcolor:Color=this.bg.getBackgroundColor(stage);
                //オブジェクト作る
                return new objects.ColorPanel(bgcolor,Layers.BACKGROUND,0,0,this.bg.screen_width,this.bg.screen_height);
            }
        }
        //////////configを解釈するインターフェース
        export module configInterface{
            //ゲームループ用
            export class Gameloop{
                //フレーム間の時間（ミリ秒）
                public gameSpeed:number;
                constructor(config:Config){
                    this.gameSpeed=parseInt(config.get("game_speed"));
                    if(!isFinite(this.gameSpeed)){
                        //とりあえずデフォルト値
                        this.gameSpeed=70;
                    }
                }
            }
            //各種リソースのURLを示すコンフィグ
            export class Resourse{
                public title:string;
                public pattern:string;
                public maptip_size:number;
                constructor(config:Config){
                    this.title=config.get("filename_title");
                    this.pattern=config.get("filename_pattern");
                    this.maptip_size=Number(config.get("maptip_size"));
                }
            }
            //ゲーム画面canvasの情報を表す
            export class Canvas{
                public screen_width:number;
                public screen_height:number;
                constructor(config:Config){
                    this.screen_width=Number(config.get("screen_width"));
                    this.screen_height=Number(config.get("screen_height"));
                }
            }
            //Map関連
            export class Map{
                public stage_width:number;
                public stage_height:number;
                public maptip_size:number;
                constructor(private config:Config){
                    this.stage_width=Number(config.get("stage_width"));
                    this.stage_height=Number(config.get("stage_height"));
                    this.maptip_size=Number(config.get("maptip_size"));
                }
                getData(stage:number):Array<string>{
                    var config=this.config;
                    if(stage<1 || 4<stage){
                        //そんなデータは持っていない
                        return [];
                    }
                    var data_suffix:string=
                        stage===1 ? "" :
                        stage===2 ? "-s" :
                        stage===3 ? "-t" : "-f";

                    var result:Array<string>=[];
                    for(var i=0;i<this.stage_height;i++){
                        result[i]=config.get("map0-"+i+data_suffix)+config.get("map1-"+i+data_suffix)+config.get("map2-"+i+data_suffix);
                    }
                    return result;
                }
            }
            //Background関連
            export class Background{
                public screen_width:number;
                public screen_height:number;
                public backgroundColor:Color;
                constructor(private config:Config){
                    this.screen_width=Number(config.get("screen_width"));
                    this.screen_height=Number(config.get("screen_height"));
                }
                getBackgroundColor(stage:number):Color{
                    var config=this.config;
                    if(!(1<=stage && stage<=4)){
                        //データがない
                        return {
                            r:0,
                            g:0,
                            b:0
                        };
                    }
                    var suffix:string=
                        stage===1 ? "" :
                        stage===2 ? "_s" :
                        stage===3 ? "_t" :
                        "_f";
                    return {
                        r:Number(config.get("backcolor_red"+suffix)),
                        g:Number(config.get("backcolor_green"+suffix)),
                        b:Number(config.get("backcolor_blue"+suffix))
                    };
                }
            }
        }
    }
}

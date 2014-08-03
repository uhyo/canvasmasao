///<reference path="./config.ts"/>
///<reference path="./image.ts"/>
///<reference path="./gameloop.ts"/>
///<reference path="./renderer.ts"/>
//Factory関連
module masao{
    export module factory{
        export class FactoryFactory{
            constructor(private config:Config){
            }
            public resourseFactory():ResourceFactory{
                return new ResourceFactory(new configInterface.Resourse(this.config));
            }
            public gameloopManagerFactory():GameloopManagerFactory{
                return new GameloopManagerFactory(new configInterface.Gameloop(this.config));
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
                constructor(config:Config){
                    this.title=config.get("filename_title");
                }
            }
        }
    }
}

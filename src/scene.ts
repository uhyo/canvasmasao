//Sceneクラス：ゲームの1場面を管理
///<reference path="./eventemitter3.d.ts" />
///<reference path="./config.ts"/>
///<reference path="./factory.ts"/>
///<reference path="./gamemanager.ts"/>
///<reference path="./image.ts"/>
///<reference path="./object.ts"/>
module masao{
    //これは抽象クラス的な何か
    export class Scene extends EventEmitter{
        //protectedがいいな…
        public factoryfactory:factory.FactoryFactory;
        public manager:GameObjectManager;
        constructor(ff:factory.FactoryFactory,manager:GameObjectManager){
            super();
            this.factoryfactory=ff;
            this.manager=manager;
        }
        //シーン開始
        start():void{
        }
        //protectedがいいな…
        end():void{
            this.emit("end");
        }
    }

    //具体的なシーン
    export module scenes{
        //タイトル画面
        export class TitleScene extends Scene{
            start():void{
                //タイトル画像を表示
                var factory=this.factoryfactory.resourceFactory();
                var image=new objects.ImagePanel(factory.title(),Layers.BACKGROUND,0,0);
                this.manager.add(image);
                //シーン進行を担当するやつ
                var t=new objects.sceneManagement.Title();
                this.manager.add(t);
                t.on("next",()=>{
                    //次のシーンへ
                    this.end();
                });
            }
        }
        //ステージ中
        export class StageScene extends Scene{
            private stage:number;
            setStage(stage:number):void{
                this.stage=stage;
            }
            start():void{
                //ステージ開始
                //まず背景
                var bgf=this.factoryfactory.backgroundFactory();
                var bg=bgf.background(this.stage);
                this.manager.add(bg);

                //マップ生成
                var mbf=this.factoryfactory.mapBuilderFactory();
                var mb=mbf.mapBuilder(this.stage);
                var map=mb.getMap();
                console.log(map);
                this.manager.add(map);
            }
        }
    }
}

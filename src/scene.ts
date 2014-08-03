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
    }

    //具体的なシーン
    export module scenes{
        //タイトル画面
        export class TitleScene extends Scene{
            start():void{
                //タイトル画像を表示
                var factory=this.factoryfactory.resourseFactory();
                var image=new objects.ImagePanel(factory.title(),0,0);
                this.manager.add(Layers.BACKGROUND,image);
            }
        }
        //ステージ中
        export class StageScene extends Scene{
        }
    }
}

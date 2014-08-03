//GameManagerクラス:ゲーム進行を管理
///<reference path="./factory.ts"/>
///<reference path="./gameloop.ts"/>
///<reference path="./scene.ts"/>
///<reference path="./interface.ts"/>
module masao{
    export class GameManager{
        private currentScene:Scene;
        private factoryfactory:factory.FactoryFactory;
        private manager:GameObjectManager;
        constructor(ff:factory.FactoryFactory){
            this.factoryfactory=ff;
        }
        //ゲーム開始準備
        init(manager:GameObjectManager):void{
            this.manager=manager;
        }
        //ゲーム開始
        start():void{
            //タイトル画面表示
            this.setScene(this.getInitScene());
            this.startScene();
            this.onEndScene(()=>{
                //ゲーム開始
                this.setScene(new scenes.StageScene(this.factoryfactory,this.manager));
                this.onEndScene(()=>{
                });
            });
        }
        //sceneをセットする
        private setScene(scene:Scene):void{
            this.currentScene=scene;
        }
        //sceneをスタートする
        private startScene():void{
            this.currentScene.start();
        }
        //今のシーンが終わったら
        private onEndScene(func:()=>void):void{
            this.currentScene.once("end",func);
        }
        //最初のSceneを得る
        private getInitScene():Scene{
            //タイトル画面からはじまる
            return new scenes.TitleScene(this.factoryfactory,this.manager);
        }
    }
}

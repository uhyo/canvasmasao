//canvas正男メインファイル
///<reference path="./gameloop.ts"/>
///<reference path="./gamemanager.ts"/>
///<reference path="./renderer.ts"/>
///<reference path="./factory.ts"/>

module masao{
    export class Game{
        private factoryfactory:factory.FactoryFactory;
        private manager:GameManager;
        private processor:RoutineProcessor;
        private renderer:Renderer;
        private omanager:GameObjectManager;
        private loopmanager:GameloopManager;
        constructor(config:Config){
            this.factoryfactory=new factory.FactoryFactory(config);
            this.manager=new GameManager(this.factoryfactory);
            this.processor=new RoutineProcessor();
            this.renderer=new Renderer(this.factoryfactory);
            this.omanager=new GameObjectManager(this.renderer.getView(),this.processor);
            this.loopmanager=this.factoryfactory.gameloopManagerFactory().loop(this.processor,this.renderer);
        }
        //初期化する
        init():void{
            this.renderer.init();
            this.manager.init(this.omanager);
        }
        //ゲーム開始
        start():void{
            this.manager.start();
            this.loopmanager.init();
        }
        //canvasを得る
        getCanvas():HTMLCanvasElement{
            return this.renderer.getCanvas();
        }
    }

}

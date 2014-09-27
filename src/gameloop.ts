///<reference path="./gamemanager.ts"/>
///<reference path="./status.ts"/>
///<reference path="./renderer.ts"/>
module masao{
    export class GameloopManager{
        private lasttime:number;
        constructor(private rp:RoutineProcessor,private renderer:Renderer,private speed:number){
        }
        init():void{
            //ループ開始
            this.lasttime=0;
            var raf=requestAnimationFrame;
            var rp=this.rp, renderer=this.renderer, speed=this.speed;
            var loopfunc=()=>{
                //時間差を取得
                var now=Date.now();
                if(now-this.lasttime<speed){
                    //短いのでとばす
                    raf(loopfunc);
                    return;
                }
                //処理する
                this.lasttime+=speed;
                rp.process();
                renderer.render();
                raf(loopfunc);
            };
            raf(loopfunc);
        }
    }
    //ゲームへのオブジェクトの追加を管理する
    export class GameObjectManager{
        constructor(private view:View,private processor:RoutineProcessor){
        }
        //初期化する
        init():void{
            this.view.init();
            this.processor.init();
        }
        add(obj:GameObject):void{
            //Rendererに追加
            this.view.add(obj.renderLayer,obj.renderer);
            this.processor.add(obj.routineLayer,obj.routine);
            obj.once("destroy",this.remove.bind(this,obj));
        }
        private remove(obj:GameObject):void{
            //オブジェクトはdestoryされたら除去する
            this.view.remove(obj.renderLayer,obj.renderer);
            this.processor.remove(obj.routineLayer,obj.routine);
        }
    }
    //各オブジェクトの処理を担当
    export class RoutineProcessor{
        private layers:Array<Array<Doable>>;
        constructor(private state:GameState){
            this.init();
        }
        init():void{
            //初期化
            this.layers=[];
            for(var i=RLayers.minBound;i<=RLayers.maxBound;i++){
                this.layers[i]=[];
            }
        }
        add(layer:RLayers,obj:Doable):void{
            this.layers[layer].push(obj);
        }
        remove(layer:RLayers,obj:Doable):void{
            var os=this.layers[layer];
            for(var i=0,l=os.length;i<l;i++){
                if(os[i]===obj){
                    os.splice(i,1);
                    break;
                }
            }
        }
        process():void{
            //removeで番号がずれてもいいように
            var os:Array<Doable>;
            for(var i=RLayers.minBound;i<=RLayers.maxBound;i++){
                os=this.layers[i].concat([]);
                for(var j=0,l=os.length;j<l;j++){
                    os[j].main(this.state);
                }
            }
        }
    }
}

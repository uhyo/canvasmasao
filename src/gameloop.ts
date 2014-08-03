////<reference path="./gamemanager.ts"/>
////<reference path="./renderer.ts"/>
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
        add(layer:Layers,obj:GameObject):void{
            //Rendererに追加
            this.view.add(layer,obj.renderer);
            this.processor.add(obj.routine);
            obj.once("destroy",this.remove.bind(this,layer,obj));
        }
        private remove(layer:Layers,obj:GameObject):void{
            //オブジェクトはdestoryされたら除去する
            this.view.remove(layer,obj.renderer);
            this.processor.remove(obj.routine);
        }
    }
    //各オブジェクトの処理を担当
    export class RoutineProcessor{
        private objects:Array<Doable>;
        constructor(){
            this.objects=[];
        }
        add(obj:Doable):void{
            this.objects.push(obj);
        }
        remove(obj:Doable):void{
            var os=this.objects;
            for(var i=0,l=os.length;i<l;i++){
                if(os[i]===obj){
                    os.splice(i,1);
                    break;
                }
            }
        }
        process():void{
            //removeで番号がずれてもいいように
            var os=this.objects.concat([]);
            for(var i=0,l=os.length;i<l;i++){
                os[i].main();
            }
        }
    }
}

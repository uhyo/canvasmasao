//Config（デフォルトコンフィグとかある）
module masao{
    export class Config{
        private config:{[key:string]:any;};
        //デフォルトコンフィグ
        private defaultConfig:any={
            //ファイル名
            filename_title:"title.gif",
            //ゲームスピード
            game_speed:"70"
        };
        constructor(config){
            this.config=config;
        }
        get(key:string):any{
            var result:any=this.config[key];
            if(result==null){
                result=this.defaultConfig[key];
            }
            return result;
        }
    }
}

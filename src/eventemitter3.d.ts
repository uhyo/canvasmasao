//EventEmitter3
// https://github.com/3rd-Eden/EventEmitter3

declare class EventEmitter{
    listeners(event?:string):Function[];
    emit(event:string,...args:any[]):boolean;
    on(event:string,fn:Function,context?:any):EventEmitter;
    once(event:string,fn:Function,context?:any):EventEmitter;
    removeListener(event:string,fn:Function):EventEmitter;
    removeAllListeners(event?:string):EventEmitter;
    off(event:string,fn:Function):EventEmitter;
    addListener(event:string,fn:Function,context?:any):EventEmitter;
    setMaxListeners(n?:number):EventEmitter;
}

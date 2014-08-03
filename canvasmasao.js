'use strict';

/**
 * Minimal EventEmitter interface that is molded against the Node.js
 * EventEmitter interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() {
  this._events = {};
}

/**
 * Return a list of assigned event listeners.
 *
 * @param {String} event The events that should be listed.
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  return Array.apply(this, this._events[event] || []);
};

/**
 * Emit an event to all registered event listeners.
 *
 * @param {String} event The name of the event.
 * @returns {Boolean} Indication if we've emitted an event.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  if (!this._events || !this._events[event]) return false;

  var listeners = this._events[event]
    , length = listeners.length
    , len = arguments.length
    , fn = listeners[0]
    , args
    , i;

  if (1 === length) {
    if (fn.__EE3_once) this.removeListener(event, fn);

    switch (len) {
      case 1:
        fn.call(fn.__EE3_context || this);
      break;
      case 2:
        fn.call(fn.__EE3_context || this, a1);
      break;
      case 3:
        fn.call(fn.__EE3_context || this, a1, a2);
      break;
      case 4:
        fn.call(fn.__EE3_context || this, a1, a2, a3);
      break;
      case 5:
        fn.call(fn.__EE3_context || this, a1, a2, a3, a4);
      break;
      case 6:
        fn.call(fn.__EE3_context || this, a1, a2, a3, a4, a5);
      break;

      default:
        for (i = 1, args = new Array(len -1); i < len; i++) {
          args[i - 1] = arguments[i];
        }

        fn.apply(fn.__EE3_context || this, args);
    }
  } else {
    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    for (i = 0; i < length; fn = listeners[++i]) {
      if (fn.__EE3_once) this.removeListener(event, fn);
      fn.apply(fn.__EE3_context || this, args);
    }
  }

  return true;
};

/**
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Functon} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  if (!this._events) this._events = {};
  if (!this._events[event]) this._events[event] = [];

  fn.__EE3_context = context;
  this._events[event].push(fn);

  return this;
};

/**
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  fn.__EE3_once = true;
  return this.on(event, fn, context);
};

/**
 * Remove event listeners.
 *
 * @param {String} event The event we want to remove.
 * @param {Function} fn The listener that we need to find.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn) {
  if (!this._events || !this._events[event]) return this;

  var listeners = this._events[event]
    , events = [];

  if (fn) for (var i = 0, length = listeners.length; i < length; i++) {
    if (listeners[i] !== fn) {
      events.push(listeners[i]);
    }
  }

  //
  // Reset the array, or remove it completely if we have no more listeners.
  //
  if (events.length) this._events[event] = events;
  else this._events[event] = null;

  return this;
};

/**
 * Remove all listeners or only the listeners for the specified event.
 *
 * @param {String} event The event want to remove all listeners for.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  if (!this._events) return this;

  if (event) this._events[event] = null;
  else this._events = {};

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

//
// Expose the module.
//
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.EventEmitter2 = EventEmitter;
EventEmitter.EventEmitter3 = EventEmitter;

try { module.exports = EventEmitter; }
catch (e) {}
////<reference path="./gamemanager.ts"/>
////<reference path="./renderer.ts"/>
var masao;
(function (masao) {
    var GameloopManager = (function () {
        function GameloopManager(rp, renderer, speed) {
            this.rp = rp;
            this.renderer = renderer;
            this.speed = speed;
        }
        GameloopManager.prototype.init = function () {
            var _this = this;
            //ループ開始
            this.lasttime = 0;
            var raf = requestAnimationFrame;
            var rp = this.rp, renderer = this.renderer, speed = this.speed;
            var loopfunc = function () {
                //時間差を取得
                var now = Date.now();
                if (now - _this.lasttime < speed) {
                    //短いのでとばす
                    raf(loopfunc);
                    return;
                }

                //処理する
                _this.lasttime += speed;
                rp.process();
                renderer.render();
                raf(loopfunc);
            };
            raf(loopfunc);
        };
        return GameloopManager;
    })();
    masao.GameloopManager = GameloopManager;

    //ゲームへのオブジェクトの追加を管理する
    var GameObjectManager = (function () {
        function GameObjectManager(view, processor) {
            this.view = view;
            this.processor = processor;
        }
        GameObjectManager.prototype.add = function (layer, obj) {
            //Rendererに追加
            this.view.add(layer, obj.renderer);
            this.processor.add(obj.routine);
            obj.once("destroy", this.remove.bind(this, layer, obj));
        };
        GameObjectManager.prototype.remove = function (layer, obj) {
            //オブジェクトはdestoryされたら除去する
            this.view.remove(layer, obj.renderer);
            this.processor.remove(obj.routine);
        };
        return GameObjectManager;
    })();
    masao.GameObjectManager = GameObjectManager;

    //各オブジェクトの処理を担当
    var RoutineProcessor = (function () {
        function RoutineProcessor() {
            this.objects = [];
        }
        RoutineProcessor.prototype.add = function (obj) {
            this.objects.push(obj);
        };
        RoutineProcessor.prototype.remove = function (obj) {
            var os = this.objects;
            for (var i = 0, l = os.length; i < l; i++) {
                if (os[i] === obj) {
                    os.splice(i, 1);
                    break;
                }
            }
        };
        RoutineProcessor.prototype.process = function () {
            //removeで番号がずれてもいいように
            var os = this.objects.concat([]);
            for (var i = 0, l = os.length; i < l; i++) {
                os[i].main();
            }
        };
        return RoutineProcessor;
    })();
    masao.RoutineProcessor = RoutineProcessor;
})(masao || (masao = {}));
//Config（デフォルトコンフィグとかある）
var masao;
(function (masao) {
    var Config = (function () {
        function Config(config) {
            //デフォルトコンフィグ
            this.defaultConfig = {
                //ファイル名
                filename_title: "title.gif",
                //ゲームスピード
                game_speed: "70"
            };
            this.config = config;
        }
        Config.prototype.get = function (key) {
            var result = this.config[key];
            if (result == null) {
                result = this.defaultConfig[key];
            }
            return result;
        };
        return Config;
    })();
    masao.Config = Config;
})(masao || (masao = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
//画像の読み込み等
///<reference path="./eventemitter3.d.ts"/>
///<reference path="./interface.ts"/>
var masao;
(function (masao) {
    /*
    * 発生イベント:
    *  load 画像の読み込み完了
    */
    var ImageObject = (function (_super) {
        __extends(ImageObject, _super);
        function ImageObject(path) {
            var _this = this;
            _super.call(this);

            //path:画像のパス
            this.width = null, this.height = null;
            var img = this.el = document.createElement("img");
            img.src = path;
            img.addEventListener("load", function (e) {
                //ロード完了した
                _this.width = img.naturalWidth, _this.height = img.naturalHeight;
                _this.emit("load");
            }, false);
        }
        ImageObject.prototype.getImage = function () {
            return this.el;
        };

        //実際に描画する
        ImageObject.prototype.renderOn = function (ctx, position, scroll) {
            var p = this.screenPosition(position, scroll);
            ctx.drawImage(this.el, p.x, p.y);
        };

        //座標計算
        ImageObject.prototype.screenPosition = function (position, scroll) {
            return {
                x: position.x - scroll.x,
                y: position.y - scroll.y
            };
        };
        return ImageObject;
    })(EventEmitter);
    masao.ImageObject = ImageObject;
})(masao || (masao = {}));
//レンダラ（canvasへの描画を担当）
///<reference path="./eventemitter3.d.ts"/>
///<reference path="./factory.ts"/>
///<reference path="./interface.ts"/>
var masao;
(function (masao) {
    var Renderer = (function () {
        function Renderer(ff) {
            this.factoryfactory = ff;
            this.view = new View(this);
        }
        //初期化
        Renderer.prototype.init = function () {
            this.canvas = document.createElement("canvas");
            this.context = this.canvas.getContext("2d");
        };

        //getter
        Renderer.prototype.getCanvas = function () {
            return this.canvas;
        };
        Renderer.prototype.getView = function () {
            return this.view;
        };

        //1回描画する
        Renderer.prototype.render = function () {
            this.view.render(this.context);
        };
        return Renderer;
    })();
    masao.Renderer = Renderer;

    //描画対象オブジェクトをまとめておく
    var View = (function () {
        function View(renderer) {
            this.renderer = renderer;
            this.scroll = {
                x: 0,
                y: 0
            };
            this.layers = [];
            for (var i = 0 /* minBound */; i <= 4 /* maxBound */; i++) {
                this.layers[i] = [];
            }
        }
        View.prototype.add = function (layer, obj) {
            //オブジェクトを追加する
            this.layers[layer].push(obj);
        };
        View.prototype.remove = function (layer, obj) {
            var ls = this.layers[layer];

            for (var i = 0, l = ls.length; i < l; i++) {
                if (ls[i] === obj) {
                    ls.splice(i, 1);
                    break;
                }
            }
        };

        //描画する
        View.prototype.render = function (ctx) {
            //奥のレイヤーから順番に
            var arr;
            for (var i = 0 /* minBound */; i <= 4 /* maxBound */; i++) {
                arr = this.layers[i];
                for (var j = 0, l = arr.length; j < l; j++) {
                    arr[j].render(ctx, this.scroll);
                }
            }
        };
        return View;
    })();
    masao.View = View;
})(masao || (masao = {}));
///<reference path="./config.ts"/>
///<reference path="./image.ts"/>
///<reference path="./gameloop.ts"/>
///<reference path="./renderer.ts"/>
//Factory関連
var masao;
(function (masao) {
    (function (factory) {
        var FactoryFactory = (function () {
            function FactoryFactory(config) {
                this.config = config;
            }
            FactoryFactory.prototype.resourseFactory = function () {
                return new ResourceFactory(new configInterface.Resourse(this.config));
            };
            FactoryFactory.prototype.gameloopManagerFactory = function () {
                return new GameloopManagerFactory(new configInterface.Gameloop(this.config));
            };
            return FactoryFactory;
        })();
        factory.FactoryFactory = FactoryFactory;

        //////////Factory
        //メインループを生成しよう
        var GameloopManagerFactory = (function () {
            function GameloopManagerFactory(cf) {
                this.cf = cf;
            }
            GameloopManagerFactory.prototype.loop = function (rp, renderer) {
                return new masao.GameloopManager(rp, renderer, this.cf.gameSpeed);
            };
            return GameloopManagerFactory;
        })();
        factory.GameloopManagerFactory = GameloopManagerFactory;

        //各種リソースのImageObjectを生成しよう
        var ResourceFactory = (function () {
            function ResourceFactory(re) {
                this.re = re;
            }
            ResourceFactory.prototype.title = function () {
                return new masao.ImageObject(this.re.title);
            };
            return ResourceFactory;
        })();
        factory.ResourceFactory = ResourceFactory;

        //////////configを解釈するインターフェース
        (function (configInterface) {
            //ゲームループ用
            var Gameloop = (function () {
                function Gameloop(config) {
                    this.gameSpeed = parseInt(config.get("game_speed"));
                    if (!isFinite(this.gameSpeed)) {
                        //とりあえずデフォルト値
                        this.gameSpeed = 70;
                    }
                }
                return Gameloop;
            })();
            configInterface.Gameloop = Gameloop;

            //各種リソースのURLを示すコンフィグ
            var Resourse = (function () {
                function Resourse(config) {
                    this.title = config.get("filename_title");
                }
                return Resourse;
            })();
            configInterface.Resourse = Resourse;
        })(factory.configInterface || (factory.configInterface = {}));
        var configInterface = factory.configInterface;
    })(masao.factory || (masao.factory = {}));
    var factory = masao.factory;
})(masao || (masao = {}));
//Sceneが保持する動くオブジェクト
///<reference path="./eventemitter3.d.ts"/>
///<reference path="./interface.ts"/>
///<reference path="./image.ts"/>
var masao;
(function (masao) {
    (function (objects) {
        //画像を表示するだけのオブジェクト（タイトル画面、背景等）
        var ImagePanel = (function (_super) {
            __extends(ImagePanel, _super);
            function ImagePanel(image, x, y) {
                _super.call(this);
                this.image = image;
                this.x = x;
                this.y = y;
                this.routine = new routine.doNothing(this);
                this.renderer = new renderer.Image(this, image);
            }
            return ImagePanel;
        })(EventEmitter);
        objects.ImagePanel = ImagePanel;
        (function (routine) {
            var doNothing = (function () {
                function doNothing(obj) {
                    this.obj = obj;
                }
                doNothing.prototype.main = function () {
                };
                return doNothing;
            })();
            routine.doNothing = doNothing;
        })(objects.routine || (objects.routine = {}));
        var routine = objects.routine;
        (function (renderer) {
            //画像を描画するだけ
            var Image = (function () {
                function Image(obj, image) {
                    this.obj = obj;
                    this.image = image;
                }
                Image.prototype.render = function (ctx, scroll) {
                    this.image.renderOn(ctx, this.obj, scroll);
                };
                return Image;
            })();
            renderer.Image = Image;
        })(objects.renderer || (objects.renderer = {}));
        var renderer = objects.renderer;
    })(masao.objects || (masao.objects = {}));
    var objects = masao.objects;
})(masao || (masao = {}));
//Sceneクラス：ゲームの1場面を管理
///<reference path="./eventemitter3.d.ts" />
///<reference path="./config.ts"/>
///<reference path="./factory.ts"/>
///<reference path="./gamemanager.ts"/>
///<reference path="./image.ts"/>
///<reference path="./object.ts"/>
var masao;
(function (masao) {
    //これは抽象クラス的な何か
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene(ff, manager) {
            _super.call(this);
            this.factoryfactory = ff;
            this.manager = manager;
        }
        //シーン開始
        Scene.prototype.start = function () {
        };
        return Scene;
    })(EventEmitter);
    masao.Scene = Scene;

    //具体的なシーン
    (function (scenes) {
        //タイトル画面
        var TitleScene = (function (_super) {
            __extends(TitleScene, _super);
            function TitleScene() {
                _super.apply(this, arguments);
            }
            TitleScene.prototype.start = function () {
                //タイトル画像を表示
                var factory = this.factoryfactory.resourseFactory();
                var image = new masao.objects.ImagePanel(factory.title(), 0, 0);
                this.manager.add(0 /* BACKGROUND */, image);
            };
            return TitleScene;
        })(Scene);
        scenes.TitleScene = TitleScene;

        //ステージ中
        var StageScene = (function (_super) {
            __extends(StageScene, _super);
            function StageScene() {
                _super.apply(this, arguments);
            }
            return StageScene;
        })(Scene);
        scenes.StageScene = StageScene;
    })(masao.scenes || (masao.scenes = {}));
    var scenes = masao.scenes;
})(masao || (masao = {}));
//GameManagerクラス:ゲーム進行を管理
///<reference path="./factory.ts"/>
///<reference path="./gameloop.ts"/>
///<reference path="./scene.ts"/>
///<reference path="./interface.ts"/>
var masao;
(function (masao) {
    var GameManager = (function () {
        function GameManager(ff) {
            this.factoryfactory = ff;
        }
        //ゲーム開始準備
        GameManager.prototype.init = function (manager) {
            this.manager = manager;
        };

        //ゲーム開始
        GameManager.prototype.start = function () {
            var _this = this;
            //タイトル画面表示
            this.setScene(this.getInitScene());
            this.startScene();
            this.onEndScene(function () {
                //ゲーム開始
                _this.setScene(new masao.scenes.StageScene(_this.factoryfactory, _this.manager));
                _this.onEndScene(function () {
                });
            });
        };

        //sceneをセットする
        GameManager.prototype.setScene = function (scene) {
            this.currentScene = scene;
        };

        //sceneをスタートする
        GameManager.prototype.startScene = function () {
            this.currentScene.start();
        };

        //今のシーンが終わったら
        GameManager.prototype.onEndScene = function (func) {
            this.currentScene.once("end", func);
        };

        //最初のSceneを得る
        GameManager.prototype.getInitScene = function () {
            //タイトル画面からはじまる
            return new masao.scenes.TitleScene(this.factoryfactory, this.manager);
        };
        return GameManager;
    })();
    masao.GameManager = GameManager;
})(masao || (masao = {}));
//canvas正男メインファイル
///<reference path="./gameloop.ts"/>
///<reference path="./gamemanager.ts"/>
///<reference path="./renderer.ts"/>
///<reference path="./factory.ts"/>
var masao;
(function (masao) {
    var Game = (function () {
        function Game(config) {
            this.factoryfactory = new masao.factory.FactoryFactory(config);
            this.manager = new masao.GameManager(this.factoryfactory);
            this.processor = new masao.RoutineProcessor();
            this.renderer = new masao.Renderer(this.factoryfactory);
            this.omanager = new masao.GameObjectManager(this.renderer.getView(), this.processor);
            this.loopmanager = this.factoryfactory.gameloopManagerFactory().loop(this.processor, this.renderer);
        }
        //初期化する
        Game.prototype.init = function () {
            this.renderer.init();
            this.manager.init(this.omanager);
        };

        //ゲーム開始
        Game.prototype.start = function () {
            this.manager.start();
            this.loopmanager.init();
        };

        //canvasを得る
        Game.prototype.getCanvas = function () {
            return this.renderer.getCanvas();
        };
        return Game;
    })();
    masao.Game = Game;
})(masao || (masao = {}));

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
//Config（デフォルトコンフィグとかある）
var masao;
(function (masao) {
    var Config = (function () {
        function Config(config) {
            //デフォルトコンフィグ
            this.defaultConfig = {
                //どちらかというと内部的なやつ
                maptip_size: 32,
                screen_width: 512,
                screen_height: 320,
                stage_width: 180,
                stage_height: 30,
                ////////////////////
                //背景色
                backcolor_red: "0",
                backcolor_green: "255",
                backcolor_blue: "255",
                //ファイル名
                filename_title: "title.gif",
                filename_pattern: "pattern.gif",
                //ゲームスピード
                game_speed: "70",
                //マップ
                "map0-0": "............................................................",
                "map0-1": "............................................................",
                "map0-2": ".a..aaa.aaa..a...........................................",
                "map0-3": "bbb.b.b.b...bbb..........................................",
                "map0-4": ".c..ccc.ccc..c...........................................",
                "map0-5": ".d..d.....d..d...........................................",
                "map0-6": ".ee.eee.eee..ee..........................................",
                "map0-7": "............................................................",
                "map0-8": "............................................................",
                "map0-9": "............................................................",
                "map0-10": "............................................................",
                "map0-11": "............................................................",
                "map0-12": "............................................999.............",
                "map0-13": "............................................999.............",
                "map0-14": "............................................................",
                "map0-15": "............................................aaa.............",
                "map0-16": "............................................................",
                "map0-17": "............................................................",
                "map0-18": "...............................99...........................",
                "map0-19": "............................................................",
                "map0-20": "............................................................",
                "map0-21": "............................................................",
                "map0-22": "...12...............12.....9.9...aaa.....aa.aaaaaaaa...12...",
                "map0-23": ".............B............aaaaa..............9.aaaaa........",
                "map0-24": ".........aaaaa..........................B...aaaaaaaa........",
                "map0-25": "....9.9.............................aaaaa...9.9aa999........",
                "map0-26": "....aaa...............B.............9.9.9...aaaaaaaa........",
                "map0-27": "...........aaaaaa..aaaaaa....................9.aaaaa........",
                "map0-28": ".A........aaaaaaa..aaaaaa............D......aaaaaaaa........",
                "map0-29": "bbbbbbbbbbbbbbbbb..bbbbbb.bbbbbbbbbbbbbbbbbbbbbbbbbb5bbbbbb.",
                "map1-0": "............................................................",
                "map1-1": "............................................................",
                "map1-2": "............................................................",
                "map1-3": "............................................................",
                "map1-4": "............................................................",
                "map1-5": "............................................................",
                "map1-6": "............................................................",
                "map1-7": "............................................................",
                "map1-8": "............................................................",
                "map1-9": "............................................................",
                "map1-10": "............................................................",
                "map1-11": "............................................................",
                "map1-12": "............................................................",
                "map1-13": "............................................................",
                "map1-14": "............................................................",
                "map1-15": "............................................................",
                "map1-16": "............................................................",
                "map1-17": "............................................................",
                "map1-18": "............................................................",
                "map1-19": "............................................................",
                "map1-20": "............................................................",
                "map1-21": "............................................................",
                "map1-22": "...12....12.....12.....12....12....12.......................",
                "map1-23": "............................................................",
                "map1-24": "............................................................",
                "map1-25": "...................O........................................",
                "map1-26": ".................aaaa...................feef................",
                "map1-27": ".............aaaaaaaaaaa................e..e..............E.",
                "map1-28": "..........O..aaaaaaaaaaa.O.....O........feefeef..feeeefeeeef",
                "map1-29": "..bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.......e..e..e..e....e....e",
                "map2-0": "............................................................",
                "map2-1": "............................................................",
                "map2-2": "............................................................",
                "map2-3": "............................................................",
                "map2-4": "............................................................",
                "map2-5": "............................................................",
                "map2-6": "............................................................",
                "map2-7": "............................................................",
                "map2-8": "............................................................",
                "map2-9": "............................................................",
                "map2-10": "............................................................",
                "map2-11": "............................................................",
                "map2-12": "............................................................",
                "map2-13": "............................................................",
                "map2-14": "............................................................",
                "map2-15": "............................................................",
                "map2-16": "............................................................",
                "map2-17": "............................................................",
                "map2-18": "............................................................",
                "map2-19": "............................................................",
                "map2-20": "............................................................",
                "map2-21": "........................................................8...",
                "map2-22": "..................99........12.....12....12....12.......a...",
                "map2-23": "..................dd...................................aaa..",
                "map2-24": "..e.ef...................9.9.9.9......................aaaaa.",
                "map2-25": "..e..e.............................................F.aaaaaaa",
                "map2-26": "..e..e.......E..............................aaaaaaaaaaaaaaaa",
                "map2-27": "..e..e.feeefeeef..99...................F....aaaaaaaaaaaaaaaa",
                "map2-28": "..feef.e...e...e..dd...aaaaaaaaaaaaaaaaaaa..aaaaaaaaaaaaaaaa",
                "map2-29": "..e..e.e...e...e.......aaaaaaaaaaaaaaaaaaa..aaaaaaaaaaaaaaaa"
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
//Sceneが保持する動くオブジェクト
///<reference path="./eventemitter3.d.ts"/>
///<reference path="./interface.ts"/>
///<reference path="./image.ts"/>
///<reference path="./status.ts"/>
var masao;
(function (masao) {
    (function (objects) {
        //画像を表示するだけのオブジェクト（タイトル画面、背景等）
        var ImagePanel = (function (_super) {
            __extends(ImagePanel, _super);
            function ImagePanel(image, renderLayer, x, y) {
                _super.call(this);
                this.image = image;
                this.renderLayer = renderLayer;
                this.x = x;
                this.y = y;
                this.routineLayer = 0 /* NONE */;
                this.routine = new routine.doNothing(this);
                this.renderer = new renderer.Image(this, image);
            }
            return ImagePanel;
        })(EventEmitter);
        objects.ImagePanel = ImagePanel;

        //単色の板を表示（背景用）
        var ColorPanel = (function (_super) {
            __extends(ColorPanel, _super);
            function ColorPanel(color, renderLayer, x, y, width, height) {
                _super.call(this);
                this.color = color;
                this.renderLayer = renderLayer;
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                this.routineLayer = 0 /* NONE */;
                this.routine = new routine.doNothing(this);
                this.renderer = new renderer.Rect(this, color);
            }
            return ColorPanel;
        })(EventEmitter);
        objects.ColorPanel = ColorPanel;

        //マップ（地形情報を管理）
        var Map = (function (_super) {
            __extends(Map, _super);
            function Map(width, height, maptip_size) {
                _super.call(this);
                this.width = width;
                this.height = height;
                this.maptip_size = maptip_size;
                this.renderLayer = 0 /* BACKGROUND */;
                this.routineLayer = 0 /* NONE */;
                this.initMap();
                this.routine = new routine.doNothing(this);
                this.renderer = new renderer.Maptips(this, maptip_size);
            }
            Map.prototype.initMap = function () {
                //マップを空っぽで初期化する
                this.map = [];
                var arr;
                var width = this.width, height = this.height;
                for (var x = 0; x < width; x++) {
                    arr = [];
                    for (var y = 0; y < height; y++) {
                        arr[y] = 0;
                    }
                    this.map[x] = arr;
                }
            };
            Map.prototype.set = function (x, y, code) {
                this.map[x][y] = code;
            };
            return Map;
        })(EventEmitter);
        objects.Map = Map;

        //シーン進行管理
        (function (sceneManagement) {
            //タイトル画面
            var Title = (function (_super) {
                __extends(Title, _super);
                function Title() {
                    _super.call(this);
                    this.renderLayer = 0 /* BACKGROUND */;
                    this.routineLayer = 3 /* CLEANUP */;
                    this.renderer = new renderer.None();
                    this.routine = new TitleRoutine(this);
                }
                Title.prototype.nextScene = function () {
                    //次のシーンに移行したい場合
                    this.emit("next");
                };
                return Title;
            })(EventEmitter);
            sceneManagement.Title = Title;
            var TitleRoutine = (function () {
                function TitleRoutine(t) {
                    this.t = t;
                }
                TitleRoutine.prototype.main = function (state) {
                    var input = state.getInput();

                    //ジャンプキー押されたら次のシーンへ移行
                    if (input.isJumpTrigger()) {
                        this.t.nextScene();
                    }
                };
                return TitleRoutine;
            })();
            sceneManagement.TitleRoutine = TitleRoutine;
        })(objects.sceneManagement || (objects.sceneManagement = {}));
        var sceneManagement = objects.sceneManagement;

        (function (routine) {
            var doNothing = (function () {
                function doNothing(obj) {
                    this.obj = obj;
                }
                doNothing.prototype.main = function (state) {
                };
                return doNothing;
            })();
            routine.doNothing = doNothing;
        })(objects.routine || (objects.routine = {}));
        var routine = objects.routine;
        (function (renderer) {
            //描画しない
            var None = (function () {
                function None() {
                }
                None.prototype.render = function (grc) {
                };
                return None;
            })();
            renderer.None = None;

            //画像を描画するだけ
            var Image = (function () {
                function Image(obj, image) {
                    this.obj = obj;
                    this.image = image;
                }
                Image.prototype.render = function (grc) {
                    grc.renderImage(this.image, this.obj);
                };
                return Image;
            })();
            renderer.Image = Image;

            //長方形
            var Rect = (function () {
                function Rect(obj, color) {
                    this.obj = obj;
                    this.color = color;
                }
                Rect.prototype.render = function (grc) {
                    grc.renderRect(this.color, this.obj);
                };
                return Rect;
            })();
            renderer.Rect = Rect;

            //マップチップを描画
            var Maptips = (function () {
                function Maptips(obj, maptip_size) {
                    this.obj = obj;
                    this.maptip_size = maptip_size;
                }
                Maptips.prototype.render = function (grc) {
                    //マップを描画
                    var obj = this.obj, map = obj.map, scr = grc.scroll, mts = this.maptip_size;

                    //描画開始マップ座標
                    var sx = Math.max(0, Math.floor(scr.x / mts)), sy = Math.max(0, Math.floor(scr.y / mts));

                    //終了座標
                    var ex = Math.min(obj.width - 1, Math.floor((grc.screen_width - 1) / mts)), ey = Math.min(obj.height - 1, Math.floor((grc.screen_height - 1) / mts));
                    for (var x = sx; x <= ex; x++) {
                        for (var y = sy; y <= ey; y++) {
                            grc.renderPatternCell(map[x][y], {
                                x: x * mts,
                                y: y * mts
                            });
                        }
                    }
                };
                return Maptips;
            })();
            renderer.Maptips = Maptips;
        })(objects.renderer || (objects.renderer = {}));
        var renderer = objects.renderer;
    })(masao.objects || (masao.objects = {}));
    var objects = masao.objects;
})(masao || (masao = {}));
///<reference path="./object.ts"/>
///<reference path="./interface.ts"/>
var masao;
(function (masao) {
    (function (input) {
        //ユーザーの入力
        var Input = (function () {
            function Input() {
                this.keyinput = new KeyInput();
            }
            Input.prototype.getKeyInput = function () {
                return this.keyinput;
            };
            Input.prototype.start = function () {
                this.keyinput.start();
            };
            Input.prototype.end = function () {
                this.keyinput.end();
            };

            //入力状況
            Input.prototype.isJumpTrigger = function () {
                //スペースまたはZ
                return this.keyinput.isTriggered(32) || this.keyinput.isTriggered(90);
            };
            return Input;
        })();
        input.Input = Input;
        var KeyInput = (function (_super) {
            __extends(KeyInput, _super);
            function KeyInput() {
                _super.call(this);
                this.renderLayer = 0 /* BACKGROUND */;
                this.routineLayer = 1 /* STARTUP */;
                this.routine = new KeyInputRoutine(this);
                this.renderer = new masao.objects.renderer.None();
            }
            //キー入力の
            KeyInput.prototype.start = function () {
                this.routine.start();
            };
            KeyInput.prototype.end = function () {
                this.routine.end();
            };

            //状態取得
            KeyInput.prototype.isPushed = function (keycode) {
                return this.routine.isPushed(keycode);
            };
            KeyInput.prototype.isTriggered = function (keycode) {
                return this.routine.isTriggered(keycode);
            };
            return KeyInput;
        })(EventEmitter);
        input.KeyInput = KeyInput;
        var KeyInputRoutine = (function () {
            function KeyInputRoutine(keyinput) {
                this.keyinput = keyinput;
                this.keyMap = {};

                //フレームをカウント（トリガー判定）
                this.framecount = 1;
                this.working = false;
            }
            KeyInputRoutine.prototype.start = function () {
                var _this = this;
                if (this.working === true) {
                    this.end();
                }
                this.keydownhandler = function (e) {
                    _this.keyMap[e.keyCode] = _this.framecount;
                };
                this.keyuphandler = function (e) {
                    _this.keyMap[e.keyCode] = 0;
                };
                document.addEventListener("keydown", this.keydownhandler, false);
                document.addEventListener("keyup", this.keyuphandler, false);
                this.working = true;
            };
            KeyInputRoutine.prototype.end = function () {
                document.addEventListener("keydown", this.keydownhandler, false);
                document.addEventListener("keyup", this.keyuphandler, false);
                this.working = false;
            };
            KeyInputRoutine.prototype.main = function () {
                //毎フレームごとの
                this.framecount++;
            };
            KeyInputRoutine.prototype.isPushed = function (keycode) {
                return this.keyMap[keycode] !== 0;
            };
            KeyInputRoutine.prototype.isTriggered = function (keycode) {
                return this.keyMap[keycode] === this.framecount;
            };
            return KeyInputRoutine;
        })();
        input.KeyInputRoutine = KeyInputRoutine;
    })(masao.input || (masao.input = {}));
    var input = masao.input;
})(masao || (masao = {}));
///<reference path="./input.ts"/>
var masao;
(function (masao) {
    //ゲームの状態を保持するってなにそれ
    var GameState = (function () {
        function GameState() {
        }
        GameState.prototype.setInput = function (i) {
            this.input = i;
        };
        GameState.prototype.getInput = function () {
            return this.input;
        };
        return GameState;
    })();
    masao.GameState = GameState;
})(masao || (masao = {}));
///<reference path="./image.ts"/>
///<reference path="./status.ts"/>
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
                _this.onImageLoad();
                _this.emit("load");
            }, false);
        }
        ImageObject.prototype.getImage = function () {
            return this.el;
        };
        ImageObject.prototype.onImageLoad = function () {
            this.width = this.el.naturalWidth;
            this.height = this.el.naturalHeight;
        };

        //ctxに描画
        ImageObject.prototype.renderOn = function (ctx, screenPosition) {
            ctx.drawImage(this.el, screenPosition.x, screenPosition.y);
        };
        return ImageObject;
    })(EventEmitter);
    masao.ImageObject = ImageObject;

    //マップチップ的パターン画像オブジェクト
    var CellImageObject = (function () {
        function CellImageObject(path, size) {
            var _this = this;
            this.xnumber = 1;
            this.image = new ImageObject(path);
            this.size = size;
            this.image.on("load", function () {
                _this.xnumber = Math.floor(_this.image.width / _this.size);
            });
        }
        CellImageObject.prototype.renderOn = function (ctx, tipnumber, screenPosition) {
            var size = this.size, xnumber = this.xnumber;
            var cx = tipnumber % xnumber, cy = (tipnumber - cx) / xnumber;
            console.log(this.image.getImage());
            ctx.drawImage(this.image.getImage(), cx * size, cy * size, size, size, screenPosition.x, screenPosition.y, size, size);
        };
        return CellImageObject;
    })();
    masao.CellImageObject = CellImageObject;

    //描画に必要な情報と描画
    var GameRenderingContext = (function () {
        function GameRenderingContext(screen_width, screen_height) {
            this.screen_width = screen_width;
            this.screen_height = screen_height;
        }
        GameRenderingContext.prototype.init = function (context, pattern) {
            this.context = context;
            this.pattern = pattern;
        };
        GameRenderingContext.prototype.setScroll = function (scroll) {
            this.scroll = scroll;
        };

        //単色の長方形を描画
        GameRenderingContext.prototype.renderRect = function (color, box) {
            var p = this.screenPosition(box);
            var context = this.context;
            context.fillStyle = this.colorString(color);
            context.fillRect(p.x, p.y, box.width, box.height);
        };

        //画像を描画する
        GameRenderingContext.prototype.renderImage = function (img, position) {
            var p = this.screenPosition(position);
            img.renderOn(this.context, p);
        };

        //パターン画像から描画
        GameRenderingContext.prototype.renderPatternCell = function (tipnumber, position) {
            var p = this.screenPosition(position);
            this.pattern.renderOn(this.context, tipnumber, p);
        };

        //座標計算
        GameRenderingContext.prototype.screenPosition = function (position) {
            return {
                x: position.x - this.scroll.x,
                y: position.y - this.scroll.y
            };
        };

        //色文字列生成
        GameRenderingContext.prototype.colorString = function (color) {
            return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
        };
        return GameRenderingContext;
    })();
    masao.GameRenderingContext = GameRenderingContext;
})(masao || (masao = {}));
//レンダラ（canvasへの描画を担当）
///<reference path="./eventemitter3.d.ts"/>
///<reference path="./factory.ts"/>
///<reference path="./interface.ts"/>
///<reference path="./image.ts"/>
var masao;
(function (masao) {
    var Renderer = (function () {
        function Renderer(ff) {
            this.factoryfactory = ff;
            this.view = new View(this);
        }
        //初期化
        Renderer.prototype.init = function () {
            var rf = this.factoryfactory.resourceFactory();
            var cf = this.factoryfactory.canvasFactory();
            var gf = this.factoryfactory.gameRenderingContextFactory();
            this.canvas = cf.canvas();
            this.context = this.canvas.getContext("2d");
            this.grc = gf.grc();
            this.grc.init(this.context, rf.pattern());
            this.grc.setScroll({ x: 0, y: 0 });
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
            this.view.render(this.grc);
        };
        return Renderer;
    })();
    masao.Renderer = Renderer;

    //描画対象オブジェクトをまとめておく
    var View = (function () {
        function View(renderer) {
            this.renderer = renderer;
            this.init();
        }
        View.prototype.init = function () {
            this.layers = [];
            for (var i = 0 /* minBound */; i <= 4 /* maxBound */; i++) {
                this.layers[i] = [];
            }
        };
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
        View.prototype.render = function (grc) {
            //奥のレイヤーから順番に
            var arr;
            for (var i = 0 /* minBound */; i <= 4 /* maxBound */; i++) {
                arr = this.layers[i];
                for (var j = 0, l = arr.length; j < l; j++) {
                    arr[j].render(grc);
                }
            }
        };
        return View;
    })();
    masao.View = View;
})(masao || (masao = {}));
///<reference path="./object.ts"/>
var masao;
(function (masao) {
    //Mapを文字列から構築する
    var MapBuilder = (function () {
        function MapBuilder(width, height, maptip_size) {
            this.width = width;
            this.height = height;
            this.maptip_size = maptip_size;
            //width,height: ステージのサイズ
        }
        MapBuilder.prototype.load = function (data) {
            var width = this.width, height = this.height;
            var x, y, code;
            this.data = data;

            //マップを作成
            this.map = new masao.objects.Map(width, height, this.maptip_size);
            for (x = 0; x < width; x++) {
                for (y = 0; y < height; y++) {
                    code = data[y].charCodeAt(x);
                    if (97 <= code && code <= 106) {
                        //a-j
                        //ブロック番号:20〜29である
                        this.map.set(x, y, code - 77);
                    }
                }
            }
        };
        MapBuilder.prototype.getMap = function () {
            return this.map;
        };
        return MapBuilder;
    })();
    masao.MapBuilder = MapBuilder;
})(masao || (masao = {}));
///<reference path="./config.ts"/>
///<reference path="./image.ts"/>
///<reference path="./gameloop.ts"/>
///<reference path="./renderer.ts"/>
///<reference path="./map.ts"/>
///<reference path="./object.ts"/>
//Factory関連
var masao;
(function (masao) {
    (function (factory) {
        var FactoryFactory = (function () {
            function FactoryFactory(config) {
                this.config = config;
            }
            FactoryFactory.prototype.resourceFactory = function () {
                return new ResourceFactory(new configInterface.Resourse(this.config));
            };
            FactoryFactory.prototype.gameloopManagerFactory = function () {
                return new GameloopManagerFactory(new configInterface.Gameloop(this.config));
            };
            FactoryFactory.prototype.canvasFactory = function () {
                return new CanvasFactory(new configInterface.Canvas(this.config));
            };
            FactoryFactory.prototype.gameRenderingContextFactory = function () {
                return new GameRenderingContextFactory(new configInterface.Canvas(this.config));
            };
            FactoryFactory.prototype.mapBuilderFactory = function () {
                return new MapBuilderFactory(new configInterface.Map(this.config));
            };
            FactoryFactory.prototype.backgroundFactory = function () {
                return new BackgroundFactory(new configInterface.Background(this.config));
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
            ResourceFactory.prototype.pattern = function () {
                return new masao.CellImageObject(this.re.pattern, this.re.maptip_size);
            };
            return ResourceFactory;
        })();
        factory.ResourceFactory = ResourceFactory;

        //canvasを生成しよう
        var CanvasFactory = (function () {
            function CanvasFactory(cn) {
                this.cn = cn;
            }
            CanvasFactory.prototype.canvas = function () {
                var result = document.createElement("canvas");
                result.width = this.cn.screen_width;
                result.height = this.cn.screen_height;
                return result;
            };
            return CanvasFactory;
        })();
        factory.CanvasFactory = CanvasFactory;

        //GameRenderingContextを生成
        var GameRenderingContextFactory = (function () {
            function GameRenderingContextFactory(cn) {
                this.cn = cn;
            }
            GameRenderingContextFactory.prototype.grc = function () {
                return new masao.GameRenderingContext(this.cn.screen_width, this.cn.screen_height);
            };
            return GameRenderingContextFactory;
        })();
        factory.GameRenderingContextFactory = GameRenderingContextFactory;

        //MapBuilder
        var MapBuilderFactory = (function () {
            function MapBuilderFactory(mp) {
                this.mp = mp;
            }
            MapBuilderFactory.prototype.mapBuilder = function (stage) {
                var result = new masao.MapBuilder(this.mp.stage_width, this.mp.stage_height, this.mp.maptip_size);
                result.load(this.mp.getData(stage));
                return result;
            };
            return MapBuilderFactory;
        })();
        factory.MapBuilderFactory = MapBuilderFactory;

        //背景を表示するためのオブジェクト
        var BackgroundFactory = (function () {
            function BackgroundFactory(bg) {
                this.bg = bg;
            }
            BackgroundFactory.prototype.background = function (stage) {
                //単色の背景
                var bgcolor = this.bg.getBackgroundColor(stage);

                //オブジェクト作る
                return new masao.objects.ColorPanel(bgcolor, 0 /* BACKGROUND */, 0, 0, this.bg.screen_width, this.bg.screen_height);
            };
            return BackgroundFactory;
        })();
        factory.BackgroundFactory = BackgroundFactory;

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
                    this.pattern = config.get("filename_pattern");
                    this.maptip_size = Number(config.get("maptip_size"));
                }
                return Resourse;
            })();
            configInterface.Resourse = Resourse;

            //ゲーム画面canvasの情報を表す
            var Canvas = (function () {
                function Canvas(config) {
                    this.screen_width = Number(config.get("screen_width"));
                    this.screen_height = Number(config.get("screen_height"));
                }
                return Canvas;
            })();
            configInterface.Canvas = Canvas;

            //Map関連
            var Map = (function () {
                function Map(config) {
                    this.config = config;
                    this.stage_width = Number(config.get("stage_width"));
                    this.stage_height = Number(config.get("stage_height"));
                    this.maptip_size = Number(config.get("maptip_size"));
                }
                Map.prototype.getData = function (stage) {
                    var config = this.config;
                    if (stage < 1 || 4 < stage) {
                        //そんなデータは持っていない
                        return [];
                    }
                    var data_suffix = stage === 1 ? "" : stage === 2 ? "-s" : stage === 3 ? "-t" : "-f";

                    var result = [];
                    for (var i = 0; i < this.stage_height; i++) {
                        result[i] = config.get("map0-" + i + data_suffix) + config.get("map1-" + i + data_suffix) + config.get("map2-" + i + data_suffix);
                    }
                    return result;
                };
                return Map;
            })();
            configInterface.Map = Map;

            //Background関連
            var Background = (function () {
                function Background(config) {
                    this.config = config;
                    this.screen_width = Number(config.get("screen_width"));
                    this.screen_height = Number(config.get("screen_height"));
                }
                Background.prototype.getBackgroundColor = function (stage) {
                    var config = this.config;
                    if (!(1 <= stage && stage <= 4)) {
                        //データがない
                        return {
                            r: 0,
                            g: 0,
                            b: 0
                        };
                    }
                    var suffix = stage === 1 ? "" : stage === 2 ? "_s" : stage === 3 ? "_t" : "_f";
                    return {
                        r: Number(config.get("backcolor_red" + suffix)),
                        g: Number(config.get("backcolor_green" + suffix)),
                        b: Number(config.get("backcolor_blue" + suffix))
                    };
                };
                return Background;
            })();
            configInterface.Background = Background;
        })(factory.configInterface || (factory.configInterface = {}));
        var configInterface = factory.configInterface;
    })(masao.factory || (masao.factory = {}));
    var factory = masao.factory;
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

        //protectedがいいな…
        Scene.prototype.end = function () {
            this.emit("end");
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
                var _this = this;
                //タイトル画像を表示
                var factory = this.factoryfactory.resourceFactory();
                var image = new masao.objects.ImagePanel(factory.title(), 0 /* BACKGROUND */, 0, 0);
                this.manager.add(image);

                //シーン進行を担当するやつ
                var t = new masao.objects.sceneManagement.Title();
                this.manager.add(t);
                t.on("next", function () {
                    //次のシーンへ
                    _this.end();
                });
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
            StageScene.prototype.setStage = function (stage) {
                this.stage = stage;
            };
            StageScene.prototype.start = function () {
                //ステージ開始
                //まず背景
                var bgf = this.factoryfactory.backgroundFactory();
                var bg = bgf.background(this.stage);
                this.manager.add(bg);

                //マップ生成
                var mbf = this.factoryfactory.mapBuilderFactory();
                var mb = mbf.mapBuilder(this.stage);
                var map = mb.getMap();
                console.log(map);
                this.manager.add(map);
            };
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
                var stage = new masao.scenes.StageScene(_this.factoryfactory, _this.manager);
                stage.setStage(1);
                _this.setScene(stage);
                _this.startScene();
                _this.onEndScene(function () {
                });
            });
        };

        //sceneをセットする
        GameManager.prototype.setScene = function (scene) {
            //ゲームオブジェクトを処お聞かする
            this.manager.init();
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
///<reference path="./gamemanager.ts"/>
///<reference path="./status.ts"/>
///<reference path="./renderer.ts"/>
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
        //初期化する
        GameObjectManager.prototype.init = function () {
            this.view.init();
            this.processor.init();
        };
        GameObjectManager.prototype.add = function (obj) {
            //Rendererに追加
            this.view.add(obj.renderLayer, obj.renderer);
            this.processor.add(obj.routineLayer, obj.routine);
            obj.once("destroy", this.remove.bind(this, obj));
        };
        GameObjectManager.prototype.remove = function (obj) {
            //オブジェクトはdestoryされたら除去する
            this.view.remove(obj.renderLayer, obj.renderer);
            this.processor.remove(obj.routineLayer, obj.routine);
        };
        return GameObjectManager;
    })();
    masao.GameObjectManager = GameObjectManager;

    //各オブジェクトの処理を担当
    var RoutineProcessor = (function () {
        function RoutineProcessor(state) {
            this.state = state;
            this.init();
        }
        RoutineProcessor.prototype.init = function () {
            //初期化
            this.layers = [];
            for (var i = 0 /* minBound */; i <= 3 /* maxBound */; i++) {
                this.layers[i] = [];
            }
        };
        RoutineProcessor.prototype.add = function (layer, obj) {
            this.layers[layer].push(obj);
        };
        RoutineProcessor.prototype.remove = function (layer, obj) {
            var os = this.layers[layer];
            for (var i = 0, l = os.length; i < l; i++) {
                if (os[i] === obj) {
                    os.splice(i, 1);
                    break;
                }
            }
        };
        RoutineProcessor.prototype.process = function () {
            //removeで番号がずれてもいいように
            var os;
            for (var i = 0 /* minBound */; i <= 3 /* maxBound */; i++) {
                os = this.layers[i].concat([]);
                for (var j = 0, l = os.length; j < l; j++) {
                    os[j].main(this.state);
                }
            }
        };
        return RoutineProcessor;
    })();
    masao.RoutineProcessor = RoutineProcessor;
})(masao || (masao = {}));
//canvas正男メインファイル
///<reference path="./gameloop.ts"/>
///<reference path="./gamemanager.ts"/>
///<reference path="./renderer.ts"/>
///<reference path="./factory.ts"/>
///<reference path="./status.ts"/>
///<reference path="./input.ts"/>
var masao;
(function (masao) {
    var Game = (function () {
        function Game(config) {
            this.factoryfactory = new masao.factory.FactoryFactory(config);
            this.state = new masao.GameState();
            this.manager = new masao.GameManager(this.factoryfactory);
            this.processor = new masao.RoutineProcessor(this.state);
            this.renderer = new masao.Renderer(this.factoryfactory);
            this.omanager = new masao.GameObjectManager(this.renderer.getView(), this.processor);
            this.loopmanager = this.factoryfactory.gameloopManagerFactory().loop(this.processor, this.renderer);
        }
        //初期化する
        Game.prototype.init = function () {
            //入力の管理
            var ip = new masao.input.Input();
            ip.start();
            this.state.setInput(ip);
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

(function(__win){
    var __POSTFIX = '.js';
    var __doc = __win.document;
    var __objectPrototype = Object.prototype.toString;
    var __instances = {};
    var __fileQueue = [];
    var __defineQueue = [];
    var __requireQueue = [];
    var __baseUrl;
    var __currentInstanceId;

    function __isObject(obj){
        return __objectPrototype.call(obj) == '[object Object]';
    };
    function __isString(obj){
        return __objectPrototype.call(obj) == '[object String]';
    };
    function __isArray(obj){
        return __objectPrototype.call(obj) == '[object Array]';
    };
    function __isFunction(obj){
        return __objectPrototype.call(obj) == '[object Function]';
    };
    function __each(arr, func){
        var len = arr.length;
        for(var i = 0;i < len;i++) func(arr[i]);
    };
    function __eachReverse(arr, func){
        for(var i = arr.length - 1;i >= 0;i--) func(arr[i]);
    };
    function __createScriptNode(){
        return __doc.createElement('SCRIPT');
    };
    function __getInstanceId(key){
        var script = __createScriptNode();

        script.src = key + __POSTFIX;

        return script.src;
    };
    function __getInstances(deps){
        var result = [];

        __each(deps, function(key){
            result.push(__instances[__getInstanceId(key)]);
        });

        return result;
    };
    function __execDefines(){
        __eachReverse(__defineQueue, function(def){
            var callback = def.callback,
                deps = def.dependencies,
                id = def.id;

            __instances[id] = callback.apply(__win, __getInstances(deps));
        });
    };
    function __execRequires(){
        __each(__requireQueue, function(req){
            var callback = req.callback,
                deps = req.dependencies;
                
            callback.apply(__win, __getInstances(deps));
        });
    };
    function __loadFiles(){
        // TODO: not process __fileQueue is []
        if(__fileQueue.length > 0){
            var script = __createScriptNode();

            script.src = __fileQueue.shift() + __POSTFIX;
            script.onload = function(){
                if(__fileQueue.length > 0){
                    // onload is execute after append script tag to body tag.
                    // define of dependencies is execute after append script tag to body tag, so new file added to __fileQueue.
                    __loadFiles();
                }else{
                    __execDefines();
                    __execRequires();
                    return;
                }
            };
            __doc.getElementsByTagName('HEAD')[0].appendChild(script);

            __currentInstanceId = script.src;
        }
    };
    function define(id, deps, callback){
        var alias;
        if(__isString(id)){
            alias = id;
            id = __currentInstanceId;
        }

        if(__isArray(id)){
            callback = deps;
            deps = id;
            id = __currentInstanceId;
        }

        if(__isArray(deps)) __fileQueue = __fileQueue.concat(deps);

        if(__isFunction(callback)) __defineQueue.push({
            callback: callback,
            dependencies: deps,
            id: id,
            alias: alias
        });
    };
    function require(deps, callback){
        if(__isArray(deps)) __fileQueue = __fileQueue.concat(deps);

        if(__isFunction(callback)) __requireQueue.push({
            callback: callback,
            dependencies: deps
        });

        __loadFiles();
    };
    function config(cfg){
        if(cfg){
            if(cfg.baseUrl) __baseUrl = cfg.baseUrl;
            if(cfg.paths) {
                var paths = cfg.paths;

                if(__isObject(paths)){
                    // TODO: merge to __each
                    for(var path in paths) __fileQueue.push(paths[path]);
                }
            }
        }
    };

    define.amd = {};
    require.amd = {};

    require.config = config;

    __win.define = define;
    __win.require = require;
    
    /*
    // TODO: not dependent case
    define({
        add: function(x, y){
            return x + y;
        }
    });
    // TODO: dependencies path validation
    */
})(window);

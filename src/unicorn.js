(function(__win){
    var __POSTFIX = '.js';
    var __doc = __win.document;
    var __objectPrototype = Object.prototype.toString;
    var __currentAbsolutePathOfDefine;
    var __instanceMap = {};
    var __aliasMap = {};
    var __fileQueue = [];
    var __defineQueue = [];
    var __requireQueue = [];

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
    function __getInstances(deps){
        var result = [];

        __each(deps, function(id){
            result.push(__instanceMap[id]);
        });

        return result;
    };
    function __execDefines(){
        __eachReverse(__defineQueue, function(def){
            var callback = def.callback,
                deps = def.dependencies,
                id = def.id;

            __instanceMap[id] = callback.apply(__win, __getInstances(deps));
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
            __currentAbsolutePathOfDefine = __fileQueue.shift();

            var script = __createScriptNode();

            script.src = __currentAbsolutePathOfDefine;
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
        }
    };
    function __getAbsolutePath(path){
        var script = __createScriptNode();

        script.src = path + __POSTFIX;

        return script.src;
    };
    function define(id, deps, callback){
        var absolutePathsOfDeps = [];

        if(__isString(id) && __isArray(deps) && __isFunction(callback)){
            __aliasMap[id] = __currentAbsolutePathOfDefine;
            id = __currentAbsolutePathOfDefine;
        }

        if(__isArray(id) && __isFunction(deps)){
            callback = deps;
            deps = id;
            id = __currentAbsolutePathOfDefine;
        }

        if(__isArray(deps)) {
            __each(deps, function(path){
                absolutePathsOfDeps.push(__getAbsolutePath(path));
            });

            __fileQueue = __fileQueue.concat(absolutePathsOfDeps);
        }

        if(__isFunction(callback)) __defineQueue.push({
            callback: callback,
            dependencies: absolutePathsOfDeps,
            id: id
        });
    };
    function require(deps, callback){
        var absolutePathsOfDeps = [];

        if(__isArray(deps)) {
            __each(deps, function(path){
                absolutePathsOfDeps.push(__getAbsolutePath(path));
            });

            __fileQueue = __fileQueue.concat(absolutePathsOfDeps);
        }

        if(__isFunction(callback)) __requireQueue.push({
            callback: callback,
            dependencies: absolutePathsOfDeps
        });

        __loadFiles();
    };

    define.amd = {};
    require.amd = {};

    __win.define = define;
    __win.require = require;
})(window);

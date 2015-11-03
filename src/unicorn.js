(function(__WIN){
    var __DOC = __WIN.document;
    var __ObjectPrototype = Object.prototype.toString;
    var __instances = {};
    var __fileQueue = [];
    var __defineQueue = [];
    var __requireQueue = [];
    var __currentInstanceId;

    function __isArray(obj){
        return __ObjectPrototype.call(obj) == '[object Array]';
    };
    function __isFunction(obj){
        return __ObjectPrototype.call(obj) == '[object Function]';
    };
    function __each(arr, func){
        var len = arr.length;
        for(var i = 0;i < len;i++) func(arr[i]);
    };
    function __eachReverse(arr, func){
        for(var i = arr.length - 1;i >= 0;i--) func(arr[i]);
    };
    function __createScriptNode(){
        return __DOC.createElement('SCRIPT');
    };
    function __getInstanceId(key){
        var script = __createScriptNode();

        script.src = key + '.js';

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

            __instances[id] = callback.apply(__WIN, __getInstances(deps));
        });
    };
    function __execRequires(){
        __each(__requireQueue, function(req){
            var callback = req.callback,
                deps = req.dependencies;
                
            callback.apply(__WIN, __getInstances(deps));
        });
    };
    function __loadFiles(){
        if(__fileQueue.length > 0){
            var script = __createScriptNode();

            script.src = __fileQueue.shift() + '.js';
            script.onload = function(){
                if(__fileQueue.length > 0){
                    __loadFiles();
                }else{
                    __execDefines();
                    __execRequires();
                    return;
                }
            };
            __DOC.getElementsByTagName('HEAD')[0].appendChild(script);

            __currentInstanceId = script.src;
        }
    };
    function define(id, deps, callback){
        if(__isArray(id)){
            callback = deps;
            deps = id;
            id = __currentInstanceId;
        }

        if(__isArray(deps)) __fileQueue = __fileQueue.concat(deps);

        if(__isFunction(callback)) __defineQueue.push({
            callback: callback,
            dependencies: deps,
            id: id
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

    __WIN.define = define;
    __WIN.require = require;
})(window);

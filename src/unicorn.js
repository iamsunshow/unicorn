(function(__WIN){
    var __DOC = __WIN.document;
    var __ObjectPrototype = Object.prototype.toString;
    var __fileQueue = [];
    var __execQueue = [];

    function __isArray(obj){
        return __ObjectPrototype.call(obj) == '[object Array]';
    };
    function __isFunction(obj){
        return __ObjectPrototype.call(obj) == '[object Function]';
    };
    function __loadFiles(){
        if(__fileQueue.length > 0){
            var script = __DOC.createElement('SCRIPT');

            script.src = __fileQueue.shift() + '.js';
            script.onload = function(){
                if(__fileQueue.length > 0){
                    __loadFiles();
                }else{
                    return;
                }
            };
            __DOC.getElementsByTagName('HEAD')[0].appendChild(script);
        }
    };
    function define(id, dependencies, factory){
        if(__isArray(id)){
            factory = dependencies;
            dependencies = id;
            id = null;
        }

        if(__isArray(dependencies)) __fileQueue = __fileQueue.concat(dependencies);

        if(__isFunction(factory)) __execQueue.push(factory);
    };
    function require(dependencies, callback){
        if(__isArray(dependencies)) __fileQueue = __fileQueue.concat(dependencies);

        if(__isFunction(callback)) __execQueue.push(callback);

        __loadFiles();
    };

    __WIN.define = define;
    __WIN.require = require;
})(window);

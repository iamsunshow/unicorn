(function(__WIN){
    var __DOC = __WIN.document;
    var __instances = {};
    var __lastLoadFile;

    function __getInstances(keys){
        var result = [];

        for(var i = 0;i < keys.length;i++){
            result.push(__instances[keys[i]]);
        }

        return result;
    };
    function __copyFilePaths(source, target){
        for(var i = 0;i < source.length;i++) target[i] = source[i];
    };
    function __loadFiles(queue, keys, callback){
        if(queue.length == 0){
            callback.apply(__WIN, []);
        }
        if(queue.length > 0){
            var script = __DOC.createElement('SCRIPT');

            script.src = queue.shift() + '.js';
            script.onload = function(){
                keys.push(script.src);

                if(queue.length > 0){
                    __loadFiles(queue, keys, callback);
                }else{
                    callback.apply(__WIN, __getInstances(keys));
                    return;
                }
            };
            __DOC.getElementsByTagName('HEAD')[0].appendChild(script);

            __lastLoadFile = script.src;
        }
    };
    function define(id, dependencies, factory){
        var oc = Object.prototype.toString;

        if(oc.call(id) == '[object Array]'){
            factory = dependencies;
            dependencies = id;
            id = __lastLoadFile;
        }

        var queue = [],
            keys = []; 

        __copyFilePaths(dependencies, queue);

        __loadFiles(queue, keys, function(){
            __instances[id] = factory.apply(__WIN, arguments);
        });
    };
    function require(dependencies, factory){
        var queue = [],
            keys = []; 

        __copyFilePaths(dependencies, queue);

        __loadFiles(queue, keys, factory);
    };

    window.define = define;
    window.require = require;
})(window);

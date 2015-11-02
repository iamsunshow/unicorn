(function(__WIN){
    var __DOC = __WIN.document;

    function __copyFilePaths(source, target){
        for(var i = 0;i < source.length;i++) target[i] = source[i];
    };
    function __loadFiles(queue, callback){
        if(queue.length > 0){
            var script = __DOC.createElement('SCRIPT');

            script.src = queue.shift() + '.js';
            script.onload = function(){
                __loadFiles(queue);
            };

            __DOC.getElementsByTagName('HEAD')[0].appendChild(script);
        }
        return;
    };
    function define(id, dependencies, factory){
        var oc = Object.prototype.toString;

        if(oc.call(id) == '[object Array]'){
            dependencies = id;
            id = 'anonymous';
        }

        var queue = []; 

        __copyFilePaths(dependencies, queue);

        __loadFiles(queue, factory);
    };
    function require(dependencies, factory){
        var queue = []; 

        __copyFilePaths(dependencies, queue);

        __loadFiles(queue, factory);
    };

    window.define = define;
    window.require = require;
})(window);

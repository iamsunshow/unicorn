(function(window){
    var UNINSTANCE_QUEUE  = [],
        INSTANCE_MAP = {};

    var OBJ2STR = Object.prototype.toString;

    function isFunction(obj){
        return OBJ2STR.call(obj) == '[object Function]' ? true : false;
    };

    function isObject(obj){
        return OBJ2STR.call(obj) == '[object Objeect]' ? true : false;

    };

    // TODO: id's name
    function getUniqueId(){
        return '?';
    };

    function getScriptPath(key){
        return key;
    };

    function processUninstanceQueue(){
        var uninstanceQueueCopy = UNINSTANCE_QUEUE.slice();

        while(uninstanceQueueCopy.length > 0){
            var o = uninstanceQueueCopy.shift(),
                dependencyInstances = getInstanceByDependencies(o.dependencies);

            if(dependencyInstances){
                if(isFunction(o.factory)){
                    INSTANCE_MAP[o.key] = o.factory.apply(this, dependencyInstances);
                }else if(isObject(o.factory)){
                    INSTANCE_MAP[o.key] = o.factory;
                }
            }
        }
    };

    function getInstanceByKey(key){
        return key in INSTANCE_MAP ? INSTANCE_MAP[key] : null;
    };

    function getInstanceByDependencies(dependencies){
        if(dependencies.length == 0){
            return [];
        }

        var dependencyInstances = [];
        for(var i = 0;i < denpendecies.length;i++){
            var instance = getInstanceByKey(denpendecies[i]);

            if(instance){
                dependencyInstances.push(instance);
            }
        }

        return dependencyInstances.length == dependencies.length ? dependencyInstances : null;
    };

    function define(id, dependencies, factory){
        if(arguments.length == 2){
            factory = dependencies;
            dependencies = id;
            id = getScriptName();
        }
        if(arguments.length == 1){
            factory = id;
            dependencies = [];
            id = getScriptName();
        }

        // push self to uninstance_queue
        UNINSTANCE_QUEUE.push({
            key: id,
            dependencies: dependencies.slice(),
            factory: factory
        });

        while(dependencies.length > 0){
            var instanceKey = dependencies.shift(),
                script = document.createElement("SCRIPT");
            script.src = getScriptPath(instanceKey);
            script.onload = function(){
                processUninstanceQueue();
            }
            document.getElementsByTagName("HEAD")[0].appendChild(script);
        }
    };

    define.amd = {};

    window.define = define;
})(window);

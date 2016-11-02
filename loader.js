(function(window){
    var OBJ2STR = Object.prototype.toString;

    function isFunction(obj){
        return OBJ2STR.call(obj) == '[object Function]' ? true : false;
    };

    // TODO: id's name
    function getScriptName(){
        return '?';
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
        
        if(isFunction(factory)) factory.call(this);
    };

    define.amd = {};

    window.define = define;
})(window);

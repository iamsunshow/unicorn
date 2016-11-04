define('a',['b','c'],function(b,c){
    console.log('demo1');
    return {
        init:function(){
            console.log('demo2');
        }
    };
});
/*define(['b','c'],function(b,c){
    console.log('demo2');
});
define({
    a:1,
    b:2,
    c:3
});*/

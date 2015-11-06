define(['test5', 'test4'],function(test5, test4){
    var s1 = new Date();
    for(var i = 0;i<3000000000;i++);
    var s2 = new Date();
    console.log((s2 - s1) / 1000);

    return {
        init: function(){
            test5.init();
            test4.init();
            console.log('test1');
        }
    };
});

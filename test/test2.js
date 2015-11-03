define(['test5', 'test6'],function(test5, test6){
    return {
        init: function(){
            test5.init();
            test6.init();
            alert('test2');
        }
    };
});


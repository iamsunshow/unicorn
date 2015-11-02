define(['test3', 'test4'],function(test2, test3){
    return {
        init: function(){
            test3.init();
            test4.init();
            alert('test1');
        }
    };
});

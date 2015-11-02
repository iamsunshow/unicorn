define(['test3', 'test4'],function(test3, test4){
    return {
        init: function(){
            test3.init();
            test4.init();
            alert('test1');
        }
    };
});

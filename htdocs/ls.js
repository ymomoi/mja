(function($){
    var key = function(k){ return 'mja_' + k; };

    $.extend({
        lsset: function(k, v){
            window.localStorage.setItem(key(k), JSON.stringify(v));
            return k;
        },
        lsget: function(k){
            var s = window.localStorage.getItem(key(k));
            return JSON.parse(s);
        },
        lsrm: function(k){
            window.localStorage.removeItem(key(k));
        },
    });
})(jQuery);

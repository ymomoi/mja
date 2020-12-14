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
            return window.localStorage.removeItem(key(k));
        },
        lshaskey: function(k){
            return window.localStorage.hasOwnProperty(key(k));
        },
    });
})(jQuery);

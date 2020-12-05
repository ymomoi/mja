(function($){
    $.extend({
		clock: function clock(target){
			var n = new Date();
//			var y = n.getFullYear();
			var m = n.getMonth()+1;
			var d = n.getDate();
			var hh = n.getHours();
			var mm = n.getMinutes();
			var ss = n.getSeconds();
			hh = hh < 10 ? "0"+hh : hh;
			mm = mm < 10 ? "0"+mm : mm;
			ss = ss < 10 ? "0"+ss : ss;
			var time_str = m + '月' + d + '日' +
							hh + ':' + mm + ':' + ss;
			target.text(time_str);
			setTimeout(function(){ clock(target); }, 1000);
		}
	});
})(jQuery);

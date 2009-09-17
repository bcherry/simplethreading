var startAnimation = function() {
	var root = $("#basic-animation .output");
	var div = $("<div/>").css({
		"width":"220px",
		"height":"50px",
		"margin":"5px auto",
		"position":"relative"
	});
	var target = $("<div/>").css({
		"width":"50px",
		"height":"50px",
		"background-color":"#666666",
		"position":"absolute",
		"left":"0",
		"top":"0",
		"cursor":"pointer"
	}).click(function(){
		if (thread.isRunning()) {
			thread.stop();
		} else {
			thread.start();
		}
	});
	div.append(target);
	root.append(div);
	var delta = 2;
	var fn = function() {
		var left = target.position().left;
		if (left > 170 || left < 0) {
			delta = -delta;
		}
		target.css("left", left + delta);
	};
	var thread = new SimpleThread(fn);
};
$("#basic-animation .start").click(startAnimation);

(function() {
	var thread;
	var root = $("#element-manipulation .output");
	var start = function() {
		if (thread && thread.isRunning()) {
			return false;
		}
		var i = 0;
		var buildFn = function() {
			root.append($("<div/>").attr("id","r" + i).addClass("result").text(i));
			i++;
			if (i >= 100) {
				i = 0;
				thread.setWorkFn(colorFn);
			}
		};
		var colorFn = function() {
			$("#r" + i, root).addClass("dark");
			i++;
			if (i >= 100) {
				i = 0;
				thread.setWorkFn(deleteFn);
			}
		};
		var deleteFn = function() {
			$("#r" + i, root).remove();
			i++;
			if (i >= 100) {
				return false;
			}
		};
		thread = new SimpleThread(buildFn);
	};
	$("#element-manipulation .start").click(start);
})();

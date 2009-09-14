var itemCount = 100;
var batchSize = 5;
var singlelimit = 1000;
var qs = window.location.search.split('?');
if (qs.length > 1) {
	qs = qs[1].split('&');
	for (var i = 0; i < qs.length; i++) {
		var x = qs[i].split('=');
		if (x.length > 1 && x[0] == 'n') {
			itemCount = parseInt(x[1]);
		}
		if (x.length > 1 && x[0] == 's') {
			batchSize = parseInt(x[1]);
		}
	}
}

var functions = [
	function(n, context) {
		$(context).append($("<div/>").addClass("result").attr("id","r"+n).text(n));
	},function(n, context) {
		$("#r" + n + ".result", context).addClass("dark");
	},function(n, context){
		$("#r" + n + ".result", context).remove();
	}];

/** singlethreaded approach **/
var singleStage = 0;
var SingleGenerator = function(n) {
	var i = 0;
	this.next = function() {
		if (i > n || i > singlelimit) {
			return null;
		}
		return i++;
	};
};

var startsingle = function() {
	var context = $("#singlethreaded .output");
	var gen = new SingleGenerator(itemCount);
	var n;
	var workFn = functions[singleStage];
	singleStage++;
	singleStage = singleStage % functions.length;
	while ((n = gen.next()) !== null) {
		workFn(n,context);
	}
};

/** simplethreaded approach **/
var simpleStage = 0;
var SimpleGenerator = function(n) {
	var i = 0;
	this.next = function() {
		if (i > n) {
			return null;
		}
		return i++;
	};
};

var startsimple = function() {
	var context = $("#simplethreaded .output");
	var gen = new SimpleGenerator(itemCount);
	var workFn = functions[simpleStage];
	simpleStage++;
	simpleStage = simpleStage % functions.length;
	var fn = function() {
		var n = gen.next()
		if (n !== null) {
			workFn(n,context);
		} else {
			return false;
		}
		thread.setInterval(thread.getInterval() + 100);
		return true;
	};
	var thread = new SimpleThread(fn,{
		workArgs:[gen,context],
		batchSize:batchSize});
};


$(function(){
	$("#singlethreaded .start").bind('click', startsingle);
	$("#simplethreaded .start").bind('click', startsimple);
});


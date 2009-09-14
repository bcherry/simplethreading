var ST = {};

ST.n = 100;
ST.s = 5;
ST.singlelimit = 1000;
var qs = window.location.search.split('?');
if (qs.length > 1) {
	qs = qs[1].split('&');
	for (var i = 0; i < qs.length; i++) {
		var s = qs[i].split('=');
		if (s.length > 1 && s[0] == 'n') {
			ST.n = parseInt(s[1]);
		}
		if (s.length > 1 && s[0] == 's') {
			ST.s = parseInt(s[1]);
		}
	}
}

ST.functions = [
	function(n, context) {
		$(context).append($("<div/>").addClass("result").attr("id","r"+n).text(n));
	},function(n, context) {
		$("#r" + n + ".result", context).addClass("dark");
	},function(n, context){
		$("#r" + n + ".result", context).remove();
	}];

/** singlethreaded approach **/
ST.singleStage = 0;
ST.SingleGenerator = function(n) {
	var i = 0;
	this.next = function() {
		if (i > n || i > ST.singlelimit) {
			return null;
		}
		return i++;
	};
};

ST.startsingle = function() {
	var context = $("#singlethreaded .output");
	var gen = new ST.SingleGenerator(ST.n);
	var n;
	var workFn = ST.functions[ST.singleStage];
	ST.singleStage++;
	ST.singleStage = ST.singleStage % ST.functions.length;
	while ((n = gen.next()) !== null) {
		workFn(n,context);
	}
};

/** simplethreaded approach **/
ST.simpleStage = 0;
ST.SimpleGenerator = function(n) {
	var i = 0;
	this.next = function() {
		if (i > n) {
			return null;
		}
		return i++;
	};
};

ST.startsimple = function() {
	var context = $("#simplethreaded .output");
	var gen = new ST.SimpleGenerator(ST.n);
	var n;
	var workFn = ST.functions[ST.simpleStage];
	ST.simpleStage++;
	ST.simpleStage = ST.simpleStage % ST.functions.length;
	var fn = function() {
		var i = 0;
		while (i++ < ST.s && (n = gen.next()) !== null) {
			workFn(n,context);
		}
		if (n !== null) {
			ST.simpleThreadID = setTimeout(fn,ST.s/10 || 1);
		}
	};
	fn();
};


$(function(){
	$("#singlethreaded .start").bind('click', ST.startsingle);
	$("#simplethreaded .start").bind('click', ST.startsimple);
});

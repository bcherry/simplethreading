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

ST.SingleGenerator = function(n) {
	var i = 0;
	this.next = function() {
		if (i > n || i > ST.singlelimit) {
			return null;
		}
		return i++;
	};
};

ST.SimpleGenerator = function(n) {
	var i = 0;
	this.next = function() {
		if (i > n) {
			return null;
		}
		return i++;
	};
};

/** singlethreaded approach **/
ST.startsingle = function() {
	$("#singlethreaded .output").empty();
	ST.singlegen = new ST.SingleGenerator(ST.n);
	while ((ST.singleD = ST.singlegen.next()) !== null) {
		$("#singlethreaded .output").append($("<div class='result'/>").text(ST.singleD));
	}
};

/** simplethreaded approach **/
ST.startsimple = function() {
	$("#simplethreaded .output").empty();
	ST.simplegen = new ST.SimpleGenerator(ST.n);
	clearTimeout(ST.simpleThreadID);
	var fn = function() {
		var i = 0;
		while (i++ < ST.s && (ST.simpleD = ST.simplegen.next()) !== null) {
			$("#simplethreaded .output").append($("<div class='result'/>").text(ST.simpleD));
		}
		if (ST.simpleD !== null) {
			ST.simpleThreadID = setTimeout(fn,ST.s/10);
		}
	};
	fn();
};


$(function(){
	$("#singlethreaded .start").bind('click', ST.startsingle);
	$("#simplethreaded .start").bind('click', ST.startsimple);
});

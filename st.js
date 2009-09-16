var itemCount = 100;
var batchSize = 100;
var qs = window.location.search.split('?');
if (qs.length > 1) {
	qs = qs[1].split('&');
	for (var i = 0; i < qs.length; i++) {
		var x = qs[i].split('=');
		if (x.length > 1 && x[0] == 'n') {
			itemCount = parseInt(x[1], 10);
		}
		if (x.length > 1 && x[0] == 's') {
			batchSize = parseInt(x[1], 10);
		}
	}
}

var jQFunctions = [
	function(n, context) {
		$(context).append($("<div/>").addClass("result").attr("id","jqr"+n).text(n));
	},function(n, context) {
		$("#jqr" + n + ".result", context).addClass("dark");
	},function(n, context){
		$("#jqr" + n + ".result", context).remove();
	}];
var jQStage = 0;
var JQGenerator = function(n) {
	var i = 0;
	this.next = function() {
		if (i > n) {
			return null;
		}
		return i++;
	};
};
var startjQuery = function() {
	var context = $("#jquery-selectors .output");
	var gen = new JQGenerator(itemCount);
	var workFn = jQFunctions[jQStage];
	jQStage++;
	jQStage = jQStage % jQFunctions.length;
	var fn = function() {
		var n = gen.next()
		if (n !== null) {
			workFn(n,context);
		} else {
			return false;
		}
		return true;
	};
	var thread = new SimpleThread(fn,{
		workArgs:[gen,context],
		batchSize:batchSize});
};

var domFunctions = [
	function build(gen,root) {
		var i = 0;
		var outerDiv = document.createElement("div");
		for (var n = gen.next(); n !== null && i < batchSize; n = gen.next()) {
			var div = document.createElement("div");
			div.appendChild(document.createTextNode(n));
			div.className = 'result';
			div.class = 'result';
			div.id = 'domr' + n;
			outerDiv.appendChild(div);
			i++;
		}
		root.appendChild(outerDiv);
		if (n === null) {
			return false;
		}
		return true;
	},function(gen, root) {
		var i = 0;
		for (var n = gen.next(); n !== null && i < batchSize; n = gen.next()) {
			$('#domr' + n).addClass("dark");
			//document.getElementById('domr' + n).className = 'result dark';
			i++;
		}
		if (n === null) {
			return false;
		}
		return true;
	},function(gen, root){
		var i = 0;
		for (var n = gen.next(); n !== null && i < batchSize; n = gen.next()) {
			var div = document.getElementById('domr' + n);
			div.parentNode.removeChild(div);
			i++;
		}
		if (n === null) {
			return false;
		}
		return true;
	}];
var domStage = 0;
var DomGenerator = function(n) {
	var i = 0;
	this.next = function() {
		if (i > n) {
			return null;
		}
		return i++;
	};
};
var startDom = function() {
	var root = $("#pure-dom .output").get(0);
	var gen = new DomGenerator(itemCount);
	var workFn = domFunctions[domStage];
	domStage++;
	domStage = domStage % domFunctions.length;
	var thread = new SimpleThread(workFn,{
		workArgs:[gen,root],
		batchSize:1});
};

$(function(){
	$("#jquery-selectors .start").bind('click', startjQuery);
	$("#pure-dom .start").bind('click', startDom);
});


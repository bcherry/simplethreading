var domFunctions = [
	function build(gen,root) {
		var n = 0;
		var outerDiv = document.createElement("div");
		for (var i = 0; n !== null && i < 1000; i++) {
			n = gen.next();
			if (n !== null) {
				var div = document.createElement("div");
				div.appendChild(document.createTextNode(n));
				div.className = 'result';
				div.class = 'result';
				div.id = 'r' + n;
				outerDiv.appendChild(div);
			}
		}
		root.appendChild(outerDiv);
		if (n === null) {
			return false;
		}
		return true;
	},function(gen, root) {
		var n = 0;
		for (var i = 0; i < 1000; i++) {
			n = gen.next();
			if (n === null) {
				return false;
			}
			$('#r' + n).addClass("dark");
		}
		return true;
	},function(gen, root){
		var n = 0;
		for (var i = 0; i < 1000; i++) {
			n = gen.next();
			if (n === null) {
				return false;
			}
			$('#r' + n).removeClass('dark');
		}
		return true;
	},function(gen, root){
		$(root).empty();
		return false;
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
	var root = $("#large-dom .output").get(0);
	var gen = new DomGenerator(30000);
	var workFn = domFunctions[domStage];
	domStage++;
	domStage = domStage % domFunctions.length;
	var thread = new SimpleThread(workFn,{
		workArgs:[gen,root],
		batchSize:1});
};

$(function(){
	$("#large-dom .start").bind('click', startDom);
});



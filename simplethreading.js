(function(){
	this.SimpleThread = function(workFn,params) {
		var that = this;
		var autoStart = (params && params.autoStart !== null) || true;
		var batchSize = (params && params.batchSize) || 1;
		var interval = (params && params.interval) || 1;
		var workArgs = (params && params.workArgs) || [];
		var _log = (params && params.log !== null) || true;
		var workFn = workFn;
		var threadID = null;
		var _callee = arguments.callee;

		var log = function(msg) {
			if (_log) {
				console.log("SimpleThread #" + threadID + ": " + msg);
			}
		}

		// Control functions
		this.start = function() {
			this.stop();
			var go = function() { threadID = setTimeout(fn,interval); };
			var fn = function() {
				var keepGoing = true;
				for (var i = 0; i < batchSize; i++) {
					if (!workFn.apply(_callee,workArgs)) {
						that.stop();
						keepGoing = false;
						break;
					}
				}
				if (keepGoing) {
					go();
				}
			};
			go();
			log("started");
		};
		this.stop = function() {
			if (this.isRunning()) {
				log("stopped");
				clearTimeout(threadID);
				threadID = null;
			}
		};
		this.isRunning = function() {
			return threadID !== null;
		}

		// Getters/Setters
		this.getBatchSize	= function()	{ return batchSize; };
		this.setBatchSize	= function(n)	{ batchSize = n; };
		this.getInterval	= function()	{ return interval; if (that.isRunning()) { that.stop; that.start();} };
		this.setInterval	= function(n)	{ interval = n; };
		this.getWorkFn		= function() 	{ return workFn; };
		this.setWorkFn		= function(fn)	{ workFn = fn; };
		this.getWorkArgs	= function()	{ return workArgs; };
		this.setWorkArgs	= function(args){ workArgs = args; };
		this.getThreadID	= function()	{ return threadID; };

		if (autoStart) {
			this.start();
		}
	};
})();


var SimpleThread = function(workFn,params) {
	var that = this;
	var autoStart = (params && params.autoStart !== null) || true;
	var batchSize = (params && params.batchSize) || 5;
	var interval = (params && params.interval) || 1;
	var workArgs = (params && params.workArgs) || [];
	var workFn = workFn;
	var threadID = null;

	var log = function(msg) {
		console.log("SimpleThread #" + threadID + ": " + msg);
	}

	// Control functions
	this.start = function() {
		this.stop();
		var fn = function() {
			for (var i = 0; i < batchSize; i++) {
				if (!workFn.apply(window,workArgs)) {
					that.stop();
					break;
				}
			}
		};
		threadID = setInterval(fn,interval);
		log("started");
		return threadID;
	};
	this.stop = function() {
		if (this.isRunning()) {
			log("stopped");
			clearInterval(threadID);
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


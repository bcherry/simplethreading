var SimpleThread = function(workFn,params) {
	var that = this;
	var batchSize = (params && params.batchSize) || 5;
	var interval = (params && params.interval) || 1;
	var workArgs = (params && params.workArgs) || [];
	var workFn = workFn;
	var threadID = null;

	// Control functions
	this.start = function() {
		this.stop();
		var fn = function() {
			if (!workFn.apply(window,workArgs)) {
				that.stop();
			}
		};
		threadID = setInterval(fn,interval);
		return threadID;
	};
	this.stop = function() {
		clearInterval(threadID);
		threadID = null;
	};
	this.isRunning = function() {
		return threadID !== null;
	}

	// Getters/Setters
	this.getBatchSize	= function()	{ return batchSize; };
	this.setBatchSize	= function(n)	{ batchSize = n; };
	this.getInterval	= function()	{ return interval; };
	this.setInterval	= function(n)	{ interval = n; };
	this.getWorkFn		= function() 	{ return workFn; };
	this.setWorkFn		= function(fn)	{ workFn = fn; };
	this.getWorkArgs	= function()	{ return workArgs; };
	this.setWorkArgs	= function(args){ workArgs = args; };
	this.getThreadID	= function()	{ return threadID; };
};


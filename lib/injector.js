"use strict";

const { getInstance } = require("./util");

module.exports = function(app, opts) {
	app.injectContent("mcp", getInstance(opts));
};

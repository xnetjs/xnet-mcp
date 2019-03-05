"use strict";

const Mcp = require("./mcp");

module.exports = {
	getInstance: opts => {
		return new Mcp(opts);
	}
};

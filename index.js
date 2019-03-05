const injector = require("./lib/injector");

module.exports = {
	name: "sso",
	install: function(app, opts) {
		injector(app, opts);
	}
};

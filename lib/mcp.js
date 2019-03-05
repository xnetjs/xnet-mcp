"use strict";

const debug = require("debug")("xnet-mcp");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
const { md5 } = require("xnet-util");


class Mcp {
	constructor(opts) {
		const { appId, secretKey, endpoint, ravenConf, version = "1.0" } = opts;
		this.appId = appId;
		this.secretKey = secretKey;
		this.endpoint = endpoint;
		this.version = version;

    this.logger = null;
    
    // 有传sentry配置，则启用请求错误上报
    if (ravenConf) {
      const raven = require('raven');
      this.raven = new raven.Client(ravenConf.dsn);
    }
	}

	async post(path, data, headers = null) {
		const url = this.buildUrl(path);
		const params = { ...this.getBaseParameter(), ...data };
		const sig = this.buildSignature(params);

    const searchParams = new URLSearchParams({ ...params, sig });
    debug('send request: ' + url + ' params: ' + searchParams.toString());
		return await fetch(url, {
			method: "POST",
			body: searchParams
		})
			.then(res => res.json())
			.catch(error => error)
			.then(res => {
        if (this.raven) {
          if (res instanceof Error) {
            this.raven.captureException(res)
          } else if (res.code > 0) {
            this.raven.captureMessage(JSON.stringify({url: url, params: searchParams.toString(), result: JSON.stringify(res)}))
          }
        }
        debug(JSON.stringify(res))
        return res;
			});
	}

	async get(path, headers = null) {}

	buildUrl(path) {
		return this.endpoint + path;
	}

	buildSignature(parameters) {
		const keys = Object.keys(parameters).sort();
		let arr = [];
		for (let key of keys) {
			arr.push(`${key}=${parameters[key]}`);
		}
		return md5(arr.join("") + this.secretKey);
	}

	getBaseParameter() {
		return {
			appId: this.appId,
			v: this.version,
			callId: new Date().getTime(),
			deviceId: (process.env.NODE_ENV || "development") + "-xl-shortvideo-admin"
		};
	}

	setLogger(logger) {
		this.logger = logger;
	}
}

module.exports = Mcp;

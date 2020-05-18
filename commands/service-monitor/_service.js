"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const http = require("http");
class ServiceMonitor {
    static CheckService([host, port], { timeout } = {}) {
        return new Promise((resolve, reject) => {
            let socket = new net_1.Socket();
            socket.setTimeout(timeout || 2500);
            socket.on('connect', () => {
                socket.destroy();
                resolve({ host: host, port: port, online: true });
            });
            socket.on('error', (err) => {
                reject(err);
            });
            socket.on('timeout', () => {
                resolve({ host: host, port: port, online: false });
            });
            socket.connect(port, host);
        });
    }
    static MonitorService([host, port], callbackfn, { timeout, interval } = {}) {
        let serviceLknownState;
        let serviceLChangeTime;
        return setInterval(() => {
            ServiceMonitor.CheckService([host, port], { timeout: timeout })
                .then(res => {
                let changed = false;
                let ms_sinceChange = 0;
                if (serviceLknownState === undefined) {
                    serviceLknownState = res.online;
                    serviceLChangeTime = new Date();
                }
                else if (serviceLknownState !== res.online) {
                    changed = true;
                    serviceLknownState = res.online;
                }
                const newstatetime = new Date();
                ms_sinceChange = newstatetime.getTime() - serviceLChangeTime.getTime();
                if (changed)
                    serviceLChangeTime = newstatetime;
                callbackfn(undefined, { host: res.host, port: res.port, online: res.online, changed: changed, ms_sinceChange });
            })
                .catch(e => {
                callbackfn(e, undefined);
            });
        }, interval || 30000);
    }
    static downloadCheck(url, callbackfn) {
        const regex = /(?:(?:http|https|ftp):\/\/)(?:([^\/]*))(.*)/g;
        const matches = Array.from(url.matchAll(regex))[0];
        const host = matches[1].toString();
        const path = matches[2].toString();
        const options = { hostname: host, port: 80, path, method: 'HEAD' };
        let req = http.request(options, (res) => {
            callbackfn(null, { statuscode: res.statusCode, headers: res.headers });
        }).on('error', (err) => { callbackfn(err, null); });
        req.end();
    }
    static downloadMonitor(url, callbackfn, options) {
        return setInterval(() => {
            this.downloadCheck(url, callbackfn);
        }, options.interval_ms || 30000);
    }
    static isUrl(s) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return regexp.test(s);
    }
}
exports.ServiceMonitor = ServiceMonitor;

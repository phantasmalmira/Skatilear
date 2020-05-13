"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
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
        return setInterval(() => {
            ServiceMonitor.CheckService([host, port], { timeout: timeout })
                .then(res => {
                let changed = false;
                if (serviceLknownState === undefined)
                    serviceLknownState = res.online;
                else if (serviceLknownState !== res.online) {
                    changed = true;
                    serviceLknownState = res.online;
                }
                callbackfn(undefined, { host: res.host, port: res.port, online: res.online, changed: changed });
            })
                .catch(e => {
                callbackfn(e, undefined);
            });
        }, interval || 30000);
    }
}
exports.ServiceMonitor = ServiceMonitor;

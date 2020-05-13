import {Socket} from 'net';

interface ServiceMonitor {
    CheckService([host, port]: [string, number], {timeout}?: {timeout?: number}):Promise<{
        host: string;
        port: number;
        online: boolean;
    }>;
    MonitorService([host, port]: [string, number], callbackfn: (err: Error, res: {
        host: string;
        port: number;
        online: boolean;
        changed: boolean;
    }) => void, { timeout, interval }?: {
        timeout?: number;
        interval?: number;
    }): NodeJS.Timer;
}


class ServiceMonitor {
    static CheckService([host, port]: [string, number], {timeout}: {timeout?: number} = {}) {
        return new Promise<{host: string, port: number, online: boolean}>((resolve, reject) => {
            let socket = new Socket();
            socket.setTimeout(timeout || 2500);
            socket.on('connect', () => {
                socket.destroy();
                resolve({host: host, port: port, online: true});
            });
            socket.on('error', (err) => {
                reject(err);
            });
            socket.on('timeout', () => {
                resolve({host: host, port: port, online: false});
            });
            socket.connect(port, host);
        });
    }
    static MonitorService([host, port]: [string, number], 
        callbackfn: (err: Error, res: {host: string, port: number, online: boolean, changed: boolean}) => void,
        {timeout, interval}: {timeout?: number, interval?: number} = {}): NodeJS.Timer
    {
        let serviceLknownState: boolean;
        return setInterval( () => {
            ServiceMonitor.CheckService(
                [host, port],
                {timeout: timeout}
            )
            .then(res => {
                let changed = false;
                if(serviceLknownState === undefined)
                    serviceLknownState = res.online;
                else if(serviceLknownState !== res.online) {
                    changed = true;
                    serviceLknownState = res.online;
                }
                callbackfn(undefined, {host: res.host, port: res.port, online: res.online, changed: changed});
            })
            .catch(e => {
                callbackfn(e, undefined);
            });
        } , interval || 30000);
    }
}

export {ServiceMonitor};
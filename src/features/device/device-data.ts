export interface MemoryUsage {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
}

export interface UserInfo {
    username: string;
    uid: number;
    gid: number;
    shell: any;
    homedir: string;
}
export interface NetworkInterfaceInfo {
    address: string;
    netmask: string;
    family: string;
    mac: string;
    internal: boolean;
}
export interface CpuUsage {
    user: number;
    system: number;
}
export class DeviceData {
    timestamp: number;
    hostname: string;
    loadavg: number[];
    uptime: number;
    freemem: number;
    totalmem: number;
    release: string;
    networkInterfaces: { [index: string]: NetworkInterfaceInfo[] };
    userInfo: UserInfo;
    memoryUsage: MemoryUsage;
    cpuUsage: CpuUsage;
    pid: number;
}

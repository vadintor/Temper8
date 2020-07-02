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
export interface WiFi {
    iface?: string; // network interface used for the connection, not available on macOS
    ssid: string;
    bssid: string;
    mac: string; // equals to bssid (for retrocompatibility)
    channel: number;
    frequency: number; // in MHz
    signal_level: number; // in dB
    quality: number; // same as signal level but in %
    security: string; //
    security_flags: string; // encryption protocols (format currently depending of the OS)
    mode: string; // network mode like Infra (format currently depending of the OS)
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

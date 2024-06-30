interface Window {
    electron: {
        send: (ev: string, args: any) => void,
        receive: (ev: string, listener: (args:any) => void) => void,
        invoke: (ev: string, args: any) => any
    }
}
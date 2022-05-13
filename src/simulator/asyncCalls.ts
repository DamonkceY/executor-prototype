

// these calls will be in other services (not in this file)
export const firstCall = (): Promise<boolean> => {
    return Executor(false)
}
export const secondCall = (): Promise<boolean> => {
    return Executor(true)
}
export const thirdCall = (): Promise<boolean> => {
    return Executor(true)
}
// The end of simulating calls

// :)
let isRefreshing: boolean = false;

// Queue for the api call's config (in this example it is a boolean)
interface QueueItem {
    data: boolean,
    resolve: (value: any) => void,
    reject: (value: any) => void,
}
const Queue: Array<QueueItem> = []

// the api call singleton function
export function Executor(isSimulateRefresh: boolean):Promise<any> {
    return new Promise((resolve, reject) => {
        if(isRefreshing) {
            // Assuming that 'isSimulateRefresh' is the config of our api call
            Queue.push({
                data: isSimulateRefresh,
                resolve,
                reject,
            })
        }else {
            if(!isSimulateRefresh) {
                // simulating api call with 200 res
                setTimeout(() => {
                    console.log('%c Ok !', 'color: green')
                    resolve(true)
                }, 1000)
            }else {
                // simulating api call with 403 res
                setTimeout(() => {
                    if(!isRefreshing) {
                        console.log('%c Refreshing !', 'color: red')
                        Queue.push({
                            data: isSimulateRefresh,
                            resolve,
                            reject,
                        })
                        isRefreshing = true
                        refreshToken().then(() => {
                            console.log('%c Token refreshed !', 'color: yellow')
                            isRefreshing = false;
                            Queue.forEach((item, index) => {
                                retryApiCall(item, index)
                            })
                            Queue.length = 0;
                            console.log(Queue)
                        }).catch((err) => {
                            isRefreshing = false;
                            Queue.length = 0;
                        })
                    }else {
                        Queue.push({
                            data: isSimulateRefresh,
                            resolve,
                            reject,
                        })
                    }
                }, 1000)
            }
        }
    });
}

// refresh token separate api call
const refreshToken = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, 2000)
    })
}

const retryApiCall = (item: QueueItem, index: number) => {
    console.log(`%c index '${index}' of Queue is being retried !`, 'color: yellow')
    Executor(false).then((res) => item.resolve(res)).catch((err) => item.reject(err))
}

/*
* Made with LOVE by Med Chouiref A.K.A JS-God
* */

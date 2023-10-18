export enum BrowserChannel {
    STABLE = 'Stable',
    BETA = 'Beta',
    DEV = 'Dev',
    CANARY = 'Canary'
}

export function GetBrowserChannelFromValue(value: string): BrowserChannel {
    const uppercasedValue = value.toUpperCase()

    if (!isValidChannel(uppercasedValue))
        throw Error('The given channel is not a valid one')

    return BrowserChannel[uppercasedValue]
}

function isValidChannel(value: string): value is keyof typeof BrowserChannel {
    return value in BrowserChannel;
}

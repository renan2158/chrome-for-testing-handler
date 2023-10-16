import axios from 'axios'
import { BrowserChannel } from '../enums/BrowserChannel'

interface LatestChromeVersions {
    timestamp: string,
    channels: object
}

interface LatestChromeVersionChannels {
    Stable: BrowserChannelInfo,
    Beta: BrowserChannelInfo,
    Dev: BrowserChannelInfo,
    Canary: BrowserChannelInfo
}

interface BrowserChannelInfo {
    channel: string,
    version: string,
    revision: string
}

async function GetChromeLatestVersion(channel: BrowserChannel): Promise<string> {
    console.log('Getting Chrome for Testing latest version for channel ' + channel)

    const response = await axios.get('https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json')
    const responseData = response.data as LatestChromeVersions
    const latestChromeVersionChannels = responseData.channels as LatestChromeVersionChannels

    return latestChromeVersionChannels[channel].version
}

export default GetChromeLatestVersion

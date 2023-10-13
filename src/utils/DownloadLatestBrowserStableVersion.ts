import path from 'path'
import axios from 'axios'
import download from 'download'
import { rm, mkdir, unlink } from 'node:fs'

import GetBrowsersForTestingFolder from './GetBrowsersForTestingFolder'
import { Browser } from '../enums/Browser'
import GetChromeLatestVersion from './GetChromeLatestVersion'

async function DownloadLatestBrowserStableVersion(): Promise<void> {
    const browserName: string = Browser.CHROME
    const browsersForTestingFolder = GetBrowsersForTestingFolder()
    const latestBrowserVersion: number = await GetChromeLatestVersion()

    const latestBrowserFolder = path.resolve(browsersForTestingFolder, browserName, String(latestBrowserVersion))

    mkdir(latestBrowserFolder, (error) => {
        if (error)
            throw error
        }
    )

    const latestBrowserResponse = await axios.get('https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json')

    const latestBrowserResponseData = latestBrowserResponse.data
    const chromePlatformVersions: object[] = latestBrowserResponseData.channels.Stable.downloads.chrome
    const chromeDriverPlatformVersions: object[] = latestBrowserResponseData.channels.Stable.downloads.chromedriver

    const desiredChromePlatformVersion: any = chromePlatformVersions
        .filter((chromePlatform: any) => chromePlatform.platform == 'mac-x64')
        .at(0)

    const desiredChromeDriverPlatformVersion: any = chromeDriverPlatformVersions
        .filter((chromeDriverPlatform: any) => chromeDriverPlatform.platform == 'mac-x64')
        .at(0)

    ;(async () => {
        await download(desiredChromePlatformVersion.url, latestBrowserFolder)
    })()

    ;(async () => {
        await download(desiredChromeDriverPlatformVersion.url, latestBrowserFolder)
    })()
}

export default DownloadLatestBrowserStableVersion

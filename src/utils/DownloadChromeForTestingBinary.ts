import path from 'path'
import axios from 'axios'
import { platform } from 'node:process'

import { BrowserChannel } from '../enums/BrowserChannel'
import CreateFolderIfNecessary from './CreateFolderIfNecessary'
import MoveFile from './MoveFile'
import RemoveDirectory from './RemoveDirectory'
import DownloadFile from './DownloadFile'
import UnpackFile from './UnpackFile'

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
    revision: string,
    downloads: BrowserChannelDownloadOptions
}

interface BrowserChannelDownloadOptions {
    chrome: BrowserChannelDownloadOption[]
    chromedriver: BrowserChannelDownloadOption[]
}

interface BrowserChannelDownloadOption {
    platform: string,
    url: string
}

async function DownloadChromeForTestingBinary(targetDirectory: string, channel: BrowserChannel): Promise<void> {
    console.log('Downloading Chrome for Testing binary for channel ' + channel)

    const response = await axios.get('https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json')

    const latestChromeVersions: LatestChromeVersions = response.data as LatestChromeVersions
    const latestChromeVersionChannels: LatestChromeVersionChannels = latestChromeVersions.channels as LatestChromeVersionChannels
    const { downloads } = latestChromeVersionChannels[channel]
    const latestChromeDownloadLinks: BrowserChannelDownloadOption[] = downloads.chrome

    const desiredChromePlatformVersion: BrowserChannelDownloadOption | undefined = latestChromeDownloadLinks
        .filter((chromePlatform: any) => chromePlatform.platform == 'mac-x64').at(0)

    if (desiredChromePlatformVersion === undefined)
        throw Error("No binary found to the current OS platform")

    const latestBrowserTemporaryFolder: string = path.resolve(targetDirectory, 'tmp')
    CreateFolderIfNecessary(latestBrowserTemporaryFolder)

    const targetFilePath: string = path.resolve(latestBrowserTemporaryFolder, 'chrome-mac-x64.zip')
    await DownloadFile(desiredChromePlatformVersion.url, targetFilePath)
    await UnpackFile(targetFilePath, latestBrowserTemporaryFolder)

    MoveFile(path.resolve(latestBrowserTemporaryFolder, 'chrome-mac-x64', 'Google Chrome for Testing.app'),
        path.resolve(targetDirectory, 'Google Chrome for Testing.app'))

    RemoveDirectory(latestBrowserTemporaryFolder)
}

export default DownloadChromeForTestingBinary

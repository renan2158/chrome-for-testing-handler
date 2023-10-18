import path from 'path'
import axios from 'axios'
import { File } from 'decompress'

import { BrowserChannel } from '../enums/BrowserChannel'
import { CreateFolderIfNecessary } from './FolderHelper'
import MoveFile from './MoveFile'
import RemoveDirectory from './RemoveDirectory'
import DownloadFile from './DownloadFile'
import UnpackFile from './UnpackFile'
import { GetCurrentPlatformInfo } from './OSPlatformHelper'
import { DoesStringIncludesAllOfTheFollowing } from './StringHelper'

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
    console.log('Downloading Chrome for Testing binary from channel ' + channel)

    const response = await axios.get('https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions-with-downloads.json')

    const latestChromeVersions: LatestChromeVersions = response.data as LatestChromeVersions
    const latestChromeVersionChannels: LatestChromeVersionChannels = latestChromeVersions.channels as LatestChromeVersionChannels
    const { downloads } = latestChromeVersionChannels[channel]
    const latestChromeDownloadLinks: BrowserChannelDownloadOption[] = downloads.chrome
    const currentPlatformInfo: string[] = GetCurrentPlatformInfo()

    const [desiredChromePlatformVersion] = latestChromeDownloadLinks
        .filter(chromePlatform => DoesStringIncludesAllOfTheFollowing(chromePlatform.platform, currentPlatformInfo))

    if (desiredChromePlatformVersion === undefined)
        throw Error("No binary found to the current OS platform")

    const latestBrowserTemporaryFolder: string = path.resolve(targetDirectory, 'tmp')
    CreateFolderIfNecessary(latestBrowserTemporaryFolder)

    const targetFilePath: string = path.resolve(latestBrowserTemporaryFolder, 'chrome-binary.zip')
    await DownloadFile(desiredChromePlatformVersion.url, targetFilePath)

    const extractedFiles: File[] = await UnpackFile(targetFilePath, latestBrowserTemporaryFolder)
    const [chromeBinaryFile] = extractedFiles.filter(file => file.path.includes('Google Chrome for Testing.app'))

    MoveFile(path.resolve(latestBrowserTemporaryFolder, chromeBinaryFile.path),
        path.resolve(targetDirectory, 'Google Chrome for Testing.app'))

    RemoveDirectory(latestBrowserTemporaryFolder)
}

export default DownloadChromeForTestingBinary

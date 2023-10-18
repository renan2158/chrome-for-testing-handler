import path from 'path'
import {  existsSync } from 'node:fs'
import { Request, Response } from 'express'

import GetChromeLatestVersion from '../utils/GetChromeLatestVersion'
import GetChromeForTestingFolderPath from '../utils/GetChromeForTestingFolderPath'
import CreateFolderIfNecessary from '../utils/CreateFolderIfNecessary'
import DownloadChromeForTestingBinary from '../utils/DownloadChromeForTestingBinary'
import { BrowserChannel, GetBrowserChannelFromValue } from '../enums/BrowserChannel'
import DownloadChromeForTestingDriver from '../utils/DownloadChromeForTestingDriver'

interface BrowserStoreRequest {
    channel?: string
}

class ChromeBrowserController {
    async store(req: Request, res: Response) {
        let { channel } = req.body as BrowserStoreRequest
        let selectedChannel: BrowserChannel = channel !== undefined ? GetBrowserChannelFromValue(channel) : BrowserChannel.STABLE

        const chromeForTestingFolder: string = GetChromeForTestingFolderPath()
        const chromeBrowserFolder: string =  path.resolve(chromeForTestingFolder)
        const latestBrowserVersion: string = await GetChromeLatestVersion(selectedChannel)

        const latestChromeVersionFolderPath = path.resolve(chromeBrowserFolder, latestBrowserVersion)

        if (existsSync(latestChromeVersionFolderPath)) {
            return res.status(200).send(`The Google Chrome for Testing ${latestBrowserVersion} is already installed!`)
        }

        CreateFolderIfNecessary(latestChromeVersionFolderPath)
        await DownloadChromeForTestingBinary(latestChromeVersionFolderPath, selectedChannel)
        await DownloadChromeForTestingDriver(latestChromeVersionFolderPath, selectedChannel)

        return res.status(200).send(`Google Chrome for Testing ${latestBrowserVersion} was successfully installed!`)
    }
}

export default new ChromeBrowserController()

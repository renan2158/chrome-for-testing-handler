import mv from 'mv'
import path from 'path'
import axios from 'axios'
import download from 'download'
import decompress from 'decompress'
import { Request, Response } from 'express'
import { rm, mkdir, existsSync } from 'node:fs'

import { Browser } from "../enums/Browser"

import GetChromeLatestVersion from '../utils/GetChromeLatestVersion'
import GetBrowsersForTestingFolder from '../utils/GetBrowsersForTestingFolder'
import CreateBrowsersForTestingFolderIfNecessary from "../utils/CreateBrowsersForTestingFolderIfNecessary"

class ChromeBrowserController {
    async store(req: Request, res: Response) {
        const browserName: string = Browser.CHROME
        const browsersForTestingFolder = GetBrowsersForTestingFolder()
        const browserFolder =  path.resolve(browsersForTestingFolder, browserName)

        CreateBrowsersForTestingFolderIfNecessary()
        const latestBrowserVersion: number = await GetChromeLatestVersion()

        if (!existsSync(browserFolder)) {
            mkdir(browserFolder, (error) => {
                    if (error)
                        throw error
                }
            )
        }

        const latestBrowserFolder = path.resolve(browserFolder, String(latestBrowserVersion))

        if (existsSync(latestBrowserFolder)) {
            return res.status(200).send(`${browserName} ${latestBrowserVersion} is already installed!`)
        }

        mkdir(latestBrowserFolder, (error) => {
            if (error)
                throw error
            }
        )

        console.log('Getting browser and driver download links')
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

        const latestBrowserTemporaryFolder = path.resolve(latestBrowserFolder, 'tmp')

        if (!existsSync(latestBrowserTemporaryFolder)) {
            mkdir(latestBrowserTemporaryFolder, (error) => {
                    if (error)
                        throw error
                }
            )
        }

        console.log('Downloading browser')
        await download(desiredChromePlatformVersion.url, latestBrowserTemporaryFolder)

        console.log('Downloading driver')
        await download(desiredChromeDriverPlatformVersion.url, latestBrowserTemporaryFolder)

        const downloadedBrowserName = desiredChromePlatformVersion.url.split('/')
        const downloadedBrowserNameVersion = downloadedBrowserName[downloadedBrowserName.length - 1]

        console.log('Unpacking browser files')
        await decompress(path.resolve(latestBrowserTemporaryFolder, downloadedBrowserNameVersion), latestBrowserTemporaryFolder)

        const downloadedDriverName = desiredChromeDriverPlatformVersion.url.split('/')
        const downloadedDriverNameVersion = downloadedDriverName[downloadedDriverName.length - 1]

        console.log('Unpacking driver files')
        await decompress(path.resolve(latestBrowserTemporaryFolder, downloadedDriverNameVersion), latestBrowserTemporaryFolder)

        mv(path.resolve(latestBrowserTemporaryFolder, 'chrome-mac-x64', 'Google Chrome for Testing.app'), path.resolve(latestBrowserFolder, 'Google Chrome for Testing.app'), function(err) {
            if (err) {
               throw err
            }
        });

        mv(path.resolve(latestBrowserTemporaryFolder, 'chromedriver-mac-x64', 'chromedriver'), path.resolve(latestBrowserFolder, 'chromedriver'), function(err) {
            if (err) {
               throw err
            }
        });

        console.log('Removing browser unecessary files')
        rm(path.resolve(latestBrowserTemporaryFolder), { recursive: true }, err => {
            if (err) {
                throw err
            }
        })

        return res.status(200).send(`${browserName} ${latestBrowserVersion} successfully installed!`)
    }
}

export default new ChromeBrowserController()

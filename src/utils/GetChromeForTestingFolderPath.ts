import os from 'node:os'
import path from 'path'

import { CreateFolderIfNecessary } from './FolderHelper'

function GetChromeForTestingFolderPath(): string {
    const systemUserHomeFolder: string = os.homedir()
    const chromeForTestingFolder = path.resolve(systemUserHomeFolder, '.chrome-browser-for-testing')

    CreateFolderIfNecessary(chromeForTestingFolder)
    return chromeForTestingFolder
}

export default GetChromeForTestingFolderPath

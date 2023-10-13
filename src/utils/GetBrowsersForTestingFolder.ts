import os from 'node:os'
import path from 'path'

function GetBrowsersForTestingFolder(): string {
    const systemUserHomeFolder: string = os.homedir()
    return path.resolve(systemUserHomeFolder, '.browsers-for-testing')
}

export default GetBrowsersForTestingFolder

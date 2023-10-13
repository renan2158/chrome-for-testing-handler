import { existsSync, readdirSync } from 'node:fs'
import path from 'path'

import GetBrowsersForTestingFolder from './GetBrowsersForTestingFolder'

function GetBrowserCurrentVersion(browserName: string) {
    const browsersForTestingFolder = GetBrowsersForTestingFolder()
    const browserCurrentVersionFolder = path.resolve(browsersForTestingFolder, browserName)

    const asdf = readdir(browserCurrentVersionFolder, function(err, data) {
        if (data.length == 0) {
            console.log("Directory is empty!");
        } else {
            console.log("Directory is not empty!");
        }
    })

    if (!existsSync(browserCurrentVersionFolder) ) {
        return browserCurrentVersion
    }

    const browserCurrentVersion: string = readdirSync(browserCurrentVersionFolder, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .at(0)



    return parseInt(browserCurrentVersion)
}

export default GetBrowserCurrentVersion

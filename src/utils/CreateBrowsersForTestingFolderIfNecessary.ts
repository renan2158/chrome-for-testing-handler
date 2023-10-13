import { existsSync, mkdir } from 'node:fs'
import os from 'node:os'
import path from 'path'

function CreateBrowsersForTestingFolderIfNecessary() {
    const systemUserHomeFolder: string = os.homedir()
    const browsersForTestingFolder: string = path.resolve(systemUserHomeFolder, '.browsers-for-testing')

    if (!existsSync(browsersForTestingFolder)) {
        mkdir(browsersForTestingFolder, (error) => {
            if (error)
                throw error
            }
        )
    }
}

export default CreateBrowsersForTestingFolderIfNecessary

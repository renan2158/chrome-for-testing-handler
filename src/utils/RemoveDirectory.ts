import { rm } from 'node:fs'

function RemoveDirectory(targetFolder: string): void {
    rm(targetFolder, { recursive: true }, err => {
        if (err) {
            throw err
        }
    })
}

export default RemoveDirectory

import { existsSync, mkdir, readdirSync } from 'node:fs'

export function CreateFolderIfNecessary(folderPath: string): void {
    if (!existsSync(folderPath)) {
        mkdir(folderPath, (error) => {
            if (error)
                throw error
            }
        )
    }
}

export function IsFolderEmpty(directoryPath: string): boolean {
    return readdirSync(directoryPath).length === 0
}

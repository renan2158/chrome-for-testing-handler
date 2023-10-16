import { existsSync, mkdir } from 'node:fs'

function CreateFolderIfNecessary(folderPath: string): void {
    if (!existsSync(folderPath)) {
        mkdir(folderPath, (error) => {
            if (error)
                throw error
            }
        )
    }
}

export default CreateFolderIfNecessary

import decompress from 'decompress'
import { File } from 'decompress'

async function UnpackFile(targetFile: string, outputFolderPath: string): Promise<File[]> {
    return await decompress(targetFile, outputFolderPath)
}

export default UnpackFile

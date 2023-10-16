import decompress from 'decompress'

async function UnpackFile(targetFile: string, outputFolderPath: string): Promise<void> {
    await decompress(targetFile, outputFolderPath)
}

export default UnpackFile

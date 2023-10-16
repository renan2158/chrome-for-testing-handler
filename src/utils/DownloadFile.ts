import download from 'download'
import { writeFileSync } from 'node:fs'

async function DownloadFile(targetUrl: string, targetFilePath: string): Promise<void> {
    writeFileSync(targetFilePath, await download(targetUrl))
}

export default DownloadFile

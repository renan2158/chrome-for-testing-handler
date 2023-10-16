import mv from 'mv'

function MoveFile(sourceFilePath: string, targetFilePath: string): void {
    mv(sourceFilePath, targetFilePath, function(err) {
        if (err) {
            throw err
        }
    });
}

export default MoveFile

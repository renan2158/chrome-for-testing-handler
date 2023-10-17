import { platform as systemPlatform, arch as systemArchitecture } from 'node:process'

enum PlatformNames {
    LINUX = 'linux',
    DARWIN = 'mac',
    WIN32 = 'win'
}

enum ArchitectureNames {
    X32 = 'x32',
    X64 = 'x64',
    ARM64 = 'arm64'
}

export function GetCurrentPlatformInfo(): [string, string] {
    const systemPlatformName: string = GetCurrentPlatformName()
    const systemArchitectureName: string = GetCurrentArchitectureName();

    return [systemPlatformName, systemArchitectureName]
}

function GetCurrentPlatformName(): string {
    const platformName = GetEnumPropertyFromValue(PlatformNames, systemPlatform)

    if (!platformName)
        throw Error('Error while getting the platform name')

    return platformName
}

function GetCurrentArchitectureName(): string {
    const architectureName = GetEnumPropertyFromValue(ArchitectureNames, systemArchitecture)

    if (!architectureName)
        throw Error('Error while getting the architecture name')

    return architectureName
}

function GetEnumPropertyFromValue(sourceEnum: object, value: string) {
    let enumKeys = Object.keys(sourceEnum)
    let enumValues = Object.values(sourceEnum)

    for (let i = 0; i < enumKeys.length; i++) {
        if (enumKeys[i].toUpperCase() === value.toUpperCase())
            return enumValues[i]
    }

    return null
}

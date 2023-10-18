import { platform as systemPlatform, arch as systemArchitecture } from 'node:process'

enum PlatformName {
    LINUX = 'linux',
    DARWIN = 'mac',
    WIN32 = 'win'
}

enum ArchitectureName {
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
    const uppercasedPlatformName = systemPlatform.toUpperCase()

    if (!isPlatformNameValid(uppercasedPlatformName))
        throw Error('Error while getting the platform name')

    return PlatformName[uppercasedPlatformName]
}

function GetCurrentArchitectureName(): string {
    const uppercasedArchitectureName = systemArchitecture.toUpperCase()

    if (!isArchitectureNameValid(uppercasedArchitectureName))
        throw Error('Error while getting the architecture name')

    return ArchitectureName[uppercasedArchitectureName]
}

function isPlatformNameValid(value: string): value is keyof typeof PlatformName {
    return value in PlatformName
}

function isArchitectureNameValid(value: string): value is keyof typeof ArchitectureName {
    return value in ArchitectureName
}

export function DoesStringIncludesAllOfTheFollowing(sourceString: string, targetOptions: string[]): boolean {
    return targetOptions
        .filter(option => sourceString.includes(option) === false)
        .length === 0
}

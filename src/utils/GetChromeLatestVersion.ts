import axios from 'axios'

async function GetChromeLatestVersion(): Promise<number> {
    const response = await axios.get('https://googlechromelabs.github.io/chrome-for-testing/last-known-good-versions.json')
    const responseData = response.data

    return parseFloat(responseData.channels.Stable.version)
}

export default GetChromeLatestVersion

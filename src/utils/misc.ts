export const randomToken = (length = 24) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let token = ''
  for (let i = 0; i < length; i++)
    token += charset[Math.floor(Math.random() * charset.length)]

  return token
}

// Convert seconds to a time string acceptable to Rainmeter
const pad = (num: number, size: number) => num.toString().padStart(size, '0')
export const timeInSecondsToString = (timeInSeconds: number) => {
  try {
    if (isNaN(timeInSeconds)) return '0:00'
    const timeInMinutes = Math.floor(timeInSeconds / 60)
    if (timeInMinutes < 60)
      return timeInMinutes + ':' + pad(Math.floor(timeInSeconds % 60), 2)

    return Math.floor(timeInMinutes / 60) + ':' + pad(Math.floor(timeInMinutes % 60), 2) + ':' + pad(Math.floor(timeInSeconds % 60), 2)
  } catch {
    return '0:00'
  }
}

export const isVersionOutdated = (currentVersion: string, latestVersion: string) => {
  // The version is major.minor.patch, compare version against what the extension knows is the latest version
  // C# actually gives us a version with 4 numbers, but this just ignores the last one
  const [major, minor, patch] = latestVersion.split('.').map((v) => parseInt(v))
  const [major2, minor2, patch2] = currentVersion.split('.').map((v) => parseInt(v))
  if (major2 < major || (major2 === major && minor2 < minor) || (major2 === major && minor2 === minor && patch2 < patch))
    return true
  else
    return false
}

const ghCache = JSON.parse(localStorage.getItem('wnp-redux-gh-cache') ?? '{}')
export const getVersionFromGithub = async (gh: string) => {
  if (ghCache[gh] && ghCache[gh].timestamp > (Date.now() - (1000 * 60 * 60 * 12)))
    return ghCache[gh].version

  try {
    const releaseApiLink = `https://api.github.com/repos/${gh}/releases?per_page=1`
    const response = await fetch(releaseApiLink)
    if (response.ok) {
      const json = await response.json()
      let tag = json[0].tag_name
      if (!tag) return 'Error'
      if (tag.startsWith('v')) tag = tag.slice(1)
      ghCache[gh] = { timestamp: Date.now(), version: tag }
      localStorage.setItem('wnp-redux-gh-cache', JSON.stringify(ghCache))
      return tag
    }
    return 'Error'
  } catch {
    return 'Error'
  }
}

export const WebNowPlayingSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" viewBox="0 0 128 128">
  <path
    fill="currentColor"
    opacity="1.000000"
    stroke="none" 
    d="
    M52.468651,129.000000 
    C51.522316,128.333679 51.183170,127.289772 50.546692,127.056244 
    C34.322289,121.103279 23.346861,105.138237 24.096548,87.351288 
    C24.401844,80.107864 26.873232,73.434875 30.401190,66.856834 
    C40.966480,47.157341 50.831905,27.082733 61.000626,7.169924 
    C61.930473,5.349056 63.075897,3.638271 64.395424,1.414187 
    C65.780602,3.448930 66.952225,4.824516 67.747757,6.391089 
    C77.577171,25.747242 87.028854,45.304592 97.294304,64.425476 
    C101.591698,72.429993 105.055092,80.321762 104.998726,89.488243 
    C104.894035,106.514221 93.884232,121.461365 78.310295,127.033180 
    C77.608803,127.284157 77.041710,127.910805 76.706009,128.681244 
    C68.979103,129.000000 60.958202,129.000000 52.468651,129.000000 
    M76.117493,114.978951 
    C85.191467,110.116631 90.346237,102.573860 92.314461,91.905426 
    C81.143524,96.487022 72.116440,93.168457 63.568077,87.094536 
    C58.102886,83.211334 52.060413,81.304787 45.274181,81.982422 
    C40.446869,82.464447 35.167786,88.801292 36.077812,93.409813 
    C40.093639,113.746559 58.187553,121.231300 76.117493,114.978951 
    z"
  />
</svg>
`
// const configs = {
//   BASE_URL: 'https://saral-dev-api.anuvaad.org',
// }

export const baseUrlConfigure = (baseUrl) => {
  if (baseUrl == 'Base_Url1') {
    baseUrl = 'http://192.168.223.164:3000'
    return baseUrl;
  } else if (baseUrl == 'Base_Url2') {
    baseUrl = 'https://saral-dev-api.anuvaad.org'
    return baseUrl;
  } else {
    baseUrl = ""
  }
}

//  export default configs;
export const apkVersion = "1.5.3"
export const apkVersionId = "1"
export const apkURL = 'http://play.google.com/store/apps/details?id=com.up_saraldata'
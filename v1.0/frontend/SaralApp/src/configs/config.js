const configs = {
  BASE_URL: 'http://192.168.128.164:3000'
}







export const baseUrlConfigure = (baseUrl) => {
  if(baseUrl=='Base_Url1'){
    configs.BASE_URL = 'https://saral-dev-api.anuvaad.org'
    return true;
  }else if(baseUrl=='Base_Url2'){
    configs.BASE_URL = 'http://192.168.128.164:3000'
    return true;
  }else{
    configs.BASE_URL = "https://saral-dev-api.anuvaad.org"
    // console.log('baseurl>>>>>>>???????????/',configs.BASE_URL)
  }
}
export default configs;
export const apkVersion =  "1.5.3"
export const apkVersionId = "1"
export const apkURL = 'http://play.google.com/store/apps/details?id=com.up_saraldata'
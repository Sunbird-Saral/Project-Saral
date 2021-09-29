import moment from 'moment'

export const validateToken = (expireTime) => {
    let expireArr = expireTime.replace(/-/g, '/').split('/')    
    let formattedExpireTime = expireArr[1]+'/'+expireArr[0]+'/'+expireArr[2]
    
    let tokenExpireTime = moment(new Date(Date.parse(formattedExpireTime)))
    let currentTime = moment()
    if(currentTime > tokenExpireTime) {
        return false
    }
    else {
        return true
    }
}

export const SCAN_TYPES = {
    SAT_TYPE: 'sat',
    PAT_TYPE: 'pat'
}
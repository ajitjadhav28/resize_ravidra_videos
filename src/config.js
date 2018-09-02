import ENV from './env'
// Configurations for extension. 

let config = {
    startDate: '2018-08-23',
    dailyHrsGoal: 4,
    thingspeak: ENV.thingspeak.CH_WRITE_API_KEY.length == true,
    dropbox: ENV.dropbox.ACCESS_TOKEN.length == true,
    jsonbin: ENV.jsonbin.SECRET_KEY.length == true 
}

export default config;
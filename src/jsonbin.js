import ENV from './.env.js'
import axios from 'axios'

export default class Jsonbin {
    constructor(binId){
        if(!binId){
            // Default Bin
            this.binUrl = "https://api.jsonbin.io/b/" + ENV.jsonbin.DEFAULT_BIN
        } else {
            // Change default bin
            this.binUrl = "https://api.jsonbin.io/b/" + binId
        }
    }

    updateBin(binId=false, data) {
        if(!data && !Object.keys(data)){
            console.error('No data provided to update json')
            return
        }
        let binUrl = binId
            ? "https://api.jsonbin.io/b/" + binId
            : this.binUrl
        axios.put(
            binUrl,
            {...data},
            {
                headers: {
                    "Content-Type": "application/json",
                    "secret-key": ENV.jsonbin.SECRET_KEY,
                    "versioning": false
                }
            }
        ).then( res => {
            console.log('Data updated on JsonBin')
        }).catch(err => {
            console.error("Can't update jsonbin!", err)
        })
    }

    getData(binId=false, callback) {
        let data = false
        let binUrl = binId
            ? "https://api.jsonbin.io/b/" + binId
            : this.binUrl

        axios.get(
            binUrl,
            {
                headers: {
                    "secret-key": ENV.jsonbin.SECRET_KEY
                }
            }
        ).then( res => {
            console.log('Got data from jsonbin.')
            callback(res.data)
        }).catch(err => {
            console.error("Can't read jsonbin!", err)
        })
    }
}
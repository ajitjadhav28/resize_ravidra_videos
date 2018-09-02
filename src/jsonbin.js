import ENV from './.env.js'
import axios from 'axios'
import PouchDB from 'pouchdb-browser'

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

    updateLocalDb(data){
        let ldb = new PouchDB('watched_lectures')
        ldb.bulkDocs(data)
            .then(res => console.log('Local Database Updated.', res))
            .catch(err => console.error("Can't update local database!"))
    }

    updateBin(data, binId=false) {
        if(!data && !Object.keys(data)){
            console.error('No data provided to update json')
            return
        }
        this.getData(0, res => {
            if(data.data.length < res.data.length) {
                this.updateLocalDb(res.data)
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
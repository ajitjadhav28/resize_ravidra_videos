import ENV from './.env.js'
import axios from 'axios'
import PouchDB from 'pouchdb-browser'
import { filterJson } from './content'  

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

    updateLocalDb(data, binId=false){
        let ldb = new PouchDB('watched_lectures')
        ldb.bulkDocs(data)
            .then(res => {
                console.log('Local Database Updated.', res)
                ldb.allDocs({ include_docs: true })
                    .then( res => {
                        this.putData(filterJson(res), binId)
                    })
            })
            .catch(err => console.error("Can't update local database!"))
    }

    putData(data, binId=false) {
        let binUrl = binId
            ? "https://api.jsonbin.io/b/" + binId
            : this.binUrl
            axios.put(
                binUrl,
                {...data},  // data = {data: [...]}
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

    updateBin(data, binId=false) {
        if(!data && !Object.keys(data)){
            console.error('No data provided to update json')
            return
        }
        this.getData(0, res => {
            if(data.data.length < res.data.length) {
                let mergedData = [...res.data, ...data.data]
                this.updateLocalDb(mergedData, binId)
            } else {
                this.putData(data,binId)
            }  
            
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
import ENV from './.env.js'
import Dropbox from 'dropbox'
import axios from 'axios'

class MyDropbox {
    constructor(){
        this.dbx = new Dropbox.Dropbox({
            accessToken: ENV.dropbox.ACCESS_TOKEN || ''
        })
    }

    upload_file(name, content){
        this.dbx.filesUpload({
            path: '/' + name,
            contents: content,
            mode: 'overwrite'
        }).then(response => console.log('Data uploaded to dropbox'))
        .catch(err => console.error(err))
    }
}

export default MyDropbox;
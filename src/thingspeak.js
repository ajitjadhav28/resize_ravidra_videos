import ENV from './.env.js'
import axios from 'axios'

export default class Thingspeak {
    constructor() {
        let API_KEY_W = ENV.thingspeak.CH_WRITE_API_KEY || ''
        this.UPDATE_URL = 'https://api.thingspeak.com/update?api_key=' + API_KEY_W
    }

    update_channel(data) {
        let get_url = this.UPDATE_URL + '&field1=' + data.field1
        axios.post(get_url)
            .then(response => console.log("Thingspeak updated."))
            .catch(err => console.error(err))
    }
}
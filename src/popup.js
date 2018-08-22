// import Download from './download'
// import PouchDB from 'pouchdb-browser'

let autoplayChbx = document.getElementById('rrv-autoplay')
let autoresizeChbx = document.getElementById('rrv-autoresize')
let downloadBtn = document.getElementById('rrv-data-btn')

document.addEventListener('DOMContentLoaded', () => {
    
    downloadBtn.onclick = (event) => {
        console.log('clicked')
        chrome.runtime.sendMessage({download_data: true }, (res) => {
            console.log(res)
        })
    }

    chrome.storage.local.get(['autoplay, autoresize'], (res) => {
        autoplayChbx.checked = res.autoplay
        autoresizeChbx.checked = res.autoresize
    })
    
    autoplayChbx.onclick = () => {
        console.log('Checkbox clicked.')
            chrome.storage.local.set({
                autoplay: autoplayChbx.checked
            })
    }
})
import Player from '@vimeo/player'
import PouchDB from 'pouchdb-browser'
import Download from './download'

PouchDB.plugin(require('pouchdb-find'));

let ldb = new PouchDB('watched_lectures')

let lastUpdatedQuery = "#region-main .modified"
let lastUpdatedElement = document.querySelector(lastUpdatedQuery)
let activeNodeClass = "active_tree_node"
let listClass = "type_activity depth_5"
let iframeQuery = "#region-main .no-overflow iframe"
let lec_url = ''
let controlsNode = document.createElement('span')
let header = document.querySelector("#page-mod-page-view > header > nav > .container-fluid")

controlsNode.style.float = 'right'

if(lastUpdatedElement)
    lastUpdatedElement.appendChild(controlsNode)

window.onload = (event) => {
    const iframe = document.querySelector(iframeQuery)
    if(iframe) {
        lec_url = iframe.src
        // iframe.src = lec_url + "?quality=360p&autoplay=1"
        resizeIframe()
        putControls()
        putTodaysProgress()
        const player = new Player(iframe)
        chrome.storage.local.get(['autoplay', 'autoresize'], (res) => {
            // console.log('Getting state')
            // console.log(res)
        })

        player.ready().then(() => {
            document.querySelector("#region-main > div > h2").scrollIntoView()
            player.play().catch(err => console.log(err))
        });
        
        player.on('ended', (event) => {
            let url = window.location.href
            let duration = event.duration
            let title = document.querySelector("#region-main > div > h2").innerText

            addLecToLdb(lec_url, title, duration, url)

            setTimeout(() => {
                window.location.href = document.getElementById("rrv-next-lecture").href
            }, 5000)
        })
    
        window.onresize = (event) => {
            resizeIframe()        
        }
    }
}

function putControls() {
    let activeNode = document.getElementsByClassName(activeNodeClass)[0].parentElement
    if(activeNode.className.match(/.*type_activity.*depth_5.*/g)) {
        let prevHref = activeNode.previousSibling ? activeNode.previousSibling.firstChild.firstChild.href : false

        let nextHref = activeNode.nextSibling ? activeNode.nextSibling.firstChild.firstChild.href : false

        if(prevHref) {
            let prevElm = document.createElement('a')
            prevElm.setAttribute('href', prevHref)
            prevElm.innerHTML = "&nbspPrev&nbsp"
            controlsNode.appendChild(prevElm)
            
            let blankElm = document.createElement('span')
            blankElm.innerHTML = '&nbsp;&nbsp;'
            controlsNode.appendChild(blankElm)
        }
        if(nextHref) {
            let nextElm = document.createElement('a')
            nextElm.setAttribute('href', nextHref)
            nextElm.setAttribute('id', 'rrv-next-lecture')
            nextElm.innerHTML = "&nbspNext&nbsp"
            controlsNode.appendChild(nextElm)
        }
    }
}

function resizeIframe() {
    if( window.window.innerHeight < window.window.innerWidth) {
        document.querySelector(iframeQuery).width = "95%"  
    } else {
        document.querySelector(iframeQuery).width = "100%"
    }
    let currentIframeWidth = parseInt(document.querySelector(iframeQuery).clientWidth) 
    document.querySelector(iframeQuery).height = currentIframeWidth * 0.562
}

function addLecToLdb(lec_url, lec_title, duration, url) {
    let data = {
        '_id'       : lec_url,
        'date'      : new Date().toISOString(),
        'title'     : lec_title,
        'url'       : url,
        'duration'  : duration
    }

    ldb.put(data, (err, result) => {
        if(err) {
            console.error(err)
            alert("Cant put data: " + JSON.stringify(data) + "\n Error : " + err)
        }
    })
}

function getData() {
    ldb.allDocs({
        include_docs: true
    }).then(res => {
        let keys = Object.keys(res.rows[0].doc).filter((key) => key != "_rev")
        let doc = keys.join(',')
        doc += '\n'
        res.rows.forEach(row => {
            keys.forEach(key => doc += row.doc[key] + ",")
            doc += '\n'
        })
        doc += '\n'
        Download('data.csv', doc)
    }).catch(err => {
        console.error(err)
    })
}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return h + ":" + m + ":" + s
}

function putTodaysProgress(){
    ldb.allDocs({
        include_docs: true
    }).then(res => {
        let todaysDuration = 0
        let today = new Date().toDateString()
        res.rows.forEach(row => {
            if (today == new Date(row.doc["date"]).toDateString()) {
                todaysDuration += parseInt(row.doc["duration"])
            }
        })
        let todaysDiv = document.createElement('div')
        let divStyle = "text-align: center; padding-top: 10px; font-size: 20px; "
        divStyle += todaysDuration >= 14400 ? "color: green;" : "color: red;"
        todaysDiv.setAttribute('id', 'rrv-todays-progress')
        todaysDiv.style = divStyle
        header.appendChild(todaysDiv)
        let durationSpan = document.createElement('span')
        durationSpan.innerHTML = secondsToHms(todaysDuration) + "&nbsp;/&nbsp;4:0:0"
        todaysDiv.appendChild(durationSpan)
    })
}
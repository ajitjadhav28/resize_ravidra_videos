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
let playButtonQuery = "#player > div > div > div.vp-controls-wrapper > div.vp-controls > button.play"
let controlsNode = document.createElement('span')
controlsNode.style.float = 'right'

if(lastUpdatedElement)
    lastUpdatedElement.appendChild(controlsNode)

window.onload = (event) => {
    const iframe = document.querySelector(iframeQuery)
    if(iframe) {
        resizeIframe()
        putControls()
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
            let lec_url = iframe.src

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
let lastUpdatedQuery = "#region-main .modified"
let lastUpdatedElement = document.querySelector(lastUpdatedQuery)
let activeNodeClass = "active_tree_node"
let listClass = "type_activity depth_5"
let iframeQuery = "#region-main .no-overflow iframe"

let controlsNode = document.createElement('span')
controlsNode.style.float = 'right'

if(lastUpdatedElement)
    lastUpdatedElement.appendChild(controlsNode)

window.onload = (event) => {
    if(document.querySelector(iframeQuery)) {
        resizeIframe()
        putControls()
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
    currentIframeWidth = parseInt(document.querySelector(iframeQuery).clientWidth) 
    document.querySelector(iframeQuery).height = currentIframeWidth * 0.562
}

window.onload = function(event){
    resizeIframe()
    window.onresize = function(event) {
        resizeIframe()        
    }
}

var resizeIframe = function(){
    if( window.window.innerHeight < window.window.innerWidth) {
        document.querySelector("#region-main .no-overflow iframe").width = "95%"  
    } else {
        document.querySelector("#region-main .no-overflow iframe").width = "100%"
    }
    currentIframeWidth = parseInt(document.querySelector("#region-main .no-overflow iframe").clientWidth) 
    document.querySelector("#region-main .no-overflow iframe").height = currentIframeWidth * 0.562
}
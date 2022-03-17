$(function(){
    getText();
})

function getText(){
    let decodedCookie = decodeURIComponent(document.cookie);
    size = decodedCookie.split('=')[1];
    document.body.style.fontSize = size + "%";
    
}
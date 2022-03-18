$(function(){
    getTextSize();
})

function getTextSize(){
    let size = sessionStorage.getItem("size");
    document.body.style.fontSize = size + "%"; 
}
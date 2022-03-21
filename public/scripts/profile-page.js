//displays the username
function getUsername(){
    $('#username').append(sessionStorage.getItem("user").split(' ')[0]);
        
}

//run on document load
$(function(){
    getUsername();
})
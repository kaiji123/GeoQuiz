//displays the username
function getUsername(){
    if (sessionStorage.getItem('user')){
        $('#username').append(sessionStorage.getItem("user").split(' ')[0]);
    }else{
        $('#username').append("Guest");
      
    }
        
}

//run on document load
$(function(){
    getUsername();
})
//run when index is loaded - should inti
function init(){
    //check if a user is logged in + set header to username
    if(sessionStorage.getItem("user") != null){
        $('#username').html(sessionStorage.getItem("user"));
    }
    else{
        $('#username').html('Guest');
    }
}

//run on document load
$(function(){
    init();
})
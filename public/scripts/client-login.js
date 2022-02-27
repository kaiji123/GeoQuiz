//called by google signin api
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log(profile);
    const params = {
        email:profile.getEmail() ,
        username:profile.getName(),

    }
    console.log(params)
    
    const http = new XMLHttpRequest()
    http.open('POST', 'http://localhost:3000')
    http.setRequestHeader('Content-type', 'application/json')   
    http.onload= function(){
        if (http.responseText == "success"){
            sessionStorage.setItem("user", params.username);
            //window.location.href = "/"
        }
    }

    http.send(JSON.stringify(params)) // Make sure to stringify          
}

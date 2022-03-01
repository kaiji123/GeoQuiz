//called by google signin api
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    
    //check if the user exists in our database
    sessionStorage.setItem("id", profile.getId());
    sessionStorage.setItem("user", profile.getName());

    //window.location.href = '/index'
}

//called by google signin api
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    
    //check if the user exists in our database
    sessionStorage.setItem("id", profile.getId());
    sessionStorage.setItem("user", profile.getName());

    //window.location.href = '/index'
}

window.fbAsyncInit = function() {
    // FB JavaScript SDK configuration and setup
    FB.init({
      appId      : '589355126092251', // FB App ID
      //cookie     : true,  // enable cookies to allow the server to access the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v3.2' // use graph api version 2.8
    });

  
};

// Load the JavaScript SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));





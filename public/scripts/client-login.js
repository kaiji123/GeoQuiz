//
// This file handles anything sign in/sign out related
//

$(function(){
    //only try and render google login if we're on the login page
    gapi.load('auth2', function() {
        gapi.auth2.init();
    });
    if(window.location.pathname == '/login'){
        renderGLogin()
    }

    setHeaderContent()
})

window.onresize = renderGLogin;

//renders google login at an appropriate size
function renderGLogin(){
    var containerWidth = $('.social-login').width()
        
    $('.g-signin2').data('width', containerWidth)
    gapi.signin2.render('g-signin',{
        'scope': 'profile email',
        'width': containerWidth,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSignIn,
        'onfailure': renderGLogin
    })
}

//called on successful google signin
function onSignIn(googleUser) {
        var profile = googleUser.getBasicProfile();
        var id = profile.getId()
        var name = profile.getName()

        //check if the user exists in our database
        sessionStorage.setItem("id", id)
        sessionStorage.setItem("user", name)

        //query the api with the user's id and add them to the db if they're new
        addUserIfNew(id, name).then((res) => {
                // if have a bad response then do not login and stay on the login page
                if (res === 403){
                    return
                }

                else{
                    //get the token and set it in the session storage
                    res.json().then(data=>{
                        sessionStorage.setItem("token", data)

                        //once the user has been added/verified, check their gdpr status
                        //if the user has correct credentials then checkGDPR and use the promise to change the url
                        checkGDPR(profile.getId()).then((gdpr) => {
                            sessionStorage.setItem('gdpr', gdpr)
                        
                            window.location.href = "/"
                        })
                    })
                    
                  
                    
            }
         
        })
      
        
}

function signOut() {     
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        //clear session storage and reset button
        sessionStorage.clear()
        setHeaderContent()
        window.location.href = "/"
    })
}

//edits header content based on user login status
function setHeaderContent(){
    let headerButton = $('#signin-out')
    //check if a user is logged in
    if(!sessionStorage.getItem('id')){
        headerButton.html("Sign in")

        headerButton.click(function(){
            window.location.href='/login'
        })
    }
    else{
        headerButton.html("Sign out")
        $('#profile').attr('src', '/api/profile-picture/' + sessionStorage.id)
        $('#profile').toggle();
        headerButton.click(function(){
                signOut()
                //window.location.href='/'
        })
    }
}

//if gdpr is not signed, set a session variable to specify it must be signed
async function checkGDPR(id){
    const res = await fetch('/api/get-gdpr', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'id': id
        })
    });

    const data = await res.json();
    return data.gdpr;
}

//sends an id to the api to check if a user exists
async function addUserIfNew(id, name){
    const res = await fetch('/api/add-user', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'id': id,
            'name': name
        })
    })

    return res
}

// window.fbAsyncInit = function() {
//         // FB JavaScript SDK configuration and setup
//         //window.location.href = '/authenticate/facebook'
//         FB.init({
//             appId            : '589355126092251', // FB App ID
//             //cookie         : true,    // enable cookies to allow the server to access the session
//             xfbml            : true,    // parse social plugins on this page
//             version        : 'v3.2' // use graph api version 2.8
//         });

    
// };

// // Load the JavaScript SDK asynchronously
// (function(d, s, id) {
//         var js, fjs = d.getElementsByTagName(s)[0];
//         if (d.getElementById(id)) return;
//         js = d.createElement(s); js.id = id;
//         js.src = "//connect.facebook.net/en_US/sdk.js";
//         fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));

// function check() {
//         FB.login(function (response) {
//                 if (response.authResponse) {
//                         console.log('Welcome!    Fetching your information.... ');
//                         FB.api('/me', { fields: 'last_name,picture.width(150).height(150)'},function (response) {
//                                 console.log('Good to see you, ' + response.last_name + '.');
//                                 console.log(response);
//                                 document.getElementById('photo').setAttribute('src', response.picture.data.url);
//                         });
//                 } else {
//                         console.log('User cancelled login or did not fully authorize.');
//                 }
//         });
// };


// module.exports = {
//         /*
//            * This file contains the configurations information of Twitter login app.
//            * It consists of Twitter app information, database information.
//            */
    
//         facebook_api_key: 589355126092251,
//         facebook_api_secret: b72f68a6baaa044498ff5bb6d5c67228,
//         callback_url: "http://localhost:3000/index",
//         use_database: false,
//         host: "localhost",
//         username: "root",
//         password: "",
//         database: ""
//     };


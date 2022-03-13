//called by google signin api
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    
    //check if the user exists in our database
    sessionStorage.setItem("id", profile.getId());
    sessionStorage.setItem("user", profile.getName());

    //window.location.href = '/index'
}



// window.fbAsyncInit = function() {
//     // FB JavaScript SDK configuration and setup
//     //window.location.href = '/authenticate/facebook'
//     FB.init({
//       appId      : '589355126092251', // FB App ID
//       //cookie     : true,  // enable cookies to allow the server to access the session
//       xfbml      : true,  // parse social plugins on this page
//       version    : 'v3.2' // use graph api version 2.8
//     });

  
// };

// // Load the JavaScript SDK asynchronously
// (function(d, s, id) {
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) return;
//     js = d.createElement(s); js.id = id;
//     js.src = "//connect.facebook.net/en_US/sdk.js";
//     fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));

// function check() {
//     FB.login(function (response) {
//         if (response.authResponse) {
//             console.log('Welcome!  Fetching your information.... ');
//             FB.api('/me', { fields: 'last_name,picture.width(150).height(150)'},function (response) {
//                 console.log('Good to see you, ' + response.last_name + '.');
//                 console.log(response);
//                 document.getElementById('photo').setAttribute('src', response.picture.data.url);
//             });
//         } else {
//             console.log('User cancelled login or did not fully authorize.');
//         }
//     });
// };


// module.exports = {
//     /*
//      * This file contains the configurations information of Twitter login app.
//      * It consists of Twitter app information, database information.
//      */
  
//     facebook_api_key: 589355126092251,
//     facebook_api_secret: b72f68a6baaa044498ff5bb6d5c67228,
//     callback_url: "http://localhost:3000/index",
//     use_database: false,
//     host: "localhost",
//     username: "root",
//     password: "",
//     database: ""
//   };


//
// This file handles anything sign in/sign out related
//

$(function(){
    onLoadCallback()
    //only try and render google login if we're on the login page
    if(window.location.pathname == '/login'){
        renderGLogin()
    }

    setHeaderContent()
})



function onLoadCallback(){
    gapi.load('auth2', function() {
        gapi.auth2.init();
    });
}
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
            console.log("adding user")
            if (res === 403){
                console.log("add error")
                return
            }
            else{
                
                //get the token and set it in the session storage
                res.json().then(data=>{
                    console.log(data)
                    sessionStorage.setItem("token", data)

                    //once the user has been added/verified, check their gdpr status
                    //if the user has correct credentials then checkGDPR and use the promise to change the url
                    checkGDPR(profile.getId()).then((gdpr) => {
                        sessionStorage.setItem('gdpr', gdpr)
                        console.log("hello")
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
        $('#profile').attr('src', API_VERSION +'/profile-picture/' + sessionStorage.id)  //set image to api route for pfps
        $('#profile').toggle();
        headerButton.click(function(){
                signOut()
        })
    }
}

//if gdpr is not signed, set a session variable to specify it must be signed
async function checkGDPR(id){
    const res = await fetch(API_VERSION + '/gdpr', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem("token") },
        body: JSON.stringify({
            'id': id
        })
    });

    const data = await res.json();
    return data.gdpr;
}

//sends an id to the api to check if a user exists
async function addUserIfNew(id, name){
    const res = await fetch(API_VERSION +'/users', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'id': id,
            'name': name
        })
    })

    return res
}




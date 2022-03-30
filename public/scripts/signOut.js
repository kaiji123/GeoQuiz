function signOut() {     
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        //clear session storage and reset button
        sessionStorage.clear()
        setHeaderButton()
        window.location.href = "/"
    })
}

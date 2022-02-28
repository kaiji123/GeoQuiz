//check if a user is logged in and display their name
function showUser(){
        //check if a user is logged in + set header to username
        if(sessionStorage.getItem("user") != null){
            $('#username').append(sessionStorage.getItem("user").split(' ')[0]);
        }
        else{
            $('#username').append('Guest');
        }
}

async function showClientLocation(){
    //check gelocation is available
    if('geolocation' in navigator) {
        var data = navigator.geolocation.getCurrentPosition((position) => {
            //get lat and lon coords
            var coords = [position.coords.latitude, position.coords.longitude];
            var data = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };       
            //create new POST request to location api using fetch (at the moment it just bounces back data)
            fetch('/api/location',{
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            })
            .then(res => res.json())
            .then(data => {
                    $('#location').append(data.city)
                }
            );
        });
    } else {
        console.log('Location services not availabe');
        return null;
    }
}

//run on document load
$(function(){
    showUser();
    showClientLocation();
})
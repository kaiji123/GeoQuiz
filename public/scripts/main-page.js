//check if a user is logged in and display their name
function showUser(){
        //check if a user is logged in + set header to username
        if(sessionStorage.getItem("user") != null){
            window.onLoadCallback = function(){
                gapi.auth2.init({
                    client_id: process.env.CLIENT_ID
                  });
            }
            $('#username').append(sessionStorage.getItem("user").split(' ')[0]);
            var s = document.getElementById("authentication")
            s.innerHTML = "Sign Out"
            s.onclick = signOut
        
        }
        else{
            $('#username').append('Guest');
        }

      
}

//show leaderboard table in homepage
function showTable(){
       //create GET request to /api/top5 to get top 5 users in homepage
       fetch('/api/top5',{
        method: 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      
        })
        .then(res => res.json())
        .then(data => {
            data = data.top5

            var content = "<table><tr><th>Rank</th><th>Name</th><th>Total</th></tr>"
            for(i=0; i<data.length; i++){
                content += '<tr><td>' + (i+1) +'</td>' +'<td>'+ data[i].name + '</td>'+ '<td>'+ data[i].scores + '</td>' + '</tr>';
            }
            content += "</table>"
                $('#leaderboard').append(content)
            }
        );

}
function showClientLocation(){
    //check gelocation is available
    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            //get lat and lon coords
            var coords = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };  
            //create new POST request to location api using fetch (at the moment it just bounces back data)
            fetch('/api/location',{
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: JSON.stringify(coords),
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
    showTable();
})
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
       fetch('/api/leaderboard',{
        method: 'GET',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
      
        })
        .then(res => res.json())
        .then(data => {  
            console.log(data)

            var content = "<table><tr><th>Rank</th><th>Name</th><th>Total</th></tr>"
            let i = 1
            for (const [key, value] of Object.entries(data)) {
                content += '<tr><td>' + i +'</td>' +'<td>'+ value.name + '</td>'+ '<td>'+ value.total + '</td>' + '</tr>';
                i++
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
                body: JSON.stringify(coords)
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

function toggleGDPR(){
    $('.popup').toggle()  
}

function acceptGDPR(){
    toggleGDPR()
}
//run on document load
$(function(){
    showUser();
    showClientLocation();
    showTable();
    
    //check if user has signed gdpr
    toggleGDPR();
})
function getClientLocation(){
    //check gelocation is available
    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            //return lat and long coords
            var coords = [position.coords.latitude, position.coords.longitude];
            var data = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
            
            //create new POST request to location api using fetch (at the moment it just bounces back data)
            fetch('/api/location',{
                method: 'POST',
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            })
            .then(res => res.json())
            .then(data => console.log(data))

        });
    } else {
        console.log('Location services not availabe');
        return null;
    }
}

getClientLocation();
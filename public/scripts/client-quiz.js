function generateQuiz(coords){
    fetch('/api/quiz',{
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify(coords),
    })
    .then(res => res.json())
    .then(data => {
           console.log(data);
        }
    );
}

$(function(){
    //get client coordinates and generate a quiz for that location
    if('geolocation' in navigator) {
        var data = navigator.geolocation.getCurrentPosition((position) => {
            //get lat and lon coords
            var coords = {lat: position.coords.latitude, lon:position.coords.longitude};
            generateQuiz(coords);
        });
    }else{
        console.log('ERROR: Location services not available.');
    }
})
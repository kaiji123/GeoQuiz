if('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
    });
} else {
    console.log('Location services not availabe');
}
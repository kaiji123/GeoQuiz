const { places } = require('@google/maps/lib/apis/places');
const axios = require('axios');

//query google places api for nearby plcaes - returns a promise 
function generateQuiz(coords, radius=10000, type='cafe'){
    const API_KEY = 'AIzaSyCt8c60BgMHIYVIByfQ30rlAzuZMDGKy4Q';

    //construct API query string
    var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json' +
        '?location=' +coords.lat + '%2C' + coords.lon +
        '&radius=' + radius +
        '&type=' + type + 
        '&key=' + API_KEY;

    //query the google api with GET
    var promise = axios.get(url);
    var dataPromise = promise.then((res) => {
        var places =  res.data.results;
        var quiz = [];
        places.forEach(place =>{
            quiz.push(place);
        })

        return quiz;
    });
    
    return dataPromise; 
}

exports.generateQuiz = generateQuiz;

/*
            var places = res.data.results;
            console.log(places);
            places.forEach(place => {
                //console.log(place.name)
            })
*/
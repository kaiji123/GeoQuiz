const axios = require('axios')
const fs = require('fs');

const API_KEY = 'AIzaSyChzAGrXXV8gklFuucKcuT_dY0lOg5Fd84'

const allowedData = ["rating", "vicinity", "photos", "reviews"]

//generate a quiz object with random questions, based on cached data (much cheaper)
function generateQuizCache(){
    //read in cached api data
    let fspromise = fs.promises.readFile('./selly.json').then((data) =>{              
        //read both general data and fine data
        var places =  JSON.parse(data).general
        var details = JSON.parse(data).fine
        var photos = JSON.parse(data).photos
        var quiz = []
        
        for(let i=0; i < 10; i++){
            //pick a local place at random without replacement
            let place = pickRandom(places);
            let placeId = place.place_id

            //remove item from array
            let index = places.indexOf(place);
            places.splice(index, 1)

            let placeDetails = details[placeId]

            let placeName = placeDetails.name
            let data = pickRandom(allowedData)
            let wrong = ['a', 'b', 'c'];  

            //if the place is missing data, pick something else
            while(placeDetails[data] == null){
                console.log(data + ' not found for current place')
                data = pickRandom(allowedData)
            }
            
            let question;
            //populate the question with the right data
            if(data == 'rating'){
                wrong = randomRatings();
                question = questionJson(`What is ${placeName}'s rating on Google?`, placeDetails[data], wrong, null, null)
            }
            else if(data == 'vicinity'){
                wrong = randomAddresses(places)
                question = questionJson(`What is ${placeName}'s address?`, placeDetails[data], wrong, null, null)

            }
            else if(data == 'photos'){
                wrong = randomPlaces(places);

                //remove item from array
                let bytes = photos[placeId]
              
                question =  questionJson(`Name this place:`, placeName, wrong, bytes, 'img')
                
            }
            else if(data =='reviews'){
                wrong = randomPlaces(places);

                //pick a review at random
                let review = pickRandom(placeDetails.reviews).text
                question = questionJson('What is this a review for?', placeName, wrong, review, 'text')
            }
            //generate question based on chosen data item
            quiz.push(question)  
              
        }
        return quiz
    })

    return fspromise
}

//uses live API queries - expensive!
function generateQuiz(coords, radius=10000, type='cafe'){
    //construct API query string
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json' +
        '?location=' + coords.lat + '%2C' + coords.lon +
        '&radius=' + radius +
        '&type=' + type + 
        '&key=' + API_KEY

    //allowed question fields for later on (name is required but not a question)
    let fields = arrayToCsv(allowedData) + ',name'
    
    //query the google api to get a list of nearby places
    let mainPromise = axios.get(url).then((res) =>{       //use this for live api query
    
        var places =  res.data.results 

        var promises = []
        
        for(let i=0; i < 10; i++){
            //pick a local place at random without replacement
            let place = pickRandom(places);
            let placeId = place.place_id

            //remove item from array
            let index = places.indexOf(place);
            places.splice(index, 1)

            //get finer detail about chosen place
            let url = 'https://maps.googleapis.com/maps/api/place/details/json' + 
            '?placeid=' + placeId + 
            '&fields=' + fields +
            '&key=' + API_KEY
            
            //make a new promise to process the above query
            let questionPromise = axios.get(url).then((details) => {
                let placeDetails = details.data.result

                let placeName = placeDetails.name
                let data = pickRandom(allowedData)
                let wrong = ['a', 'b', 'c'];  

                //if the place is missing data, pick something else
                while(placeDetails[data] == null){
                    console.log(data + ' not found for current place')
                    data = pickRandom(allowedData)
                }
                
                //populate the question with the right data
                if(data == 'rating'){
                    wrong = randomRatings();
                    question = questionJson(`What is ${placeName}'s rating on Google?`, placeDetails[data], wrong, null, null)
                }
                else if(data == 'vicinity'){
                    wrong = randomAddresses(places)
                    question = questionJson(`What is ${placeName}'s address?`, placeDetails[data], wrong, null, null)

                }
                else if(data == 'photos'){
                    wrong = randomPlaces(places);

                    //remove item from array
                    let photoRef = placeDetails.photos[0].photo_reference
                    //gets an image bytearray from google's servers
                    question = getImage(photoRef).then((bytes) =>{
                        return questionJson(`Name this place:`, placeName, wrong, bytes, 'img')
                    })
                }
                else if(data =='reviews'){
                    wrong = randomPlaces(places);

                    //pick a review at random
                    let review = pickRandom(placeDetails.reviews).text
                    question = questionJson('What is this a review for?', placeName, wrong, review, 'text')
                }
                //generate question based on chosen data item
                return question;    
            })
            promises.push(questionPromise)
        }

        //resolve all promises simultaneously
        return Promise.all(promises);
    })
    .catch((err) => {
        console.log(err)
        return [];
    })

    return mainPromise
}


//get an image from google's api
function getImage(ref){
    //construct API query string
    let url = 'https://maps.googleapis.com/maps/api/place/photo' +
    '?maxwidth=400' +
    '&photo_reference=' + ref + 
    '&key=' + API_KEY

    //query the google api to get a list of nearby places
    return axios.get(url, {
        responseType: 'arraybuffer'
    }).then((res) =>{
        return Buffer.from(res.data, 'binary').toString('base64')
    }).catch((err) => {
        console.log('Error loading image!');  
    })
}

//returns a json question give question, answer and question type
//meta will hold any extra information that goes with the question
function questionJson(q, a, w, meta, type){
    return {
        "question": q,
        "answer": a,
        "wrong": w,
        "metadata": meta,
        "type": type
    }
}

//picks a random element from an array, as well as it's index
function pickRandom(array){
    var index = Math.floor(Math.random() * array.length)
    return array[index]
}

//generate three random ratings
function randomRatings(){
    let ratings = []
    for(x = 0; x < 3; x++){
        //generate random ratings larger than 2
        let rnd = (Math.floor(Math.random() * 30) / 10) + 2
        ratings.push(rnd)
    }

    return ratings;
}

//genearte three random place names
function randomPlaces(sample){
    //pick some places and get their names
    let randPlaces = [];
    for(x = 0; x < 3; x++){
        let place = pickRandom(sample);

        let name = place.name
        randPlaces.push(name);
    }
    return randPlaces
}

//generate three random addresses
function randomAddresses(sample){
    //pick some places
    let randAddr = [];
    for(x = 0; x < 3; x++){
        let place = pickRandom(sample);

        let addr = place.vicinity
        randAddr.push(addr);
    }
    return randAddr
}

function arrayToCsv(array){
    csv = '';
    for(i = 0; i < array.length; i++){
        csv += array[i]
        csv += (i == array.length - 1) ? '' : ','
    }
    return csv
}


module.exports ={
    generateQuizCache, pickRandom, randomRatings, arrayToCsv, questionJson, 
} 

const axios = require('axios')
const API_KEY = 'AIzaSyCt8c60BgMHIYVIByfQ30rlAzuZMDGKy4Q'

const allowedData = ["rating", "formatted_address", "photos", "reviews"]


//generate a quiz object with random questions

function generateQuiz(coords, radius=10000, type='cafe'){

    //construct API query string
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json' +
        '?location=' +coords.lat + '%2C' + coords.lon +
        '&radius=' + radius +
        '&type=' + type + 
        '&key=' + API_KEY

    //query the google api to get a list of nearby places
    let mainPromise = axios.get(url).then((res) =>{
        var places =  res.data.results
        var promises = []
        
        for(let i=0; i < 10; i++){
            //pick a local place at random
            let place = pickRandom(places)
            let placeId = place.place_id

            //get finer detail about it
            let url = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + placeId + '&key=' + API_KEY
            let questionPromise = axios.get(url).then((res) => {
                let placeDetails = res.data.result
                let placeName = placeDetails.name
                let data = pickRandom(allowedData)

                //populate the question with the right data
                if(data == 'rating'){
                    question = questionJson(`What is ${placeName}'s rating on Google?`, placeDetails[data], null, null)
                }
                else if(data == 'formatted_address'){
                    question = questionJson(`What is ${placeName}'s address?`, placeDetails[data], null, null)

                }
                else if(data == 'photos'){
                    let photoRef = placeDetails.photos[0].photo_reference
                    //gets an image bytearray from google's servers
                    question = getImage(photoRef).then((bytes) =>{
                        return questionJson(`Name this place:`, placeName, bytes, 'img')
                    })
                }
                else if(data =='reviews'){
                    //pick a review at random
                    let review = pickRandom(placeDetails.reviews).text
                    question = questionJson('What is this a review for?', placeName, review, 'text')
                }
                //generate question based on chosen data item
                return question;
            })
            promises.push(questionPromise)
        }

        //resolve all promises simultaneously
        return Promise.all(promises);
    }).catch((err) => {
        return err
    })

    return mainPromise
}


//picks a random element from an array
function pickRandom(array){
    var index = Math.floor(Math.random() * array.length)
    return array[index]
}

//returns a json question give question, answer and question type
//meta will hold any extra information that goes with the question
function questionJson(q, a,  meta, type){
    return {
        "question": q,
        "answer": a,
        "metadata": meta,
        "type": type
    }
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

//getImage('Aap_uEBbUsls1tpfNvRWLnMDoL1w3-BXRK-MLBuDXXX7vq-P_xfTm-F15K8NiSein2Q2vnxlF7RY20K9Ar_-JllQ0Q-IMINFkNkPw94s1vasfi1_i7v-TMn-S0CSTFhpdPojfyw6v7S8KuJnmL8m93PzpWy9YjR1SMby3iLjbW4griv0wO-j');
exports.generateQuiz = generateQuiz
exports.pickRandom = pickRandom
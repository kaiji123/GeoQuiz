const axios = require('axios')
const fs = require('fs')
const { resolve } = require('path')

const coords = {lat:'52.445071',lon:'-1.9374337'}
const radius = 10000
const type = 'cafe'
const API_KEY = 'AIzaSyChzAGrXXV8gklFuucKcuT_dY0lOg5Fd84'

//create a json file with selly oak data
function cacheSellyOld(){
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json' +
        '?location=' + coords.lat + '%2C' + coords.lon +
        '&radius=' + radius +
        '&type=' + type + 
        '&key=' + API_KEY

    let promises = [];

    let general = []
    let fine = {}
    let photos = {}

    let mainPromise = axios.get(url).then((res) =>{       
        let places = res.data.results

        places.forEach((place) => {;
            general.push(place)
            let placeId = place.place_id

            //get finer detail about chosen place
            let detailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json' + 
            '?placeid=' + placeId + 
            '&key=' + API_KEY
            //query the google api to get a list of nearby places
  
            let subPromise = axios.get(detailsUrl).then((details) =>{
                data = details.data.result
                return getImage(data.photos[0].photo_reference).then((photo) => {
                    return [placeId, place, data, photo]
                })
            }) 
            promises.push(subPromise) 
        })

        return Promise.all(promises)
    })
    mainPromise.then((data) => {
        data.forEach((placeData) =>{
            general.push(placeData[1])
            fine[placeData[0]] = placeData[2]
            photos[placeData[0]] = placeData[3]
        })
        console.log(fine)
        let json = {'general':general, 'fine': fine, 'photos': photos }

        return JSON.stringify(json)
    }).then((data) => [
        fs.writeFile('./selly.json', data, (err) => {
            console.log(err)
            return
        })
    ])
}   

function cacheSelly(){
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json' +
        '?location=' + coords.lat + '%2C' + coords.lon +
        '&radius=' + radius +
        '&type=' + type + 
        '&key=' + API_KEY

    let promises = [];
    let cache = {};

    axios.get(url).then((res) =>{       
        let places = res.data.results

        places.forEach((place) => {
            let placeId = place.place_id

            //get finer detail about chosen place
            let detailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json' + 
            '?placeid=' + placeId + 
            '&key=' + API_KEY

            //query the google api to get a list of nearby places
            let getDetails = axios.get(detailsUrl).then((details) =>{
                let data = details.data.result
                console.log(data)
                photoref = data.photos != null ? data.photos[0].photo_reference : null

                return getImage(photoref).then((photo) => {
                    return {
                        'id': placeId,
                        'data': data,
                        'photo': photo
                    }
                })
            })

            promises.push(getDetails) 
        })
        return Promise.all(promises)
        
        
    }).then((places) => {
        //console.log(places)
        //takke return places and save them as json
        places.forEach((place) =>{
            
            console.log(place.data.name)
            cache[place.id] = {
                'data' : place.data,
                'photo' : place.photo
            }
        })

        return JSON.stringify(cache)

    }).then((data) => {

        //write these to disk
        fs.writeFile('./selly.json', data, (err) => {
            if(err) console.log(err)
            return
        })
    })
}  

function getImage(ref){
    //check for null image references
    if(ref == null){
        return new Promise((resolve, reject) =>{
            resolve(null)
        })
    }
    else{
        //photo query
        let url = 'https://maps.googleapis.com/maps/api/place/photo' +
        '?maxwidth=400' +
        '&photo_reference=' + ref + 
        '&key=' + API_KEY

        return axios.get(url, {
            responseType: 'arraybuffer'
        }).then((res) =>{
            return Buffer.from(res.data, 'binary').toString('base64')
        }).catch((err) => {
            console.log('Error loading image!');  
        })                                   
    }
}
cacheSelly()
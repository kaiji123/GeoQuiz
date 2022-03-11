const axios = require('axios')
const fs = require('fs')

const coords = {lat:'52.445071',lon:'-1.9374337'}
const radius = 10000
const type = 'cafe'
const fields = ["rating", "vicinity", "photos", "reviews", "name"]
const API_KEY = 'AIzaSyChzAGrXXV8gklFuucKcuT_dY0lOg5Fd84'

function cacheSelly(){
    let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json' +
        '?location=' + coords.lat + '%2C' + coords.lon +
        '&radius=' + radius +
        '&type=' + type + 
        '&key=' + API_KEY

    let promises = [];
    //general place data, then fine data indexed by placeId

    let general = []
    let fine = {}

    let mainPromise = axios.get(url).then((res) =>{       
        let places = res.data.results

        places.forEach((place) => {;
            general.push(place)
            let placeId = place.place_id

            //get finer detail about chosen place
            let detailsUrl = 'https://maps.googleapis.com/maps/api/place/details/json' + 
            '?placeid=' + placeId + 
            '&key=' + API_KEY

            let subPromise = axios.get(detailsUrl).then((details) =>{
                data = details.data.result
                return [placeId, place, data]
            }) 
            promises.push(subPromise)
        })

        return Promise.all(promises)
    })
    mainPromise.then((data) => {
        data.forEach((placeData) =>{
            general.push(placeData[1])
            fine[placeData[0]] = placeData[2]
        })
        console.log(fine)
        let json = {'general':general, 'fine': fine}

        return JSON.stringify(json)
    }).then((data) => [
        fs.writeFile('./selly.json', data, (err) => {
            console.log(err)
            return
        })
    ])
}   

cacheSelly()
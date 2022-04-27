const fs = require('fs')
const pos = require('pos')

const QUIZ_LENGTH = 10

let allowedQTypes = ['rating', 'photos', 'reviews', 'reviews']
async function generateQuiz(){
    //places are indexed by place id
    let data = await fs.promises.readFile('./selly.json')
    let places = JSON.parse(data)
    
    let quiz = []

    for(let i = 0; i < QUIZ_LENGTH; i++){
        let placeId = pickRandom(Object.keys(places))
        let qtype = pickRandom(allowedQTypes)
        //make sure the place has the chosen data available
        while(places[placeId].data[qtype] == null){
            qtype = pickRandom(allowedQTypes)
        }
        

        //generate a new question (and copy places object to avoid conflicts)
        question = generateQuestion(placeId, Object.assign({}, places), qtype)
        quiz.push(question)
    }
    return quiz
}

//generate a question about a place object based on provided data index
function generateQuestion(placeId, places, type){
    let place = places[placeId]
    delete places[placeId]

    switch(type){
        case 'rating':
            return ratingsQuestion(place)
        case 'photos':
            return photoQuestion(place, places)
        case 'reviews':
            if (Math.random() < 0.5){
                return reviewQuestion(place, places)
            }
            else{
                return missingWordQuestion(place, places)
            }
    }

}

function ratingsQuestion(place){
    let question = `What is ${place.data.name}'s rating on Google?`
    let answer = place.data.rating
    
    let wrong = []
    for(let i = 0; i < 3; i++){
        let rating = (Math.floor(Math.random() * 30) / 10) + 2
        wrong.push(rating)
    }

    return questionJson(question, answer, wrong)
}

function photoQuestion(place, wrongPlaces){
    let question = 'What is this place?'
    let answer = place.data.name
    let photo = place.photo

    let rndPlaces = Object.values(randomObjects(wrongPlaces, 3))
    let wrong = rndPlaces.map(p => p.data.name)     //extract place name
    
    return questionJson(question, answer, wrong, photo, 'img')
}

function reviewQuestion(place, wrongPlaces){
    let question = 'What place is this a review for?'
    let answer = place.data.name
    let review = pickRandom(place.data.reviews).text

    let rndPlaces = Object.values(randomObjects(wrongPlaces, 3))
    let wrong = rndPlaces.map(p => p.data.name) //extract a random review
    
    return questionJson(question, answer, wrong, review, 'text')
}

function missingWordQuestion(place, wrongPlaces){
    //nouns and adjectives
    const allowedTags = ['NN', 'NNS', 'NNP', 'NNPS', 'JJ', 'JJR', 'JJS']
    const backupWords = ['Amazing!', 'nice', 'horrible,', 'staff', 'food', 'drink', 'Disappointing']  //in case we run out of random words
    const gap = '_____'

    let question = `What word is missing from this review for ${place.data.name}?`
    
    let review = pickRandom(place.data.reviews).text
    let lexedWords = new pos.Lexer().lex(review)
    let taggedWords = new pos.Tagger().tag(lexedWords)

    //filter words by allowed types
    let filteredWords = []
    taggedWords.forEach(w => {
        if(allowedTags.includes(w[1])){
            filteredWords.push(w[0])
        }
    })

    //pick a random word and remove it from the review (and filtered words)
    let missingWord = pickRandom(filteredWords)
    let filtIndex = filteredWords.indexOf(missingWord)
    filteredWords.splice(filtIndex, 1)

    let regex = new RegExp(missingWord)
    let reviewMeta =  review.replace(regex, gap)    //replace the word

    let wrong = []
    while(wrong.length < 3){
        let wrongAnswer;
        if(filteredWords.length > 0){
            wrongAnswer = pickRandom(filteredWords)
            let wi = filteredWords.indexOf(wrongAnswer)
            filteredWords.splice(wi, 1)
        }
        else{
            wrongAnswer = pickRandom(backupWords)
        }
        wrong.push(wrongAnswer)
    }

    return questionJson(question, missingWord, wrong, reviewMeta, 'text')
}

function pickRandom(array){
    let index = Math.floor(Math.random() * array.length)
    return array[index]
}

//picks random items from index JSON
function randomObjects(objects, n){
    let picked = []
    for(let i = 0; i < n; i++){
        let key = pickRandom(Object.keys(objects))
        picked.push(objects[key])
        delete objects[key]
    }

    return picked
}

//returns a question JSON object
function questionJson(question, answer, wrong, meta=null, type=null){
    return {
        "question": question,
        "answer": answer,
        "wrong": wrong,
        "metadata": meta,   //'img' or 'text'
        "type": type
    }
}

generateQuiz()

module.exports = {
    generateQuiz
}
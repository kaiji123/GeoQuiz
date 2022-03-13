var currentQuestion = 1;
var quizLength;
var score = 0;

//document ready function - run on page load
$(function(){
    //get client coordinates and generate a quiz for that location
    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            //get lat and lon coords and fetch a quiz
            var coords = {lat: position.coords.latitude, lon:position.coords.longitude};
            fetchQuiz(coords).then((data) => {
                if(data == []){
                    console.log('failed to load quiz');
                }else{
                    genQuizHtml(data);
                }
            });
        });
    }else{
        console.log('ERROR: Location services not available.');
    }
})

//fetch a quiz from the API
function fetchQuiz(coords){
    return fetch('/api/quiz',{
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify(coords),
    })
    .then((res) => res.json());
}

//takes a JSON quiz and generates html
function genQuizHtml(quiz){
    quizLength = quiz.length;
    questionHtml = [];
    quiz.forEach((q) =>{
        html  = '<h1 class="trialQuestion">' + q.question + '</h1>';
        
        if(q.type == 'text'){
            html += '<h3 class="trialQuestion">"' + q.metadata + '"</h3>';
        }
        else if(q.type == 'img'){
            var bytearray = q.metadata;
            html += '<img id="google-image" src="data:image/png;base64,' + bytearray + '" class="trialQuestion"></img><br>'
        }

        //put buttons in a random order
        var rightPos = Math.floor(Math.random() * 4);

        //keep track of used wrong answers
        var wi = 0;
        html += '<div id="buttons">';
        //add each question
        for(i = 0; i < 4; i++){
            if(i == rightPos){
                html += '<button class="trialQuestion" onclick="nextQuestion(this, true)">' + q.answer + '</button>';
            }
            else{
                html += '<button class="trialQuestion" onclick="nextQuestion(this, false)">'+q.wrong[wi]+'</button>'
                wi++;
            }
        }
        html += '</div>'
        questionHtml.push(html);
    })
    
    $('#quiz').html(questionHtml[0]);
}

function nextQuestion(el, right){
    //style element 
    if(right) {
        score++;
        $(el).addClass('right')
    }
    else{
        $(el).addClass('wrong')
    }

    setTimeout(function(){
        currentQuestion++;
        $('#quiz').html(questionHtml[currentQuestion - 1]);
        quizLength = 1
        if(currentQuestion > quizLength){
            alert(score + '/' + quizLength)
            //end of quiz processing
        
            //save score
            
            //redirect
        }
     }, 500)    //wait for half a second
    
}
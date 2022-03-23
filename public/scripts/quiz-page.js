var currentQuestion = 0;
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
        timeQuestion()
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
                html += '<button class="trialQuestion" id="rightanswer" onclick="nextQuestion(this, true)">' + q.answer + '</button>';
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
        $('#rightanswer').addClass('right')
    }
    //advance progress bar
    move()

    $('#timer').css('animation', "")
    
    setTimeout(function(){
        if(currentQuestion + 1 >= quizLength){
            finish(score);
        }
        else{
            currentQuestion++
            $('#quiz').html(questionHtml[currentQuestion]);
            
            timeQuestion();
            
            
            //elem.style.animation;
            
        }
     }, 500)    //wait for half a second
    
}

function finish(score){
    //end of quiz processing
    var percentage = (score / quizLength) * 100
    //save score
    if(sessionStorage.id != null){
        //send score to db
        fetch('/api/save-score',{
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({
                'score': score,
                'percentage': percentage,
                'id': sessionStorage.id
            })
        
        }).then((res) =>{
            //redirect
            window.location.href = '/score?score=' + score
        })
    }else{
        window.location.href = '/score?score=' + score
 
    }
}


//time your question 
function timeQuestion(){
    $('#timer').css('animation', "anim 5s linear forwards")
    //set 5s time out then it calls nextQuestion automatically
    setTimeout(nextQuestion, 5000)
}
function move() {
    var barWidth = $('#progress').width()
    var progressWidth = barWidth * ((currentQuestion + 1)/quizLength)
    $('#myBar').css('width', progressWidth + 'px')

}

/*
 function circle(){
     var progress =$(outer).width()
     var progressWidth = progress * ((currentQuestion + 1)/quizLength)
     $('circle').css('stroke-dashoffset', progressWidth + 'px')
 }
 */



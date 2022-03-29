var currentQuestion = 0;
var quizLength;
var quizHtml = []
var score = 0;

//constantly increasing timer
var timer = 0
var quizStarted = false

//document ready function - run on page load
$(function(){
    //start main loop
    window.requestAnimationFrame(loop)

    //get client coordinates and generate a quiz for that location
    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            //get lat and lon coords and fetch a quiz
            var coords = {lat: position.coords.latitude, lon:position.coords.longitude};
            fetchQuiz(coords).then((data) => {
                if(data == []){
                    console.log('Failed to load quiz');
                }
                else{
                    //generate markup for the quiz
                    quizLength = data.length
                    quizHtml = genQuizHtml(data);
                    
                    //start the quiz by rendering the first question
                    $('#quiz').html(quizHtml[0]);
                    $('#timer').css('animation', "anim 10s linear forwards")

                    quizStarted = true
                    
                }
            });
        });
    }
    else{
        console.log('ERROR: Location services not available.');
    }
})

//fetch a quiz from the API
async function fetchQuiz(coords){
    const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(coords),
    });
    return await res.json();
}

//takes a JSON quiz and generates html
function genQuizHtml(quiz){
    var htmlArray = [];

    quiz.forEach((q) =>{
        var html = '<h1 class="trialQuestion">' + q.question + '</h1>';
        
        //create content for special question types
        if(q.type == 'text'){
            html += '<h3 class="trialQuestion">"' + q.metadata + '"</h3>';
        }
        else if(q.type == 'img'){
            var bytearray = q.metadata;
            html += '<img id="google-image" src="data:image/png;base64,' + bytearray + '" class="trialQuestion"></img><br>'
        }

        //put buttons in a random order
        var rightPos = Math.floor(Math.random() * 4);

        //keeps track of position in wrong answer array
        var wi = 0;
        html += '<div id="buttons">';

        //add each question
        for(i = 0; i < 4; i++){
            if(i == rightPos){
                html += '<div class="answer-container">'
                    +       '<button class="trialQuestion" id="rightanswer" onclick="nextQuestion(this, true)">' + q.answer + '</button>' 
                    +       '<div class="tick-container">'
                    +           '<img class="tick" src="https://www.freepnglogos.com/uploads/tick-png/tick-mark-symbol-icon-26.png"/>' 
                    +       '</div>'
                    +   '</div>'
            }
            else{
                html+=  '<div class="answer-container">'
                    +       '<button class="trialQuestion" onclick="nextQuestion(this, false)">'+q.wrong[wi] + '</button>' 
                    +       '<div class="tick-container">'
                    +           '<img class="tick" src="https://www.downloadclipart.net/large/52728-wrong-cross-clipart.png"/>' 
                    +       '</div>'
                    +   '</div>'
                wi++;
            }
        }

        html += '</div>'
        htmlArray.push(html);
    })
    return htmlArray
}

//called when the user clicks an answer
function nextQuestion(el, right){
    //style element based on whether right answer clicked
    if(right) {
        score++;
        $(el).addClass('right')
        $(el).parent().find('.tick').toggle()
    }
    else{
        $(el).addClass('wrong')
        $(el).parent().find('.tick').toggle()

        $('#rightanswer').addClass('right')
        $('#rightanswer').parent().find('.tick').toggle()

    }
    
    //advance quiz progress bar
    advanceProgressBar()

    //stop timer animation
    $('#timer').css('animation', "")
    
    if(currentQuestion + 1 >= quizLength){
        finish(score);
    }
    else{
        setTimeout(() => {
            currentQuestion++
            $('#quiz').html(quizHtml[currentQuestion]);
            timer = 0
            $('#timer').css('animation', "anim 10s linear forwards")
        }, 2000)
    }  
}

//called when the quiz is finished
function finish(score){
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

//increases the width of the progress bar
function advanceProgressBar() {
    var barWidth = $('#progress-bar').width()
    var progressWidth = barWidth * ((currentQuestion + 1)/quizLength)
    $('#inner-bar').css('width', progressWidth + 'px')
}

/*
 function circle(){
     var progress =$(outer).width()
     var progressWidth = progress * ((currentQuestion + 1)/quizLength)
     $('circle').css('stroke-dashoffset', progressWidth + 'px')
 }
 */


//main quiz loop - deltaTime = how long the last loop took in ms
var deltaTime = 0
var start = 0;
var end = Date.now()

function loop() {
    //recalculate delta time
    start = Date.now();
    deltaTime = start - end;
    
    //code goes here
    timer += deltaTime

    if(timer > 10000 & quizStarted){
        nextQuestion()
        timer = 0
    }
    
    //loop end calculations
    end = Date.now()
    window.requestAnimationFrame(loop)
}

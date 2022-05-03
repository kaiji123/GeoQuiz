var currentQuestion = 0;
var quizLength;
var quizHtml = []
var score = 0;

//sound effects
var rightFX = new Audio('../sounds/right.wav');
var wrongFX = new Audio('../sounds/wrong.wav');

//emojis
var emojis = {
    'happy': '😁',
    'mid': '😥',
    'sad': '😭'
}

//constantly increasing timer
var timer = 0
var quizStarted = false

var debug = false


//register the event listener for keyboard
function register() {
    document.addEventListener('keydown', handleKey);
}


//handle keys for from 1 to 4
function handleKey(event){

    //get buttons
    var buttons = document.getElementById("buttons")   
    let children = buttons.childNodes

    //check the key and move to next question
    for(let i=0; i<4; i++){
        if (parseInt(event.key) == i+1){
            
            let isRight = children[i].id === "rightanswer"
          

            document.removeEventListener('keydown', handleKey);
            nextQuestion(children[i], isRight)

        }
    }
}

//document ready function - run on page load
$(function () {
    $('#mascot-sad img').hide();
    $('#mascot-happy img').hide();
    $('#mascot-meh img').hide();
    //enable debug for jack's user account
    if (sessionStorage.id == '106017767078900462768') {
        console.log('DEBUG MODE ON ')
        debug = true
    }
    if(debug){
        init()
        return
    }

    setTimeout(init, 3000)
    let countdown = 3
    $('#countdown').html(countdown)

    setInterval(() => {
        countdown--
        if (countdown > 0) $('#countdown').html(countdown)
    }, 1000)

})

function init() {
    
    //start main loop
    window.requestAnimationFrame(loop)

   
    //get client coordinates and generate a quiz for that location
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            //get lat and lon coords and fetch a quiz
            var coords = { lat: position.coords.latitude, lon: position.coords.longitude };
            fetchQuiz(coords).then((data) => {
                if (data == []) {
                    console.log('Failed to load quiz');
                }
                else {
                    //generate markup for the quiz
                    quizLength = data.length
                    quizHtml = genQuizHtml(data);

                    //start the quiz by rendering the first question
                    $('#quiz').html(quizHtml[0]);
                    $('#timer').css('animation', "anim 10s linear forwards")

                    quizStarted = true


                    //register buttons for the quiz
                    register();

                }
            });
        });
    }
    else {
        console.log('ERROR: Location services not available.');
    }
}
//fetch a quiz from the API
async function fetchQuiz(coords) {
    const res = await fetch(API_VERSION + '/quiz', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem("token") },
        body: JSON.stringify(coords),
    });
   
    return await res.json();
}

//takes a JSON quiz and generates html
function genQuizHtml(quiz) {
    console.log(quiz)
    var htmlArray = [];
    
    quiz.forEach((q) => {
        var html = '<h1 class="question">' + q.question + '</h1>';
        
        //create content for special question types
        if (q.type == 'text') {
            html += '<h3 class="review">"' + q.metadata + '"</h3>';
        }
        else if (q.type == 'img') {
            var bytearray = q.metadata;
            html += '<img id="google-image" src="data:image/png;base64,' + bytearray + '"></img><br>'
        }

        //put buttons in a random order
        var rightPos = Math.floor(Math.random() * 4);

        //keeps track of position in wrong answer array
        var wi = 0;
        html += '<div id="buttons">';
        //add each question
        for (i = 0; i < 4; i++) {
            console.log(q.answer)
            if (i == rightPos) {
                html += `
                    <div class="answer" id="rightanswer"  onclick="nextQuestion(this, true)">
                        <div class="answer-text" >
                            ${i+1}) ${q.answer}
                            <span class="tick">    ✔️</span>
                        </div>
                    </div>`
            }
            else {
                html += `
                <div class="answer" onclick="nextQuestion(this, false)">
                        <div class="answer-text">
                        ${i+1}) ${q.wrong[wi]}
                        <span class="tick">    ❌</span>
                    </div>
                </div>`
                wi++;
            }
        }

        html += '</div>'


        htmlArray.push(html);
    })
    localStorage.setItem('htmlArray', JSON.stringify(htmlArray));
    return htmlArray
}

function disableButtons(buttons){
    for(let i of buttons){
        i.onclick = function(){}
    }
}
//called when the user clicks an answer
function nextQuestion(el, right) {
    
    var buttons = document.getElementById("buttons").childNodes
    disableButtons(buttons)
    //style element based on whether right answer clicked
    if (right) {
        score++;
        $(el).addClass('right')
        $(el).find('.tick').css('visibility', 'visible')
        $('#mascot-happy img').show();
       // $('#mascot-sad img').hide();
        rightFX.play()
        

    }
    else {
        $(el).addClass('wrong')
        $(el).find('.tick').css('visibility', 'visible')

        $('#rightanswer').addClass('right')
        $('#rightanswer').find('.tick').css('visibility', 'visible')
        $('#mascot-sad img').show();
        wrongFX.play()
        

    }

    //advance quiz progress bar
    advanceProgressBar()

    //stop timer animation
    $('#timer').css('animation', "")

    setTimeout(() => {
        if (currentQuestion + 1 >= quizLength) {
            finish(score);
        }
        else {
            currentQuestion++
            $('#quiz').html(quizHtml[currentQuestion]);
            timer = 0
            $('#timer').css('animation', "anim 10s linear forwards")
            $('#mascot-happy img').hide();
            $('#mascot-sad img').hide();
            //register a new set of key listeners 
            register();
        }
    }, 2000)
}

//called when the quiz is finished
function finish(score) {
    var percentage = (score / quizLength) * 100

    //save score
    if (sessionStorage.id != null) {
        //send score to db
        fetch(API_VERSION + '/scores', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem("token") },
            body: JSON.stringify({
                'score': score,
                'percentage': percentage,
                'id': sessionStorage.id
            })

        }).then((res) => {
            //redirect
            window.location.href = '/score?score=' + score
            
        })
    } else {
        
        window.location.href = '/score?score=' + score
        

    }
}
//increases the width of the progress bar
function advanceProgressBar() {
    var barWidth = $('#progress-bar').width()
    var progressPercentage = (currentQuestion + 1) / quizLength
    var progressWidth = barWidth * (progressPercentage)
    $('#inner-bar').css('width', progressWidth + 'px')
    $('#emoji').css('margin-left', (progressPercentage * 100) + '%')

    var scorePercentage = score / (currentQuestion + 1)
    if (scorePercentage > 0.7) {
        $('#emoji').html(emojis.happy)
    }
    else if (scorePercentage <= 0.7 && scorePercentage > 0.3) {
        $('#emoji').html(emojis.mid)
    }
    else {
        $('#emoji').html(emojis.sad)

    }
}




//main quiz loop - deltaTime = how long the last loop took in ms
var deltaTime = 0
var start = 0;
var end = Date.now()

function loop() {
    //recalculate delta time
    start = Date.now();
    deltaTime = start - end;

    //code goes here
    if (!debug) {
        timer += deltaTime
    }

    if (timer > 10000 & quizStarted) {
        nextQuestion()
        timer = 0
    }

    //loop end calculations
    end = Date.now()
    window.requestAnimationFrame(loop)
}

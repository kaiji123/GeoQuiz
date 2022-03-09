var currentQuestion = 0;
var quizLength;

//takes a JSON quiz and generates html
function genQuizHtml(quiz){
    console.log(quiz);
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

        //add each question
        for(i = 0; i < 4; i++){
            if(i == rightPos){
                html += '<button class="trialQuestion" onclick="nextQuestion()">' + q.answer + '</button>';
            }
            else{
                html += '<button class="trialQuestion">'+q.wrong[wi]+'</button>'
                wi++;
            }
        }

        questionHtml.push(html);
    })

    $('#quiz').html(questionHtml[0]);
}

function nextQuestion(){
    currentQuestion++;
    $('#quiz').html(questionHtml[currentQuestion - 1]);

    if(currentQuestion > quizLength){
        console.log('well done');
    }
}

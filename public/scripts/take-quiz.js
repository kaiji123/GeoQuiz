var currentQuestion = 0;
var quizLength;

//takes a JSON quiz and generates html
function genQuizHtml(quiz){
    console.log(quiz);
    quizLength = quiz.length;
    questionHtml = [];
    quiz.forEach((q) =>{
        html  = '<h1>' + q.question + '</h1>';

        if(q.type == 'text'){
            html += '<h3>"' + q.metadata + '"</h3>';
        }
        else if(q.type == 'img'){
            var bytearray = q.metadata;
            html += '<img id="google-image" src="data:image/png;base64,' + bytearray + '"></img><br>'
        }
        html += '<button onclick="nextQuestion()">' + q.answer + '</button><br>';
        html += '<button>'+q.wrong[0]+'</button><br><button>'+q.wrong[1]+'</button><br><button>'+q.wrong[2]+'</button><br>'

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
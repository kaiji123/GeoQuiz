//document ready function - run on page load
$(function () {
    showQuizQuestions()
})

function showQuizQuestions(){
    var quizHTML = localStorage.getItem('htmlArray')
    //document.write(retrievedObject)
    document.getElementById("quizQuestions").innerHTML=quizHTML;
    localStorage.removeItem('htmlArray')
}
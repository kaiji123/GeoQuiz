//document ready function - run on page load
$(function () {
    showQuizQuestions()
})

function showQuizQuestions(){
    var quizHTML = JSON.parse(localStorage.getItem('htmlArray'))
    document.getElementById("quizQuestions").innerHTML=quizHTML

    localStorage.removeItem('htmlArray')
}
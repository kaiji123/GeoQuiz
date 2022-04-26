//document ready function - run on page load
$(function () {
    showQuizQuestions()
})

function showQuizQuestions(){
    var retrievedObject = localStorage.getItem('htmlArray');
    document.write(retrievedObject)
}
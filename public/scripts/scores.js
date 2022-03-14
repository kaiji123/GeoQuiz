$(function(){
    showScore();
})

//gets a user's most recent score and displays it
function showScore(){
    var queryString = window.location.search
    var score = new URLSearchParams(queryString).get("score")

    $('#score').html(score + '/10')
}
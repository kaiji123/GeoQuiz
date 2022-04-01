$(function(){
    showScore();
    startConfetti();
})

//gets a user's most recent score and displays it
function showScore(){
    var queryString = window.location.search
    var score = new URLSearchParams(queryString).get("score")

    $('#score').html(score + '/10')
}

function startConfetti(){
  
    var myCanvas = document.getElementById("my-canvas")
    console.log(myCanvas)
    var myConfetti = confetti.create(myCanvas, {
        resize: true,
        useWorker: true
      });
      myConfetti({
        particleCount: 100,
        spread: 160
        // any other options from the global
        // confetti function
      });
    console.log("start confetti")
    myConfetti()
}
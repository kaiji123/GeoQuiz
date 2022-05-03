//check if a user is logged in and display their name
function showUser(){
    
    //check if a user is logged in + set header to username
    if(sessionStorage.getItem("user") != null){
        window.onLoadCallback = function(){
            gapi.auth2.init({
                client_id: process.env.CLIENT_ID
                });
        }
        $('#username').append(sessionStorage.getItem("user").split(' ')[0]);    
    }
    else{
        $('#username').append('Guest');
    }   
}

function showClientLocation(){
    //check gelocation is available
    if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            //get lat and lon coords
            var coords = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };  
            //create new POST request to location api using fetch (at the moment it just bounces back data)
            fetch(API_VERSION +'/location',{
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem("token") },
                body: JSON.stringify(coords)
            })
            .then(res => res.json())
            .then(data => {
                    $('#location').append(data.city)
                }
            );
        });
    } else {
        console.log('Location services not availabe');
        return null;
    }
}

//set the user's gdpr status
function acceptGDPR(){
    fetch(API_VERSION +'/gdpr', {
        method: 'PUT',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem("token") },
        body: JSON.stringify({
            'id': sessionStorage.getItem('id')
        })
    })
    .then((res) => {
        sessionStorage.setItem('gdpr', 1)   //don't bother the user again even if db fails
        toggleGDPR()
    });
}

function toggleGDPR(){
    $('.popup').toggle()  
}

//run on document load
$(function(){
    getTextSize();
    showUser();
    showClientLocation();
       
    //check if user has signed gdpr
    if(sessionStorage.getItem('gdpr') == 0){
        toggleGDPR();
    }

})

function setTextSize(size){
    sessionStorage.setItem("size", size);
    document.body.style.fontSize = size + "%";

}

function getTextSize(){
    let size = sessionStorage.getItem("size");
    document.body.style.fontSize = size + "%"; 
}


//Some random colors
const colors = ["#FFFFFF", "#2AA7FF", "#9980FF", "#FCBC0F", "#F85F36"];

const numBalls = 60;
const balls = [];

for (let i = 0; i < numBalls; i++) {
  //var ball = document.getElementsByClassName("ball");
  let ball = document.createElement("div");
  ball.classList.add("ball");
  ball.style.background = colors[Math.floor(Math.random() * colors.length)];
  ball.style.left = `${Math.floor(Math.random() * 100)}vw`;
  ball.style.top = `${Math.floor(Math.random() * 100)}vh`;
  ball.style.transform = `scale(${Math.random()})`;
  ball.style.width = `${Math.random()}em`;
  ball.style.height = ball.style.width;
  
  balls.push(ball);
  document.body.append(ball);
}



// Keyframes
balls.forEach((el, i, ra) => {
  let to = {
    x: Math.random() * (i % 2 === 0 ? -11 : 11),
    y: Math.random() * 12
  };

  let anim = el.animate(
    [
      { transform: "translate(0, 0)" },
      { transform: `translate(${to.x}rem, ${to.y}rem)` }
    ],
    {
      duration: (Math.random() + 1) * 2000, // random duration
      direction: "alternate",
      fill: "both",
      iterations: Infinity,
      easing: "ease-in-out"
    }
  );
});
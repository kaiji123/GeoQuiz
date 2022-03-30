
//show leaderboard table in homepage
function showRank(){
    //create GET request to /api/top5 to get top 5 users in homepage
    fetch('/api/leaderboard',{
    method: 'GET',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    
    })
    .then(res => res.json())
    .then(data => {  
      
        for (let i =0 ;i < data.length; i ++){
        
            if (data[i].name == sessionStorage.getItem('user')){
                $('#rank').append((i+1))
            }
        }

        }
    );
}


$(function(){
    showRank();  
})
//run on document load
$(function(){
    getUsername();
    showRank()
    registerDelete();

    $('#profile-pic').attr('src', '/api/profile-picture/' + sessionStorage.id)
    $('#get-new-pfp').click(function(){
        resetProfilePic()
    })
})

//displays the username
function getUsername(){
    if (sessionStorage.getItem('user')){
        let user = sessionStorage.getItem("user").split(' ')[0]
        $('#username').append(`${user}'s profile`)
    }else{
        $('#username').append("Guest"); 
    }      
}

function registerDelete(){
    $('#delete').click(function(){
        let id = sessionStorage.getItem('id')
        deleteUser(id).then(res => {
            if (res.status != 403 && res.status != 401){
                signOut()
            }
           
        })
    })
}

function resetProfilePic(){
    fetch('/api/reset-pfp',{
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'id': sessionStorage.getItem('id')
        })
    })
    .then(res => {
        if(res.status = 200){
            $('#profile-pic').attr('src', '/api/profile-picture/' + sessionStorage.id + '?t=' + new Date().getTime())
            $('#profile').attr('src', '/api/profile-picture/' + sessionStorage.id + '?t=' + new Date().getTime())

        }
        else{
            return 
        }
    })
}

//show leaderboard table in homepage
function showRank(){
    //create GET request to /api/top5 to get top 5 users in homepage
    fetch('/api/leaderboard',{
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => {  
        let user = sessionStorage.getItem('user')
        let index = -1;

        let lbEntry = data.find((item, i) =>{
            if(item.name === user){
                index = i
                return item
            }
        })

        let rank = index + 1
        let score = lbEntry.total
        $('#rank').html(`Global ranking: ${rank}<br>Total score: ${score}`)
    });
}

async function deleteUser(id){
    const token = sessionStorage.getItem("token")
    
    const res = await fetch('/api/users', {
        method: 'Delete',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json','Authorization': 'Bearer '+ token },
        body: JSON.stringify({
            'id': id,
        })
    })

    return res
}

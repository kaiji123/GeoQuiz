//displays the username
function getUsername(){
    if (sessionStorage.getItem('user')){
        $('#username').append(sessionStorage.getItem("user").split(' ')[0]);
    }else{
        $('#username').append("Guest");
      
    }
        
}

function registerDelete(){
    $('#delete').click(function(){
        let id = sessionStorage.getItem('id')
        deleteUser(id).then(res => signOut())
        
       
    })
}


async function deleteUser(id){
    const token = sessionStorage.getItem("token")
    
    const res = await fetch('/api/users', {
        method: 'Delete',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': 'Bearer '+token },
        body: JSON.stringify({
            'id': id,
        })
    })

    return res
}
//run on document load
$(function(){
    getUsername();
    registerDelete();
})
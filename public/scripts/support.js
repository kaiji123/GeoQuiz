function sendSupport(){
    var email = $('#email').val()
    var query = $('#query').val()
    if(email == '' || query == ''){
        return 
    }
    
    var json = {
        'email': email,
        'query': query
    }

    fetch(API_VERSION +'/support',{
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json','Authorization': 'Bearer '+ sessionStorage.getItem("token") },
        body: JSON.stringify(json),
    })
    .then((res) => {
        $('#form').html('<h1>Thank you for your query!</h1>')
    })
}

$(function(){
    $('#submit').click(() =>{
        sendSupport()
    })
})

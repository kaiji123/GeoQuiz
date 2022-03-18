function sendSupport(){
    var email = $('#email').val()
    var query = $('#query').val()
    
    var json = {
        'email': email,
        'query': query
    }

    fetch('/api/support',{
        method: 'POST',
        headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
        body: JSON.stringify(json),
    })
    .then((res) => res.json())
    .then((json) => console.log(json))
}

$(function(){
    $('#submit').click(() =>{
        sendSupport()
    })
})

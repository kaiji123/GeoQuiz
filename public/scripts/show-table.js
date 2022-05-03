//show leaderboard table in homepage
function showTable(){
    //create GET request to /api/v1/top5 to get top 5 users in homepage
    fetch(API_VERSION +'/leaderboard',{
    method: 'GET',
    headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
    
    })
    .then(res => res.json())
    .then(data => {  
        data = data.slice(0,5)

        var content = "<table><tr><th>Rank</th><th>Name</th><th>Total</th></tr>"
        let i = 1
        for (const [key, value] of Object.entries(data)) {
            content += '<tr><td>' + i +'</td>' +'<td>'+ value.name + '</td>'+ '<td>'+ value.total + '</td>' + '</tr>';
            i++
        }
        content += "</table>"
            $('#leaderboard').append(content)
        }
    );
}


$(function(){
    showTable();
})
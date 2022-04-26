//run on document load
$(function(){
    getScores()
})



function show(data)
{
    //preprocess total data
    let userid = sessionStorage.getItem("id")
    console.log(userid)
    total = 0 
    let perfect_total= 0
    for (let i = 0 ; i < data.length; i++){
        if (data[i].userId === userid){
            total = total + data[i].score
            console.log(data[i].score)
            if (data[i].score === 10){

                perfect_total = perfect_total +1 
            }
        }
    }
    console.log("this is my total"  + total)
    console.log("perfect " +perfect_total)

    let scores = [1,5,10,15,20,25,30,40,60,100]
    
    let container = document.getElementById("achievements")
    scores.forEach(data => {
        let div= document.createElement("div")
        let text = document.createElement("p")
        text.innerHTML = "Achieve "+ data + " points"
        div.appendChild(text)
        if (total >= data){
            div.className = "achieved"
        }
        else
        {
            div.className = "not-achieved"
        }
        container.appendChild(div)
    })

    let perfects = [1,3,10,20,30]
    perfects.forEach(data => {
        let div= document.createElement("div")
        let text = document.createElement("p")
        text.innerHTML = "Had "+ data + " perfect games"
        div.appendChild(text)
        if (perfect_total >= data){
            div.className = "achieved"
        }
        else
        {
            div.className = "not-achieved"
        }
        container.appendChild(div)
    })

   



    
}


async function getScores(){
    const token = sessionStorage.getItem("token")
    
    const res = await fetch(API_VERSION + '/scores', {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json','Authorization': 'Bearer '+ token }
    })
    let data = await res.json()


    show(data)
    
    return res
}

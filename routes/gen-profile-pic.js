const {createCanvas} = require('canvas')
const fs = require('fs')

function generateProfilePicture(res){
    //generate 3*6 then mirror
    let color = randomColor()
    let img = [];

    //for each column:
    for(y = 0; y < res; y++){
        let row = []

        let half = []
        for(x = 0; x < res/2; x++){
            fill = (Math.random() * 100) > 50 ? true : false
            half.push(fill)
        }

        //append normal and reversed row for symmetry
        row = row.concat(half)
        half.reverse();
        row = row.concat(half)
        img.push(row)
    }
    saveImg(img, 600)
}

//image pixels and image size
function saveImg(img, size){
    //create a new render context
    const canvas = createCanvas(size, size)
    const ctx = canvas.getContext('2d')

    //calculate pixel res and tilesize
    let res = img.length
    let tileSize = size / res
    let color = randomColor();

    for(y = 0; y < res; y++){
        let line = '';
        for(x = 0; x < res; x++){
            if(img[y][x]){
                ctx.fillStyle = color
                
            }
            else{
                ctx.fillStyle = '#fff'
            }
            ctx.fillRect((x*tileSize), (y*tileSize), tileSize, tileSize)
        }
    }

    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync('./image.png', buffer)
}

function randomColor(){
    let r = Math.floor((Math.random() * 255)).toString(16)
    let g = Math.floor((Math.random() * 255)).toString(16)
    let b = Math.floor((Math.random() * 255)).toString(16)
    
    //very quick darkening
    let tooLight = 250;
    if(r > tooLight && g > tooLight && b > tooLight){
        r = 0
    }

    return '#' + r + g + b;
}


generateProfilePicture(8)
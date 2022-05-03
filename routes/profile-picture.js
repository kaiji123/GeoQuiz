const {createCanvas} = require('canvas')
const fs = require('fs')

const DEFAULT_RES = 8

function generateProfilePicture(res = DEFAULT_RES){
    //generate 3*6 then mirror
    let colour = randomColour()
    let img = {'colour': colour, 'pixels':[]};

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
        img.pixels.push(row)
    }
    return img
}

//image pixels and image size
function renderProfilePicture(img, size=500){
    //create a new render context
    const canvas = createCanvas(size, size)
    const ctx = canvas.getContext('2d')

    //calculate pixel res and tilesize
    let res = img.pixels.length
    let tileSize = size / res
    let colour = img.colour;

    for(y = 0; y < res; y++){
        for(x = 0; x < res; x++){
            if(img.pixels[y][x]){
                ctx.fillStyle = colour 
            }
            else{
                ctx.fillStyle = '#ffffff'
            }
            ctx.fillRect((x*tileSize), (y*tileSize), tileSize + 1, tileSize + 1)
        }
    }

    //var buffer = canvas.toBuffer('image/png')
    //fs.writeFileSync('./image.png', buffer)

    const data = canvas.toBuffer('image/png')
    return data
}

function randomColour(){
    let r = Math.floor((Math.random() * 255)).toString(16)
    let g = Math.floor((Math.random() * 255)).toString(16)
    let b = Math.floor((Math.random() * 255)).toString(16)
    
    //very quick darkening
    let tooLight = 200;
    if(r > tooLight && g > tooLight && b > tooLight){
        r = '00'
    }

    r = r.padStart(2, '0')
    g = g.padStart(2, '0')
    b = b.padStart(2, '0')
    console.log(r + ',' + g + ',' + b)
    return '#' + r + g + b;
}

module.exports ={
    generateProfilePicture,
    renderProfilePicture, 
    randomColour
}
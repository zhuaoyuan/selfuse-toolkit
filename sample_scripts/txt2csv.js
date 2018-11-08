const readline = require('readline');
const fs = require('fs');
const os = require('os');

let fReadName = './a.txt';
let fRead = fs.createReadStream(fReadName);
let name_array = [];
let size = 0;
let index = 0;


let objReadline = readline.createInterface({
    input: fRead
});



objReadline.on('line', function (line) {
    let x = line.split(/\s+/);
    console.log(x)
    let newline = x[0]+'\t'+x[1]+'\t'+x[2]+'\n';
    fs.appendFile('b.csv',newline,function () {

    });
});

objReadline.on('close', function () {

});




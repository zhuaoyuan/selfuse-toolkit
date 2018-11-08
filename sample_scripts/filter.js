const XLSX = require('xlsx');
const readline = require('readline');
const fs = require('fs');
let fReadName = './filenames.txt';

// column names
let index_array = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','AY','AZ','BA','BB','BC','BD','BE','BF','BG','BH','BI','BJ','BK','BL','BM','BN','BO','BP','BQ','BR','BS','BT','BU'];
let fRead = fs.createReadStream(fReadName);
let objReadline = readline.createInterface({
    input: fRead,
});

let ws_data = [
    // labels
    []
];
objReadline.on('line', function (line) {

    let workbook = XLSX.readFile(line);
    for(let j = 2;; j++ ) {
        // conditions
        if(workbook.Sheets.sheet1['A'+j] != undefined){
            if(workbook.Sheets.sheet1['J'+j].v == 'target'){
                let row = []
                for(let i in index_array){
                    row.push(workbook.Sheets.sheet1[index_array[i]+j].v)
                }
                ws_data.push(row)
            }
        } else {
            console.log(line);
            break;
        }
    }
});

objReadline.on('close', ()=>{
    let wb = XLSX.utils.book_new();

    let ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'sheet');

    XLSX.writeFile(wb, './summary.xlsx', {})
});



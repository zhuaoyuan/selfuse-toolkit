const Excel = require('exceljs');
let f = []    ;

let labelArray = ["id",
    "apiName",
    "scopeName",
    "catId",
    "apiDesc",
    "usageScenarios",
    "codeExample",
    "status",
    "extension1",
    "extension2",
    "extension3",
    "extension4",
    "bigExtension1",
    "bigExtension2",
    "createdAt",
    "updatedAt",
    "creatorId",
    "creatorName",
    "requestCodeExample"];


let workbook = new Excel.Workbook();
workbook.views = [
    {
        x: 0, y: 0, width: 10000, height: 20000,
        firstSheet: 0, activeTab: 1, visibility: 'visible'
    }
];
let sheet = workbook.addWorksheet('phoebe');
sheet.addRow(labelArray);
for(let i = 0; i < f.length; i++){
    let rowArray = [];
    // for(let key in f[i]){
    //     rowArray.push(f[i][key]);
    // }
    console.log(f[i]);
    for(let j = 0; j < labelArray.length; j++) {
        rowArray.push(f[i][labelArray[j]]);
    }
    sheet.addRow(rowArray);
}




workbook.xlsx.writeFile('./docs.xlsx')
    .then(function () {
        console.log('docs.xlsx generated.');
    });


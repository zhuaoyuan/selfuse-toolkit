const dateFormat = require('dateformat');
let today = new Date();
let yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);


let MONTHS =
    ['Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec'
    ];

let date2Str = function(date){
    let month = MONTHS[date.getMonth()];
    let day = dateFormat(date, "d");
    let year = dateFormat(date, "yyyy");
    return month + ' ' + day + ', ' + year;
};

let getDate = function(index){
    let day = new Date();
    day.setDate(today.getDate() + index);
    return day;
};

module.exports= {
    date2Str : date2Str,
    yesterday :yesterday,
    today : today,
    dateFormat : dateFormat,
    getDate : getDate
};
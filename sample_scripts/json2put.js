let test = '{"mallId":7739179, "shippingId":205, "branchCode":"123890", "quantity":100, "operateType":6, "type":0, "operatorId":"3", "operatorName":"操作员", "uniqueCode":21313123112}';
let jsonStr = '{"interfaceName":"BATCH_FETCH_WAYBILL_CODE", "batchFetchWayBillRequest":{ "mallId":7739179, "wpCode":"STO", "sender":{ "address":{ "province":"江苏省", "city":"南京市", "district":"栖霞区", "detail":"565" }, "name":"xxx", "mobile":"13012345678" }, "fetchWayBillRequestList":[{ "templateUrl":"url", "packageInfoDTO":{ "itemDTOS":[{ "goodName":"gn", "count":1 }] }, "requestID":"1234", "userID":1234, "orderInfoDTO":{ "bizIDLists":["121331312411131"], "orderChannelsTy":"PDD" }, "recipient":{ "address":{ "province":"北京市", "city":"北京市", "district":"东城区", "detail":"HZ" }, "name":"xxx", "mobile":"13012345678" } }]}}';
let obj = JSON.parse(jsonStr);
let result = 'Map<String, Object> body = new HashMap<String, Object>();\n';
let index = 0;

let newName = function () {
    return 'name_' + (++index);
};

let putGen = function(name, obj){

    if(Object.prototype.toString.call(obj) == '[object String]'){
        return ('String ' + name + ' ="' + obj +'";\n')
    }

    let result = 'Map<String, Object> '+name+' = new HashMap<String, Object>();\n';

    for(let i in obj){
        console.log(i + ' ' +name)
        console.log(Object.prototype.toString.call(obj[i]))

        if(Object.prototype.toString.call(obj[i]) == '[object Number]'){
            result += (name + '.put("' + i + '", "'+obj[i]+'");\n');
        }

        if(Object.prototype.toString.call(obj[i]) == '[object String]'){
            result += (name + '.put("' + i + '", "'+obj[i]+'");\n');
        }

        if(Object.prototype.toString.call(obj[i]) == '[object Array]'){
            let listName = newName();
            result += ('List<Object> ' + listName + '= new ArrayList<Object>();\n');
            for(let j in obj[i]) {
                let objName = newName();
                result += putGen(objName, obj[i][j]);
                result += (listName + '.add(' +objName+');\n');
            }
            result += (name + '.put("' + i + '", '+listName+');\n');
        }

        if(Object.prototype.toString.call(obj[i]) == '[object Object]'){
            let objName = newName();
            result += putGen(objName, obj[i]);
            result += (name + '.put("' + i + '", '+objName+');\n');
        }
    }
    return result;
}

console.log(putGen('body', JSON.parse(jsonStr)));


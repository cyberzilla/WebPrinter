function WebPrinter(sUrl, sApi,sCommand,callback){
    var sData;
    sUrl = sUrl[sUrl.length -1]!=="/"?sUrl+"/":sUrl;
    $.ajax({
        url: sUrl+sCommand,
        beforeSend: function(xhr){
            xhr.setRequestHeader("key", sApi);
        },
        crossOrigin:true,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        success: function (data, textStatus, jqXHR ) {
            callback(data);
        },
        error: function(jqXHR,textStatus,errorThrown){
            if (jqXHR.responseJSON === undefined){
                callback({webprinter:{code:jqXHR.status,status:textStatus,description:(jqXHR.status!==0?jqXHR.statusText:"Server is not responding or Insecure content requests has been blocked by browser")}});
            }else{
                callback(jqXHR.responseJSON);
            }
        }
    });
}

function stringToHex(str) {
    var hex = '';
    for (var i = 0; i < tmp.length; i++) {
        hex += (str.charCodeAt(i)).toString(16);
    }
    return hex;
}

function hexToString(hex) {
    var arr = hex.match(/.{1,2}/g),
        str = '';
    for (var i=0; i < arr.length; i++) {
        str += String.fromCharCode(parseInt(arr[i], 16));
    }
    return str;
}

function isIE(){
    var ua = window.navigator.userAgent;
    return ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0
}
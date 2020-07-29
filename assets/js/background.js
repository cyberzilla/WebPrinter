chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method === "getData"){
        var webPrinterData = findData({key:request.key,param:'apiStatus',find:'active'});
        if (webPrinterData!==null){
            sendResponse ({data: webPrinterData});
        }else{
            sendResponse ({data: false});
        }
    }else
    {
        sendResponse({data: false});
    }
});

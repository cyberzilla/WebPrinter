$(window).on("message", function(e) {
	chrome.runtime.sendMessage({method: "getData",key:"WebPrinter"}, function(response) {
		if (response.data!==null || true){
			var	resData = response.data,
				command = e.originalEvent.data,
				arrWebUrl = (resData.webAppUrl).split(";"),
				serverUrl = resData.serverUrl;
			if (arrWebUrl.includes(e.originalEvent.origin)){
				var decode 	= (hexToString(resData.apiKey)).split("|"),
					sApi	= decode[0],
					sIP		= decode[1],
					sPort	= decode[2],
					accessUrl = (serverUrl!==undefined && serverUrl!=="")?serverUrl : "http://"+sIP+":"+sPort;

				switch (command.webPrinter){
					case "print":
						var doc = (atob(command.base64)).split("|");
						var toast = $.toast({
							heading:'Web Printer',
							icon: 'printing',
							text: "Printing Document...",
							position: 'top-right',
							hideAfter: false,
							allowToastClose: false,
							width:"200px"
						});
						WebPrinter(accessUrl, sApi,command.base64,function (res) {
							if (res.webprinter.code===200){
								if (res.webprinter.description==="Done"){
									toast.update({
										heading: 'Web Printer',
										text: 'Document successfully printed!',//'Document '+doc[1]+' successfully printed',
										allowToastClose: true,
										hideAfter: 2000,
										loader: false,
										canAutoHide:true
									});
								}else{
									toast.update({
										heading: 'Document Printing',
										text: res.webprinter.description+doc[1]+"...",
									});
								}
							}else{
								toast.reset();
								$.toast({
									heading: 'Server Problem',
									icon: 'error',
									text: res.webprinter.description,
									position: 'top-right',
									hideAfter: false
								});
							}
						});

						break;

					default:
						WebPrinter(accessUrl, sApi,command.webPrinter,function (res) {
							var template;
							switch (command.webPrinter){
								case "author":
									if(res.webprinter.code===200){
										template = '<b>'+res.webprinter.content.author+'</b>\n<a href="mailto:'+res.webprinter.content.email+'">'+res.webprinter.content.email+'</a>\n<a href="'+res.webprinter.content.website+'">'+res.webprinter.content.website+'</a>';
										$.toast({
											heading: 'WebPrinter Author',
											icon: 'info',
											text: template ,
											position: 'top-right',
											hideAfter: false
										});
									}else{
										$.toast({
											heading: 'Server Problem',
											icon: 'error',
											text: res.webprinter.description,
											position: 'top-right',
											hideAfter: false
										});
									}
									break;

								case "serverinfo":
									if(res.webprinter.code===200){
										template = 'AppName: '+res.webprinter.content.appname+'<b></b><br>Version\t\t: <b>'+res.webprinter.content.version+'</b><br>License\t\t: <b>'+res.webprinter.content.license+'</b>';
										$.toast({
											heading: 'Server Info',
											icon: 'info',
											text: template,
											position: 'top-right',
											hideAfter: false
										});
									}else{
										$.toast({
											heading: 'Server Problem',
											icon: 'error',
											text: res.webprinter.description,
											position: 'top-right',
											hideAfter: false
										});
									}
									break;

								case "licensestatus":
									if(res.webprinter.code===200){
										template = 'License\t\t: <b>'+res.webprinter.content.license+'</b><br>Limit\t\t: <b>'+res.webprinter.content.limit+'</b><br>Remaining\t\t: <b>'+res.webprinter.content.remaining+'</b>\n';
										$.toast({
											heading: 'License Status',
											icon: 'info',
											text: template,
											position: 'top-right',
											hideAfter: false
										});
									}else{
										$.toast({
											heading: 'Server Problem',
											icon: 'error',
											text: res.webprinter.description,
											position: 'top-right',
											hideAfter: false
										});
									}
									break;

								case "printerlist":
									if(res.webprinter.code===200){
										var printerlist="";
										$.each(res.webprinter.content.printerlist,function(i,item){
											printerlist += '<li>'+item+'</li>';
										});
										template = '<ol>'+printerlist+'</ol>';
										$.toast({
											heading: 'Printer List',
											icon: 'info',
											text: template,
											position: 'top-right',
											hideAfter: false
										});
									}else{
										$.toast({
											heading: 'Server Problem',
											icon: 'error',
											text: res.webprinter.description,
											position: 'top-right',
											hideAfter: false
										});
									}
									break;

								default:
									if(res.webprinter.code===200){
										if ((command.webPrinter).substring(0,8)==="clearJob"){
											$.toast({
												icon: 'success',
												text: res.webprinter.description,
												position: 'top-right'
											});
										}else{
											$.toast({
												icon: 'success',
												text: "Load data success",
												position: 'top-right'
											});
										}
									}else{
										$.toast({
											heading: 'Server Problem',
											icon: 'error',
											text: res.webprinter.description,
											position: 'top-right',
											hideAfter: false
										});
									}
									break;
							}
						});
				}
			}
		}
	});

});
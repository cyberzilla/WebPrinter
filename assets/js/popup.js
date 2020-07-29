function loadSetting(){
	var decode,
		checkdata = getData({key:'WebPrinter'});
	if (checkdata !== null){
		if (checkdata.length!==0){
			decode = (hexToString(checkdata[0].apiKey)).split("|")
			$("#apiKey").val(checkdata[0].apiKey);
			$("#webAppUrl").val(checkdata[0].webAppUrl);
			$("#serverIP").val(decode[1]);
			$("#serverPort").val(decode[2]);
			$("#serverUrl").val(checkdata[0].serverUrl);
		}
	}
}

function validateForm(){
	if($("#apiKey").val() !=="" && $("#webAppUrl").val()!==""){
		$("#checkButton").attr("disabled",false).removeClass("bt-disabled").addClass("bt-success");
	}else{
		$("#checkButton").attr("disabled",true).removeClass("bt-success").addClass("bt-disabled");
	}
}

function tableRender(){
	var decode,
		rowRender,
		checkdata = getData({key:'WebPrinter'}),
		checkPopup = getData({key:'WebPrinterSetting'});
	if (checkdata !== null){
		if (checkdata.length!==0){
			$.each(checkdata,function (index,item) {
				decode = (hexToString(item.apiKey)).split("|");
				var check = item.apiStatus==="active"?"checked":"",
					checkStatus = '<div class="pretty p-switch p-fill">\n' +
						'        <input type="radio" name="apiStatus" data-api="'+item.apiKey+'" '+check+'/>\n' +
						'        <div class="state p-success">\n' +
						'            <label></label>\n' +
						'        </div>\n' +
						'    </div>';
				rowRender += '<tr><td><a title="Click To Delete!" class="setDeleter" data-api="'+item.apiKey+'" style="cursor: pointer;">'+decode[3]+'</a></td><td>'+decode[1]+':'+decode[2]+'</td><td class="text-center">'+checkStatus+'</td></tr>';
			});

			$(".table .apiList").html(rowRender);

			if(checkPopup!==null){
				$("#showPopup").prop("checked",checkPopup[0].showPopup);
			}else{
				$("#showPopup").prop("checked",false);
			}

			$("input[name=apiStatus]").click(function(){
				var decode = (hexToString($(this).data("api"))).split("|");
				updateData({key:'WebPrinter',findParam: 'apiStatus', setParam: 'apiStatus', find: 'active', setValue: ""});
				updateData({key:'WebPrinter',findParam: 'apiKey', setParam: 'apiStatus', find: $(this).data("api"), setValue: "active"});
				$.toast({
					icon: 'success',
					text: "Pointing to "+decode[1]+':'+decode[2]+" successfully",
					position: 'top-right'
				});
			});
		}else{
			$(".table .apiList").html("<tr><td colspan='3' class='text-center text-italic'>~ No Data ~</td></tr>");
		}
	}else{
		$(".table .apiList").html("<tr><td colspan='3' class='text-center text-italic'>~ No Data ~</td></tr>");
	}

	$(".setDeleter").click(function () {
		var decode = (hexToString($(this).attr("data-api"))).split("|");
		$("#delApiKey").attr("disabled",false).removeClass("bt-disabled").addClass("bt-error").attr("data-api",$(this).attr("data-api"));
		$.toast({
			icon: 'success',
			text: "Selected " +decode[3]+" on "+decode[1]+":"+decode[2],
			position: 'top-right'
		});
	});
}

function resetForm(){
	$("#checkButton,#saveButton,#delApiKey").attr("class","bt").addClass("bt-disabled").attr("disabled",true);
	$("#frmAddApi")[0].reset();
}

$(function(){
	tableRender();
	resetForm();
	//Tab Action
	$(".tablinks").click(function (e) {
		$(".tablinks").removeClass("active");
		$(this).addClass("active");
		$(".tabcontent").removeClass("active").hide();
		$(".tabcontent"+$(this).attr("tab-href")).addClass("active").show();
	});

	$(".viewApi .box-body").slimScroll({
		height: '312px',
		// height: '246px',
		size: '5px',
		railVisible: true,
		railColor: '#222',
		railOpacity: 0.3,
		wheelStep: 10,
	});

	var $select = $("#webAppUrl").selectize({
		plugins: ['remove_button'],
		delimiter: ';',
		persist: false,
		create: function(input) {
			var pattern = new RegExp('^https?:\\/\\/(www\\.)?[a-zA-Z0-9._-]{1,256}\\.[a-zA-Z0-9]{1,6}'),
				pass 	= pattern.test(input),
				root	= "";
				if(pass){
					root = input.split("/");
					return {
						value: root[0]+"//"+root[2],
						text: root[0]+"//"+root[2]
					}
				}else{
					return false;
				}
		}
	});

	//Button Disabled
	$("#apiKey,#webAppUrl").on("keyup change paste keypress",function (e) {
		validateForm();
	});

	$("#addApiKey").click(function () {
		var webAppUrl = $select[0].selectize;
		$(".viewApi").hide();
		$(".addApi").show();
		resetForm();
		webAppUrl.clear();
	});

	$("#delApiKey").click(function () {
		var $this = this,
			api   = $($this).attr("data-api"),
			decode= (hexToString(api)).split("|");
		$.toast({
			heading: 'Delete Api Key',
			icon: 'confirm',
			hideAfter: false,
			allowToastClose: false,
			confirm:true,
			text:'Are you sure to delete api key of '+decode[3]+' on '+decode[1]+':'+decode[2],
			position: 'top-right',
			confirmLabelOk:'Delete',
			stack: false,
			confirmCancel:function(){
				$($this).attr("disabled",true).removeClass("bt-error").addClass("bt-disabled").attr("data-api","");
			},
			confirmOk:function () {
				deleteData({key:'WebPrinter',param:'apiKey',find:api});
				$($this).attr("disabled",true).removeClass("bt-error").addClass("bt-disabled").attr("data-api","");
				$.toast({
					icon: 'success',
					text: "Api key successfully deleted",
					position: 'top-right'
				});
				tableRender();
			}
		});
	});

	$("#backList").click(function () {
		$(".addApi").hide();
		$(".viewApi").show();
	});

	$("#serverUrl").on("keyup change paste keypress",function (e) {
		$("#saveButton").attr("disabled",true).removeClass("bt-primary").addClass("bt-disabled");
	});

	$("#checkButton").click(function () {
		var apiKey = $("#apiKey").val(),
			serverIP = $("#serverIP"),
			serverPort = $("#serverPort"),
			serverUrl = $("#serverUrl").val(),
			decode = (hexToString(apiKey)).split("|");

		serverIP.val(decode[1]);
		serverPort.val(decode[2]);
		var accessUrl = (serverUrl!=="")?serverUrl : "http://"+decode[1]+":"+decode[2];

		if (serverIP.val()!=="" && serverPort.val()!==""){
			WebPrinter(accessUrl,decode[0],'test',function (res) {
				try{
					console.log(res);
					if (res.webprinter.code === 200){
						$.toast({
							icon: 'success',
							text: "Connected to server ("+decode[1]+":"+decode[2]+")",
							position: 'top-right'
						});
						$("#saveButton").attr("disabled",false).removeClass("bt-disabled").addClass("bt-primary");
					}else{
						$.toast({
							icon: 'error',
							text: "Failed to connect to ("+decode[1]+":"+decode[2]+")",
							position: 'top-right'
						});
						$("#saveButton").attr("disabled",true).removeClass("bt-primary").addClass("bt-disabled");
					}
				}
				catch (e) {
					$.toast({
						icon: 'error',
						text: "XMLHttpRequest: Invalid URL",
						position: 'top-right'
					});
				}
			});
		}else{
			$.toast({
				icon: 'error',
				text: "Invalid Api Key!",
				position: 'top-right'
			});
		}

	});

	$("#saveButton").click(function () {
		var checkdata = getData({key:'WebPrinter'}),
			apiKey = $("#apiKey").val(),
			webAppUrl = $("#webAppUrl").val(),
			serverUrl = $("#serverUrl").val(),
			newData =  {apiKey: apiKey, webAppUrl: webAppUrl,apiStatus:'active',serverUrl:serverUrl}
		if (checkdata === null){
			pushData({key:'WebPrinter',data:[newData]});
			$(this).attr("disabled",true).removeClass("bt-primary").addClass("bt-disabled");
			$("#checkButton").attr("disabled",true).removeClass("bt-success").addClass("bt-disabled");
			$.toast({
				icon: 'success',
				text: "Preferences saved",
				position: 'top-right'
			});
			tableRender();
		}else{
			if (findData({key:'WebPrinter',param:'apiKey',find:apiKey})===undefined) {
				updateData({key:'WebPrinter',findParam: 'apiStatus', setParam: 'apiStatus', find: 'active', setValue: ""}); //nonaktifkan semua api yang aktiv
				pushData({key:'WebPrinter',data:[newData]});
				$(this).attr("disabled",true).removeClass("bt-primary").addClass("bt-disabled");
				$("#checkButton").attr("disabled",true).removeClass("bt-success").addClass("bt-disabled");
				$.toast({
					icon: 'success',
					text: "Preferences saved",
					position: 'top-right'
				});
				tableRender();
			}else{
				$.toast({
					icon: 'warning',
					text: "Api key already exist",
					position: 'top-right'
				});
			}
		}
	});
})


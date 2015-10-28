(function($){

	var abbrStore;
  	
  	var init = function() {
  		getAbbreviations();
  	}

  	var getAbbreviations = function() {
  		var localStorageAbbrs = localStorage.getItem('poeAbbreviations');

  		if(localStorageAbbrs){

  			localStorageAbbrs = JSON.parse(localStorageAbbrs);

  			if(localStorageAbbrs && localStorageAbbrs.date){

  				var currDate = new Date();
  				var lastDate = new Date(localStorageAbbrs.date);

  				var timeDiff = currDate - lastDate;

  				//Update abbreviations once an hour, just in case
  				if(timeDiff > 3600000){
  					queryAbbrvData();
  				} else {
  					parseAbbrvData(localStorageAbbrs);
  				}
  			}

  		} else{
  			queryAbbrvData();
  		}
  	};

  	var queryAbbrvData = function() {
  		blockspring.runParsed("query-google-spreadsheet", { "query": "SELECT A, B", "url": "https://docs.google.com/spreadsheets/d/1ASrqT4GIm0Pb2ey-BHfgojl26KaaZerXsiV5PpDdID4"}, { "api_key": "br_15314_39d07898688a710dbafc0508110ae664e678ac0b" }, function(res){
			var errors = res.getErrors();

			if(!errors.length){
				var abbrvData = {'data': res.params.data, 'date': new Date()};
				var abbrvDataJson = JSON.stringify(abbrvData);
			
				localStorage.setItem('poeAbbreviations', abbrvDataJson);

				parseAbbrvData(abbrvData);
			}

		});
  	}

  	var parseAbbrvData = function(abbrvData) {
  		console.log(abbrvData);

  		var dataObj = abbrvData.data;

		var dataArr = Object.keys(dataObj).map(function (key) {return dataObj[key].abbr});
		var abbrDescObj = {};

		for(var i = 0; i < dataObj.length; i++){
			var abbrLower = dataObj[i].abbr.toLowerCase();
			abbrDescObj[abbrLower] = dataObj[i].desc;
		}

  		$('body').highlight(dataArr, {className: 'poeAbbrv_highlight', wordsOnly: true});

		$('span.poeAbbrv_highlight').each(function(){

			var currEl = $(this);
			var elVal  = currEl.text().toLowerCase();

			var elDesc = abbrDescObj[elVal];

			if(elDesc){
				currEl.qtip({
					content: {
						text: elDesc
					},
					position: {
						my: 'bottom left',
						at: 'top right',
						target: currEl
					},
					style: {
						classes: 'qtip-light qtip-shadow'
					}
				})
			}
			
		});
	}

	init();

})(jQuery);
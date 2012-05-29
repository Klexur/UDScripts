// ==UserScript==
// @name           UD DSS Brain Map
// @namespace      Klexur
// @version        0.1
// @description    Displays the UDBrain data on the DSS map
// @updateURL      https://github.com/Klexur/UDScripts/raw/master/UDBrain_DSS_Map.user.js
// @include        http://dssrzs.org/map/*
// @exclude        http://dssrzs.org/map/city
// ==/UserScript==

// Ben2's UDBrainMap script used as reference and some code borrowed.

window.addEventListener('load', getCoords(), true);

function getCoords() {
	var query = '//table[@class="map"]//td//div[@class="p"]';
	var blocks = document.evaluate(query, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	console.log('blocks.snapshotLength: ' + blocks.snapshotLength);
	
	var coordinates = '';
	for (var i = 0; i < blocks.snapshotLength; i++) {
        var currentBlock = blocks.snapshotItem(i).parentNode;
        // Non Free-running: carpark cemetary monument park street wasteland zoo
    	if ((currentBlock.className!='loc cprk')&&(currentBlock.className!='loc ceme')&&
			(currentBlock.className!='loc monu')&&(currentBlock.className!='loc park')&&
			(currentBlock.className!='loc opns')&&(currentBlock.className!='loc wast')&&
			(currentBlock.className!='loc zoox')) { 
			coordinates = currentBlock.firstChild.innerHTML.replace(',','');
			//console.log('coordinates: ' + coordinates);
			getData(coordinates, currentBlock);
		}
	}
}

function getData(building, currentBlock) {
	GM_xmlhttpRequest({
		method: 'GET',
		url: 'http://www.alloscomp.com/udbrain/api4ext.php?'+building,
		onload: function(response) {
			if(response != '') {
				var data = response.responseText;
				//console.log(data);
				var arr = data.split(':');
				// arr[0] = coords, arr[1] = timestamp, arr[2] = report type, arr[3] = barricades
				// addData(arr[0], arr[1], arr[2], arr[3]);
				addData(currentBlock, arr[1], arr[2], arr[3]);
			}
		}
	});
}

function addData(currentBlock, timestamp, rtype, barricades) {
	var cades = convertCadeLevelToShort(barricades);
	var description = currentBlock.firstChild.nextSibling;
	description.innerHTML = description.innerHTML + '<br>' + cades;
}

function convertCadeLevelToShort(cl) {
	if(cl == 1) return "Opn";
	if(cl == 2) return "Cls";
	if(cl == 3) return "LoB";
	if(cl == 4) return "LiB";
	if(cl == 5) return "QSB";
	if(cl == 6) return "VSB";
	if(cl == 7) return "HeB";
	if(cl == 8) return "VHB";
	if(cl == 9) return "EHB";
}
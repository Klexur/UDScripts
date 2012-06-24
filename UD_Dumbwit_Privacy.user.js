// ==UserScript==
// @name           UD Dumbwit Privacy
// @namespace      Klexur
// @version        1.1
// @description    Hides HP, AP, and Inventory before making Dumbwit report.
// @updateURL      https://github.com/Klexur/UDScripts/raw/master/UD_Dumbwit_Privacy.user.js
// @include        http://*urbandead.com/map.cgi*
// @exclude        http://*urbandead.com/map.cgi?logout
// ==/UserScript==

addButton();

function addButton() {
	var input = document.createElement('input');
	input.type = 'submit';
	input.className = 'm';
	input.id = 'Dumbwit_Privacy';
	input.value = 'Dumbwit';
	input.addEventListener(
		'click',
		function(event) {
			event.stopPropagation();
			event.preventDefault();
			var pre_body = document.body.innerHTML;
			var barrista = document.evaluate('//td[@class="cp"]/div[@class="gt"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
			if (!barrista) hideBarrista(pre_body);
			else hideDefault(pre_body);
		},
		false
	);
	
	var form = document.createElement('form');
	form.className = 'a';
	form.method = 'post';
	form.action = 'map.cgi';
	form.appendChild(input);

	var frag = document.createDocumentFragment();
	frag.appendChild(form);
	frag.appendChild(document.createTextNode(' '));		// seems to create the equivalent of &nbsp;

	var firstForm = document.evaluate('//td[@class="gp"]/form', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
	if (!firstForm)
		document.evaluate('//td[@class="gp"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).appendChild(frag);
	else
		firstForm.parentNode.insertBefore(frag, firstForm.nextSibling);
}

function hideBarrista(pre_body) {
	// get info
	var AP = document.evaluate('/html/body/div/div/div[2]/div/div', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
	var AP_bar = AP.nextSibling
	var HP = document.evaluate('/html/body//div/div/div[2]/div[2]/div', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
	var HP_bar = HP.nextSibling

	// hide info
	AP.innerHTML = 'XXAP'
	AP_bar.parentNode.removeChild(AP_bar);
	HP.innerHTML = 'XXHP'
	HP_bar.parentNode.removeChild(HP_bar);
	
	var forms = document.evaluate('//td[@class="gp"]//form[@class="a"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var j=0; j<forms.snapshotLength; j++) {
		forms.snapshotItem(j).parentNode.removeChild(forms.snapshotItem(j));
	}

	getDumbwit();

	// return info
	document.body.innerHTML = pre_body;
}

function hideDefault(pre_body) {
	// get info
	var points = document.evaluate('//div[@class="gt"]//b', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	var i=0, HP, AP;

	if (points.snapshotItem(1).innerHTML == 'dead') i=1;
	HP = points.snapshotItem(1+i).innerHTML;
	AP = points.snapshotItem(3+i).innerHTML;

	// hide info
	points.snapshotItem(1+i).innerHTML = 'XX'; // HP
	points.snapshotItem(3+i).innerHTML = 'XX'; // AP
	
	var forms = document.evaluate('//td[@class="gp"]//form[@class="a"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	for (var j=0; j<forms.snapshotLength; j++) {
		forms.snapshotItem(j).parentNode.removeChild(forms.snapshotItem(j));
	}

	getDumbwit();

	// return info
	document.body.innerHTML = pre_body;
}

function getDumbwit() {
	var d = new Date();
	var w = window.open('', d);
	w.document.write('<html><body><form name="wF" action="http://iamscott.net/cgi-bin/dumbwit.rb" method="post"><input name="wP" value="PRIVATE" /><input name="wC" value="' + prompt('Enter Dumbwit comment - may be blank.') + '"><input name="wT" value="' + window.document.lastModified + '" /><input name="wZ" value="' + d.getTimezoneOffset() + '" /><input name="wV" value="23" /><textarea name="wS">' + document.body.innerHTML + '</textarea></form>');
	w.document.forms[0].submit();
}
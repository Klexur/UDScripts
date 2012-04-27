// ==UserScript==
// @name           UD PK Reporter
// @namespace      Klexur
// @version        0.2
// @description    *Work In Progress* Automates the task of submitting a Dumbwit url to the Rogues Gallery
// @include        http://www.urbandead.com/map.cgi*
// @include        http://*urbandead.com/map.cgi*
// @include        http://iamscott.net/cgi-bin/dumbwit.rb
// @include        http://rg.urbandead.net/reports/add/url#*
// @exclude        http://www.urbandead.com/map.cgi?logout
// @exclude        http://*urbandead.com/map.cgi?logout
// ==/UserScript==

var durl = document.location.href

if (durl.indexOf('urbandead.com/map.cgi') != -1) addButton();
else if (durl.indexOf('iamscott.net/cgi-bin/dumbwit.rb') != -1) openReport();
else if (durl.indexOf('rg.urbandead.net/reports/add/url#') != -1) sendReport();

function addButton() {
	var input = document.createElement('input');
	input.type = 'submit';
	input.className = 'y';
	input.value = 'Report PK';
	input.style.color = '#FF9999';
	input.addEventListener(
		'click',
		function(event) {
			event.stopPropagation();
			event.preventDefault();
			var d = new Date();
			var w = window.open('', d);
			w.document.write('<html><body><form name="wF" action="http://iamscott.net/cgi-bin/dumbwit.rb" method="post"><input name="wP" value="PRIVATE" /><input name="wC" value="' + prompt('Enter Dumbwit comment - may be blank.') + '"><input name="wT" value="' + window.document.lastModified + '" /><input name="wZ" value="' + d.getTimezoneOffset() + '" /><input name="wV" value="23" /><textarea name="wS">' + document.body.innerHTML + '</textarea></form>');
			w.document.forms[0].submit();
		},
		false
	);
	
	var frag = document.createDocumentFragment();
	frag.appendChild(document.createTextNode(' '));		// seems to create the equivalent of &nbsp;
	frag.appendChild(input);
	frag.appendChild(document.createTextNode(' '));
	
	var firstP = document.evaluate('//td[@class="cp"]/p/a', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
	if (!firstP)
		document.evaluate('//td[@class="cp/p"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).appendChild(frag);
	else
		// Place before the Log out link
		firstP.parentNode.insertBefore(frag, firstP.parentNode.lastChild.previousSibling);
}

function openReport() {
	var a = document.getElementsByTagName('a');
	var link = a[0].href; // assuming Dumbwit capture is first link
	// GM_log('Dumbwit link: ' + link);
	console.log('Dumbwit link: ' + link);
		
	// GM_openInTab('http://rg.urbandead.net/reports/add/url#' + link);
	//window.open('http://rg.urbandead.net/reports/add/url#' + link, '', '', true);
	window.onLoad = a[0].focus();
	window.location.replace('http://rg.urbandead.net/reports/add/url#' + link);
	//copyToClipboard(link);
}

function sendReport() {
	var i = durl.indexOf('#');
	if (i == -1) return;
	
	var link = durl.substring(i+1);
	var upinput = document.getElementById('DocumentUrl');
	window.onLoad = upinput.focus();
	upinput.value = link;
	// var upform = document.getElementById('ObservationsAddForm');
	// upform.submit();
}

function copyToClipboard(text) {
  window.prompt ("Copy to clipboard: Ctrl+C, Enter", text);
}

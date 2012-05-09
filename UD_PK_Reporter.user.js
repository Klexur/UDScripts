// ==UserScript==
// @name           UD PK Reporter
// @namespace      Klexur
// @version        0.2.1
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

// Wait for page to load
window.addEventListener('load', function() {
	if (durl.indexOf('iamscott.net/cgi-bin/dumbwit.rb') != -1) getLink();
	if (durl.indexOf('rg.urbandead.net/reports/add/url#') != -1) openReport();
}, true);

function addButton() {
	var a = document.createElement('a');
	a.className = 'y';
	a.href = "javascript:d=new%20Date();void(wW=window.open('',%20d.toString().replace(/[\W]/g,%20'')));void(wW.document.write(%22<HTML><BODY><FORM%20NAME='wF'%20ACTION='http://iamscott.net/cgi-bin/dumbwit.rb'%20METHOD='POST'><INPUT%20NAME='wP'%20VALUE='PRIVATE'><INPUT%20NAME='wC'%20VALUE='%22+prompt(%22enter%20Dumbwit%20comment%20-%20may%20be%20blank%22)+%22'><INPUT%20NAME='wT'%20VALUE='%22+window.document.lastModified+%22'><INPUT%20NAME='wZ'%20VALUE='%22+d.getTimezoneOffset()+%22'><INPUT%20NAME='wV'%20VALUE='23'><TEXTAREA%20NAME='wS'>%22+document.body.innerHTML+%22</TEXTAREA>%22));u=window.location.href.indexOf(%22ead.com/map.c%22);if(12<u&&u<18)wW.document.wF.submit()";
	a.innerHTML = 'Report PK';
	
	var frag = document.createDocumentFragment();
	frag.appendChild(document.createTextNode(' '));		// seems to create the equivalent of &nbsp;
	frag.appendChild(a);
	frag.appendChild(document.createTextNode(' '));
	
	var firstA = document.evaluate('//td[@class="cp"]/p/a', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
	if (!firstA)
		document.evaluate('//td[@class="cp/p"]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).appendChild(frag);
	else
		// Place before the 'Log out' link
		firstA.parentNode.insertBefore(frag, firstA.parentNode.lastChild.previousSibling);
}

function getLink() {
	var a = document.getElementsByTagName('a');
	// window.onLoad = a[0].focus();
	// Assuming Dumbwit capture is first link
	var link = a[0].href;
	window.location.replace('http://rg.urbandead.net/reports/add/url#' + link);
	//copyToClipboard(link);
}

function openReport() {
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

var ul = document.querySelector('ul'),
    btn = document.querySelector('.btn'),
    arr;

chrome.storage.local.get('keys', function (data) {
	arr = data['keys'];
	if( arr === undefined ){
		arr = [];
	}else if(arr.length !== 0){
		for(var i=0; i<arr.length; i++){
			keysHtmlTpl(arr[i]);
		}
	}
});

//关键字模板
function keysHtmlTpl(key){
	var text = document.createTextNode(key);
	var spankey = document.createElement('span');
	spankey.appendChild(text);
	var spanbtn = document.createElement('span');
	spanbtn.className = 'icon-cross';
	var li = document.createElement('li');
	li.appendChild(spankey);
	li.appendChild(spanbtn);
	spanbtn.onclick = function(){
		var val = li.children[0].innerHTML;
		var index = arr.indexOf(val);
		arr.splice(index, 1);
		chrome.storage.local.set({ 'keys': arr });
		ul.removeChild(li);
	}
	ul.appendChild(li);
}

btn.addEventListener('click', function(){
	var text = document.querySelector('input').value;
	var val = text.replace(/(^\s*)|(\s*$)/g, "");  //删除前后空格
	if( val !== ''){
		keysHtmlTpl(val);
		arr.push(val);
		chrome.storage.local.set({ 'keys': arr });
	}
})
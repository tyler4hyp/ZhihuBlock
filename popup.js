document.querySelector('.inner').addEventListener('click', function(){
    chrome.tabs.query({currentWindow: true, active: true},function(tabs){
    	chrome.storage.local.get('isBlock', function(data){
    		var val = data['isBlock'];
    		if( val === true ){
    			chrome.storage.local.set({ 'isBlock': false });
    			setBtn(false);
    		}else{
    			chrome.storage.local.set({ 'isBlock': true });
    			setBtn(true);
    		}
    	})
	});
})

function setBtn(isBlock){
	var outerDiv = document.querySelector('.outer');
	var innerDiv = document.querySelector('.inner');
	if(isBlock === true){
		outerDiv.className = 'outer';
		innerDiv.className = 'inner';
	}else{
		outerDiv.className = 'outer outerClose';
		innerDiv.className = 'inner innerClose';
	}
}

chrome.storage.local.get('isBlock', function (data) {
	var val = data['isBlock'];
	if( val === undefined ){
		chrome.storage.local.set({ 'isBlock': true });
		setBtn(true);
	}else{
		setBtn(val);
	}
});



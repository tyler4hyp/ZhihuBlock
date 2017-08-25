var html = $('html')[0],
    config = { childList: true, subtree: true},
    blockedUsers = [],     //屏蔽的用户
    blockedItems = [],     //被屏蔽的div
    ob = new MutationObserver(blockUser),
    blockedTitle = [];     //屏蔽的关键字

chrome.storage.onChanged.addListener(function(changes, areaName){
	//关闭，开启屏蔽
	if( changes['isBlock'] != undefined ){
		var newval = changes['isBlock'].newValue;
		var oldval = changes['isBlock'].oldValue;
		ob.disconnect();
		if( oldval === false && newval === true ){
			blockUser();
	    	ob.observe(html, config);
		}else if( oldval === true && newval === false){
			for(var i=0; i<blockedItems.length; i++){
				blockedItems[i].show();
			}
		}
	}
	//获取新的关键字
	if( changes['keys'] != undefined ){
		blockedTitle = changes['keys'].newValue;
	}
})

//获取用户的屏蔽列表,受知乎限制，只能得到50个屏蔽的用户
function getBlockedUser(){
	$.get("/settings/filter").done(function(data){
		var html = $(data);
		html.find('.blocked-users .avatar-link').each(function(){
			var href = $(this).attr('href');
			if( blockedUsers.indexOf(href) === -1){
				blockedUsers.push(href);
			}
		});
	});
}

function blockUser(){
	//首页屏蔽
	$('.TopstoryMain .TopstoryItem').each(function(){
		var $self = $(this);
		var href = $self.find('.AuthorInfo-head .UserLink-link').attr('href');
		if( blockedUsers.indexOf(href) != -1 ){
			$self.hide();
			blockedItems.push($self);
		}
		blockTitle($self);
	});

	//发现页屏蔽
	$('.tab-panel .explore-feed').each(function(){
		var $self = $(this);
		var href = $self.find('.author-link-line .author-link').attr('href');
		if( blockedUsers.indexOf(href) != -1 ){
			$self.hide();
			blockedItems.push($self);
		}
		blockTitle($self);
	});

    //话题页屏蔽
	$('.zu-top-feed-list .feed-item').each(function(){
		var $self = $(this);
		var href = $self.find('.author-link-line .author-link').attr('href');
		if( blockedUsers.indexOf(href) != -1 ){
			$self.hide();
			blockedItems.push($self);
		}
		blockTitle($self);
	});

    //评论屏蔽
	$('.Comments-container .CommentItem').each(function(){
		var $self = $(this);
		var href = $self.find('.CommentItem-avatar .UserLink-link').attr('href');
		if( blockedUsers.indexOf(href) != -1 ){
			$self.hide();
			blockedItems.push($self);
		}
	});

    //问题页屏蔽
	$('.QuestionAnswers-answers .List-item').each(function(){
		var $self = $(this);
		var href = $self.find('.AuthorInfo-avatarWrapper .UserLink-link').attr('href');
		if( blockedUsers.indexOf(href) != -1){
			$self.hide();
			blockedItems.push($self);
		}
	});

	//搜索页屏蔽
	$('.Question-mainColumn .QuestionAnswer-content').each(function(){
		var $self = $(this);
		var href = $self.find('.AuthorInfo-avatarWrapper .UserLink-link').attr('href');
		if( blockedUsers.indexOf(href) != -1){
			$self.hide();
			blockedItems.push($self);
		}
	});

	console.log(blockedItems);
}

//关键字过滤
function blockTitle(item){
	if(blockedTitle !== []){
		var temp = item.find('.ContentItem-title a')[0];
		if( temp !== undefined ){
			var title = temp.innerHTML;
			for(var i=0; i<blockedTitle.length; i++){
				if(title.indexOf(blockedTitle[i]) != -1){
					item.hide();
					blockedItems.push(item);
					break;
				}
			}
		}
	}
}


chrome.storage.local.get('isBlock', function (data) {
	var val = data['isBlock'];
	if( val === undefined || val === true ){
		chrome.storage.local.get('keys', function(data){
			if( data['keys'] !== undefined ){
				blockedTitle = data['keys'];
			}
		})
		getBlockedUser();
		blockUser();
		ob.observe(html, config);
	}
});


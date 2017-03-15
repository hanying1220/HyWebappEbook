//初始化
;(function(){
	var pages = document.querySelectorAll('li');
	var width = document.documentElement.clientWidth;
	var len = pages.length;

	var setpost = function(index){
		var element = pages[index];
		element.style.transform = 'translate3d('+width+'px, 0, 0)';
		element.style.backgroundImage = 'url(/uploads/rs/349/rpkvgwc4/'+index+'.png)';
	}

	while(--len){
		//把除1以外的页堆在右边
		setpost(len);
	}

	pages[0].style.backgroundImage = 'url(/uploads/rs/349/rpkvgwc4/0.png)';
}());

//控制逻辑
;(function(){
	//获取所有页面
	var pages = document.querySelectorAll('li');
	//左右翻页按钮
	var left = document.querySelector('.left');
	var right = document.querySelector('.right');
	//取得所有的子页面长度
	var pagesLen = pages.length-1;
	//屏宽
	var screenWidth = document.documentElement.clientWidth;
	//反弹时间
	var time = 300;
 
	//标记当前页面
	var currIndex = 0;

	//标记是否触发滑动
	var isTouch = false;
	//初始化点击位置
	var axis = {
		x:0,
		y:0
	}

	//移动页面
	var move = function(index,width,time){
		var page = pages[index];
		page.style.transform = 'translate3d('+width+'px, 0, 0)';
		page.style.transitionDuration = time+'ms';
	}

	//下一页
	var toLeft = function(){
		if(currIndex < pagesLen){
			move(currIndex,-screenWidth,time);
			move(++currIndex,0,time);
		} 
	}

	//上一页
	var toRight = function(){
		if(currIndex >0){
			move(currIndex,screenWidth,time);
			move(--currIndex,0,time);
		}
	}

	//监听动作
	//next
	left.onclick = function(){
		toLeft();
	}
	//prev
	right.onclick = function(){
		toRight();
	}
	
	var hyc = document.getElementById("fiction_container");
	hyc.addEventListener('mousedown',function(e){
		//当按下鼠标时生效
		isTouch = true;
		axis.x = e.clientX;
    	axis.y = e.clientY;
	});

	hyc.addEventListener('mousemove',function(e){
		//按下鼠标进行滑动时生效
		if(isTouch){
			//滑动距离
    		var distance = e.clientX - axis.x;
    		if(distance<0){
    			//next
    			if(currIndex<pagesLen){
    				//此时需要看到实时移动效果，所以时间为0
    				move(currIndex,distance,0);
    				//当前页与上一页之间总是相差一个屏宽
    				move(currIndex+1,distance+screenWidth,0);
    			}
    		}else{
    			if(currIndex>0){
    				//prev
	    			move(currIndex,distance,0);
	    			move(currIndex-1,distance-screenWidth,0);
    			}
    		}
    	}
	});

	hyc.addEventListener('mouseup',function(e){
		//松手时的移动距离
		var distance = e.clientX - axis.x;
    	//反弹条件
    	var band = Math.ceil(screenWidth * 0.3);
    	//结束滑动
		isTouch = false;
    	//next
		if(distance <0 && currIndex < pagesLen){
			if(-distance > band){
	    		toLeft();
	    	}else{
	    		//滑动距离太小，页面反弹
	    		move(currIndex,0,time);
				
	    		move(currIndex+1,screenWidth,time);
	    	}
	    	return;
		}
		//prev
		if(distance > 0 && currIndex > 0){
			console.log(distance);
			if(distance > band){
	    		toRight();
	    	}else{
	    		//反弹
	    		move(currIndex,0,time);
	    		move(currIndex-1,-screenWidth,time);
	    	}
		}
		
		//distance==0时为点击
		if(distance==0){
			//$('.root').click(function(){
				if(Dom.top_nav.css('display')=='none'){
					Dom.top_nav.show();
					Dom.bottom_nav.show();
				}else{
					Dom.top_nav.hide();
					Dom.bottom_nav.hide();
					Dom.panel_control.hide();
				}
				
				Dom.font_button.removeClass('current');
			//});	
		}
	});

	//计算物理像素值，
	var dpr = window.devicePixelRatio;
	var hywidth = screen.width;
	var docEl = document.documentElement;
	
	console.log((dpr*hywidth)+'hy1');
	console.log((dpr*hywidth/14)+'hy2');
	console.log(docEl.clientWidth);
	console.log(docEl.clientWidth/14);
	console.log((docEl.clientHeight/(14*1.5))+'行');
	
	var Util = (function(){
		//localSotrage 共享一个域，为避免冲突，给每个key加上前缀
		var prefix = 'fiction_reader_';
		var StorageGetter = function(key){
			return localStorage.getItem(prefix+key);
		}
		
		var StorageSetter = function(key, value){
			return localStorage.setItem(prefix+key, value);
		}
		
		var getJSONP = function(url, callbackFun){
			$.jsonp({
				url:url,
				cache:true,
				callback:'',
				success:function(json){
					var decodeJson = $.base64.docode(json);
					callbackFun(decodeJson);
				}
			});
		}
		
		//事件委托的函数
		var addHandler = function(element, type, handler){
			if(element.addEventListener){
				element.addEventListener(type, handler, false);
			}else if(element.attachEvent){
				element.attachEvent('on'+type, handler);
			}else{
				element['on' + type] = handler;
			}
		};
		
		var getEvent = function(event){
			return event?event:window.event;
		}
		
		var getTarget = function(event){
			return event.target||event.srcElement;
		}
		
		var changeBkColor = function(BkColor){
			initBkColor = BkColor;
			Dom.fiction_area.css('background-color',initBkColor);
			Util.StorageSetter('background-color',initBkColor);
		}
		
		var changeBkClass = function(target_id){
			Dom.color1_bk.removeClass('icon-color-current');
			Dom.color2_bk.removeClass('icon-color-current');
			Dom.color3_bk.removeClass('icon-color-current');
			Dom.color4_bk.removeClass('icon-color-current');
			Dom.color5_bk.removeClass('icon-color-current');
			$('.'+target_id+'-bk').addClass('icon-color-current')
		}
		
		return {
			getJSONP:getJSONP,
			addHandler:addHandler,
			getEvent:getEvent,
			getTarget:getTarget,
			changeBkColor:changeBkColor,
			changeBkClass:changeBkClass,
			StorageSetter:StorageSetter,
			StorageGetter:StorageGetter
		}
	})();
	
	var Dom = {
			top_nav: $('#nav_bar'),
			bottom_nav:$('.foot-nav'),
			font_button:$('.m-font-bar'),
			panel_control:$('.pannel-control'),
			night_day:$('.night-day'),
			light_day:$('.light-day'),
			fiction_area:$('#fiction_container'),
			fiction_word:$('#fiction_word'),
			color1_bk:$('.color1-bk'),
			color2_bk:$('.color2-bk'),
			color3_bk:$('.color3-bk'),
			color4_bk:$('.color4-bk'),
			color5_bk:$('.color5-bk')
	};

	var Win = $(window);
	var Doc = $(document);
	var initFontSize = Util.StorageGetter('font-size');
	initFontSize = parseInt(initFontSize);
	if(!initFontSize){
		initFontSize = 14;
	}
	Dom.fiction_area.css('font-size', initFontSize);
	
	var initBkColor = Util.StorageGetter('background-color');
	if(!initBkColor){
		initBkColor = '#f7eee5';
	}
	
	Dom.fiction_area.css('background-color', initBkColor);
	
	//点击字体，控制面板出现或隐藏
	Dom.font_button.click(function(){
		console.log('font_button is click');
		if(Dom.panel_control.css('display')=='none'){
			Dom.panel_control.show();
			Dom.font_button.addClass('current');
		}else{
			Dom.panel_control.hide();
			Dom.font_button.removeClass('current');
		}
	});
	
	//点击白天或夜晚，模式切换
	Dom.night_day.click(function(){
		console.log('you clicked the night day');
		Dom.night_day.hide();
		Dom.light_day.show();
		initBkColor = '#283548';
		Util.changeBkColor(initBkColor);
		Dom.fiction_area.css('bakground-color',initBkColor);
		Util.StorageSetter('background-color',initBkColor);
		Dom.font_button.removeClass('current');
	});
	
	Dom.light_day.click(function(){
		console.log('you clicked the light day');
		Dom.light_day.hide();
		Dom.night_day.show();
		initBkColor = '#f7eee5';
		Util.changeBkColor(initBkColor);
		Dom.fiction_area.css('background-color',initBkColor)
		Util.StorageSetter('background-color',initBkColor);
		Dom.font_button.removeClass('current');
	});
	
	// 放大或缩小字体
	$('#big_font').click(function(){
		console.log('you clicked the bigger font');
		if(initFontSize > 20){
			return ;
		}
		initFontSize += 1;
		Dom.fiction_area.css('font-size', initFontSize);
		Util.StorageSetter('font-size', initFontSize);
	});

	$('#small_font').click(function(){
		console.log('you clicked the smaller font.');
		if(initFontSize < 10){
			return ;
		}
		initFontSize -= 1;
		Dom.fiction_area.css('font-size', initFontSize);
		Util.StorageSetter('font-size', initFontSize);
	});	
	
	// 设置背景色
	// 使用事件委托的方式
	Util.addHandler($('.color-pannel')[0], 'click', function(event){
		var event = Util.getEvent(event);
		// debugger;
		var target = Util.getTarget(event);
		switch(target.id){
			case 'color1':
				Util.changeBkColor('#f7eee5');
				Util.changeBkClass(target.id);
				break;
			case 'color2':
				Util.changeBkColor('#e9dfc7');
				Util.changeBkClass(target.id);
				break;
			case 'color3':
				Util.changeBkColor('#a4a4a4');
				Util.changeBkClass(target.id);
				break;
			case 'color4':
				Util.changeBkColor('#cdefce');
				Util.changeBkClass(target.id);
				break;
			case 'color5':
				Util.changeBkColor('#283548');
				Util.changeBkClass(target.id);
				break;
			default:
				break;
		}
	});
	
}());

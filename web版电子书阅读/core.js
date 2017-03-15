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

	document.addEventListener('mousedown',function(e){
		//当按下鼠标时生效
		isTouch = true;
		axis.x = e.clientX;
    	axis.y = e.clientY;
	});

	document.addEventListener('mousemove',function(e){
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

	document.addEventListener('mouseup',function(e){
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
	
	
}());

//用户网页的逗留时间
	var second = 0;
	var minute = 0;
	var hour = 0;
	var time=0;
	window.setTimeout('staytime();',1000);
	
	function staytime(){
		console.log(time);
		second++;
		if(second==60){second=0;minute+=1;}
		if(minute==60){minute=0;hour+=1;}
		window.onbeforeunload=function(){
			alert(time);
		}
		
		time= hour +"小时" + minute + "分" + second + "秒";
		window.setTimeout("staytime();",1000);
	}
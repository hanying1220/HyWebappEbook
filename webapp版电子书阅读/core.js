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

	document.addEventListener('touchstart',function(e){
		//当按下鼠标时生效
		isTouch = true;
		axis.x = e.touches[0].clientX;
    	axis.y = e.touches[0].clientY;
	});

	document.addEventListener('touchmove',function(e){
		//按下鼠标进行滑动时生效
		if(isTouch){
			//滑动距离
    		var distance = e.touches[0].clientX - axis.x;
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

	document.addEventListener('touchend',function(e){
		//松手时的移动距离
		var distance = e.changedTouches[0].clientX - axis.x;
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
			if(distance > band){
	    		toRight();
	    	}else{
	    		//反弹
	    		move(currIndex,0,time);
	    		move(currIndex-1,-screenWidth,time);
	    	}
		}
	});

}());
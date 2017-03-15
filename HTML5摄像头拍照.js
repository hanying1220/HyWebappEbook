/**
*组件：调用摄像头的构造函数
*@params {object} options 参数如下；
* video {DOM} vido元素
* width {Number} 画布宽度
* height {Number} 画布高度
* onShoot {function} 录像回调函数
* onError {Function} error回调函数
*调用：
* Camera.create(options);
*
*/
function Camera(options){
	this.video = options.video;
	this.width = options.width||640;
	this.height = options.height||580;
	this.onError = options.onError;
	this.onShoot = options.onShoot;
}

Camera.prototype = {
	init:function(){
		navigator.getUserMedia = navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||
			navigator.msGetUserMedia;//获取媒体对象
		this.video.autoplay = 'true';
		this.canvasDom = document.createElement('canvas');
		this.canvasDom.width = this.width;
		this.canvasDom.height = this.height;
		this.canvasDom.style.display = 'none';
		document.querySelector('body').appendChild(this.canvasDom);
	},
	//检查摄像头是否可用
	canCameraUse:function(){
		return (navigator.getUserMedia&&window.URL);
	},
	//获取录像流到video中
	shoot:function(){
		var self = this;
		var video = self.video;
		if(self.canCameraUse){
			navigator.getUserMedia({video:true},
			function(stream){
				video.src = URL.createObjectURL(stream);
				video.play();
				video.addEventListener('error',function(error){
					stream.stop();
					self.onError&&self.onError(error);
				}, false);
			},
			function(){
				self.onError&&self.onError(error);
			});
		}
	},
	//将录像绘制到canvas
	drawVideo:function(){
		var canvasDom = this.canvasDom;
		var ctx = canvasDom.getContext('2d');
		ctx.fillStyle = "#000000";
		ctx.fillRect(0,0,canvasDom.width,canvasDom.height);
		ctx.drawImage(this.video,0,0,canvasDom.width,canvasDom.height);
	},
	//录像事件绑定
	addShottEvent:function(){
		var self = this;
		var video = self.video;
		//正在录像
		video.addEventListener('timeupdata',function(){
			self.drawVideo();
			self.onShoot&&self.onShoot();
		},false);
	},
	//将录像成图片
	snapshot:function(cb,imageType){
		var self = this;
		var video = self.video;
		var canvas = self.canvasDom;
		imageType = imageType||'png';
		imageScr = canvas.toDataURL('image/' + imageType);
		cb&&cb(imageSrc);
	},
	//开始录像
	play:function(){
		this.video.play();
	},
	//停止录像
	pause:function(){
		this.video.pause();
		
	},
	render:function(){
		this.init();
		this.shoot();
		this.drawVideo();
		this.addShootEvent();
	}
};

Camera.cteate = function(options){
	var camera = new Camera(options);
	camera.render();
	return camera;
}

<video id= 'video'></video>
<div>
	<buttom id='shootBtn'>拍照</button>
</div>
<div id='imageBox'></div>
<script>
	var camera = Camera.create({
		video:document.querySelector('#video'),
		width:640,
		height:480,
		onError:function(error){
			alert(error);
		}
	});
	
	//拍照
	document.querySelector('#shootBtm').addEventListener('click',function(){
		camera.snapshot(function(imageUrl){
			var imageBox = document.querySelector('#imageBox');
			var image = imageBox.querySelector('img');
			if(!image){
				var image = document.createElement('img');
				image.src = imageUrl;
				document.querySelector('#imageBox').appendChild(image);
			}else{
				image.src = imageUrl;
			}
		});
	}, false);
</script>

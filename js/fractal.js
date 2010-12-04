//
//   Fractal Drawer on JS / with Canvas
//

// class Fractal Drawer
var FDrawer = function(elm){
	var Myself = arguments.callee;
	if (!(this instanceof Myself)) return new Myself(elm);
	
	this.deg = 0;
	this.x = 0;
	this.y = 0;
	this.canvas = elm;
	this.ctx = elm.getContext("2d");
}

FDrawer.prototype = {
	// public
	draw: function(repeat, side){
		repeat = Number(repeat);
		var lg = Number(side);
		var points = [[lg,0],[0,lg],[-lg,0],[0,-lg]];
		this._drawLines(this._prepare(repeat),points);
	}
	,
	
	// private
	_prepare: function(repeat){
		var order = [];
		for(var i=0; i < repeat; i++){
			var prepare = order.slice(0);
			for(var key in prepare){
				prepare[key] = prepare[key] * -1;
			}
			order.push(1);
			[].push.apply(order, prepare.reverse());
		}
		return order;
	},
	_calcPoint: function(deg, points){
		this.deg = Number(this.deg + deg);
		var drct = this.deg%4;
		if(drct < 0) drct = drct + 4;
		var dx = points[drct][0], dy = points[drct][1];
		return {
			x: Number(this.x + dx),
			y: Number(this.y + dy)
		}
	},
	_initCanvas: function(){
		this.deg = 0;
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
		this.ctx.moveTo(parseInt(this.canvas.width/2), parseInt(this.canvas.height/2));
		this.x = this.canvas.width/2;
		this.y = this.canvas.height/2;
	},
	_drawLines: function(order, points){
		order.unshift(-1);
		var movePoint = {};
		var ctx = this.ctx;
		this._initCanvas();
		// draw Lines
		ctx.beginPath();
		for(var i=0; i < order.length; i++){
			ctx.moveTo(this.x, this.y);
			movePoint = this._calcPoint(order[i], points);
			ctx.lineTo(movePoint.x, movePoint.y);
			this.x = movePoint.x;
			this.y = movePoint.y;
			movePoint = {};
		}
		ctx.stroke();
	}
};


// init
var init = function(){
	var canvas = document.getElementById("canvasElement");
	var pref = document.getElementById("preference");
	var repeat = pref.repeat;
	var side = pref.side;
	var drawButton = pref.draw;
	// preventSwipe
	document.ontouchmove = function(e){e.preventDefault();}
	// change startup image
	if(navigator.userAgent.indexOf('iPad') != -1) document.getElementById("startupImg").href = "./imgs/startup_ipad.png";
	
	var fractal = FDrawer(canvas);
	
	
	// placeholder
	// todo: optimize it
	repeat.onfocus = function(){
		if(repeat.value === 'Repeat'){
				repeat.value = '';
				repeat.style.color = '#333333';
		}
	}
	
	repeat.onblur = function(){
		if(repeat.value === ''){
			repeat.style.color = '#AAAAAA';
			repeat.value = 'Repeat';
		}
	}
	
	side.onfocus = function(){
		if(side.value === 'Length'){
				side.value = '';
				side.style.color = '#333333';
		}
	}
	
	side.onblur = function(){
		if(side.value === ''){
			side.style.color = '#AAAAAA';
			side.value = 'Length';
		}
	}
	
	
	drawButton.onclick = function(){
		if(repeat.value.match(/[^0-9]+/) || side.value.match(/[^0-9]+/)){
			alert("数値を設定してください。");
			return false;
		}
		fractal.draw(repeat.value, side.value);
	}
}

window.onload = init;
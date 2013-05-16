// HELPER FUNCTIONS START
Array.prototype.last = function() {
	return this[this.length - 1];
}
function rgb2hsv(r, g, b) {
	var min, max, delta;
	var result = {
		h : 0,
		s : 0,
		v : 0
	};
	min = Math.min(r, g, b);
	max = Math.max(r, g, b);
	result.v = max;
	// v
	delta = max - min;
	if (max != 0)
		result.s = delta / max;
	// s
	else {
		// r = g = b = 0		// s = 0, v is undefined
		result.s = 0;
		result.h = -1;
		return result;
	}
	if (r == max)
		result.h = (g - b ) / delta;
	// between yellow & magenta
	else if (g == max)
		result.h = 2 + (b - r ) / delta;
	// between cyan & yellow
	else
		result.h = 4 + (r - g ) / delta;
	// between magenta & cyan
	result.h *= 60;
	// degrees
	if (result.h < 0)
		result.h += 360;
	return result;
}

function getSat(r, g, b) {
	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	if (max != 0)
		return (max - min) / max;
	else
		return 0;

}

function from2da(col, row) {
	return (row * 4) * theCanvas.width + col * 4;
}

function getPixel(ctx, x, y) {
	return ctx.getImageData(x, y, 1, 1).data;
}

function clearCanvas(canvas) {
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawAscii(ctx, txt, dx, dy, dw, dh) {
	var pic = new Image();
	pic.src = txt;
	pic.onload = function() {
		if ( typeof (dx) == 'undefined' && typeof (dy) == 'undefined')
			ctx.drawImage(pic, 0, 0);
		else if ( typeof (dw) == 'undefined' && typeof (dh) == 'undefined')
			ctx.drawImage(pic, dx, dy);
		else
			ctx.drawImage(pic, dx, dy, dw, dh);
	};
}

function getInt(qstr, defval) {
	var v = $(qstr).val();
	v = parseInt(v);
	if (isNaN(v))
		return defval;
	else
		return v;
}

function apply2pixels(canvas,ctx,fun) {
	var ymax = canvas.height;
	var xmax = canvas.width;
	for(var y = 0; y < ymax; y++) {
		var row0 = ctx.getImageData(0, y, xmax, 1).data;
		var lenx = row0.length;
		var row1 = ctx.createImageData(xmax, 1);
		for(var x = 0; x < lenx; x += 4) {
			var pix = fun(row0[x], row0[x + 1], row0[x + 2], row0[x + 3]);
			row1.data[x] = pix[0];
			row1.data[x + 1] = pix[1];
			row1.data[x + 2] = pix[2];
			row1.data[x + 3] = pix[3];
		}
		ctx.putImageData(row1, 0, y);
	}
}

function hex2rgb(color){
	//assume FFEEAA type
	var red = parseInt(color.substr(0,2),16);
	var green = parseInt(color.substr(2,2),16);
	var blue = parseInt(color.substr(4,2),16);
	return {r:red, g:green, b:blue};
}

// HELPER FUNCTIONS END

/*Global variables */
var ready = {
	image : false,
	gray : false,
	post : false,
	fontsaved : false
};
var tonesList = [];
var history = [];
var layers = [];
var graypostImg = null;
var overpostImg = null;
var colorImg = null;

// IMAGE LOADER CODE BEGIN
var Mirror = Mirror || {};
Mirror.url = '';

Mirror.loadURL = function() {
	var ext = $('input[name="imgurl"]').val();
	if (ext.length > 0) {
		$.get('magicloadextimg.php', {
			url : ext
		}, MirrorBreak);
	} else {
		MirrorBreak(Mirror.url);
	}
};

Mirror.previewImage = function() {
	Mirror.url = "demoimg/" + $('#chooseImage option:selected').val();
	var iv = document.getElementById("preview");
	iv.setAttribute('src', Mirror.url);
	iv.style.visibility = "visible";
};

Mirror.init = function() {
	$('#chooseImage').change(this.previewImage);
	$('#GoImgButton').button().click(Mirror.loadURL);
	Mirror.url = "demoimg/" + $('#chooseImage option:selected').val();
};

function MirrorBreak(imgurl) {
	var pic = new Image();
	pic.src = imgurl;
	theCanvas.width = pic.width;
	theCanvas.height = pic.height;
	eCanvas.width = pic.width;
	eCanvas.height = pic.height;
	pic.onload = function() {
		sudo.drawImage(pic, 0, 0);
		editor.drawImage(pic, 0, 0);
		Mirror = null;
		Gray.doIt();
	}
	ready.image = true;
	$(theCanvas).show();
	$('#preview').hide();
	$('#toolbox_mirror').hide();
	$('#toolbox_settings').show();
};
// IMAGE LOADER CODE END

// GRAYPOST START

var Gray = Gray || {};
// define namespace variables
Gray.lvs = 3;
Gray.egray = false;
Gray.egskalor = 25;

Gray.changeLevels = function() {
	var postlvl = $('#postlvl').val();
	Gray.lvs = parseInt(postlvl);
	Gray.doIt();
};

Gray.changeEcheck = function() {
	Gray.egray = ($('#egray:checked').length != 0);
	Gray.doIt();
};

Gray.changeEgskalor = function() {
	var eg_skalor = $('#eg_skalor').val();
	Mirror.egskalor = parseInt(eg_skalor);
	if (Mirror.eg_skalor > 200 || Mirror.egskalor < 0) {
		alert("please enter a value 0-200");
		return;
	} else {
		Gray.doIt();
	}
};

Gray.pixGraypost = function(r, g, b, a) {
	var avg = (r + g + b) / 3;
	if(Gray.egray) {
		var min = Math.min(r, g, b);
		var max = Math.max(r, g, b);
		var invsat = 0;
		if(max != 0)
			var invsat = 1 - (max - min) / max;
		avg += Gray.egskalor;
		avg *= invsat;
	}
	avg = Math.floor(avg/Gray.div)*Gray.div;

	return [avg, avg, avg, a];
}

Gray.doIt = function() {
	Gray.div = Math.floor(255 / Gray.lvs);
	var imgPixels = editor.getImageData(0, 0, eCanvas.width, eCanvas.height);
	sudo.putImageData(imgPixels, 0, 0);
	apply2pixels(theCanvas,sudo,Gray.pixGraypost);
	 tonesList = [];
	 tonesList[0]=0;
	 for (var i = 1; i < Gray.lvs; i++) {
		 tonesList.push(tonesList[i-1] + Gray.div);
	 }
};

Gray.init = function() {
	$('#postlvl').change(Gray.changeLevels);
	$('#egray').change(Gray.changeEcheck);
	$('#eg_skalor').change(Gray.chnageEgskalor);
};

// GRAYPOST END

// FONT SETTINGS START
function FontProp() {
	this.title = "Hello World";
	this.face = "Merienda";
	this.angle = 0;
	this.color = "000000";
	this.rainbow = false;
	this.size = 12;
}

var Wordsmith = Wordsmith || {};
//declare namespace variables
Wordsmith.dolce = new FontProp();
Wordsmith.fontlist = ['Merienda', 'Dr+Sugiyama'];
Wordsmith.canvas = null;
Wordsmith.ctx = null;

Wordsmith.redraw = function() {
Wordsmith.ctx.clearRect(0,0, Wordsmith.canvas.width, Wordsmith.canvas.height);
Wordsmith.ctx.font = "normal "+Wordsmith.dolce.size+"px "+Wordsmith.dolce.face;
Wordsmith.ctx.textAlign = "start";
Wordsmith.ctx.fillStyle = "#"+Wordsmith.dolce.color;
	
Wordsmith.ctx.save();
Wordsmith.ctx.translate(25,50);
Wordsmith.ctx.rotate(Wordsmith.dolce.angle);
Wordsmith.ctx.fillText(Wordsmith.dolce.title, 0,0);
Wordsmith.ctx.restore();
console.log("canvas font updated");
}

Wordsmith.changeFactory = function(id) {
	if (id === 'rainbow') {
		return function() {
		var	val = ($('#fox_rainbow:checked').length > 0);
		Wordsmith.dolce[id] = val;
		Wordsmith.redraw();
	}
	} else if (id === 'size') {
		return function() {
		var val = getInt('#fox_size', 16);
		Wordsmith.dolce[id] = val;
		Wordsmith.redraw();
	}
	} else if (id === 'angle') {
		return function() {
		var ag = getInt('#fox_angle', 0);
		var val = ag * (Math.PI / 180);
		Wordsmith.dolce[id] = val;
		Wordsmith.redraw();
	}
	} else {
		return function() {
		var val = $('#fox_'+id).val();
		Wordsmith.dolce[id] = val;
		Wordsmith.redraw();
	}
	}
};

Wordsmith.drawText = function(shad,t){
	shad.ctx.fillStyle = $('#bgcolor').val();
	var intensity = parseFloat($('#intent').val());
	shad.ctx.fillRect(0,0, shad.canvas.width, shad.canvas.height);
	shad.ctx.save();
	shad.ctx.font = "normal "+Wordsmith.dolce.size+"px "+Wordsmith.dolce.face;
	shad.ctx.textAlign = "start";
	shad.ctx.fillStyle = "#"+Wordsmith.dolce.color;
	var tw = shad.ctx.measureText(Wordsmith.dolce.title).width;
	
	var density = //(255-t)*Math.sqrt(theCanvas.width*theCanvas.height)*intensity;
	(255-t)*Math.sqrt((theCanvas.width/tw)*(theCanvas.height/Wordsmith.dolce.size))*intensity;
	for(var n=0; n<density; n++){
		var x = Math.floor(Math.random()*(theCanvas.width+(2*tw)))-tw;
		var y = Math.floor(Math.random()*theCanvas.height+(2*Wordsmith.dolce.size))-Wordsmith.dolce.size;
		shad.ctx.save();
		shad.ctx.translate(x,y);
		shad.ctx.rotate(Wordsmith.dolce.angle);
		if(Wordsmith.dolce.rainbow)
			{
				shad.ctx.fillStyle = 'rgb('+Math.floor((Math.random()*255))+','+
										Math.floor((Math.random()*255))+','+
										Math.floor((Math.random()*255))+')';
			}
		shad.ctx.fillText(Wordsmith.dolce.title,0,0);
		shad.ctx.restore();
	}
	
	shad.ctx.restore();
}

Wordsmith.init = function() {
	//load fonts
	var fs = Wordsmith.fontlist.join('|');
	fontstring = "http://fonts.googleapis.com/css?family=" + fs
	var link = $('<link />');
	$(link).attr('rel', 'stylesheet');
	$(link).attr('type', 'text/css');
	$(link).attr('href', fontstring);
	$('head').append(link);

	// populate selection list
	var len = Wordsmith.fontlist.length;
	var st = $('#fox_face');
	for (var i = 0; i < len; i++) {
		var realname = Wordsmith.fontlist[i].replace('+', ' ');
		$(st).append('<option value="' + realname + '">' + realname + '</option>');
	}

	//set canvas
	Wordsmith.canvas = document.getElementById('fontprev');
	Wordsmith.ctx = Wordsmith.canvas.getContext('2d');

	// draw to font canvas
	Wordsmith.redraw();

	$('[id^="fox_"]').each(function() {
		var myname = $(this).attr('id');
		myname = myname.replace('fox_', '');
		var ifun = Wordsmith.changeFactory(myname);
		$(this).change(ifun);
	});
}
// FONT SETTINGS END

var Exe = Exe || {};
Exe.shades = [];
Exe.bgcolors = null;

Exe.createShadowCanvas = function(num){
	var canvas = $('<canvas></canvas>');
	$(canvas).width(theCanvas.width);
	$(canvas).height(theCanvas.height);
	var id = 'shadow'+num;
	$(canvas).attr('id',id);
	$('#tempData').append(canvas);
	var domcanvas = document.getElementById(id);
	domcanvas.width = theCanvas.width;
	domcanvas.height = theCanvas.height;
	var context = domcanvas.getContext('2d');
	return {canvas: domcanvas, ctx: context};
}

Exe.startMake = function(){
	Exe.bgcolors = hex2rgb($('#bgcolor').val());
	var tl = tonesList.length;
	for(var i=0; i<tl; i++){
		var tonefill = Exe.createShadowCanvas(i);
		Wordsmith.drawText(tonefill,tonesList[i]);
		Exe.shades.push(tonefill.ctx);
		console.log("made text fill for "+tonesList[i]);
	}
	Exe.matchPixels();
};

Exe.matchPixels = function(){
	var ymax = theCanvas.height;
	var xmax = theCanvas.width;
	for(var y=0; y<ymax; y++){
		var row0 = sudo.getImageData(0,y,xmax,1).data;
		var lenx = row0.length;
		var row1 = sudo.createImageData(xmax,1);
		var shadyrows = [];
		for(var s=0; s<Exe.shades.length; s++){
			shadyrows.push(Exe.shades[s].getImageData(0,y,xmax,1).data)
		} 
		for(var x=0; x<lenx; x+=4){
			var whi = tonesList.indexOf(row0[x]);
			if(whi!=-1){
			row1.data[x] = shadyrows[whi][x];
			row1.data[x+1] = shadyrows[whi][x+1];
			row1.data[x+2] = shadyrows[whi][x+2];
			row1.data[x+3] = 255;
			}
			else { 
			row1.data[x] = Exe.bgcolors.r;
			row1.data[x+1] = Exe.bgcolors.g;
			row1.data[x+2] = Exe.bgcolors.b;
			row1.data[x+3] = 255;
			}
			
		}
		sudo.putImageData(row1,0,y);
	}
	console.log("done replacement");
}

Exe.generate = function() {
	Exe.startMake();
	$("#exe_do").button("option", "disabled", true);
	$("#exe_un").button("option", "disabled", false);
};

Exe.undo = function() {
	clearCanvas(theCanvas);
	Gray.doIt();
	$('#tempData').empty();
	Exe.shades = [];
	$("#exe_do").button("option", "disabled", false);
	$("#exe_un").button("option", "disabled", true);
};

Exe.init = function() {
	$('#exe_do').button({
		icons : {
			primary : "ui-icon-play"
		}
	}).click(Exe.generate);
	$('#exe_un').button({
		disabled : true,
		icons : {
			primary : "ui-icon-arrowreturnthick-1-w"
		}
	}).click(Exe.undo);
	$('#makerbot').buttonset();
};

var theCanvas, sudo, eCanvas, editor;
window.onload = function() {
	$('#toolbox').dialog({
		position : {
			my : "right top",
			at : "right top",
			of : window
		}
	});

	theCanvas = document.getElementById('overCanvas');
	sudo = theCanvas.getContext('2d');
	eCanvas = document.getElementById('editCanvas');
	editor = eCanvas.getContext('2d');
	Mirror.init();
	Gray.init();
	Wordsmith.init();
	Exe.init();

	$('#toolbox_settings').hide();
};


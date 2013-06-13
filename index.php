<html>
	<head>
		<script type="text/javascript" src="../lib/jscolor/jscolor.js"></script>
		<script type="text/javascript" src="../lib/jquery/jquery-1.7.2.min.js"></script>
		<script type="text/javascript" src="../lib/jqui_flick/js/jquery-ui-1.8.11.custom.min.js"></script>
		<script src="http://ajax.googleapis.com/ajax/libs/webfont/1.4.2/webfont.js"></script>
		<script type="text/javascript" src="helpers.js"></script>
		<script>
				WebFont.load({
    google: {
      families: Wordsmith.fontlist
    }
  });
		</script>
		<title>Shade Me with Words [beta]</title>
		<link href="../lib/jqui_flick/css/flick/jquery-ui-1.8.11.custom.css" rel="stylesheet" type="text/css" />
		<link href="style.css" rel="stylesheet" type="text/css" />
		<!--link rel="stylesheet" type="text/css"
	href="http://fonts.googleapis.com/css?family=Merienda|Dr+Sugiyama|Crafty+Girls" /-->
	</head>
	<body>
		<div id="toolbox" title="Toolbox">

			<div id="toolbox_mirror">
				<table>
					<tr>
						<td> Sample Images:
						<select id="chooseImage">
							<option value="ocwee.png">Octaweenie</option>
							<option value="centralpark.jpg">Central Park</option>
							<option value="penguins.jpg">Penguins</option>
							<option value="turtles.jpg" selected="true">Turtles</option>
						</select></td>
						<td rowspan=2>
						<button id="GoImgButton">
							USE THIS IMAGE
						</button></td>
					</tr>
					<tr>
						<td>
					<!--	<u>Load External Image</u>
						<br/>
						<i>Currently only accepting gif,jpg,png images</i>
						<br />
						URL:-->
						<input type="text" name="imgurl" style="display:none;"> 
						</td>
					</tr>
				</table>
			</div>
			<div id="toolbox_settings">
				Background Color
				<input type="text" id="bgcolor" value="FFFFFF" class="color" />
				<br />
				Density
				<input type="number" id="intent" min="0.1" max="1.0" step="0.05" value="0.5" /><br /><br />
				<input type="checkbox" id="egray">
				Saturation Awareness
				<br />
				Additive Scalor:
				<input type="range" id="eg_skalor" min="0" max="200" value="25" />
				<br/>

				Posterization Levels:
				<input type="range" id="postlvl" min="2" max="9" value="3" />
				<br />
				<br />
				<div id="smithbox">
				<canvas id="fontprev" width="250" height="100"></canvas>

<p>Title:
	<input type="text" id="fox_title" value="Hello World!" /></p>
	
<p>Font face:
	<select id="fox_face"></select></p>
    
<p>Font Angle
<input type="number" id="fox_angle" min="-359" max="359" value="0" /> degrees</p>

<p>Font Color
	<input type="text" id="fox_color" value="000000" class="color"><br />
	<input type="checkbox" id="fox_rainbow"> Random Colors</p>
	
	<p>Font Size
	<input type="number" id="fox_size" min="1" max="100" value="12"> px</p>
	
				</div>
				<div id="makerbot">
					<button id="exe_do">
						MAKE IT
					</button>
					<button id="exe_un">
						UNDO
					</button>
				</div>
			</div>
		</div>

		<div id="workarea">
			<canvas id="editCanvas">
				Your browser does not support the HTML 5 Canvas.
			</canvas>
			<canvas id="overCanvas">
				Your browser does not support the HTML 5 Canvas.
			</canvas>
			<img id="preview" src="demoimg/turtles.jpg" />
		</div>
		<div id="tempData"></div>
	</body>
</html>
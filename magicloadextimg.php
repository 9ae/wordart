<?php

$url = $_GET["url"];
$im = null;

list($width, $height, $type, $attr) = getimagesize($url);
/*
 * Type
 * 1: gif
 * 2: jpg
 * 3: png
 */

switch($type){
case 1:
	$im = imagecreatefromgif($url);
	break;
case 2:
	$im = imagecreatefromjpeg($url);
	break;
case 3:
	$im = imagecreatefrompng($url);
	break;
}
if($im!=null){
ob_start();
//header("Content-type: image/png");
imagepng($im);
$stringdata = ob_get_contents();
ob_end_clean();
echo "data:image/png;base64,".base64_encode($stringdata);
}

?>
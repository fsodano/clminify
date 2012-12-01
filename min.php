<?php
	
	//MUST EDIT TO MATCH THE CURRENT CONFIGURATION
	const CONFIG_PATH = 'example/config';
	const CACHE_PATH = 'example/cache';

	/**********************************************************************************/
	/**********************************************************************************/
	/**********************************************************************************/	

	//Set the header to return the right content
	header('Content-type: text/javascript');
	//Make the file cache expire in a long time from now
	header('Expires: '.gmdate("D, d M Y H:i:s", time() + 3600*24*365).' GMT');
	
	/**********************************************************************************/
	/**********************************************************************************/
	/**********************************************************************************/

	//Merge the options preserving the $_GET ones.
	$options = $_GET + array('configPath' => CONFIG_PATH,'cachePath' => CACHE_PATH);
	
	//Require our library
	require('src/cl_minify.php');
	
	//Create the minification object
	$minify = new ClMinify($options);
	
	//Minify the code
	echo $minify->getCode();
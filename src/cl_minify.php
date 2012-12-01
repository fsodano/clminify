<?php
/***
 * A class to minify a set of either JS or CSS files into a single file which is then cached.
 * 
 * 
 * */
class ClMinify
{	
	//TODO: Improve the detection of the directory separator
	//TIP: See how CakePHP does it
	const DS = '/';
	
	/**
	 * Private configuration array
	 * 
	 * @ext contains the extensions for the different file types
	 * 'ext' => (
	 * 	'type' => '.extension'
	 * )
	 
	 * @libs contains the configuration for the different minification libraries
	 * 'libs' => (
	 * 	'type' => (
	 * 		'path' => 'path_to_library/file.php'
	 * 		'name' => 'Class name' //!Important
	 * 	)
	 * )
	 * 
	 * @path => Where to load the files from, this is populated after the initiation
	 * @files => Which files should be concatenated and minified, this is populated after the initiation
	 * */
	private $_config = array(
		'ext' => array(
			'js' => '.js',
			'css' => '.css'
		),
		'libs' => array(
			'js' => array(
				'path' => 'lib/Jsmin.php',
				'name' => 'JSMinPlus'
			),
			'css' => array(
				'path' => 'lib/Cssmin.php',
				'name' => 'Cssmin'
			)
		),
		
		//Declared here, defined later on
		'path' => '',
		'files' => array(),
	);
	
	//Type of minifycation being performed
	private $_type = '';
	
	//General options
	/***
	 *  the $options are:
	 * 
	 * configPath = routes for config files
	 * type = js,css
	 * 
	 *
	*/	
	public $options = array();

	
	/*
	 * Init function, load the options and set the type
	 * 
	 * */
	public function __construct($options){
		$this->options = $options;
		$this->_type = $options['type'];
	}
	
	/**
	 * private _loadConfig
	 * 
	 * Loads the configuration files
	 * 
	 * Sets up which files are going to be minifyed and where will the cache be stored
	 * 
	 * */
	private function _loadConfig(){
		$this->_config['path'] = $this->options['configPath'] . self::DS . $this->_type;
		
		if(!isset($this->options['config'])){
			$this->options['config'] = 'default';
		}
		
		$configFile = $this->_config['path'] . self::DS . $this->options['config'] . '.php';
		
		require($configFile);
		
		if(isset($this->options['files'])){
			foreach($this->options['files'] as $file){
				$minFiles[] = $file;
			}
		}
		
		$this->options['cachePath'] = $this->options['cachePath'] . self::DS . $this->_type . self::DS . $this->options['config'];
		$this->_config['files'] = $minFiles;
	}
	
	/**
	 * 
	 * Gets the hash (name of the cached file) based on the files that need to be minified
	 * 
	 * */
	private function _getHash(){
		
		$time_stamp = null;
		
		foreach($this->_config['files'] as $file){
			
			$stats = stat($file['path']);
			
			//mtime key asociativo para modified time , que provee la función stat
			$time_stamp.= $stats['mtime'];
		}

		$hash = sha1($time_stamp);
		
		return $hash;
		
	}
	
	/**
	 
	 * Seeks the cached file name.
	 * 
	 * @params
	 * @hash the hash of the files to be processed (the hash is the file name)
	 * @returns the name of the cached file or false if the cache file doesn't exists
	 * 
	 * */
	private function _getCachedFile($hash){
		$cachedFileName = $this->options['cachePath'] . self::DS . $hash . $this->_config['ext'][$this->_type];
		
		if(file_exists($cachedFileName)){
			return $cachedFileName;
		}else{
			return false;
		}
	}
	
	/**
	 * Minifies the code
	 * 
	 * Checks each file and decides based on the configuration files if it should be minified and concatenated, or just concatenated
	 * Also created the cached file.
	 * 
	 * @params
	 * @hash the name of the cache file to be created
	 * 
	 * @returns the minified code
	 * */
	private function _minifyCode($hash){
		$minCode = '';
		
		foreach($this->_config['files'] as $file){
			
			$script = file_get_contents($file['path']);
			
			if(isset($file['minify']) && !$file['minify']){
				$minCode .= $script;
			}else{
				
				$className = $this->_config['libs'][$this->_type]['name'];
				$minCode .= $className::minify($script);
				
				echo $minCode;
				die();
				
			}
			
			$minCode .= "\n\r";
			
		}
		
		$this->_generateCache($hash,$minCode);
		
		return $minCode;
	}
	
	
	/*
	 * Generates the cache file
	 * 
	 * @parameters
	 * @hash the name of the file
	 * @content the content to be introduced into the file
	 * 
	 * */
	private function _generateCache($hash,$content){
		
		$cacheDir = $this->options['cachePath'];
		
		//Check if the cache directory exists
		if(is_dir($cacheDir)){
			
			//Scan the files
		    $dirFiles = scandir($cacheDir);
			
			//Counts that there's at least 1 cache file present.
			//0 and 1 positions are for "." and ".." respectively.
		    if(count($dirFiles) > 2){
				//Delete the oldest file
				//REMOVED: Because it messes up the &files[] dynamic loading.
				//TODO: Solve so the cache file folder doesn't grow forever.
		    	//unlink($cacheDir . self::DS . $dirFiles[2]);
		    }
		}else{
			//Create it
			mkdir($cacheDir);
		}
		
		//Creates the file in the configuration directory
		$fh = fopen($cacheDir . self::DS . $hash . $this->_config['ext'][$this->_type] , 'w+');
		
		//Writes the content to the file
		fwrite($fh,$content);
		
		//closes the file
		fclose($fh);
		
		return true;
	}
	
	/**
	 * getCode
	 * 
	 * Gets the code for the selected files, if cached version is available, it's served, if not, a new version is cached and then served.
	 * 
	 * */
	public function getCode(){
		
		//Require the minification library based on the type
		require($this->_config['libs'][$this->_type]['path']);
		
		//Load the configuration
		$this->_loadConfig();
		$hash = $this->_getHash();
		
		//Get the cache file
		$cachedFile = $this->_getCachedFile($hash);
		
		//If it doesn't exist
		if($cachedFile === false){
			//Create the code
			$minifiedCode = $this->_minifyCode($hash);
		}else{
			//Get cached version
			$minifiedCode =  file_get_contents($cachedFile);
		}
		
		//Return the minified code
		return $minifiedCode;
		
	}
}
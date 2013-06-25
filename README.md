# CLMinify

A PHP minifier and cacher for JS and CSS based on JsMin+ and CssMin by Fabricio Sodano

I have no idea about licenses, so do whatever you want with it (even say you did it, if it makes you happy :P),
but I believe you're restricted by everyone elses's licenses.


##How to use

You incude the ```min.php``` script in your ```<script>``` or ```<link>``` tags and specify if it's a 
js or css minification/caching that you're doing, that's the most basic usage.


```html
 	<!-- Default configuration -->
		<script type="text/javascript" src="../min.php?type=js"></script>
		
		<!-- Extra files -->
		<script type="text/javascript" src="../min.php?type=js&files[][path]=example/js/test.js&files[][path]=example/js/test2.js"></script>
		<link rel="stylesheet" href="../min.php?type=css" type="text/css" media="screen, projection" />
		
		<!-- Other configuration -->
		<!--script type="text/javascript" src="../min.php?type=js&config=other"></script>
		<link rel="stylesheet" href="../min.php?type=css&config=other" type="text/css" media="screen, projection" /-->
```

You can also add individual files or other configurations, by adding the ```&config=other``` parameter to the min.php
file, of course, the "other" has to be replaced by a valid configuration specified by you in the "config" folder.



```php
//config/default.php <-- you can clone this file and create new configurations
<?php 
 /*
 	Scripts that should be loaded throughout your site!
	*/
 
	$minFiles = array( //<-- array named minFiles is mandatory!
		array(
			'path'=>'example/js/test.js', //<-- relative path from the executing file
			'minify'=>true //<-- minify or just concat?
		)
	);
```

You can check the "example" folder for a working example.

##How it works

The minifier part is just an implementation of CSSMin and JS Minifier, this script just provides an extra layer
for configuration.

As for the caching, it creates a hash of the content of the concatenated files and re-creates it if they don't match
(so you never have an outdated version of your scripts), if they do match, it just serves the .js stored in your server.

##Credits

The caching idea of the scripts was taken from here:

http://verens.com/2008/05/20/efficient-js-minification-using-php/


JS Minifier by Tino Zijdel <crisp@tweakers.net> 

Latest version of this script:
http://files.tweakers.net/jsminplus/jsminplus.zip

/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is the Narcissus JavaScript engine.
 *
 * The Initial Developer of the Original Code is
 * Brendan Eich <brendan@mozilla.org>.
 * Portions created by the Initial Developer are Copyright (C) 2004
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s): Tino Zijdel <crisp@tweakers.net>
 * PHP port, modifications and minifier routine are (C) 2009-2011
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
 * 

CSS Minifier by Joe Scylla <joe.scylla@gmail.com>

 * @package   CssMin
 * @link		http://code.google.com/p/cssmin/
 * @author		Joe Scylla <joe.scylla@gmail.com>
 * @copyright	2008 - 2011 Joe Scylla <joe.scylla@gmail.com>
 * @license		http://opensource.org/licenses/mit-license.php MIT License
 * @version		3.0.1
 * 
 *  * --
 * Copyright (c) 2011 Joe Scylla <joe.scylla@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 

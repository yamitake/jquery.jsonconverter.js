/**
 * jquery.jsonconverter.js ver1.0
 *
 * The MIT License
 *
 * Copyright (c) 2011 yapr
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
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function($) {
	/** result class String Array */
	var classesStrArray;

	$.jsonconvert = function(str , options){
		/**
		 * default Options
		 */
		var defaults ={
				type          : "java"  ,
				rootClassName : "Sample",
		};
		var opts = $.extend(defaults , options);

		try{
			var obj = $.evalJSON(str);
			classesStrArray = new Array();
			result =  convertJava(obj , opts.rootClassName , opts);

			alert(result);
		}catch( e ){
			alert( e );
		}
	};

	function convertJava(obj , rootClassName , opts)
	{
		var result = getHeader(rootClassName , opts);

		for(var pname in obj){
			var val = obj[pname];

			 if(val === null){
			 }else if (typeof val === 'boolean') {
				 result += getVariableDeclaration("Boolean" , pname , opts);
			 } else if (typeof val === 'string') {
				 result += getVariableDeclaration("String" , pname , opts);
			 } else if (typeof val === 'number') {
				 if (parseFloat(val) == parseInt(val, 10)) {
					 result += getVariableDeclaration("int" , pname , opts);
				 } else {
					 result += getVariableDeclaration("float" , pname , opts);
				 }
			 }else if (val instanceof Date) {
				 result += getVariableDeclaration("Date" , pname , opts);
	        }else if(typeof obj === 'object'){
	        	//className = ClassName
	        	var className = pname.substr(0,1).toUpperCase() + pname.substr(1);
	        	getVariableDeclaration(className , pname , opts);

	        	//recurrent
	        	if((val instanceof Array)){
		        	convertJava(val[0] , className , opts);

	        	}else{
	        		convertJava(val , className , opts);
	        	}
	        }
		}
		result += getFooter(opts);

		classesStrArray[classesStrArray.length] = result;
		return classesStrArray;
	}

	/**
	 * Class宣言を持ってくる
	 */
	function getHeader(rootClassName , opts)
	{
		switch(opts.type)
		{
			case "java":
				return "public class " + rootClassName + "{\n";
				break;
			case "php":
				return "class " + rootClassName + "{\n";
				break;
			default:
				 throw "invalid type";
			break;
		}
	}

	/**
	 * 変数宣言
	 */
	function getVariableDeclaration(className , varName , opts){
		switch(opts.type)
		{
			case "java":
				return "\tpublic " + className + " " + varName + ";\n";
				break;
			case "php":
				return "\tpublic var $" + varName + ";\n";
				break;
			default:
				 throw "invalid type";
			break;
		}
	}


	/**
	 * Class宣言閉じ
	 */
	function getFooter(opts){
		switch(opts.type)
		{
			case "java":
			case "php":
				return "}\n";
				break;
			default:
				 throw "invalid type";
			break;
		}
	}
})(jQuery);
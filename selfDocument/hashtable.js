function Hashtable(){
    this.clear = hashtable_clear;
    this.containsKey = hashtable_containsKey;
    this.containsValue = hashtable_containsValue;
    this.get = hashtable_get;
    this.isEmpty = hashtable_isEmpty;
    this.keys = hashtable_keys;
    this.put = hashtable_put;
    this.remove = hashtable_remove;
    this.size = hashtable_size;
    this.toString = hashtable_toString;
    this.values = hashtable_values;
    //this.hashtable = new Array();
    this.hashtable=[];
}


function hashtable_clear(){             //清空
   this.hashtable=[];
}

function hashtable_containsKey(key){    //key包含条件key
    
	for (var i in this.hashtable) {
        if (i === key && this.hashtable[i] != null) {
			 return true;
        }
    }
    return false;
}

function hashtable_containsValue(value){    //value包含条件
    if (valule != null) {
        for (var i in this.hashtable) {
            if (this.hashtable[i] == value) {
                return true;
            }
        }
    }
    return false;
}

function hashtable_get(key){        //get by key
    return this.hashtable[key];
}

/*判断是否为空*/
function hashtable_isEmpty(){
    return (this.size === 0) ? true : false;
}

/*将key存入一个数组*/
function hashtable_keys(){
    var keys = new Array();
    for (var i in this.hashtable) {
        if (this.hashtable[i] != null){
			 keys.push(i);
		 }            
    }
    return keys;
}

/*将value存入一个数组*/
function hashtable_values(){
    var values = new Array();
    for (var i in this.hashtable) {
        if (this.hashtable[i] != null) {
            values.push(this.hashtable[i]);
        }
    }
    return values;
}

/*存value*/
function hashtable_put(key, value){
    if(argument.length===1 && Object.prototype.toString.call(argument[0])==="[object Array]"){
        for(var i=-1,val;val=key[i++];){
           this.hashtable[val[0]]=val[1];
        }
    }
    if (!key || !value) {
        throw 'NullPointerException{' + key + '},{' + value + '}';
    }else {
        this.hashtable[key] = value
    }
}

/*移除*/
function hashtable_remove(key){
    var rtn = this.hashtable[key];
    this.hahstable.splice(key, 1);
    return rtn;
}

/*长度*/
function hashtable_size(isnull){
	if(isnull){
		//返回实际长度
		return this.hashtable.length;   		
	}
	//返回有数据的长度
    var size = 0;
    for (var i in this.hashtable) {
        if (this.hashtable[i] != null) {
            size++;
        }
        
    }
    return size;
	
}

/*转换string*/
function hashtable_toString(debug){
    var result =[];
    for (var i in this.hashtable) {
        var param=this.hashtable[i];
        if (this.hashtable[i] != null) {
            
            if(typeof param==='object'){
                result.push(i+':'+zhun(this.hashtable[i]))
            }else{      
                result.push(i+':'+this.hashtable[i]);
            }
            //result.push(i+':'+this.hashtable[i])
        }
    }
    if(debug){
        return result.join('\n'); //replace(/\n/g,'')   
    }else{
        return result.join('');    
    }
    
}

function zhun(object){
    var cache=[];
    for(var i in object){
        var ca=object[i];
        if(ca){
            if(typeof ca==='object'){
                cache.push(i+' : '+zhun(ca))
            }else{
                cache.push(i+' : '+ca);
            }
        }        
    }
    return '{'+ cache.join() +'}'
}
/*

 使用方法：

 var hashTable=new Hashtable();  //实例化

 hashTable.put(0,'abc');

 hashTable.put(1,'153');

 hashTable.put(2,'254');

 //遍历hashtable 严格遍历(不推荐使用) 个人推荐使用第二种hashtable方法进行遍历 
for (var i = 0, a; a = hashTable.hashtable[i++];) {
	console.log(a);
}

 //遍历hashtable  用hashtable方法

 for(var key in hashTable.hashtable){	
	console.log(hashTable.get(key));	
 }	


 alert(hashTable.containsKey(1));  //返回true

 alert(hashTable.containsKey(4));  //因为不存在key为4，返回false

 alert(hashTable.containsValue('88'))  //因为不存在value为88的 返回false

 hashTable.remove(1);  //移除key为1的元素

 alert(hashTable.containsKey(1));  //因为key为1的元素已被上行的remove移除，所以返回false

 */




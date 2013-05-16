var Class = {
	makeClass: (function() {
		/*目的:
             将[Object对象]转换为[构造函数],进而实现new来构建继承对象
             过程:
                 1:检测argument是否为多个,如为多个,即先将其利用init函数来继承
                 2:将所有的继承过来的属性与方法,放入到 init函数中并返回该函数
                 3:通过new关键字来 继承 即:实则为继承的init
             注意:
                调用父类同名函数的时候,使用 childName._super.call(this,argument);
                constructor:默认属性 writable:true,enumerable:true,configurable:true
       */
		var create = function(corl, superCtor) {
			corl._super = function(params) { //调用父类方法
				params = params || [];
				if (params) {
				    var type=params.shift();
                    this._father[type].apply(this, params);
                    if(type==='init'){
                        delete this._father.init;
                    }
				} else {
					console.log('fuck no params ');
				}

			};
			
			if ( !! window.jQuery) { //针对jQuery使用extend
				$.extend(corl.prototype, superCtor.prototype);
			} else {
				if (Object.create) {
					corl.prototype = Object.create(superCtor.prototype, {
						constructor: {
							value: corl,
							writable: true,
							enumerable: true,
							configurable: true
						}
					});
				} else {
					var cache = function() {}; //创建中间函数
					cache.prototype = superCtor.prototype; //将中间函数的原型指向父类元素的prototype原型 此时为 浅复制
					corl.prototype = new cache(); //将corl的prototype指向中间函数.至此完成 深度继承
				}
			}

			corl.prototype.constructor = corl; //将corl的构造函数指向自己 至此跟cache断关系
			//构造函数调用父亲
			superCtor.prototype.init = superCtor;
			corl.prototype._father = superCtor.prototype;
		};

		return function() {
			var length = arguments.length - 1, //获取继承者(一般为第二个)
				childs = arguments[length] || {}, //继承者属性个数
				init = childs.init || function() {}; //继承者init继承预备函数

			for (var i = 0; i < length; i++) {
				create(init, arguments[i]); //开始继承父类
			}

			for (var prop in childs) {
				if (prop !== 'init') {
					init.prototype[prop] = childs[prop]; //把自己的属性添加到init继承预备函数的prototype中 
				}
			}
			return init; //返回制作完成的构造函数
		};
	})()
};

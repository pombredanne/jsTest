###
<script type="text/javascript" src="https://raw.github.com/jashkenas/coffee-script/master/extras/coffee-script.js"></script>
	<script type="text/coffeescript">
	    alert "I knew it!"
	</script>
<script type="text/coffeescript" src="myapp.coffee"></script>
不建议 使用这种方式
http://ruby-china.org/topics/4789
http://zhang.zipeng.info/library/coffeescript/02_syntax.html
http://coffeescript.org/
http://dreamhead.blogbus.com/tag/CoffeeScript/
http://koala-app.com/index-zh.html
###


#拼接字符串  必须使用 双引号  "  不能使用 '   
name ="rambo"
result ="hello #{name}"
#alert(result)


###
函数:
		coffeescript 中准确来说 并没有对作用域有过多的解决办法  采用的是 强制使用别的命名空间
		coffeescript 函数的特点:
				1:全部采用 变量形式的functin   因此一定要养成 先定义 后使用的习惯
				2: 向Ruby学习  函数最后通常都会 自动return 最后一句
###
age=10
funTest1 =-> age=0
funTest1()
#alert age

###
对于上面的语法:
我们想要的是:
var age=10;
function Test1(){
	  var age=0;
    return age;
}
但是很抱歉 在coffeescript中不可以  解决办法: 尝试使用别名
###

# 新判断语句   unless
odd=(num) ->
				unless typeof num is "number"  #is:===
			     throw "#{num} is not a number"
				unless num is Math.round num
						throw "#{num} is not an integer"
			  unless num>0
						throw "#{num} <0"
				num % 2 is 1
				
# this  上下文
setPerson =(name) -> @name=name
cat={}
cat.setName=setPerson
cat.setName 'rambo'

#默认参数设置
ring=(isi,k,p=true,o) -> 
      # 相当与 isi==null   因此无法判断 ''
      isi=true unless isi?  
      k ?=true  
     
      # 相当与 !o     
      o=true unless o    
   
      #上面三种方法 不管那种 如果单独使用 则会形成如下js: return k != null ? k : k = true;
			
			
			
			
			
			
father=
   name:'shiming'
   age:48
   son:
      name:'rambo'
      age:20
   
father1=name:"shiming",age:48,son:[name:'rambo',age:23]

delta="rambo"
greek={delta}

#给对象添加属性
c=3
a=b?.father ? c   
#注意?之后的空格 
b?.prototype?c
a=b?.father?c    #这样会判断成 b.father(c)


array=[1,2,3,4,5]
array1=[1..10]
array2=[1...10]  #没有10
array2.slice 0,5
array2[0..3]  # [1,2,3]
array2[0...3] # [1,2]
[1..10][2..]  #[3..10]
[1..10][0..-3]  #[1..8]

for key,value of array2
    console.log value

for key in array1
    console.log key

func=()->
for key,value of array2 when typeof value is "function"
    func()

#by 语法 起步
animat=(army) ->
      solider for solider in army by 10

for key in array1 by 2
    console.log key

5 in array2   #判断元素是否存在该数组
5 of array2

array2[5]?

array2 while true
array2 until false   

loop
   console.log 'Home'
   break if @flag is true
   console.log 'Sweet'
   @flag =true

a=0
loop break if ++a > 999
console.log a

po=[1..10]
p=(-num for num in po)

p=(char while char=func())  #类似简单的map功能啦

[aa,bb,cc]=[1,2,3];



#真正意义上的全局函数
root=global ? window
root.name='rambo'
alert name

#定义类
class Tribble
      constructor: ->
          @isAlive=true
          @.count++
      breed: -> new Tribble if @isAlive
      die: -> #函数内部为类原型绑定方法
          @count-- if @isAlive
          @isAlive=false
      @count:0
      @makeTrouble:->console.log ('Trioble' for i in [o..@count]).join(' ')
Tribble:: getName ->console.log 'rambo'    #在外部为类绑定原型

#继承
class Pet
      constructor: -> @isHungry = true
      eat: (name) ->  #类对象中 定义方法 无需使用 =
            console.log name
            @isHungry =false

class Dog extends Pet
      eat: (name) ->
         console.log 'dog is hungry'   #这里即实现啦所谓的OO语法中的多肽  重写啦eat方法 但还是可以利用 super使用父类的eat方法
         #调用父类的 eat方法
         #super()     #不传参
         super(name) #传指定参数
         #super       #传全部参数  argument
      fetch: ->
         console.log 'Yip'
         @isHungry=true

# 多肽
class Shape
      constructor: (@width) ->
      computeArea: -> throw new Error "l am an abstract class!" 

class Circle extends Shape
      radius: -> @width / 2
      computeArea: -> 
           Math.PI %Math.pow @radius(),2 #重写父亲方法
       
###
ps: 在编译成js的时候  # 这样的注释 是无法编程js的 //
只有多行注释 才会在js中显示出来
###



#jQuery coffeescript 使用
$ ->
  arr = [ "a", "b", "c", "d", "e" ]
  $('#ui').show('slow')
  arr = jQuery.map(arr, (n,i)->
                        (n.toUpperCase()+i)
                  )
  $.ajax({
      type: 'POST'
      date: 
           name:'rambo'
           age: 23
      success: (data) ->
                console.log data
      error: (data) -> console.log 'it is wrong' 
  })
      
		
		
	

#  ----------------------  CoffeeScript 函数绑定 ------------------ #

$ = jQuery                                                        #(1)
$.fn.zebraTable = (options) ->
###
 实现 (function($){  ....  })(jQuery)  功能
###
          
Account1 = (@customer, @cart) ->                                 #(2)
  ###
    直接在参数中写 @customer  好比在 函数体内 this.name=name;
  ###
  $('.shopping_cart').bind 'click', (event) =>
    @customer.purchase @cart

###
 (2):通常用在 嵌套函数中 修改函数内部this指向
      var Account;

     Account = function(customer, cart) {
           var _this = this;

           this.customer = customer;
           this.cart = cart;
           return $('.shopping_cart').bind('click', function(event) {
              return _this.customer.purchase(_this.cart);
           });
      };      
###


obj=                                                            #(3)
  name:'rambo'
  age:10
  
alertName =() -> alert(this.name)
alertName.aplly obj,obj
   
((obj)->                                           #(3.1)      
  console.log this   # 这里仍然指向 windows 不要妄想 更改this
)(obj)

###
   (3):  应该不难看懂 不解释
###

# ps  一个草蛋的语法糖

race = (winner, runners,ohtner...) -> console.log winner, runners   #含义:  winner=argument[0],runners=argument[1],other=[argument.[3],arugument[4].....]

#http://koala-app.com/index-zh.html

		
	

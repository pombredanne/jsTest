/****************************************************************************
 * DESC       ：公用函数变量定义
* Author     : 中国大地项目组
 * CREATEDATE ：2002-06-14
 * MODIFYLIST ：   Name       Date            Reason/Contents
 *          ------------------------------------------------------
 *           zhouxianli   2002-07-08       添加输入域的maxleng控制
 *           zhouxianli   2002-08-26       整理
 *           sunchenggang 2002-09-03       修改collectByCurrency脚本
 *           sunchenggang 2002-09-04       添加按币别、保额计算标志汇总脚本collectByCurrencyAndCalculateFlag
 *           zhouxianli   2002-09-05       添加方法,一次给所有的input域添加onchange方法，且保留原有onchange()
 *           sunchenggang 2002-09-06       添加按变化量汇总脚本showCollectChange
 *           zhouxianli   2002-09-09       add method numberFormat()
 *           zhouxianli   2002-09-10       add method setReadonlyOfAllInput(),undoSetReadonlyOfAllInput();
 *           sunchenggang 2002-09-11       add method calTimeSinglePremium()
 *                                         修改deleteRowForPG，当flag="D"时，恢复原值
 *           zhouxianli   2002-09-12       修改setOnchangeOfAllInput为setOnchangeOfTable(),一次给一个table的
 *                                         input域添加onchange方法，且保留原有onchange()
 *                                         修改setTitleOfAllInput();
 *           zhouxianli   2002-09-13       add method isEmpty(field)  return true/false.
 *           sunchenggang 2002-09-18       add method setBackColorOfTable()
 *           luxupan      2002-10-17       增加showSpan和hideSpan方法
 *                                             getTableFieldsName方法
 *                                             setFlagPG方法
 *           zhouxianli   2002-10-21       add method setTableDisabled(PageCode,Value)
 *                                         //为一页中所有的元素设置disabled,value = true or false
 *           zhouxianli   2002-10-22       add method functionReturnFalse() and functionReturnTrue()
 *           zhouxianli   2002-10-23       添加可发布函数列表
 *           zhouxianli   2002-10-24       优化getElementOrder() and getElementCount()
 *           zhouxianli   2002-11-08       修正checkDecimal不校验输入域的数字是否是decimal的问题
 *           zhouxianli   2002-11-11       修改checkDateTime,加入Year-Minute的方式
 *           zhouxianli   2002-11-14       添加函数setCheckBoxReadonly()，设置checkbox的Readonly
 *           zhouxianli   2002-11-14       添加函数pressCustom()，checkCustom()
 *           zhouxianli   2002-11-21       修改函数setOption,支持Select数组
 *           zhouxianli   2002-11-21       新增函数compareFullDate,//比较两个日期字符串
                                           date1=date2则返回0 , date1>date2则返回大于0的整数, date1<date2则返回小于0的整数
 *           zhouxianli   2002-11-22       新增函数setObjectDisplay，设置对象是否显示
 *           lijiyaun     2002-12-03       新增函数checkHour()效验输入小时是否合法
 *           renyiqun     2003-02-26              修改relate()函数
 *           xuxinyuan    2003-04-18       新增函数checkBetweenDate用来校验查询条件的日期
 *           xiaojian     2003-04-22       新增函数compareFullTime(date1,date2)比较两个日期（包括小时和分钟）字符串
 *           zhangying    2003-05-27       新增函数checkNull(field)判断输入域不为空，为空提示，但是不锁定焦点
 *           sunfei       2004-12-17       新增函数ShowContractNo,如果是车队的车辆显示合同信息
 *           zhouliubin   2007-08-09       convertCurrency();人民币数字转换成中文大写货币形式
 *           chenxi       2008-11-25       新增函数viewTracePolicy()，用于保单查询核保信息
 *           mxy          2009-05-25       getShortRate（两个）方法中修改strMode=1为短期费率表
 ************************************************************************************/

/************************************************************************************
  函数组        函数名称                函数作用
  系统函数
                functionReturnFalse     返回false
                functionReturnTrue      返回true
                functionDoNothing       空函数,什么也不做
                setObjectDisplay        设置对象是否显示
                getElementIndex         查找元素在Form(fm)中的顺序，没有则返回-1
                getElementCount         查找在Form中的同名元素，没有则返回0
                getElementOrder         得到元素在Form中的同名元素中的顺序,从1开始计数
                errorMessage            弹出错误信息
                cancelForm              默认的取消按钮处理方法，即重定向到一个空白文件

  日期处理函数
                getNextDateFullDate     得到下n天
                getNextMonthFullDate    得到下n月
                getNextYearFullDate     得到下n年
                convertFullDateToString 得到日期的字符串表达形式，传入参数为Date类型,如果不传，则默认为当天

  数据判断函数
                isDate                  检查数据是否是日期,是返回true,否则返回false
                isInteger               检查数据是否是整数,即只包含字符0123456789,是返回true,否则返回false
                isNumeric               检查数据是否是数字,是返回true,否则返回false

  输入域校验函数
                checkDatetime           如果输入域不为空，校验输入域的值是否为Datetime型,如果不是则弹出提示且无法离开
                checkDecimal            如果输入域不为空，校验输入域的值是否为在输入许可范围内的Decimal型,如果不是则弹出提示且无法离开
                checkFullDate           如果输入域不为空，校验输入域的值是否为FullDate(即年月日的Date)型,如果不是则弹出提示且无法离开
                checkInteger            如果输入域不为空，校验输入域的值是否为Integer型,如果不是则弹出提示且无法离开
                checkSmallint           如果输入域不为空，校验输入域的值是否为Smallint型,如果不是则弹出提示且无法离开
                checkLength             如果输入域不为空，校验输入域的值是否为不大于最大长度的字符型,如果不是则弹出提示且无法离开
                checkCustom             如果输入域不为空，校验输入域的值是否为指定格式的值,如果不是则弹出提示且无法离开
                checkNull               判断输入域不为空，为空提示，但是不锁定焦点

  字符串处理函数
                leftTrim                返回输入字符串去除左侧开始的空格后的字符串
                rightTri                返回输入字符串去除右侧开始的空格后的字符串
                trim                    返回输入字符串去除左右两侧开始的空格后的字符串
                replace                 返回输入字符串全部替换后的结果
                newString               将给定字符串复制ｎ遍并返回

  输入域按键函数
                pressDatetime           输入域只可输入Datetime型数据
                pressDecimal            输入域只可输入Decimal型数据
                pressFullDate           输入域只可输入FullDate型数据
                pressHour               输入域只可输入Hour数据
                pressInteger            输入域只可输入Integer型数据
                pressCustom             输入域只可输入指定的数据，用规则表达式表示 如pressCustom(event,/[\d]/) 只让输入数字

  数字处理函数
                point                   按传入的精度对数值格式化
                pointTwo                对数值按0.00格式化
                pointFour               对数值按0.0000格式化
                round                   按传入的精度对数值四舍五入
                numberFormat            对数字格式化(实现千分位显示等)，delimiterChar默认为"," precision默认为3
                retExpTest              执行正则函数功能

  其他
                getTableFieldsName      得到table里第一个tbody里的所有输入域的名称
                setOnchangeOfElement
                setOnchangeOfTable        一次给所有的input域添加onchange方法，且保留原有onchange()，不适用于多行的上一条/下一条模式
                setOnchangeOfTableSpecial 一次给所有的input域添加onchange方法，且保留原有onchange()，用于多行的上一条/下一条模式
                setOption                 分割代码并放在select域里，串的格式: 值FIELD_SEPARATOR文本GROUP_SEPARATOR值FIELD_SEPARATOR文本...
                setReadonlyOfAllInput     一次给所有的text,textarea设置为readonly,select-one变成只保留当前选项，过程部分可逆
                setTitleOfAllInput        一次给所有的element用value设置title
                setCheckBoxReadonly       将CheckBox设置为只读或可读写


  应用函数

                showCollectItem         显示汇总主险
                showCollectItemApd      显示汇总附加险
                showCollectCurrency     显示按币别汇总
                showCollectChange       显示按变化量汇总
                showCollectItemC        显示船险汇总主险
                showCollectItemY        显示货险汇总主险
                showCollectItemApdC     显示船险汇总附加险


  ######### 未完待续

/************************************************************************************/


//定义常数
var FIELD_SEPARATOR = "_FIELD_SEPARATOR_";   //字段之间的分割符
var GROUP_SEPARATOR = "_GROUP_SEPARATOR_";     //一组代码之间的分割符
var DATE_DELIMITER="-";       //日期分隔符
var BGCOLORU="#FFFF00";        //修改(颜色)
var BGCOLORI="#00F0F0";       //添加(颜色)
var BGCOLORD="#778899";       //删除(颜色)

var MAX_SMALLINT = Math.pow(2,15) - 1;
var MIN_SMALLINT = -MAX_SMALLINT;

var MAX_INTEGER  = Math.pow(2,31) - 1;
var MIN_INTEGER  = -MAX_INTEGER;
var MIN_HOUR     = 0;
var MAX_HOUR     = 24;
var MAX_DISRATEB = 8;

//var DATEVALUEDELIMITER=":";       //日期分隔符
//var NAMEVALUEDELIMITER=":";       //域名与域值的分隔符
//var SBCCASECOLON="：";
//var FIELDDELIMITER="|";       //域之间的分隔符
//var SBCCASEVERTICAL="｜";
//var RECORDDELIMITER="^";      //记录之间的分隔符
//var CODE_DELIMITER = "-";    //代码和名称之间的显示分隔符


function functionReturnFalse()
{
  return false;
}

function functionReturnTrue()
{
  return true;
}

function functionCancelFocus()
{
  errorMessage("只读输入域不能选择！");
  this.blur();
  window.focus();
  return false;
}


//empty function
function functionDoNothing()
{
  //do nothing
}

function getFunctionName(FunctionDesc)
{
  var start = 0;
  var end = 0;
  var tempValue = FunctionDesc;
  tempValue = tempValue.toString();
  start = tempValue.indexOf("{") + 2;
  end = tempValue.lastIndexOf("}");
  tempValue = tempValue.substr(start,end-start);
  tempValue = replace(tempValue,"return","");
  tempValue = replace(tempValue,";",",");
  tempValue = trim(tempValue);
  if(tempValue.charAt(tempValue.length-1)==",")
  {
    tempValue = tempValue.substring(0,tempValue.length-1) + ";";
  }
  return tempValue;
}

//RegExt Test
function regExpTest(source,re)
{
  var result = false;

  if(source==null || source=="")
    return false;

  if(source==re.exec(source))
    result = true;

  return result;
}

//设置对象是否显示
function setObjectDisplay(ID,flag)
{
  var obj = document.all(ID);
  var intCount = 0;
  var i = 0;
  if(obj==null)
  {
    errorMessage("setObjectDisplay('" + ID + "','" + flag + "')的第一个参数不正确");
    return;
  }
  intCount = obj.length;
  //单个
  if(intCount==null)
  {
    //modify begin by lir ,shenzhen,2004-10-30 隐藏y险
    //if(flag==true)
      if(flag==true && ID!="KindCode_Y")
    //modify end by lir ,shenzhen,2004-10-30 隐藏y险
      obj.style.display = "";
    else
      obj.style.display = "none";
  }
  else //多个
  {
    for(i=0;i<intCount;i++)
    {
    //modify begin by lir ,shenzhen,2004-10-30 隐藏y险
    //if(flag==true)
      if(flag==true && ID!="KindCode_Y")
    //modify end by lir ,shenzhen,2004-10-30 隐藏y险
        obj[i].style.display = "";
      else
        obj[i].style.display = "none";
    }
  }
}
//查找元素在Form中的顺序，没有则返回-1
function getElementIndex(field)
{
  var intElementIndex = -1;

  for(var i=0;i<fm.elements.length;i++) //查找fm里的元素
  {
    if(fm.elements[i]==field)
    {
      intElementIndex=i;
      break;
    }
  }
  return intElementIndex;
}


//查找在Form中的同名元素，没有则返回0, frm默认为当前页面的fm
function getElementCount(strFieldName,frm)
{
  var intCount = 0;
  var frmForm = (frm==null?document.fm:frm);

  try
  {
    intCount = eval( frmForm.all(strFieldName).length );
    if(isNaN(intCount)) intCount = 1;
  }
  catch(E)
  {
    intCount = 0;
  }

  //select输入域的特殊处理
  if(intCount>1 && frmForm.all(strFieldName)[0].tagName=="OPTION")
  {
    intCount = 1;
  }

  return intCount;
}

//得到元素在Form中的同名元素中的顺序,frm默认为当前页面的fm
function getElementOrder(field,frm)
{
  var intOrder = 0;
  var intCount = getElementCount(field.name,frm);
  var frmForm = (frm==null?document.fm:frm);

  if(intCount>1)
  {
    for(var i=0;i<intCount;i++)
    {
      if(frmForm.all(field.name)[i].name==field.name)
      {
        intOrder++;
      }
      if(frmForm.all(field.name)[i]==field)
      {
        break;
      }
    }
  }
  else
  {
    intOrder = 1;
  }
  return intOrder;
}

//对输入域是否是日期的校验，splitChar参数缺省为"-"
function isDate(date,splitChar)
{
  var charSplit = (splitChar==null?"-":splitChar);
  var strValue = date.split(charSplit);

  if(strValue.length!=3) return false;
  if(!isInteger(strValue[0]) || !isInteger(strValue[1]) || !isInteger(strValue[2]) ) return false;

  var intYear  = parseInt(strValue[0],10);
  var intMonth = parseInt(strValue[1],10)-1;
  var intDay   = parseInt(strValue[2],10);

  var dt = new Date(intYear,intMonth,intDay);
  if( dt.getFullYear() != intYear ||
      dt.getMonth() != intMonth ||
      dt.getDate() != intDay
     )
  {
    return false;
  }
  return true;
}

/**
 @Author     : 中国大地项目组
 @description 检查日期输入域 变成yyyy/mm/dd  2003/2/4  ->2003/04/04
 @param       日期串
 @param       分隔符
 @return      无
 */
 function formatFullDate(field,date_Delimiter)
{
  var strValueDate  ;  //用于存放日期值
  var strDate = field.value;
  var strReturnDate ;  //新组成的格式串
  strValueDate = strDate.split(date_Delimiter);
  if(strValueDate[0].length==2)
  {
     strValueDate[0]= "20" + strValueDate[0];
  }
  if(strValueDate[1].length==1)
  {
     strValueDate[1]= "0" + strValueDate[1];
  }

  if(strValueDate[2].length==1)
  {
     strValueDate[2]= "0" + strValueDate[2];
  }
  //重新组成串
  strReturnDate = strValueDate[0] + date_Delimiter + strValueDate[1] + date_Delimiter + strValueDate[2];
  field.value = strReturnDate ;
  return true;
}
/**
 @Author     : 中国大地项目组
 @description 检查日期输入域 变成yyyy/mm/dd  2003/2/4  ->2003/04/04
 @param       日期串
 @param       分隔符
 @return      无
 */
 function formatChgFullDate(strDate,date_Delimiter,date_Delimiter1)
{
  var strValueDate  ;  //用于存放日期值
  var strReturnDate ;  //新组成的格式串
  strValueDate = strDate.split(date_Delimiter);
  if(strValueDate[0].length==2)
  {
     strValueDate[0]= "20" + strValueDate[0];
  }
  if(strValueDate[1].length==1)
  {
     strValueDate[1]= "0" + strValueDate[1];
  }

  if(strValueDate[2].length==1)
  {
     strValueDate[2]= "0" + strValueDate[2];
  }
  //重新组成串
  strReturnDate = strValueDate[0] + date_Delimiter1 + strValueDate[1] + date_Delimiter1 + strValueDate[2];
  return strReturnDate;
}

//检查日期输入域
function checkFullDate(field)
{
  field.value = trim(field.value);
  var strValue = field.value;
  var desc   = field.description;
  //如果description属性不存在，则用name属性
  if(desc==null)
    desc = field.name;
  if(strValue=="")
  {
    return false;
  }
  if(isNumeric(strValue ))
  {
    if(strValue.length > 6 && strValue.length < 9)
    {
        strValue = strValue.substring(0,4) + DATE_DELIMITER + strValue.substring(4,6) + DATE_DELIMITER + strValue.substring(6);

        field.value = strValue;
    }
     else
     {
      errorMessage("请输入合法的" + desc +"\n类型为日期，格式为YYYY-MM-DD 或者YYYYMMDD");
        field.value="";
        field.focus();
        field.select();
        return false;
     }
  }
  if( !isDate(strValue,DATE_DELIMITER) && !isDate(strValue)||strValue.substring(0,1)=="0")
  {
    errorMessage("请输入合法的" + desc +"\n类型为日期，格式为YYYY-MM-DD 或者YYYYMMDD");
    field.value="";
    field.focus();
    field.select();
    return false;
  }else{
	  if(strValue.split("-")[1].length<2){//add by gaochaofeng 20110314 task-8163 对日前格式化进步优化
	    strValue = strValue.split("-")[0]+"-"+"0"+strValue.split("-")[1]+"-"+strValue.split("-")[2];
	  }
	  
	  if(strValue.split("-")[2].length<2){//add by gaochaofeng 20110314 task-8163 对日前格式化进步优化
	    strValue = strValue.split("-")[0]+"-"+strValue.split("-")[1]+"-"+"0"+strValue.split("-")[2];
	  }
	  field.value = strValue;
  }

  return true;
}

//检查YYYY-MM-DD:YYYY-MM-DD格式的日期输入域
function checkBetweenTwoDate(field)
{
  field.value = trim(field.value);
  var strValue = field.value.split(":");
  var desc   = field.description;
  var strValues = "";
  //如果description属性不存在，则用name属性
  if(desc==null)
    desc = field.name;
  for(i=0;i<strValue.length;i++){
      if(strValue[i]=="")
      {
        alert("请按YYYY-MM-DD:YYYY-MM-DD格式录入日期！");
        field.value = "";
        field.focus();
        return false;
      }
	  if(isNumeric(strValue[i] ))
	  {
	    if(strValue[i].length > 6 && strValue[i].length < 9)
	    {
	        strValue[i] = strValue[i].substring(0,4) + DATE_DELIMITER + strValue[i].substring(4,6) + DATE_DELIMITER + strValue[i].substring(6);
	    }
	     else
	     {
	      errorMessage("请输入合法的" + desc +"\n格式应为YYYY-MM-DD:YYYY-MM-DD");
	        field.value="";
	        field.focus();
	        field.select();
	        return false;
	     }
	  }
	  if( !isDate(strValue[i],DATE_DELIMITER) && !isDate(strValue[i])||strValue[i].substring(0,1)=="0")
	  {
	    errorMessage("请输入合法的" + desc +"\n格式应为YYYY-MM-DD:YYYY-MM-DD");
	    field.value="";
	    field.focus();
	    field.select();
	    return false;
	  }else{
		  if(strValue[i].split("-")[1].length<2){//add by gaochaofeng 20110314 task-8163 对日前格式化进步优化
		    strValue[i] = strValue[i].split("-")[0]+"-"+"0"+strValue[i].split("-")[1]+"-"+strValue[i].split("-")[2];
		  }
		  
		  if(strValue[i].split("-")[2].length<2){//add by gaochaofeng 20110314 task-8163 对日前格式化进步优化
		    strValue[i] = strValue[i].split("-")[0]+"-"+strValue[i].split("-")[1]+"-"+"0"+strValue[i].split("-")[2];
		  }
	  }
	  strValues += strValue[i] + ":";
	  if(i==strValue.length-1){
	      field.value = strValues.substring(0,strValues.length-1);
	  }
  }
  return true;
}

//检查日期输入域,和checkFullDate的区别是允许输入两个日期,之间以":" 分割,
//例如 20030523:20040312,
//例如 2003/03/04:2004/09/12
function checkBetweenDate(field)
{
  field.value = trim(field.value);
  var strValue = field.value;
  var desc   = field.description;
  //如果description属性不存在，则用name属性
  if(desc==null)
    desc = field.name;
  if(strValue=="")
  {
    return false;
  }

  //不采用直接返回
  var index = strValue.indexOf(":");
  if (index < 0)
  {
    if(isNumeric(strValue ))
    {
      if(strValue.length>6)
      {
        strValue = strValue.substring(0,4) + DATE_DELIMITER + strValue.substring(4,6) + DATE_DELIMITER + strValue.substring(6);
        field.value = strValue;
      }

      if(!isDate(strValue,DATE_DELIMITER) && !isDate(strValue))
      {
       errorMessage("请输入合法的" + desc +"\n类型为日期，格式为YYYY-MM-DD 或者YYYYMMDD");
       field.value="";
       field.focus();
       field.select();
       return false;
      }
    }
    return true;
  }

  var beginDate = strValue.substring(0,index);
  var endDate  = strValue.substring(index + 1);

  if(isNumeric(beginDate ))
  {
    beginDate = beginDate.substring(0,4) + DATE_DELIMITER + beginDate.substring(4,6) + DATE_DELIMITER + beginDate.substring(6);
  }
  if(isNumeric(endDate ))
  {
    endDate = endDate.substring(0,4) + DATE_DELIMITER + endDate.substring(4,6) + DATE_DELIMITER + endDate.substring(6);
  }

  if(!isDate(beginDate,DATE_DELIMITER))
  {
    errorMessage("输入的日期为非法日期,请重新输入");
    field.focus();
    field.select();
    return false;
  }
  if(!isDate(endDate,DATE_DELIMITER))
  {
    errorMessage("输入的日期为非法日期,请重新输入");
    field.focus();
    field.select();
    return false;
  }
   field.value = beginDate + ":" + endDate;
   return true;
}


//宋硕 2010-04-01 拓展应用范围
//得到intCount分钟以后
function getNextMinuteFullDate(strDate,intCount)
{

  strDate = replace(strDate,"-","/");
  var tempDate = new Date(strDate);
  if(intCount == null)
  {
    intCount =1;
  }
  tempDate.setMinutes(tempDate.getMinutes() + intCount );
  return tempDate.format('yyyy-MM-dd HH:mm');
}


//庄元 2009-07-23 扩展应用范围
//得到下n天
function getNextDateFullDate(strDate,intCount)
{
  var time = "";
  if(strDate && strDate.indexOf(" ")>-1)
    time = strDate.substring(strDate.indexOf(" "));
    
  /*modify by weishixin add begin 2003-07-26*/
  //原因：2003-07-26这种格式JS new Date不认,转成2003/07/26
  strDate = replace(strDate,"-","/");
  /*modify by weishixin add end 2003-07-26*/
  var tempDate = new Date(strDate);
  if(intCount == null)
  {
    intCount =1;
  }
  tempDate.setDate(tempDate.getDate() + intCount );

  var strReturn = convertFullDateToString(tempDate);
  return strReturn + time;
}

//庄元 2009-07-23 扩展应用范围
//得到下n个月
function getNextMonthFullDate(strDate,intCount)
{
  var time = "";
  if(strDate && strDate.indexOf(" ")>-1)
    time = strDate.substring(strDate.indexOf(" "));
    
	strDate = replace(strDate,"-","/");
  var tempDate = new Date(strDate);
  if(intCount == null)
  {
    intCount =1;
  }

  tempDate.setMonth(tempDate.getMonth() + intCount );
  var strReturn = convertFullDateToString(tempDate);
  return strReturn + time;
}

//庄元 2009-07-23 扩展应用范围
//得到下n个年
function getNextYearFullDate(strDate,intCount)
{
  var time = "";
  if(strDate && strDate.indexOf(" ")>-1)
    time = strDate.substring(strDate.indexOf(" "));
    
  strDate = replace(strDate,"-","/");
  var tempDate = new Date(strDate);
  if(intCount == null)
  {
    intCount =1;
  }
  tempDate.setFullYear(tempDate.getFullYear() + intCount );
  var strReturn = convertFullDateToString(tempDate);
  return strReturn+time;
}


//得到日期的字符串表达形式，传入参数为Date类型
//如果不传，则默认为当天
function convertFullDateToString(date)
{
  var chgMonth;//改变格式的月

  var chgDay  ;//改变格式的日期

  if(date==null)
  {
    date = new Date();
  }

  var strDate = "";
  //modify 2003-07-26 start weishixin
  //原因将月日格式变成mm/dd如7/1改成07/01
  /*
  strDate = date.getFullYear() + DATE_DELIMITER +
              (date.getMonth() + 1) + DATE_DELIMITER +
            date.getDate();
  */

  if (date.getMonth()+1<10)
  {
     chgMonth = date.getMonth() + 1 ;//
     chgMonth ="0" + chgMonth ;
  }
  else
  {
     chgMonth = date.getMonth() + 1 ;//
  }
  if (date.getDate()<10)
  {
     chgDay = date.getDate();//
     chgDay ="0" + chgDay ;
  }
  else
  {
     chgDay = date.getDate() ;//
  }
  strDate = date.getFullYear() + DATE_DELIMITER +
            chgMonth + DATE_DELIMITER +
            chgDay;
  //modify 2003-07-26 start weishixin
  return strDate;
}

/*modify by zhanjie begin 0724*/
//源程序没有考虑到对分割符"/"的处理，现修改
/*
//比较两个日期字符串
// date1=date2则返回0 , date1>date2则返回1 , date1<date2则返回-1
function compareFullDate(date1,date2)
{
  alert("date1:"+date1);
  alert("date2:"+date2);
  var strValue1=date1.split(DATE_DELIMITER);
  var date1Temp=new Date(strValue1[0],parseInt(strValue1[1],10)-1,parseInt(strValue1[2],10));

  var strValue2=date2.split(DATE_DELIMITER);
  var date2Temp=new Date(strValue2[0],parseInt(strValue2[1],10)-1,parseInt(strValue2[2],10));

  if(date1Temp.getTime()==date2Temp.getTime())
    return 0;
  else if(date1Temp.getTime()>date2Temp.getTime())
    return 1;
  else

    return -1;
}
*/

//庄元 2009-07-23 扩展日期函数的适用范围
//比较两个日期字符串
// date1=date2则返回0 , date1>date2则返回1 , date1<date2则返回-1
function compareFullDate(date1,date2)
{
  //获取字符串的分割符号
  var date1Temp=typeof(date1)=="string"?new Date(replace(date1,"-","/")):typeof(date1)=="object"?date1:new Date(date1);
  var date2Temp=typeof(date2)=="string"?new Date(replace(date2,"-","/")):typeof(date2)=="object"?date2:new Date(date2);
  
  if(date1Temp.getTime()==date2Temp.getTime())
    return 0;
  else if(date1Temp.getTime()>date2Temp.getTime())
    return 1;
  else
    return -1;
}

//获取日期字符串的分割符
function get_datesplit(strdate)
{
  if (strdate.match("/")) return "/"
  if (strdate.match("-")) return "-"
}

/*modify by zhanjie end 0724*/




//比较两个日期（包括小时和分钟）字符串
// date1=date2则返回0 , date1>date2则返回1 , date1<date2则返回-1
function compareFullTime(date1,date2)
{
  date1=replace(date1," ","-");
  date1=replace(date1,":","-");
  date2=replace(date2," ","-");
  date2=replace(date2,":","-");

  var strValue1=date1.split(DATE_DELIMITER);
  var date1Temp=new Date(strValue1[0],parseInt(strValue1[1],10)-1,parseInt(strValue1[2],10),parseInt(strValue1[3],10),parseInt(strValue1[4],10));

  var strValue2=date2.split(DATE_DELIMITER);
  var date2Temp=new Date(strValue2[0],parseInt(strValue2[1],10)-1,parseInt(strValue2[2],10),parseInt(strValue2[3],10),parseInt(strValue2[4],10));

  if(date1Temp.getTime()==date2Temp.getTime())
    return 0;
  else if(date1Temp.getTime()>date2Temp.getTime())
    return 1;
  else
    return -1;
}

//去掉字符串头空格
function leftTrim(strValue)
{
  var re =/^\s*/;
  if(strValue==null)
    return null;

 strValue= "" + strValue;
  var strReturn = strValue.replace(re,"");

  return strReturn;
}

//去掉字符串尾空格
function rightTrim(strValue)
{
  var re =/\s*$/;
  if(strValue==null)
    return null;

  var strReturn = strValue.replace(re,"");

  return strReturn;
}

//去掉字符串头尾空格
function trim(s)
{
  var strReturn;
  strReturn = leftTrim(s);
  strReturn = rightTrim(strReturn);

  return strReturn;
}

//对输入域是否是整数的校验,即只包含字符0123456789
function isInteger(strValue)
{
  var result = regExpTest(strValue,/\d+/g);
  return result;
}

//对输入域是否是数字的校验
function isNumeric(strValue)
{
  var result = regExpTest(strValue,/\d*[.]?\d*/g);
  return result;
}


//离开域时的数字校验
function checkInteger(field,MinValue,MaxValue)
{
  field.value = trim(field.value);
  var strValue=field.value;
  if(strValue=="")
    strValue = "0";
  var desc   = field.description;
  //如果description属性不存在，则用name属性
  if(desc==null)
    desc = field.name;

  if(!isInteger(strValue))
  {
    errorMessage("请输入合法的数字");
    field.focus();
    field.select();
    return false;
  }

  MinValue = parseInt(MinValue,10);
  if(isNaN(MinValue))
    MinValue = MIN_INTEGER;

  MaxValue = parseInt(MaxValue,10);
  if(isNaN(MaxValue))
    MaxValue = MAX_INTEGER;
  var value = parseInt(strValue,10);
  if(isNaN(value) || value>MaxValue || value<MinValue)
  {
    errorMessage("请输入合法的" + desc +"\n类型为数字(integer),最小值为" + MinValue + ",最大值为" +MaxValue);
    field.focus();
    field.select();
    return false;
  }
  return true;
}

//离开域时的数字校验
function checkSmallint(field,MinValue,MaxValue)
{
  field.value = trim(field.value);
  var strValue=field.value;
  if(strValue=="")
    strValue = "0";
  var desc   = field.description;
  //如果description属性不存在，则用name属性
  if(desc==null)
    desc = field.name;

  if(!isInteger(strValue))
  {
    errorMessage("请输入合法的数字");
    field.focus();
    field.select();
    return false;
  }

  MinValue = parseInt(MinValue,10);
  if(isNaN(MinValue))
    MinValue = MIN_SMALLINT;

  MaxValue = parseInt(MaxValue,10);
  if(isNaN(MaxValue))
    MaxValue = MAX_SMALLINT;

  var value = parseInt(strValue,10);
  if(isNaN(value) || value>MaxValue || value<MinValue)
  {
    errorMessage("请输入合法的" + desc +"\n类型为数字(smallint),最小值为" + MinValue + ",最大值为" +MaxValue);
    field.focus();
    field.select();
    return false;
  }
  return true;
}


//离开域时的数字校验Decimal
function checkDecimal(field,p,s,MinValue,MaxValue)
{
  field.value = trim(field.value);
  var strValue=field.value;
  if(strValue=="")
    strValue = "0";

  var desc   = field.description;
  //如果description属性不存在，则用name属性
  if(desc==null)
    desc = field.name;

  if(!isNumeric(strValue))
  {
    errorMessage("请输入合法的数字");
    field.focus();
    field.select();
    return false;
  }
  p = parseInt(p,10);
  s = parseInt(s,10);

  var pLength;
  var sLength;
  var position = strValue.indexOf(".");
  if(position>-1)
  {
    pLength = position;
    sLength = strValue.length - position - 1;
  }
  else
  {
    pLength = strValue.length;
    sLength = 0;
  }

  if(pLength>(p-s) || sLength>s)
  {
    errorMessage("请输入合法的" + desc +"\n类型为数字,整数位最长为" + (p-s) + ",小数位最长为" + s);
    field.focus();
    field.select();
    return false;
  }

  var value = parseFloat(strValue);
  if(MaxValue!=null && MinValue!=null && trim(MaxValue)!="" && trim(MinValue)!="")
  {
    MinValue = parseFloat(MinValue);
    MaxValue = parseFloat(MaxValue);
    if(isNaN(value) || value>MaxValue || value<MinValue)
    {
      errorMessage("请输入合法的" + desc +"\n类型为数字,最小值为" + MinValue + ",最大值为" +MaxValue);
      field.focus();
      field.select();
      return false;
    }
  }

  return true;
}

//对输入域的校验,reg为规则表达式
function checkCustom(field,reg,typeDesc)
{
  var strValue = field.value;
  var desc   = field.description;
  //如果description属性不存在，则用name属性
  if(desc==null)
    desc = field.name;
  if(typeDesc==null)
    typeDesc = reg;

  if(strValue=="")
  {
    return true;
  }

  var r=reg.test(strValue);

  if (r==false)
  {
    errorMessage("请输入合法的" + desc +"\n数据类型为" +typeDesc + "\n格式为" + reg);
    field.focus();
    field.select();
    return false;
  }

  return r;
}

//离开域时的数字校验Datetime
function checkDatetime(field,from,to)
{
  field.value = trim(field.value);
  field.value = replace(field.value,"/","-");
  var strValue=field.value;
  var desc   = field.description;
  //如果description属性不存在，则用name属性
  if(desc==null)
    desc = field.name;

  if(strValue=="")
  {
    return true;
  }
  from = from.toLowerCase();
  to = to.toLowerCase();

  if(from=="year" && to=="month")
  {
    if(isNumeric(field.value))
    {
      if(strValue.length>4)
      {
        strValue = strValue.substring(0,4) + "-" + strValue.substring(4);
        field.value = strValue;
      }
    }

    if(regExpTest(strValue,/[\d]{4}[-][\d]{1,2}/)==false)
    {
      errorMessage("请输入合法的" + desc +"\n类型为日期时间，格式为YYYY-MM 或者YYYYMM");
      field.focus();
      field.select();
      return false;
    }

    var month = parseInt(replace(strValue.substring(strValue.indexOf("-")+1),"0",""),10);
    if(!(month>=1 && month<=12))
    {
      errorMessage("请输入合法的月份数！月份数应该为大于等于1小于等于12的整数！");
      field.focus();
      field.select();
      return false;
    }
  }
  else if(from=="year" && to=="minute")
  {
    if(isNumeric(field.value))
    {
      if(strValue.length==12)
      {
        strValue = strValue.substring(0,4) + "-" + strValue.substring(4,6) + "-" + strValue.substring(6,8) + " " + strValue.substring(8,10) + ":" + strValue.substring(10,12);
        field.value = strValue;
      }
    }

    if(regExpTest(strValue,/[\d]{4}[-][\d]{1,2}[-][\d]{1,2} [\d]{1,2}:[\d]{1,2}/)==false)
    {
      errorMessage("请输入合法的" + desc +"\n类型为日期时间，格式为YYYY-MM-DD hh:mm 或者YYYYMMDDhhmm");
      field.focus();
      field.select();
      return false;
    }

    var pos = strValue.indexOf(" ");
    var tempDate = strValue.substring(0,pos);
    strValue = strValue.substring(pos+1);
    if(!isDate(tempDate,"-"))
    {
      errorMessage("请输入合法的日期！");
      field.focus();
      field.select();
      return false;
    }
    pos = strValue.indexOf(":");
    var hour = parseInt(strValue.substring(0,pos),10);
    var minute = parseInt(strValue.substring(pos+1),10);
    if(!(hour>=0 && hour<=24))
    {
      errorMessage("请输入合法的小时数！小时数应该为大于等于0小于等于24的整数！");
      field.focus();
      field.select();
      return false;
    }
    if(!(minute>=0 && minute<=59))
    {
      errorMessage("请输入合法的分钟数！分钟数应该为大于等于0小于等于59的整数！");
      field.focus();
      field.select();
      return false;
    }
  }
  else if(from=="year" && to=="second")
  {

    if(isNumeric(field.value))
    {
      if(strValue.length==14)
      {
        strValue = strValue.substring(0,4) + "-" + strValue.substring(4,6) + "-" + strValue.substring(6,8) + " " + strValue.substring(8,10) + ":" + strValue.substring(10,12) + ":" + strValue.substring(12,14);
        field.value = strValue;
      }
    }

    if(regExpTest(strValue,/[\d]{4}[-][\d]{1,2}[-][\d]{1,2} [\d]{1,2}:[\d]{1,2}:[\d]{1,2}/)==false)
    {
      errorMessage("请输入合法的" + desc +"\n类型为日期时间，格式为YYYY-MM-DD hh:mm:ss 或者YYYYMMDDhhmmss");
      field.focus();
      field.select();
      return false;
    }

    var pos = strValue.indexOf(" ");
    var tempDate = strValue.substring(0,pos);
    strValue = strValue.substring(pos+1);
    if(!isDate(tempDate,"-"))
    {
      errorMessage("请输入合法的日期！");
      field.focus();
      field.select();
      return false;
    }
    var timeArr = strValue.split(":");
    var hour = parseInt(timeArr[0],10);
    var minute = parseInt(timeArr[1],10);
    var second = parseInt(timeArr[2],10);
    if(!(hour>=0 && hour<=24))
    {
      errorMessage("请输入合法的小时数！小时数应该为大于等于0小于等于24的整数！");
      field.focus();
      field.select();
      return false;
    }
    if(!(minute>=0 && minute<=59))
    {
      errorMessage("请输入合法的分钟数！分钟数应该为大于等于0小于等于59的整数！");
      field.focus();
      field.select();
      return false;
    }
    if(!(second>=0 && second<=59))
    {
      errorMessage("请输入合法的秒数！秒数应该为大于等于0小于等于59的整数！");
      field.focus();
      field.select();
      return false;
    }
  }
  else
  {
    errorMessage("Not support now!");
    return false;
  }
  return true;
}


//检查空
function hasValue(field)
{
  if(field.value=="")
    return false;
  else
    return true;
}

//对输入域按键时的校验,reg为规则表达式
function pressCustom(e,reg)
{
  var value = String.fromCharCode(e.keyCode);
  var r=reg.test(value);
  return r;
}

//对输入域按键时的整数校验
function pressInteger(e)
{
  var value = String.fromCharCode(e.keyCode);
  if(value>=0 && value<=9)
    return true;
  else
    return false;
}

//对输入域按键时的小时校验
function pressHour(e)
{
  return pressInteger(e);
}


//对输入域按键时的数字校验
function pressDecimal(e)
{
  var value = String.fromCharCode(e.keyCode);
  if((value>=0 && value<=9) || value==".")
    return true;
  else
    return false;
}
//对输入域按键时的数字校验
function pressDecimal1(e)
{
  var value = String.fromCharCode(e.keyCode);
  if((value>=0 && value<=9) || value=="."|| value=="-")
    return true;
  else
    return false;
}
//对输入域按键时的日期校验
function pressFullDate(e)
{
  var value = String.fromCharCode(e.keyCode);
  if((value>=0 && value<=9) || value=="/" || value=="-")
    return true;
  else
    return false;
}

//对输入域按键时的Datetime校验
function pressDatetime(e)
{
  var value = String.fromCharCode(e.keyCode);
  if((value>=0 && value<=9) || value=="/" || value=="-" || value==":" || value==" ")
    return true;
  else
    return false;
}


//打开一个窗口
function openWindow(strURL,strName)
{
  var newWindow = window.open(strURL,strName,'width=640,height=480,top=0,left=0,toolbar=0,location=0,directories=0,menubar=0,scrollbars=1,resizable=1,status=0');
  newWindow.focus();
  return newWindow;
}

//打开一个小窗口
function openSmallWindow(strURL,strName)
{
  var newWindow = window.open(strURL,strName,'width=350,height=220,top=200,left=200,toolbar=0,location=0,directories=0,menubar=0,scrollbars=1,resizable=1,status=0');
  newWindow.focus();
  return newWindow;
}
//分割代码并放在select域里
//串的格式: 值FIELD_SEPARATOR文本GROUP_SEPARATOR值FIELD_SEPARATOR文本...
function setOption(selectName,strValue)
{
  //查不到代码返回
  if(strValue==null || trim(strValue)=="")
  {
    return;
  }

  var arrayField=strValue.split(GROUP_SEPARATOR);
  var i=0;
  var j=0;
  var intCount = getElementCount(selectName);

  if(intCount>1)
  {
    for(j=0;j<intCount;j++)
    {
      fm.all(selectName)[j].options.length = 0;
    }
  }
  else
  {
    fm.all(selectName).options.length = 0;
  }

  while(i<arrayField.length)
  {
    if(intCount>1)
    {
      for(j=0;j<intCount;j++)
      {
        var option=document.createElement("option");
        var arrayTemp=arrayField[i].split(FIELD_SEPARATOR);
        var strFieldName=arrayTemp[0];
        var strFieldValue=unescape(arrayTemp[1]);
        option.value=strFieldName;
        option.text=strFieldValue;

        fm.all(selectName)[j].add(option);
      }
    }
    else
    {
        var option=document.createElement("option");
        var arrayTemp=arrayField[i].split(FIELD_SEPARATOR);
        var strFieldName=arrayTemp[0];
        var strFieldValue=unescape(arrayTemp[1]);
        option.value=strFieldName;
        option.text=strFieldValue;
      fm.all(selectName).add(option);
    }
    i++;
  }
}

/* 大写输入域 --onkeypress时调用该方法 */
function uppercaseKey()
{
  var keycode = window.event.keyCode;
  if( keycode>=97 && keycode<=122 )
  {
    window.event.keyCode = keycode-32;
  }
}

function setFormAllDisabled()
{
  var i = 0;
  for(i=0;i<fm.elements.length;i++)
  {
    fm.elements[i].disabled=true;
  }
}

function setFormAllEnabled()
{
  var i = 0;
  for(i=0;i<fm.elements.length;i++)
  {
    fm.elements[i].disabled=false;
  }
}

//为一页中所有的元素设置disabled
//value = true or false
function setTableDisabled(PageCode,Value)
{
  var i = 0;
  var j = 0;
  var elements;
  //得到Input域的名字
  for(i=0;i<document.all(PageCode).tBodies.length;i++)
  {
    elements = document.all(PageCode).tBodies.item(i).getElementsByTagName("input");
    for(j=0;j<elements.length;j++)
    {
      elements[j].disabled=Value;
    }
    //得到Select域的名字
    elements = document.all(PageCode).tBodies.item(i).getElementsByTagName("select");
    for(j=0;j<elements.length;j++)
    {
      elements[j].disabled=Value;
    }
    //得到textarea域的名字
    elements = document.all(PageCode).tBodies.item(i).getElementsByTagName("textarea");
    for(j=0;j<elements.length;j++)
    {
      elements[j].disabled=Value;
    }
  }
}

//设置背景色
function setBackColor(field,bcolor)
{
  field.style.backgroundColor = bcolor;
}


//比较保单与批单值设置背景色(用在批单查询中)
function setBackColorOfTable(TableID)
{
  var i = 0;
  //得到Input域的名字
  elements = document.all(TableID).tBodies.item(0).getElementsByTagName("input");
  for(i=0;i<elements.length;i++)
  {
    if(elements[i].type!="text") continue;
    if(elements[i].value!=elements[i].title)
    {
      setBackColor(elements[i],BGCOLORU);
    }
  }

  //得到Select域的名字
  elements = document.all(TableID).tBodies.item(0).getElementsByTagName("select");
  for(i=0;i<elements.length;i++)
  {
    if(elements[i].value!=elements[i].title)
    {
      setBackColor(elements[i],BGCOLORU);
    }
  }

  //得到textarea域的名字
  elements = document.all(TableID).tBodies.item(0).getElementsByTagName("textarea");
  for(i=0;i<elements.length;i++)
  {
    if(elements[i].value!=elements[i].title)
    {
      setBackColor(elements[i],BGCOLORU);
    }
  }

}


/**
 * 将给定字符串复制ｎ遍
 * @param intLength 字符串长度
 * @return 字符串
 */
function newString(iString, iTimes)
{
  var str = "";
  for (var i = 0 ; i < iTimes; i++)
     str = str + iString;
  return str;
}


//对数字四舍五入
//数值,精度
function round(number,precision)
{
  if(isNaN(number))
    number = 0;
  var prec = Math.pow(10,precision);
  var result = Math.round( number * prec) ;
  result = result/prec;
  return result;
}


//对数字进行格式化,保证precision位
function point(number,precision)
{
  if(isNaN(number))
    number = 0;
  var result = number.toString();
  if(result.indexOf(".")==-1)
    result = result + ".";

  result = result + newString("0",precision);
  result = result.substring(0,precision + result.indexOf(".") + 1);
  return result;
}

//对数字第三位四舍五入
function mathRound(number)
{
  return round(number,2);
}

//对数字按0.00格式化
function pointTwo( s )
{
  return point(s,2);
}

//对数字按0.0000 格式化
function pointFour( s )
{
  return point(s,4);
}

//对数字格式化，delimiterChar默认为"," precision默认为3
function numberFormat(ivalue,delimiterChar,precision)
{
  if((ivalue==null) || (ivalue==""))
    return "";

  if(delimiterChar==null || delimiterChar=="")
    delimiterChar = ",";

  if(precision==null || precision =="")
    precision = 3;

  var i = 0;
  var ovalue = "";
  var times;

  var avalue = "";
  if(ivalue.indexOf(".")>-1)
  {
    avalue = "." + ivalue.substring(ivalue.indexOf(".")+1);
    ivalue = ivalue.substring(0,ivalue.indexOf("."));
  }

  times = ivalue.length % precision;
  if(times!=0)
  {
    ovalue = ivalue.substring(0,times);
    ivalue = ivalue.substring(times);
  }

  for(i=0;i<ivalue.length;i++)
  {
    if(i%precision==0)
    {
      ovalue += delimiterChar;
    }
    ovalue += ivalue.substring(i,i+1)
  }

  if(ovalue.substring(0,1) == delimiterChar)
    ovalue = ovalue.substring(1);


  return ovalue + avalue;
}


/**
 * 格式化数字
 * @param value 值
 * @param count 分割位数 默认为3
 * @param precision 小数点保留位数 默认为2
 * @param delimiterChar 分割符 默认为','
 */
function formatFloat(value,count,precision,delimiterChar)
{
  count = count==null?3:count;
  precision = precision==null?2:precision;
  delimiterChar = delimiterChar==null?",":delimiterChar;

  //lijibin add 如果有负号则不参与格式化
  var strMinus = "";
  if(value<0)
  {
    strMinus = "-";
    value = -1*value;
  }

  var strReturn = ""; //返回值
  var strValue = point(round(value,precision),precision); //格式化成指定小数位数

  strReturn = strValue.substring(strValue.length-precision-1);
  strValue = strValue.substring(0,strValue.length-precision-1);
  while(strValue.length>count)
  {
    strReturn = delimiterChar + strValue.substring(strValue.length-count) + strReturn;
    strValue = strValue.substring(0,strValue.length-count);
  }

  strReturn = strMinus + strValue + strReturn;
  return strReturn;
}


//显示打印窗口
function printWindow(strURL,strWindowName)
{
  var pageWidth=screen.availWidth-10;
  var pageHeight=screen.availHeight-30;
  if (pageWidth<100 )
    pageWidth = 100;

  if (pageHeight<100 )
    pageHeight = 100;

  var newWindow = window.open(strURL,strWindowName,'width='+pageWidth+',height='+pageHeight+',top=0,left=0,toolbar=0,location=0,directories=0,menubar=0,scrollbars=1,resizable=1,status=0');
  newWindow.focus();
  return newWindow;
}


//对图片的显示、隐藏
function showImg(imgID,stl)
{
  document.all(imgID).style.display = stl;
}

//控制输入域长度
// 使用方法如下所示
// <input name = "PolicyNo" maxlength="8" description="保单号"  onblur="checkLength(this)">
function checkLength(field)
{
  var str;
  var count  = 0;
  var value  = field.value;
  var length = field.maxLength;
  var desc   = field.description;
  //如果description属性不存在，则用name属性
  if(desc==null)
    desc = field.name;

  if(value=="")
  {
    return true;
  }

  if(value.indexOf("^")>-1 ||
     value.indexOf(FIELD_SEPARATOR)>-1 ||
     value.indexOf(GROUP_SEPARATOR)>-1
    )
  {
    errorMessage("^为系统保留字符，不允许输入！");
    field.focus();
    field.select();
    return false;
  }



  //如果maxlength属性不存在，则返回
  if(isNaN(parseInt(length,10)))
    return true;

  for(var i=0;i<value.length;i++)
  {
    str = escape(value.charAt(i));
    if(str.substring(0,2)=="%u" && str.length==6)
      count = count + 2;
    else
      count = count + 1;
  }

  if(count>length)
  {
    errorMessage(desc + "输入的内容超长！\n" + desc + "的最大长度为" + length + "个英文字符！\n请重新输入！");
    field.focus();
    field.select();
    return false;
  }
  return true;
}

//控制输入域不能为空
// 使用方法如下所示
// <input name = "PolicyNo" maxlength="8" description="保单号"  onblur="checkNull(this)">
function checkNull(field)
{
  if(!hasValue(field))
  {
    errorMessage("不能为空");
    return false;
  }
}

//替换字符串函数
function replace(strExpression,strFind,strReplaceWith)
{
  var strReturn;
  var re = new RegExp(strFind,"g");
  if(strExpression==null)
    return null;

  strReturn = strExpression.replace(re,strReplaceWith);
  return strReturn;
}

//将毫秒数换算成x天x时x分
function getDHMI(ms) 
{
  var ss = 1000;
  var mi = ss * 60;
  var hh = mi * 60;
  var dd = hh * 24;

  var day = parseInt(ms / dd);
  var hour = parseInt((ms - day * dd) / hh);
  var minute = parseInt((ms - day * dd - hour * hh) / mi);

  var strDay = day < 1 ? "" : day + "天";
  var strHour = hour < 1 ? "" : hour + "小时";
  var strMinute = minute < 1 ? "" : minute + "分";

  return strDay + strHour + strMinute;
}

//计算两个日期的差,返回差的月数(M)或天数(D)
//2003/3/17 改为(其中天数包含2.29这一天)
function dateDiff(dateStart,dateEnd,MD)
{
  var i;
  if(MD=="D1")//庄元 2009-07-23 添加交强险即时生效
  {
    var endTm   = dateEnd.getTime();
    var startTm = dateStart.getTime();
    var diffDay = getDHMI(endTm - startTm);//返回×天×小时×分钟

    return diffDay;
  }
  else if(MD=="D") //按天计算差
  {
    var endTm   = dateEnd.getTime();
    var startTm = dateStart.getTime();
    var diffDay = (endTm - startTm)/86400000 + 1;

    return diffDay;
  }
  else //按月计算差
  {
    var endD   = dateEnd.getDate();
    var endM   = dateEnd.getMonth();
    var endY   = dateEnd.getFullYear();
    var startD = dateStart.getDate();
    var startM = dateStart.getMonth();
    var startY = dateStart.getFullYear();

    if(endD>=startD)
    {
      return (endY-startY)*12 + (endM-startM) + 1;
    }
    else
    {
      return (endY-startY)*12 + (endM-startM);
    }
  }
}


//计算两个日期的差,返回差的月数(M)或天数(D) (其中天数是实际天数，包含2.29这一天)
function dateRealDiff(dateStart,dateEnd,MD)
{
  var i;
  if(MD=="D") //按天计算差
  {
    var endTm   = dateEnd.getTime();
    var startTm = dateStart.getTime();
    var diffDay = (endTm - startTm)/86400000 + 1;
    return diffDay;
  }
  else //按月计算差
  {
    var endD   = dateEnd.getDate();
    var endM   = dateEnd.getMonth();
    var endY   = dateEnd.getFullYear();
    var startD = dateStart.getDate();
    var startM = dateStart.getMonth();
    var startY = dateStart.getFullYear();

    if(endD>startD)
    {
      return (endY-startY)*12 + (endM-startM) + 1;
    }
    else
    {
      return (endY-startY)*12 + (endM-startM);
    }
  }
}


function isEmpty(field)
{
  if(field.value==null || trim(field.value)=="")
  {
    return true;
  }

  return false;
}

//
//  业务相关Javascript
//

//public
//一次给所有的element用value设置title
function setTitleOfAllInput()
{
  for(var i=0;i<fm.elements.length;i++)
  {
    if(fm.elements[i].type=="checkbox" || fm.elements[i].type=="radio")
      fm.elements[i].title = fm.elements[i].checked;
    else
      fm.elements[i].title = fm.elements[i].value;
  }
}


//public
function setOnchangeOfElement(element)
{
  element.onchange=mainOnchange;
}

//public
//一次给所有的input域添加onchange方法，且保留原有onchange()
//用于多行的上一条/下一条模式
function setOnchangeOfTableSpecial(TableID)
{
  var i = 0;
  //得到Input域的名字
  elements = document.all(TableID).tBodies.item(0).getElementsByTagName("input");
  for(i=0;i<elements.length;i++)
  {
    if(elements[i].onchange!=null)
    {
      elements[i].oldOnchange = getFunctionName(elements[i].onchange.toString());
    }
    elements[i].tableID=TableID;
    elements[i].onchange=mainOnchangeSpecial;
  }
  //得到Select域的名字
  elements = document.all(TableID).tBodies.item(0).getElementsByTagName("select");
  for(i=0;i<elements.length;i++)
  {
    if(elements[i].onchange!=null)
    {
      elements[i].oldOnchange = getFunctionName(elements[i].onchange.toString());
    }
    elements[i].tableID=TableID;
    elements[i].onchange=mainOnchangeSpecial;
  }
  //得到textarea域的名字
  elements = document.all(TableID).tBodies.item(0).getElementsByTagName("textarea");
  for(i=0;i<elements.length;i++)
  {
    if(elements[i].onchange!=null)
    {
      elements[i].oldOnchange = getFunctionName(elements[i].onchange.toString());
    }
    elements[i].tableID=TableID;
    elements[i].onchange=mainOnchangeSpecial;
  }
}

//pirvate
function mainOnchangeSpecial()
{
  if(fm.all(this.tableID + "_Flag").value==null ||
    (fm.all(this.tableID + "_Flag").value == "")||
    (fm.all(this.tableID + "_Flag").value == "U"))
  {
    mainOnchangeChangeColor(this);
  }
  if(this.oldOnchange!=null)
  {
    return eval(this.oldOnchange.toString());
  }
}

function setOnchangeOfTable(TableID)
{
  var i = 0;
  //得到Input域的名字
  elements = document.all(TableID).tBodies.item(0).getElementsByTagName("input");
  for(i=0;i<elements.length;i++)
  {
    if(elements[i].onchange!=null)
    {
      elements[i].oldOnchange = getFunctionName(elements[i].onchange.toString());
    }
    elements[i].onchange=mainOnchange;
  }
  //得到Select域的名字
  elements = document.all(TableID).tBodies.item(0).getElementsByTagName("select");
  for(i=0;i<elements.length;i++)
  {
    if(elements[i].onchange!=null)
    {
      elements[i].oldOnchange = getFunctionName(elements[i].onchange.toString());
    }
    elements[i].onchange=mainOnchange;
  }
  //得到textarea域的名字
  elements = document.all(TableID).tBodies.item(0).getElementsByTagName("textarea");
  for(i=0;i<elements.length;i++)
  {
    if(elements[i].onchange!=null)
    {
      elements[i].oldOnchange = getFunctionName(elements[i].onchange.toString());
    }
    elements[i].onchange=mainOnchange;
  }
}

//private

function mainOnchangeChangeColor(field)
{
  if(field.style.backgroundColor.toUpperCase()!=BGCOLORI && field.style.backgroundColor.toUpperCase()!=BGCOLORD)
  {
    if(field.type=="select-one")
    {
      var i = 0;
      for(i=0;i<field.options.length;i++)
      {
        if(field.options[i].value==field.title)
          setBackColor(field.options[i],"");
        else
          setBackColor(field.options[i],BGCOLORU);
      }
    }
    else if(field.type=="checkbox")
    {
      if(trim(""+field.checked)!=trim(""+field.title))
        setBackColor(field,BGCOLORU);
      else
        setBackColor(field,"");
    }
    else if(field.type=="radio")
    {
      var i = 0;
      var obj;
      for(i=0;i<getElementCount(field.name);i++)
      {
        obj = eval("fm." + field.name + "[" + i + "]");
        if(trim(""+obj.checked)!=trim(""+obj.title))
          setBackColor(obj,BGCOLORU);
        else
          setBackColor(obj,"");
      }
    }
    else
    {
      if(field.value!=field.title )
        setBackColor(field,BGCOLORU);
      else
        setBackColor(field,"");
    }
  }
}
//pirvate
function mainOnchange()
{
  mainOnchangeChangeColor(this);
  if(this.oldOnchange!=null)
  {
    return eval(this.oldOnchange.toString());
  }
}

//main onblur
function mainOnblur()
{
  if(this.oldOnblur!=null)
  {
//    alert(this.oldOnblur.toString());
    return eval(this.oldOnblur.toString());
  }
}

//main ondblclick
function mainOndblclick()
{
  if(this.oldOndblclick!=null)
  {
    return eval(this.oldOndblclick.toString());
  }
}

//main onfocus
function mainOnfocus()
{
  if(this.oldOnfocus!=null)
  {
    return eval(this.oldOnfocus.toString());
  }
}

//public
function setCheckBoxReadonly(field,flag)
{
  if(flag==null)
  {
    errorMessage("函数setCheckBoxReadonly使用错误，Flag应该为True/Flase!");
    return;
  }

  if(flag==true)
  {
    if(field.setCheckBoxReadonlyFlag!=true)
    {
      field.setCheckBoxReadonlyFlag = true;
      field.oldClassName = field.className;
      field.oldOnclick   = field.onclick;
      field.className = "readonlycheckbox";
      field.onclick = functionReturnFalse;
    }
  }
  else
  {
    if(field.setCheckBoxReadonlyFlag==true)
    {
      field.className = field.oldClassName;
      field.onclick = field.oldOnclick;
      field.setCheckBoxReadonlyFlag = false;
    }
  }
}

//public
function setRadioReadonly(field,flag)
{
  if(flag==null)
  {
    errorMessage("函数setRadioReadonly使用错误，Flag应该为True/Flase!");
    return;
  }
  if(flag==true)
  {
    if(field.setRadioReadonlyFlag!=true)
    {
      field.setRadioReadonlyFlag = true;
      field.oldClassName = field.className;
      field.oldOnfocus   = field.onfocus;
      field.className = "readonlyradio";
      field.onfocus = functionCancelFocus;
    }
  }
  else
  {
    if(field.setRadioReadonlyFlag==true)
    {
      field.className = field.oldClassName;
      field.onfocus = field.oldOnfocus;
      field.setRadioReadonlyFlag = false;
    }
  }
}


//public
function setReadonlyOfElement(iElement)
{
  if(iElement.type=="select-one")
  {
    if(iElement.setReadonlyFlag==true)
    {
      return;
    }
    else
    {
      iElement.setReadonlyFlag = true;
    }

    var optionTags = new Array();
    var index = 0;
    for(var j=iElement.options.length-1;j>=0;j--)
    {
      var tag = new Array();
      tag["value"] = iElement.options[j].value;
      tag["text"]  = iElement.options[j].text;
      optionTags[index++] = tag;
      if(iElement.options[j].value!=iElement.value)
      {
        iElement.remove(j);
      }
    }
    iElement.optionTags = optionTags;
  }
  else if ((iElement.type=="hidden") ||
            (iElement.type=="password") ||
            (iElement.type=="text") ||
            (iElement.type=="textarea"))
  {
    if(iElement.setReadonlyFlag==true)
    {
      return;
    }
    else
    {
      iElement.setReadonlyFlag = true;
    }

    //事件存储在oldXXX里
    iElement.oldOnblur = iElement.onblur;
    iElement.onblur = functionDoNothing;

    iElement.oldOndblclick = iElement.ondblclick;
    iElement.ondblclick = functionDoNothing;

    iElement.oldOnfocus = iElement.onfocus;
    iElement.onfocus = functionDoNothing;

    iElement.oldClassName = iElement.className;
    iElement.readOnly = true;
    iElement.className = "readonlyOnly";


    if(iElement.style.width=="")
    {
      switch (iElement.oldClassName)
      {
         case "codecode" :
             iElement.style.width="40px";
             break;
         case "common" :
             iElement.style.width="160px";
             break;
         case "readonly" :
             iElement.style.width="160px";
             break;
         default :
      }
    }

  }
  else if(iElement.type=="button")
  {
    if(iElement.setReadonlyFlag==true)
    {
      return;
    }
    else
    {
      iElement.setReadonlyFlag = true;
    }

    if(iElement.name.indexOf("Delete")>-1 || iElement.name.indexOf("Insert")>-1)
    {
      iElement.disabled = true;
    }
  }
  else if(iElement.type=="checkbox")
  {
    setCheckBoxReadonly(iElement,true);
  }
  else if(iElement.type=="radio")
  {
    setRadioReadonly(iElement,true);
  }
}
//将容器里的元素设置为只读或可读写
function setContainerReadonly(Container,Flag,buttonFlag)//庄元 2009-09-11 添加是否包含button的判断
{
  var i = 0;
  var vFlag = (Flag==null?true:Flag);
  var includeButton = (buttonFlag==null?true:buttonFlag);
  var elements;

  //Input域
  elements = Container.getElementsByTagName("input");
  for(i=0;i<elements.length;i++)
  {
    if(elements[i].type=="button" && includeButton==false)
    {
      continue;
    }
    
    if(vFlag)
      setReadonlyOfElement(elements[i]);
    else
      undoSetReadonlyOfElement(elements[i]);
  }

  //Select域
  elements = Container.getElementsByTagName("select");
  for(i=0;i<elements.length;i++)
  {
    if(vFlag)
      setReadonlyOfElement(elements[i]);
    else
      undoSetReadonlyOfElement(elements[i]);
  }


  //Textarea域
  elements = Container.getElementsByTagName("textarea");
  for(i=0;i<elements.length;i++)
  {
    if(vFlag)
      setReadonlyOfElement(elements[i]);
    else
      undoSetReadonlyOfElement(elements[i]);
  }

}

//public
//一次给所有的text,textarea设置为readonly,select-one变成只保留当前选项
//过程部分可逆
function setReadonlyOfAllInput()
{
  for(var i=0;i<fm.elements.length;i++)
  {
    setReadonlyOfElement(fm.elements[i]);
  }
}

//public
//过程部分可逆,select-one所有附加事件被取消 --OK了
function undoSetReadonlyOfElement(iElement)
{
  if(iElement.type=="select-one")
  {
    if(iElement.setReadonlyFlag!=true)
    {
      return;
    }
    else
    {
      iElement.setReadonlyFlag = false;
    }

    var optionTags = iElement.optionTags;
    var currentValue = iElement.value;

    for(var i=iElement.options.length-1;i>=0;i--)
    {
      iElement.remove(i);
    }

    for(var i=optionTags.length-1;i>=0;i--)
    {
      var tag = optionTags[i];
      var op = document.createElement("OPTION");
      op.value = tag.value;
      op.text =  tag.text;
      iElement.add(op);
    }
    iElement.value = currentValue;

  }
  else if ((iElement.type=="hidden") ||
            (iElement.type=="password") ||
            (iElement.type=="text") ||
            (iElement.type=="textarea"))
  {
    if(iElement.setReadonlyFlag!=true)
    {
      return;
    }
    else
    {
      iElement.setReadonlyFlag = false;
    }

    iElement.onblur = iElement.oldOnblur;
    iElement.ondblclick = iElement.oldOndblclick;
    iElement.onfocus = iElement.oldOnfocus;

    iElement.readOnly = false;
    iElement.className = iElement.oldClassName;
  }
  else if(iElement.type=="button")
  {
    if(iElement.setReadonlyFlag!=true)
    {
      return;
    }
    else
    {
      iElement.setReadonlyFlag = false;
    }

    if(iElement.name.indexOf("Delete")>-1 || iElement.name.indexOf("Insert")>-1)
    {
      iElement.disabled = false;
    }
  }
  else if(iElement.type=="checkbox")
  {
    setCheckBoxReadonly(iElement,false);
  }
  else if(iElement.type=="radio")
  {
    setRadioReadonly(iElement,false);
  }

}
//一次给所有的text,textarea的readonly设置为false,select-one恢复初始设置
function undoSetReadonlyOfAllInput()
{
  for(var i=0;i<fm.elements.length;i++)
  {
    undoSetReadonlyOfElement(fm.elements[i]);
  }
}

//加减模式的添加一行所需Script(Only for PG)
function insertRowForPG(PageCode,DataPageCode)
{
  insertRow(PageCode,DataPageCode);
  var index = getRowsCount(PageCode);
  setRowColor(DataPageCode,index,BGCOLORI);
  try
  {
    fm.all(PageCode + "_Flag")[index].value="I";
  }
  catch(e)
  {
    errorMessage(PageCode + "_Flag 字段不存在");
  }
}


//加减模式的删除一行所需Script(Only for PG)
function deleteRowForPG(PageCode,DataPageCode,field,intPageDataKeyCount,intRowCount)
{

  var index = getElementOrder(field)-intPageDataKeyCount;
  var flag = "";
  try
  {
    flag = fm.all(PageCode + "_Flag")[index].value;
  }
  catch(e)
  {
    errorMessage(PageCode + "_Flag 字段不存在");
    return false;
  }

  if(flag=="I")
  {
    deleteRow(PageCode,field,intPageDataKeyCount,intRowCount);
  }
  else if(flag=="D")
  {
    setRowColor(DataPageCode,index,"");

    var pageFieldsName = getPageFieldsName(PageCode,DataPageCode);

    for(var i=0;i<pageFieldsName.length;i++)
    {
      if(fm.all(pageFieldsName[i])[index].type=="text" || fm.all(pageFieldsName[i])[index].type=="textarea" || fm.all(pageFieldsName[i])[index].type=="password")
      {
        //恢复原值
        fm.all(pageFieldsName[i])[index].value=fm.all(pageFieldsName[i])[index].title;

      }
    }
    fm.all(PageCode + "_Flag")[index].value="";

  }
  else
  {
    fm.all(PageCode + "_Flag")[index].value="D";
    setRowColor(DataPageCode,index,BGCOLORD);
  }
}


//更换图片
function changeImage(image,gif)
{
  image.src='/prpall/common/images/'+gif;
}


//取消
function cancelForm()
{
  window.location="/prpall/common/pub/UIBlank.html";
}


//显示错误信息
function errorMessage(strErrMsg)
{
  var strMsg = "系统信息:\n\n" + strErrMsg;
  alert(strMsg);
}

//显示输入框
//leftMove 默认值0，坐标左移leftMove
function showSubPage(field,spanID,leftMove)
{
  var intLeftMove = (leftMove==null?0:leftMove);
  var intIndex = parseInt(getElementOrder(field),10) - 1;
  var span = eval(spanID + "(" + intIndex + ")");
  var strTemp = span.id;
  var strCompare = "Context"; //比较字符串，条款的最后几个字符是Context

  if(strTemp.indexOf(strCompare)>-1)
  {
    strTemp = strTemp.substring(strTemp.length - strCompare.length);
  }
  else
  {
    strTemp = "";
  }

  var ex=window.event.clientX+document.body.scrollLeft;  //得到事件的坐标x
  var ey=window.event.clientY+document.body.scrollTop;   //得到事件的坐标y
  if(strTemp==strCompare)
  {
    ex = ex - 700;
  }
  if (ex<0)
  {
    ex = 0;
  }
  ex = ex - intLeftMove;
  span.style.left=ex;
  span.style.top=ey;
  span.style.display ='';
}

function showSubPageCI(field,spanID,leftMove)
{
  var intLeftMove = (leftMove==null?0:leftMove);
  var intIndex = parseInt(getElementOrder(field),10) - 1;
  var span = eval(spanID + "(" + intIndex + ")");
  var strTemp = span.id;
  var strCompare = "Context"; //比较字符串，条款的最后几个字符是Context

  if(strTemp.indexOf(strCompare)>-1)
  {
    strTemp = strTemp.substring(strTemp.length - strCompare.length);
  }
  else
  {
    strTemp = "";
  }

  var ex=window.event.clientX+document.body.scrollLeft - 700;  //得到事件的坐标x
  var ey=window.event.clientY+document.body.scrollTop;   //得到事件的坐标y
  if(strTemp==strCompare)
  {
    ex = ex - 700;
  }
  if (ex<0)
  {
    ex = 0;
  }
  ex = ex - intLeftMove;
  span.style.left=ex;
  span.style.top=ey;
  span.style.display ='';
}

//显示输入框 add by hzy20070310
//leftMove 默认值0，坐标左移leftMove
function showSubPageDiv(field,spanID,leftMove,tabKind_div)
{
  var intLeftMove = (leftMove==null?0:leftMove);
  var intIndex = parseInt(getElementOrder(field),10) - 1;
  var span = eval(spanID + "(" + intIndex + ")");
  var strTemp = span.id;
  var strCompare = "Context"; //比较字符串，条款的最后几个字符是Context

  if(strTemp.indexOf(strCompare)>-1)
  {
    strTemp = strTemp.substring(strTemp.length - strCompare.length);
  }
  else
  {
    strTemp = "";
  }

  var ex=window.event.clientX+tabKind_div.scrollLeft;  //得到事件的坐标x
  var ey=window.event.clientY+tabKind_div.scrollTop-20;   //得到事件的坐标y并微调
  if(strTemp==strCompare)
  {
    ex = ex - 700;
  }
  if (ex<0)
  {
    ex = 0;
  }
  ex = ex - intLeftMove;
  span.style.left=ex;
  span.style.top=ey;
  span.style.display ='';
}

//显示输入框,在span的缺省位置显示
function showSubPageAtDefaultPosition(field,spanID)
{
  var intIndex = parseInt(getElementOrder(field),10) - 1;
  var span = eval(spanID + "(" + intIndex + ")");
  span.style.display ='';
}

//隐藏输入框
function hideSubPage(field,spanID)
{
  var intIndex = parseInt(getElementOrder(field),10) - 1;
  var span = eval(spanID + "(" + intIndex + ")");
  span.style.display ='none';
}

//显示span
//leftMove: span向左移动的像素,默认值为0
function showSpan(spanID,leftMove)
{
  var intLeftMove = (leftMove==null?0:leftMove);
  var ex=window.event.clientX+document.body.scrollLeft;  //得到事件的坐标x
  var ey=window.event.clientY+document.body.scrollTop;   //得到事件的坐标y
  ex = ex - intLeftMove;
  document.all(spanID).style.left = ex;
  document.all(spanID).style.top  = ey;
  document.all(spanID).style.display = '';
}

//隐藏span
function hideSpan(spanID)
{
  document.all(spanID).style.display = 'none';
}

//得到table里第一个tbody里的所有输入域的名称
function getTableFieldsName(tableId)
{
  var fields = new Array();
  var i;
  var elements;
  var index = 0;

  //得到Input域的名字
  elements = document.all(tableId).tBodies.item(0).getElementsByTagName("input");
  for(i=0;i<elements.length;i++)
  {
    fields[index] = elements[i].name;
    index++;
  }
  //得到Select域的名字
  elements = document.all(tableId).tBodies.item(0).getElementsByTagName("select");
  for(i=0;i<elements.length;i++)
  {
    fields[index] = elements[i].name;
    index++;
  }
  //得到textarea域的名字
  elements = document.all(tableId).tBodies.item(0).getElementsByTagName("textarea");
  for(i=0;i<elements.length;i++)
  {
    fields[index] = elements[i].name;
    index++;
  }

  return fields;
}
//设置Flag输入域的值
//mode: 1, 单记录的表格
//      2, 加减模式的多记录表格
//      3, 上下条模式的多记录表格
function setFlagPG(tableId,mode)
{
  var i,j;
  var fields;
  //单记录的表格
  if(mode==1)
  {
    fm.all(tableId+'_Flag').value = '';
    fields = getTableFieldsName(tableId);
    for(i=0;i<fields.length;i++)
    {
      if(getElementCount(fields[i])>1) //输入域多于一个
      {
        if( fm.all(fields[i])[0].type=="radio" || fm.all(fields[i])[0].type=="checkbox" )
        {
          for(j=0;j<getElementCount(fields[i]);j++)
          {
            if(fm.all(fields[i])[j].style.display!='none' &&  //域处于显示状态
               new Boolean(fm.all(fields[i])[j].checked).toString()!=fm.all(fields[i])[j].title  //新旧状态不一样
              )
            {
              fm.all(tableId+'_Flag').value = 'U';
              break;
            }//end if
          }//end for
        }
        else
        {
          errorMessage(tableId+"表格中存在多个"+fields[i]+"输入域！");
        }//end if
      }
      else //输入只有一个
      {
        if( fm.all(fields[i]).type=="radio" || fm.all(fields[i]).type=="checkbox" )
        {
          if(fm.all(fields[i]).style.display!='none' &&  //域处于显示状态
             new Boolean(fm.all(fields[i]).checked).toString()!=fm.all(fields[i]).title  //新旧状态不一样
            )
          {
            fm.all(tableId+'_Flag').value = 'U';
            break;
          }//end if
        }
        else
        {
          if(fm.all(fields[i]).type!='button' &&         //非按钮
             fm.all(fields[i]).type!='hidden' &&         //非隐藏域
             fm.all(fields[i]).style.display!='none' &&  //域处于显示状态
             fm.all(fields[i]).readOnly!=true &&         //非只读域
             fm.all(fields[i]).value!=fm.all(fields[i]).title  //新旧值不一样
            )
          {
            fm.all(tableId+'_Flag').value = 'U';
            break;
          }//end if
        }//end if
      }//end if
    }//end for
  }
  //加减模式的多记录表格
  else if(mode==2)
  {
    fields = getTableFieldsName(tableId+'_Data');
    var len = document.all(tableId).tBodies.item(0).rows.length;
    for(i=1;i<=len;i++)
    {
      if(fm.all(tableId+'_Flag')[i].value!='' &&
         fm.all(tableId+'_Flag')[i].value!='U'
        )
      {
        continue;
      }

      fm.all(tableId+'_Flag')[i].value = '';
      for(j=0;j<fields.length;j++)
      {
        if(fm.all(fields[j])[i].type=='checkbox' ) //checkbox输入域
        {
          if(fm.all(fields[j])[i].style.display!='none' &&  //域处于显示状态
             new Boolean(fm.all(fields[j])[i].checked).toString()!=fm.all(fields[j])[i].title  //新旧状态不一样
            )
          {
            fm.all(tableId+'_Flag')[i].value = 'U';
            break;
          }
        }
        else if( fm.all(fields[j])[i].type!='button' &&         //非按钮
                 fm.all(fields[j])[i].type!='hidden' &&         //非隐藏域
                 fm.all(fields[j])[i].style.display!='none' &&  //域处于显示状态
                 fm.all(fields[j])[i].readOnly!=true &&         //非只读域
                 fm.all(fields[j])[i].value!=fm.all(fields[j])[i].title  //新旧值不一样
          )
        {
          fm.all(tableId+'_Flag')[i].value = 'U';
          break;
        }//end if
      }//end for
    }//end for
  }
  //上下条模式的多记录表格
  else if(mode==3)
  {
    var onePageData = getPageData(tableId);
    fields = onePageData.field;
    for(i=0;i<onePageData.length;i++)
    {
      var onePageRowData = onePageData[i];

      if(onePageRowData[tableId+'_Flag'].value!='' &&
         onePageRowData[tableId+'_Flag'].value!='U'
        )
      {
        continue;
      }

      onePageRowData[tableId+'_Flag'].value = '';
      for(j=0;j<fields.length;j++)
      {
        if(fm.all(fields[j]).type!='button' &&         //非按钮
           fm.all(fields[j]).type!='hidden' &&         //非隐藏域
           fm.all(fields[j]).style.display!='none' &&  //域处于显示状态
           fm.all(fields[j]).readOnly!=true &&         //非只读域
           onePageRowData[fields[j]].value!=onePageRowData[fields[j]].title  //新旧值不一样
          )
        {
          onePageRowData[tableId+'_Flag'].value = 'U';
          if(onePageData.currentIndex==i)
            fm.all(tableId+'_Flag').value = 'U';
          break;
        }
      }
    }
  }

}


//查看审批意见
function visitHandelText(vCaseidNo)
{
  var newWindow = window.open("/pages/VisitHandleText.jsp?CaseidNo="+vCaseidNo,"vistText","width=600,height=200,top=150,left=100,toolbar=0,location=0,directories=0,menubar=0,scrollbars=1,resizable=1,status=0");
  newWindow.focus();
  return newWindow;
}



//显示汇总主险
function showCollectItem()
{
  var newWindow = window.open("/prpall/common/pub/UIItemCollect.html","new","width=400,height=220,top=200,left=200,scrollbars=yes");
  newWindow.focus();
  return newWindow;
}

//显示船险汇总主险
function showCollectItemC()
{
  var newWindow = window.open("/prpall/common/pub/UIItemCCollect.html","new","width=400,height=220,top=200,left=200,scrollbars=yes");
  newWindow.focus();
  return newWindow;
}

//显示货险汇总主险
function showCollectItemY()
{
  var newWindow = window.open("/prpall/common/pub/UIItemYCollect.html","new","width=400,height=220,top=200,left=200,scrollbars=yes");
  newWindow.focus();
  return newWindow;
}


//显示汇总附加险
function showCollectItemApd()
{
  var newWindow = window.open("/prpall/common/pub/UIItemApdCollect.html","new","width=400,height=220,top=200,left=200,scrollbars=yes");
  newWindow.focus();
  return newWindow;
}


//显示船险汇总附加险
function showCollectItemApdC()
{
  var newWindow = window.open("/prpall/common/pub/UIItemApdCollectC.html","new","width=400,height=220,top=200,left=200,scrollbars=yes");
  newWindow.focus();
  return newWindow;
}


//显示按币别汇总
function showCollectCurrency()
{
  var newWindow = window.open("/prpall/common/pub/UICurrencyCollect.html","new","width=400,height=220,top=200,left=200,scrollbars=yes");
  newWindow.focus();
  return newWindow;
}


//显示按变化量汇总
function showCollectChange()
{
  var newWindow = window.open("/prpall/common/pub/UIChangeCollect.html","new","width=400,height=220,top=200,left=200,scrollbars=yes");
  newWindow.focus();
  return newWindow;
}


//对span的显示、隐藏
function showPage(img,spanID)
{
  if(spanID.style.display=="")
  {
    //关闭
    spanID.style.display="none";
    img.src="/prpall/common/images/butCollapse.gif";
  }
  else
  {
    //打开
    spanID.style.display="";
    img.src="/prpall/common/images/butExpand.gif";
  }
}

//对span的显示only
function showPageOnly(img,spanID)
{
  //打开
  spanID.style.display="";
  img.src="/prpall/common/images/butExpand.gif";
}


//保额，保费按币别汇总，
//传入参数：包含币别，保额，保费的原始数组(Currency,Amount,Premium)
//返回值：按币别汇总的币别，保额，保费的数组
function collectByCurrency(arrayFee)
{
  var arrayReturn = new Array();
  var i = 0;
  var j = 0;
  for(i=0;i<arrayFee.length;i++)
  {
    for(j=i+1;j<arrayFee.length;j++)
    {
      if(trim(arrayFee[j].Currency)==trim(arrayFee[i].Currency))
      {
        arrayFee[i].Amount  = parseFloat(arrayFee[i].Amount) + parseFloat(arrayFee[j].Amount);
        arrayFee[j].Amount  = 0;
        arrayFee[i].Premium = parseFloat(arrayFee[i].Premium) + parseFloat(arrayFee[j].Premium);
        arrayFee[j].Premium = 0;
      }
    }
  }

  j=0;
  for(i=0;i<arrayFee.length;i++)
  {
    if(arrayFee[i].Amount == 0 && arrayFee[i].Premium == 0)
    {
      continue;
    }
    arrayReturn[j] = arrayFee[i];
    j++;
  }

  return arrayReturn;
}


//保额，保费按币别、保额计算标志汇总，
//传入参数：包含币别，保额，保费的原始数组(Currency,Amount,Premium)
//返回值：按币别、保额计算标志汇总的币别，保额，保费的数组
function collectByCurrencyAndCalculateFlag(arrayFee)
{
  var arrayReturn = new Array();
  var i = 0;
  var j = 0;
  var blnExist = false;
  for(i=0;i<arrayFee.length;i++)
  {
    blnExist = false;
    for(j=0;j<arrayReturn.length;j++)
    {
      if(arrayFee[i].Currency==arrayReturn[j].Currency)
      {
        blnExist = true;
        break;
      }
    }
    if(blnExist)
    {
      arrayReturn[j].Premium = arrayReturn[j].Premium + arrayFee[i].Premium;
      if(arrayFee[i].CalculateFlag=="Y")
      {
        arrayReturn[j].Amount = arrayReturn[j].Amount + arrayFee[i].Amount;
        arrayReturn[j].CalculateFlag = "Y";
      }
    }
    else
    {
      if(arrayFee[i].CalculateFlag!="Y") arrayFee[i].Amount = 0;
      arrayReturn[arrayReturn.length] = arrayFee[i];
    }
  }

  return arrayReturn;
}


////按币别汇总函数
//var arrayCollect = new Array();    //汇总项数组
//
////汇总 (行数,币别域名,保额域名,保费域名)
//function collectFee(intNum,CN,Amt,Prm )
//{
//  var arrayCollectOne ;
//  for(i=0;i<intNum;i++)
//  {
//    var strCN      = fm.all(CN)[i].value;
//    var strAmount  = fm.all(Amt)[i].value;
//    var strPremium = fm.all(Prm)[i].value;
//    var existFlag  = false;
//
//    if(!isNumeric(strAmount))
//      strAmount=0;
//    else
//      strAmount=eval(strAmount);
//    if(!isNumeric(strPremium))
//      strPremium=0;
//    else
//      strPremium=eval(strPremium);
//
//    for(j=0;j<arrayCollect.length;j++)
//    {
//      if( arrayCollect[j]["CN"] == strCN )
//      {
//        existFlag = true;
//        break;
//      }
//    }
//    if(!existFlag)
//    {
//      arrayCollectOne = new Array(); //一个汇总项
//      arrayCollectOne["CN"] = strCN;
//      arrayCollectOne["Amount"] = strAmount;
//      arrayCollectOne["Premium"] = strPremium;
//      arrayCollect[j] = arrayCollectOne;
//    }
//    else
//    {
//      arrayCollect[j]["Amount"] = arrayCollect[j]["Amount"] + strAmount ;
//      arrayCollect[j]["Premium"] = arrayCollect[j]["Premium"] + strPremium ;
//    }
//  }
//}

//
////给新***代码赋值 --代码维护模块专用onblur=setNewCode(this)
//function setNewCode(field)
//{
//  if( trim(fm.all("new"+field.name).value)=="" )
//  {
//    fm.all("new"+field.name).value = field.value;
//  }
//}



//得到短期费率表
function getMonthRate(intMonthNum)
{
  var mrate = new Array(0,10,20,30,40,50,60,70,80,85,90,95,100);
  var floatReturn = Math.floor(intMonthNum/12)+ mrate[intMonthNum%12]/100;
  return floatReturn;
}

//计算短期费率函数
function getShortRate(strMode,strStartDate,strEndDate)
{
  var startDate = new Date(replace(strStartDate,"-","/"));
  var endDate = new Date(replace(strEndDate,"-","/"));
  var shortRate = 0;
  if(parseInt(strMode,10)==1 )  //月比例
  {
    shortRate = getMonthRate(dateDiff(startDate,endDate,"M"))*100;
  }
  else if(parseInt(strMode,10)==2 )  //日比例
  {
    shortRate = dateDiff(startDate,endDate,"D")*100/365;
  }
  else
  {
    shortRate = 100;
  }
  return shortRate;
}
//计算短期费率函数
function getShortRate(strMode,strStartDate,strStartHour,strEndDate,strEndHour)
{
  var shortRate = 0;
  var strRiskCode = "PUB";
  if(parseInt(strMode,10)==1 )  //月比例
  {
    try{ strRiskCode = fm.RiskCode.value; }catch(e){}
    return getShortRateMonth(strStartDate,strEndDate,strRiskCode);
  }
  else if(parseInt(strMode,10)==2 )  //日比例
  {
    return getShortRateDay(strStartDate,strStartHour,strEndDate,strEndHour);
  }
  else
  {
    shortRate = 100;
  }
  return shortRate;
}
//请注意，此方法只在关联出单时对关联的交强险调用，单投交强险，调用的是上面那东东，^--^
function getShortRate_CI(strMode,strStartDate,strStartHour,strEndDate,strEndHour)
{
  var shortRate = 0;
  var strRiskCode = "PUB";
  if(parseInt(strMode,10)==1 )  //月比例
  {
    try{ strRiskCode = fm.RiskCode.value; }catch(e){}
    return getShortRateMonth(strStartDate,strEndDate,strRiskCode);
  }
  else if(parseInt(strMode,10)==2 )  //日比例
  {
  	strRiskCode = "0507";
    return getShortRateDay_CI(strStartDate,strStartHour,strEndDate,strEndHour,strRiskCode);
  }
  else
  {
    shortRate = 100;
  }
  return shortRate;
}

//按月比例计算短期费率函数
function getShortRateMonth(strStartDate,strEndDate,strRiskCode)
{
  var startDate = new Date(replace(strStartDate,"-","/"));
  var endDate   = new Date(replace(strEndDate,"-","/"));

  var monthCount = dateDiff(startDate,endDate,"M");
  var shortRate  = getMonthRate(monthCount,strRiskCode) * 100;
  return shortRate;
}
//按日比例计算短期费率函数
function getShortRateDay(strStartDate,strStartHour,strEndDate,strEndHour)
{
  var startDate = new Date(replace(strStartDate,"-","/"));
  var endDate   = new Date(replace(strEndDate,"-","/"));
  var dayCount  = dateDiff(startDate,endDate,"D");
  var shortRate = 0;
  if(strStartHour=="0" && strEndHour=="0")
  {
    dayCount = dayCount -1;
  }

  if(strStartHour=="24" && strEndHour=="24")
  {
    dayCount = dayCount -1;
  }

  if(strStartHour=="24" && strEndHour=="0")
  {
    dayCount = dayCount -2;
  }
  //20090917 宋硕修改 按日比例，以前是直接把保险区间除以365天，这里是考虑了闰年的情况的
  if(fm.RiskCode.value=="0507"&&dayCount<7)//20091026 songshuo 新保险法
  {
  	//小于七天按照七天算钱
  	shortRate = 7/365*100;
  }
  else
	{
  var startTm = new Date(replace(strStartDate,"-","/")).getTime();
  var StartDateAdd12month = new Date(replace(getNextMonthFullDate(strStartDate,12),"-","/")).getTime();
  shortRate = dayCount/((StartDateAdd12month-startTm)/86400000)*100;
  }
  return shortRate;
}


function getShortRateDay_CI(strStartDate,strStartHour,strEndDate,strEndHour,strRiskCode)
{
  var startDate = new Date(replace(strStartDate,"-","/"));
  var endDate   = new Date(replace(strEndDate,"-","/"));
  var dayCount  = dateDiff(startDate,endDate,"D");
  var shortRate = 0;
  if(strStartHour=="0" && strEndHour=="0")
  {
    dayCount = dayCount -1;
  }

  if(strStartHour=="24" && strEndHour=="24")
  {
    dayCount = dayCount -1;
  }

  if(strStartHour=="24" && strEndHour=="0")
  {
    dayCount = dayCount -2;
  }
  //20090917 宋硕修改 按日比例，以前是直接把保险区间除以365天，这里是考虑了闰年的情况的
  if(strRiskCode=="0507"&&dayCount<7)//20091026 songshuo 新保险法
  {
  	//小于七天按照七天算钱
  	shortRate = 7/365*100;
  }
  else
	{
  var startTm = new Date(replace(strStartDate,"-","/")).getTime();
  var StartDateAdd12month = new Date(replace(getNextMonthFullDate(strStartDate,12),"-","/")).getTime();
  shortRate = dayCount/((StartDateAdd12month-startTm)/86400000)*100;
  }
  return shortRate;
}




//加保(保额)
function incAmount(vNewAmount,vOldAmount,vNewRate,vOldRate,vNewDiscount,vOldDiscount,shortRateValue)
{
  var Dpremium =
      parseFloat(vNewAmount) * parseFloat(vNewRate) * parseFloat(vNewDiscount) * parseFloat(shortRateValue)
    - parseFloat(vOldAmount) * parseFloat(vOldRate) * parseFloat(vOldDiscount) * parseFloat(shortRateValue);

  return Dpremium;
}


//减保(保额)
function decAmount(vNewAmount,vOldAmount,vNewRate,vOldRate,vNewDiscount,vOldDiscount,vOverShortRate,vShortRate)
{
  var Dpremium =
      ((parseFloat(vNewAmount)-parseFloat(vOldAmount))* parseFloat(vOldRate) * parseFloat(vOldDiscount)
      + parseFloat(vOldAmount)*(parseFloat(vNewRate) * parseFloat(vNewDiscount)
      - parseFloat(vOldRate) * parseFloat(vOldDiscount)
      ))
      *(parseFloat(vShortRate)-parseFloat(vOverShortRate));

  return Dpremium;
}


//加保(保险期限)
function incTime(vAmount,vRate,vDiscount,vShortRate)
{
  var Dpremium =
    parseFloat(vAmount) * parseFloat(vRate) * parseFloat(vDiscount) * parseFloat(vShortRate);
  return Dpremium;
}


//减保(保险期限)
function decTime(vAmount,vRate,vDiscount,vOldShortRate,vNewShortRate)
{
  var Dpremium =
    parseFloat(vAmount) * parseFloat(vRate) * parseFloat(vDiscount)
    * ( parseFloat(vNewShortRate) - parseFloat(vOldShortRate) );
  return Dpremium;
}


//批改的计算保费(保额变化时)
function calAmountPremium(field,ext)
{
  var fieldname=field.name;
  var i = 0;
  var findex=0;

  //得到行索引
  for(i=1;i<fm.all(fieldname).length;i++)
  {
    if( fm.all(fieldname)[i] == field )
    {
      findex=i;
      break;
    }
  }

  //得到新值
  var amountValue    = fm.all("Amount"+ext)[findex].value;         //新保额
  var rateValue      = fm.all("Rate"+ext)[findex].value;           //新费率
  var discountValue  = fm.all("Discount"+ext)[findex].value;       //折扣率
  var vShortRateFlag = fm.all("ShortRateFlag"+ext)[findex].value;  //短期费率方式

  //检验值的合法性
  if( !isNumeric(amountValue) || !isNumeric(rateValue)
      || !isNumeric(discountValue)) return 0;
  if( eval(amountValue)<0 || eval(rateValue)<0
      || eval(discountValue)<0) return 0;

  //如果标的被删除则新保额按0计算
  if(ext=="Main" || ext=="Sub")
  {
    if(findex<fm.all(fieldname).length && (fm.all("Itemkind"+ext+"_Flag")[findex].value=="D"))
    {
      amountValue="0";
    }
  }
  else if(ext=="Spe")
  {
    if(findex<fm.all(fieldname).length && fm.all(SpecialFlag)[findex].value=="D")
      amountValue="0";
  }

  if(vShortRateFlag=="1")
    vShortRateFlag = "M";
  else
    vShortRateFlag = "D";

  //原值变量
  var pv = 0;             //保费
  var dpv = 0;            //保费变化量
  var vOldAmount = 0;     //原保额
  var vOldRate = 0 ;      //原费率
  var vShortRate = 0;     //原短期费率
  var vOldDiscount = 0;   //原折扣率
  var vOverShortRate = 0; //已了责任短期费率
  var shortRateValue = 0; //未了短期费率

  if( findex < fm.all(fieldname).length && (fm.all("Itemkind"+ext+"_Flag")[findex].value!="I")) //修改标的
  {
    pv = fm.all("Premium"+ext)[findex].title;             //原保费
    vOldAmount = fm.all("Amount"+ext)[findex].title;      //原保额
    vOldRate   = fm.all("Rate"+ext)[findex].title;        //原费率
    vOldDiscount = fm.all("Discount"+ext)[findex].title;  //原折扣率
  }
  else
  {
    pv = 0;         //原保费
    vOldAmount = 0; //原保额
    vOldRate   = 0; //原费率
    vOldDiscount = 0;
  }

  //日期
  var sdate,edate,pdate,pprevdate;
  var tmpd = fm.ValidDate.value.split("/");   //生效日期
  pdate = new Date(tmpd[0],parseInt(tmpd[1],10)-1,tmpd[2]);

  try
  {  //有PolicySort域的情况
    if( fm.PolicySort.value=="8" )//对分期结算单批改的处理
    {
      tmpd = fm.FQStartDate.value.split("/");
      sdate = new Date(tmpd[0],parseInt(tmpd[1],10)-1,tmpd[2]);
      tmpd = fm.FQEndDate.value.split("/");
      edate = new Date(tmpd[0],parseInt(tmpd[1],10)-1,tmpd[2]);
    }
    else //普通保单批改的处理
    {
      sdate = new Date(fm.StartDate.value );
      edate = new Date(fm.EndDate.value );
    }
  }
  catch(ex)
  {  //没有PolicySort域的情况
    sdate = new Date(fm.StartDate.value );
    edate = new Date(fm.EndDate.value );
  }

  pprevdate = new Date(pdate.getYear(),pdate.getMonth(),pdate.getDate()-1);

  //未了责任短期费率
  if( vShortRateFlag=="M" )
    shortRateValue = monthToRate(dateDiff(pdate,edate,vShortRateFlag));
  else
    shortRateValue = dateDiff(pdate,edate,vShortRateFlag)/365;

  //原短期费率
  if( vShortRateFlag=="M" )
    vShortRate = monthToRate(dateDiff(sdate,edate,vShortRateFlag));
  else
    vShortRate = dateDiff(sdate,edate,vShortRateFlag)/365;

  //已了责任短期费率
  if( vShortRateFlag=="M" )
    vOverShortRate = monthToRate(dateDiff(sdate,pprevdate,vShortRateFlag));
  else
    vOverShortRate = dateDiff(sdate,pprevdate,vShortRateFlag)/365;

  if( vOldAmount==0 || vOldAmount<=parseFloat(amountValue) )
  {
    dpv = incAmount( parseFloat(amountValue),
               vOldAmount,
               parseFloat(rateValue)/1000,
               parseFloat(vOldRate)/1000,
               discountValue/100,
               vOldDiscount/100,
               shortRateValue);        //未了短期费率
  }
  else
  {
    dpv = decAmount( parseFloat(amountValue),
               vOldAmount,
               parseFloat(rateValue)/1000,
               parseFloat(vOldRate)/1000,
               discountValue/100,
               vOldDiscount/100,
               vOverShortRate,         //已了短期费率
               vShortRate);            //原短期费率
  }

  pv = parseFloat(pv) + dpv;
  pv = pointTwo(mathRound(pv));
  fm.all("Premium"+ext)[findex].value= pv;
  fm.all("Premium"+ext)[findex].onchange();

  return pv;
}


//批改的计算保费(保险期限变化时)
function calTimePremium(fieldname,ext)
{
  var i;
  var vShortRate = 0;     //原短期费率(起保-原终保)
  var vOverShortRate = 0; //已了责任短期费率(起保-新终保)
  var shortRateValue = 0; //未了短期费率(原终保-新终保)

  //日期
  var sdate,edate,pdate,enextdate;

  try
  {
    if( fm.PolicySort.value=="8" )//对分期结算单批改的处理
    {
      tmpd = fm.FQEndDate.value.split("/");
      if(tmpd.length!=3 || !isNumeric(tmpd[0]) || !isNumeric(tmpd[1]) || !isNumeric(tmpd[2]) ) return;
      pdate = new Date(tmpd[0],parseInt(tmpd[1],10)-1,tmpd[2]);
      tmpd = fm.FQStartDate.value.split("/");
      sdate = new Date(tmpd[0],parseInt(tmpd[1],10)-1,tmpd[2]);
      tmpd = oldFQEndDate.split("/");
      edate = new Date(tmpd[0],parseInt(tmpd[1],10)-1,tmpd[2]);
    }
    else //普通保单批改的处理
    {
      pdate = new Date(fm.EndDate.value);    //批改后的终保日期
      sdate = new Date(fm.StartDate.value);  //起保日期
      edate = new Date(fm.EndDate.title);    //批改前的终保日期
    }
  }
  catch(ex)
  {
      pdate = new Date(fm.EndDate.value);
      sdate = new Date(fm.StartDate.value);
      edate = new Date(fm.EndDate.title);
  }
  enextdate = new Date(edate.getYear(),edate.getMonth(),edate.getDate()+1);

  //计算各个保费
  for(i=1;i<fm.all(fieldname).length;i++)
  {
    //得到新值
    var amountValue    = fm.all("Amount"+ext)       [i].value;  //保额
    var rateValue      = fm.all("Rate"+ext)         [i].value;  //费率
    var discountValue  = fm.all("Discount"+ext)     [i].value;  //折扣率
    var vShortRateFlag = fm.all("ShortRateFlag"+ext)[i].value;  //短期费率方式

    //检验值的合法性
    if( !isNumeric(amountValue) || !isNumeric(rateValue)
        || !isNumeric(discountValue) ) continue;
    if( eval(amountValue)<0 || eval(rateValue)<0
        || eval(discountValue)<0 ) continue;

    //短期费率方式
    if(vShortRateFlag=="1")
      vShortRateFlag = "M";
    else
      vShortRateFlag = "D";

    //未了责任短期费率 (新增短期费率)
    if( vShortRateFlag=="M" )
      shortRateValue = monthToRate(dateDiff(enextdate,pdate,vShortRateFlag));
    else
      shortRateValue = dateDiff(edate,pdate,vShortRateFlag)/365;

    //原短期费率
    if( vShortRateFlag=="M" )
      vShortRate = monthToRate(dateDiff(sdate,edate,vShortRateFlag));
    else
      vShortRate = dateDiff(sdate,edate,vShortRateFlag)/365;

    //已了责任短期费率(新短期费率)
    if( vShortRateFlag=="M" )
      vOverShortRate = monthToRate(dateDiff(sdate,pdate,vShortRateFlag));
    else
      vOverShortRate = dateDiff(sdate,pdate,vShortRateFlag)/365;

    //计算保费
    var pv = fm.all("Premium"+ext)[i].title; //原保费

    if( isNaN(parseFloat(pv)) ) //误操作
    {
      fm.all("Premium"+ext)[i].value = "";
      fm.all("Premium"+ext)[i].onchange();
      return ;
    }

    var dpv = 0;            //保费变化量
    if( edate.getTime()<pdate.getTime() )
    {
      dpv = incTime(parseFloat(amountValue),
                    parseFloat(rateValue)/1000,
                    discountValue/100,
                    shortRateValue);
    }
    else
    {
      dpv = decTime(parseFloat(amountValue),
                    parseFloat(rateValue)/1000,
                    discountValue/100,
                    vShortRate,
                    vOverShortRate);
    }

    pv = parseFloat(pv) + dpv;   //新保费=原保费+ 保费变化量
    pv = pointTwo(mathRound(pv));
    fm.all("Premium"+ext)[i].value= pv;
    fm.all("Premium"+ext)[i].onchange();
    fm.all("ShortRate"+ext)[i].value= point(mathRound(vOverShortRate*100),4);
  }
}


//批改的计算单个标的保费(保险期限变化时，保存前校验用)
function calTimeSinglePremium(field,ext)
{
  var i;
  var findex=0;
  var vShortRate = 0;     //原短期费率(起保-原终保)
  var vOverShortRate = 0; //已了责任短期费率(起保-新终保)
  var shortRateValue = 0; //未了短期费率(原终保-新终保)

  //日期
  var sdate,edate,pdate,enextdate;

  var fieldname=field.name;

  //得到行索引
  for(i=1;i<fm.all(fieldname).length;i++)
  {
    if( fm.all(fieldname)[i] == field )
    {
      findex=i;
      break;
    }
  }

  try
  {
    if( fm.PolicySort.value=="8" )//对分期结算单批改的处理
    {
      tmpd = fm.FQEndDate.value.split("/");
      if(tmpd.length!=3 || !isNumeric(tmpd[0]) || !isNumeric(tmpd[1]) || !isNumeric(tmpd[2]) ) return;
      pdate = new Date(tmpd[0],parseInt(tmpd[1],10)-1,tmpd[2]);
      tmpd = fm.FQStartDate.value.split("/");
      sdate = new Date(tmpd[0],parseInt(tmpd[1],10)-1,tmpd[2]);
      tmpd = oldFQEndDate.split("/");
      edate = new Date(tmpd[0],parseInt(tmpd[1],10)-1,tmpd[2]);
    }
    else //普通保单批改的处理
    {
      pdate = new Date(fm.EndDate.value);    //批改后的终保日期
      sdate = new Date(fm.StartDate.value);  //起保日期
      edate = new Date(fm.EndDate.title);    //批改前的终保日期
    }
  }
  catch(ex)
  {
      pdate = new Date(fm.EndDate.value);
      sdate = new Date(fm.StartDate.value);
      edate = new Date(fm.EndDate.title);
  }
  enextdate = new Date(edate.getYear(),edate.getMonth(),edate.getDate()+1);

  //得到值
  var amountValue    = fm.all("Amount"+ext)       [findex].value;  //保额
  var rateValue      = fm.all("Rate"+ext)         [findex].value;  //费率
  var discountValue  = fm.all("Discount"+ext)[findex].value;       //折扣率
  var vShortRateFlag = fm.all("ShortRateFlag"+ext)[findex].value;  //短期费率方式

  //检验值的合法性
  if( !isNumeric(amountValue) || !isNumeric(rateValue)
      || !isNumeric(discountValue) ) return 0;
  if( eval(amountValue)<0 || eval(rateValue)<0
      || eval(discountValue)<0 ) return 0;

  //短期费率方式
  if(vShortRateFlag=="1")
    vShortRateFlag = "M";
  else
    vShortRateFlag = "D";

  //未了责任短期费率
  if( vShortRateFlag=="M" )
    shortRateValue = monthToRate(dateDiff(enextdate,pdate,vShortRateFlag));
  else
    shortRateValue = dateDiff(edate,pdate,vShortRateFlag)/365;

  //原短期费率
  if( vShortRateFlag=="M" )
    vShortRate = monthToRate(dateDiff(sdate,edate,vShortRateFlag));
  else
    vShortRate = dateDiff(sdate,edate,vShortRateFlag)/365;

  //已了责任短期费率
  if( vShortRateFlag=="M" )
    vOverShortRate = monthToRate(dateDiff(sdate,pdate,vShortRateFlag));
  else
    vOverShortRate = dateDiff(sdate,pdate,vShortRateFlag)/365;

  //计算保费
  var pv = fm.all("Premium"+ext)[findex].title; //原保费

  if( isNaN(parseFloat(pv)) ) //误操作
  {
    fm.all("Premium"+ext)[findex].value = "";
    fm.all("Premium"+ext)[findex].onchange();
    return ;
  }

  var dpv = 0;            //保费变化量
  if( edate.getTime()<pdate.getTime() )
  {
    dpv = incTime(parseFloat(amountValue),
                  parseFloat(rateValue)/1000,
                  discountValue/100,
                  shortRateValue);
  }
  else
  {
    dpv = decTime(parseFloat(amountValue),
                  parseFloat(rateValue)/1000,
                  discountValue/100,
                  vShortRate,
                  vOverShortRate);
  }

  pv = parseFloat(pv) + dpv;   //新保费=原保费+ 保费变化量
  pv = pointTwo(mathRound(pv));
  fm.all("Premium"+ext)[findex].value= pv;
  fm.all("Premium"+ext)[findex].onchange();
  fm.all("ShortRate"+ext)[findex].value= point(mathRound(vOverShortRate*100),4);

  return pv;
}

//
//  查询
//
//对输入域是否是日期的校验(日期格式xxxx/xx/xx)
function isDateI(date)
{
  var strValue;
  strValue=date.split("/");

  if(strValue.length!=3) return false;
  if(!isInteger(strValue[0]) || !isInteger(strValue[1]) || !isInteger(strValue[2]) ) return false;

  var intYear=eval(strValue[0]);
  var intMonth=eval(strValue[1]);
  var intDay=eval(strValue[2]);

  if( intYear<0 || intYear>9999 || intMonth<0 || intMonth>12 || intDay<0 || intDay>31 ) return false;
  return true;
}

//比较两个日期字符串(日期格式xxxx/xx/xx)
// date1=date2则返回0 , date1>date2则返回1 , date1<date2则返回2
function compareDateI(date1,date2)
{
  var strValue=date1.split("/");
  var date1Temp=new Date(strValue[0],strValue[1],strValue[2]);

  strValue=date2.split("/");
  var date2Temp=new Date(strValue[0],strValue[1],strValue[2]);

  if(date1Temp.getTime()==date2Temp.getTime())
    return 0;
  else if(date1Temp.getTime()>date2Temp.getTime())
    return 1;
  else
    return 2;
}

//对输入域是否是满足查询格式的日期的校验(日期格式xxxx/xx/xx)
function isQueryDate(sign,date)
{
  var strValue;

  //区间的判断
  if (sign==":")
  {
    strValue=date.split(":");
    if (strValue.length!=2) return false;
    if (!isDateI(strValue[0])) return false;
    if (!isDateI(strValue[1])) return false;
    if (compareDateI(strValue[0],strValue[1])==1) return false;
  }
  //单一日期的判断
  else
  {
    return isDateI(date);
  }
  return true;
}

//对输入域是否是满足查询格式的整数的校验integer
function isQueryInteger(sign,integer)
{
  var strValue;

  //区间的判断
  if (sign==":")
  {
    strValue=integer.split(":");
    if (strValue.length!=2) return false;
    if (!isInteger(strValue[0])) return false;
    if (!isInteger(strValue[1])) return false;
    if (strValue[0]>strValue[1]) return false;
  }
  //单一日期的判断
  else
  {
    return isInteger(integer);
  }
  return true;
}

//对输入域是否是满足查询格式的数字的校验
function isQueryNum(sign,num)
{
  var strValue;

  //区间的判断
  if (sign==":")
  {
    strValue=num.split(":");
    if (strValue.length!=2) return false;
    if (!isNumeric(strValue[0])) return false;
    if (!isNumeric(strValue[1])) return false;
    if (strValue[0]<strValue[1]) return false;
  }
  //单一日期的判断
  else
  {
    return isNumeric(num);
  }
  return true;
}

//小时判断
function checkHour(field)
{
    if (field.value<0||field.value>24)
    {
    errorMessage("时间格式输入不合法");
    field.focus();
    return false;
    }
}



//财产核定损汇总
function collectProp()
{
  openWindow("/prpall/temp/common/lp/UILpropCollect.jsp","CollectProp");
}
//人员核定损汇总
function collectPerson()
{
  openWindow("/prpall/temp/common/lp/UILpersonCollect.jsp","CollectPerson");
}
//财产赔付清单汇总
function collectLoss()
{
  openWindow("/prpall/0599/lp/compensate/UIL0599lossCollect.jsp","CollectLoss");
}
//人员赔付清单汇总
function collectPersonLoss()
{
  openWindow("/prpall/temp/common/lp/UILpersonLossCollect.jsp","CollectPersonLoss");
}


//显示合同信息
function ShowContractNo(strBizType,strContractNo)
{
  if(strContractNo == null || trim(strContractNo).length < 19)
  {
    alert("没有提供有效的合同号!");
    return;
  }
  //modify by huzhenyu 20070428 begin;
  //var strURL = "/prpall/0501/tbcb/UIPrpslPoli0501MotorcadeShow.jsp?SHOWTYPE=SHOW&" + "BIZTYPE=" + strBizType +"&ContractNo="+strContractNo;
  var strURL = "/prpall/common/tbcb/UIPrpslPoliMotorcadeShow.jsp?SHOWTYPE=SHOW&" + "BIZTYPE=" + strBizType +"&ContractNo="+strContractNo;
  //modify by huzhenyu 20070428 end;
  openWindow(strURL,"strContractNo");

}


//关联
function relate(strPolicyNo)
{
    if(strPolicyNo == null || trim(strPolicyNo).length < 19)
    {
      alert("没有提供有效的保单号！");
      return;
    }

  var strURL = "/prpall/common/pub/UIRelate.jsp?PolicyNo="+strPolicyNo;
  var newWindow = window.open(strURL,"Relate",'width=640,height=300,top=0,left=0,toolbar=0,location=0,directories=0,menubar=0,scrollbars=1,resizable=1,status=0');
  newWindow.focus();
}

//关联
function relateProposalNo(strProposalNo)
{
    if(strProposalNo == null || trim(strProposalNo).length < 19)
    {
      alert("没有提供有效的投保单号！");
      return;
    }

  var strURL = "/prpall/common/pub/UIRelateProposalNo.jsp?ProposalNo="+strProposalNo;
  var newWindow = window.open(strURL,"Relate",'width=640,height=300,top=0,left=0,toolbar=0,location=0,directories=0,menubar=0,scrollbars=1,resizable=1,status=0');
  newWindow.focus();
}

//生成一个field对象,即给一个field对象赋值
function newFieldPG(value,title,tag,flag)
{
  var field = new Array();
  field.value = value;
  field.title = title;

  if(flag=="I")
    field.backgroundColor = BGCOLORI;
  else if(flag=="D")
    field.backgroundColor = BGCOLORD;
  else if(flag=="U" && value!=title)
    field.backgroundColor = BGCOLORU;
  else
    field.backgroundColor = "";

  field.tag   = tag;
  return field;
}


//批单显示时，设置一行的颜色
function setRowColorPG(DataPageCode,index,flag)
{
  var i = 0;
  var name = "";
  var elements;
  var color = "";
  if(flag=="I")
  {
    setRowColor(DataPageCode,index,BGCOLORI);
    return ;
  }
  else if(flag=="D")
  {
    setRowColor(DataPageCode,index,BGCOLORD);
    return ;
  }
  else if(trim(flag)=="")
  {
    return ;
  }

  //--以下是flag=="U"的情况
  color = BGCOLORU;

  //得到Input域的名字
  elements = document.all(DataPageCode).tBodies.item(0).getElementsByTagName("input");
  for(i=0;i<elements.length;i++)
  {
    if(elements[i].type=="button") continue;
    if(fm.all(elements[i].name)[index].value!=fm.all(elements[i].name)[index].title)
      fm.all(elements[i].name)[index].style.backgroundColor = color;
  }
  //得到Select域的名字
  elements = document.all(DataPageCode).tBodies.item(0).getElementsByTagName("select");
  for(i=0;i<elements.length;i++)
  {
    if(fm.all(elements[i].name)[index].value!=fm.all(elements[i].name)[index].title)
      fm.all(elements[i].name)[index].style.backgroundColor = color;
  }
  //得到textarea域的名字
  elements = document.all(DataPageCode).tBodies.item(0).getElementsByTagName("textarea");
  for(i=0;i<elements.length;i++)
  {
    if(fm.all(elements[i].name)[index].value!=fm.all(elements[i].name)[index].title)
      fm.all(elements[i].name)[index].style.backgroundColor = color;
  }

}

//容器里存在相同元素的位置
function getSameElementOrder(container,elementTagName,elementName,elementValue)
{
  var elements = container.getElementsByTagName(elementTagName);
  for(var i=0;i<elements.length;i++)
  {
    if(elements[i].name==elementName)
    {
      if(elements[i].value==elementValue)
      {
        return getElementOrder(elements[i],container.document.fm);
      }
    }//end if
  }//end for
  return -1;
}//end function

//元素在容器里的数组位置
function getElementOrderFromContainer(container,elementTagName,field)
{
  var index = -1;
  var elements = container.getElementsByTagName(elementTagName);
  for(var i=0;i<elements.length;i++)
  {
    if(elements[i].name==field.name)
    {
      index++;
      if(elements[i]==field) return index;
    }//end if
  }//end for
  return -1;
}

//按钮单击事件，用于条款的显示
function buttonOnClick(Field,strCodeType,intCodeCodeOffset,intCodeNameOffset,strSubPageCode)
{
  var intElementIndex=getElementIndex(Field);
  var strCodeCode = trim(fm.elements[intElementIndex + intCodeCodeOffset].value);
  var strContext  = trim(fm.elements[intElementIndex + intCodeNameOffset].value);

  var strCodeTypeTemp = "";
  if(strCodeType.indexOf("Context")>-1)
  {
    strCodeTypeTemp = strCodeType.substring(0,strCodeType.indexOf("Context"));
  }
  else
  {
    return;
  }

  if(strContext=="")
  {
    strContext = ""; //根据strCodeTypeTemp、strCodeCode取内容
    fm.elements[intElementIndex + intCodeNameOffset].value = strContext;
    showSubPage(Field,strSubPageCode);
  }

  showSubPage(Field,strSubPageCode);
}

// add bu zhangfan begin 特别约定较强险与商业险的分离 20071106
function buttonOnClickCI(Field,strCodeType,intCodeCodeOffset,intCodeNameOffset,strSubPageCode)
{

  var intElementIndex=getElementIndex(Field);
  var strCodeCode = trim(fm.elements[intElementIndex + intCodeCodeOffset].value);
  var strContext  = trim(fm.elements[intElementIndex + intCodeNameOffset].value);

  var strCodeTypeTemp = "";
  if(strCodeType.indexOf("Context")>-1)
  {
    strCodeTypeTemp = strCodeType.substring(0,strCodeType.indexOf("Context"));
  }
  else
  {
    return;
  }
  if(strContext=="")
  {
    strContext = ""; //根据strCodeTypeTemp、strCodeCode取内容
    fm.elements[intElementIndex + intCodeNameOffset].value = strContext;
    showSubPageCI(Field,strSubPageCode);
  }
  showSubPageCI(Field,strSubPageCode);
}

// added by wuhangli, 20081007, 分离核心与其他系统依赖调用 start
function includeJavaScript(jsFile)
{
  document.write('<script type="text/javascript" src="'
    + jsFile + '"></scr' + 'ipt>'); 
}

function openIncludeFile()
{
	includeJavaScript("XmlGet.js");
}
// added by wuhangli, 20081007, 分离核心与其他系统依赖调用 end

// add bu zhangfan begin 特别约定较强险与商业险的分离 20071106

/**
 @Author     : 中国大地项目组
 @description 查看核保信息
 @param       无
 @return      无
 */
function viewTrace(businessNo, undwrtIP)
{
  if(businessNo=="")
  {
    errorMessage("没有核保信息!");
    return ;
  }
  //fm.target = "fraSubmit";
  //fm.action = "/undwrt/CommonViewTrace.do?BusinessNo=" + businessNo;
    //fm.method="post";
  //fm.submit();
  //var strURL="/undwrt/common/CommonTraceInfo.jsp?BusinessNo=" + businessNo;
  //window.open(strURL,'核保信息','width=640,height=300,top=50,left=80,toolbar=0,location=0,directories=0,menubar=0,scrollbars=1.resizable=1,status=0');


  var submitStr="/CommonViewTrace.do?BusinessNo=" + businessNo;
  
  // rectified by wuhangli 20081007, 分离核心与其他系统依赖调用
  //submitStr = 'http://100.250.128.5:7021/' + submitStr;
  //openIncludeFile();
  //submitStr = getConfigData("UNDWRT_URL_SEP") + submitStr;
  //TASK-1916 modified by liujiliang 20101101 begin
  //submitStr = 'http://100.250.128.69:7011/' + submitStr;//生产环境用该语句，但是本地用该地址则看不到核保意见
  //changed by liudl; TASK-8577; begin
  if(undwrtIP =="" || undwrtIP == null ){
	  submitStr = parent.fraTitle.fm.undwrtIP.value + submitStr  ;
  } else {
	  submitStr = undwrtIP + submitStr;	  
  }
  //changed by liudl; TASK-8577; end
  //TASK-1916 modified by liujiliang 20101101 end
  //submitStr = 'http://localhost:7001/' + submitStr;//生产环境用上面语句，本地环境用该语句，但是本地用该地址则看不到核保意见
  window.open(submitStr,'核保信息','width=640,height=300,top=50,left=80,toolbar=0,location=0,directories=0,menubar=0,scrollbars=1.resizable=1,status=0');
}

/**
 @Author     : chenxi
 @description 保单查看核保信息
 @param       无
 @return      无
 */
function viewTracePolicy(undwrtIP)
{
  var businessNo = fm.ProposalNo2.value;
  var submitStr="/CommonViewTrace.do?BusinessNo=" + businessNo;
  //modified by liujiliang 20101101 begin
  //submitStr = 'http://100.250.128.69:7011/' + submitStr;
  //changed by liudl; TASK-8577; begin
  if(undwrtIP =="" || undwrtIP == null ){
	  submitStr = parent.fraTitle.fm.undwrtIP.value + submitStr;
  } else {
	  submitStr = undwrtIP + submitStr;	  
  }
  //changed by liudl; TASK-8577; end
  //modified by liujiliang 20101101 end
  //submitStr = 'http://localhost:7001/' + submitStr;//生产环境用上面语句，本地环境用该语句，但是本地用该地址则看不到核保意见
  window.open(submitStr,'核保信息','width=640,height=300,top=50,left=80,toolbar=0,location=0,directories=0,menubar=0,scrollbars=1.resizable=1,status=0');
}

//获取条款内容(财产卢续攀20030407)
//strQueryString参数格式是：参数1=值1&参数2=值2
function getClauseContext(strQueryString)
{
  var ClauseURL = "/prpall/common/pub/UIClauseGet.jsp";
  var strURL = ClauseURL + "?" + strQueryString;
  var vXmlText = getResponseXmlText(strURL);
  //截掉头尾字符[]
  if(vXmlText.length>=2)
    return vXmlText.substring(1,vXmlText.length-1);
  else
    return "";
}

//使用xmlhttp访问页面，并获取数据(财产卢续攀20030407)
function getResponseXmlText(strURL)
{
  var objXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  objXmlHttp.Open("POST",strURL,false);
  objXmlHttp.setRequestHeader("Content-type","text/xml");
  objXmlHttp.Send("");
  if(objXmlHttp.status==200)
  {
    return objXmlHttp.responseXML.text;
  }
  else if(objXmlHttp.status==404)
  {
    alert("找不到页面："+ strURL);
    return "";
  }
  else
  {
    alert("访问"+ strURL +"出错，错误号："+objXmlHttp.status);
    return "";
  }
}

//通用设置序号函数(财产卢续攀20030407)
//参数 serialNoElements 序号域数组
//     startNo 开始序号
function resetSerialNumber(serialNoElements,startNo)
{
  for(var i=0;i<serialNoElements.length;i++)
    serialNoElements[i].value = startNo + i;
}


//add begin by liuyang 2003/10/14
//离开域时的数字校验Decimal
function checkDecimal2(field,p,s,MinValue,MaxValue)
{
  field.value = trim(field.value);
  var strValue=field.value;
  if(strValue=="")
    strValue = "0";
  if(strValue.length>0 && strValue.charAt(0)=="-")
    strValue = strValue.substring(1);

  var desc   = field.description;
  //如果description属性不存在，则用name属性
  if(desc==null)
    desc = field.name;

  if(!isNumeric(strValue))
  {
    errorMessage("请输入合法的数字");
    field.focus();
    field.select();
    return false;
  }
  p = parseInt(p,10);
  s = parseInt(s,10);

  var pLength;
  var sLength;
  var position = strValue.indexOf(".");
  if(position>-1)
  {
    pLength = position;
    sLength = strValue.length - position - 1;
  }
  else
  {
    pLength = strValue.length;
    sLength = 0;
  }

  if(pLength>(p-s) || sLength>s)
  {
    errorMessage("请输入合法的" + desc +"\n类型为数字,整数位最长为" + (p-s) + ",小数位最长为" + s);
    field.focus();
    field.select();
    return false;
  }

  var value = parseFloat(strValue);
  if(MaxValue!=null && MinValue!=null && trim(MaxValue)!="" && trim(MinValue)!="")
  {
    MinValue = parseFloat(MinValue);
    MaxValue = parseFloat(MaxValue);
    if(isNaN(value) || value>MaxValue || value<MinValue)
    {
      errorMessage("请输入合法的" + desc +"\n类型为数字,最小值为" + MinValue + ",最大值为" +MaxValue);
      field.focus();
      field.select();
      return false;
    }
  }

  return true;
}

//对输入域按键时的数字校验
function pressDecimal2(e)
{
  var value = String.fromCharCode(e.keyCode);
  if((value>=0 && value<=9) || value=="." || value=="-")
    return true;
  else
    return false;
}
//add end by liuyang 2003/10/14

////子险序号、险别代码到数组
//var itemKindNoArray = new Array();
//
////保存子险序号、险别代码到数组
//function setItemKindNo(itemKindNo)
//{
//  itemKindNoArray = itemKindNo;
//}
//
////取子险序号、险别代码，打包为字符串的函数
//function getItemKindNo()
//{
//  var strCodes="";
//
//  if(itemKindNoArray.length==0) return null;
//
//  for(var i=0;i<itemKindNoArray.length;i++)
//  {
//    strCodes=strCodes+itemKindNoArray[i].ItemKindNo+FIELD_SEPARATOR+itemKindNoArray[i].KindCode+GROUP_SEPARATOR;
//  }
//
//  strCodes=strCodes.substring(0,strCodes.length-GROUP_SEPARATOR.length);
//  return strCodes;
//
//}



//冲减保额
//function processLendor(strClaimNo)
//{
//  var strURL = "/prpall/temp/common/lp/UILendorInput.jsp?ClaimNo="+strClaimNo;
//  var newWindow = window.open(strURL,"Lendor",'width=640,height=270,top=0,left=0,toolbar=0,location=0,directories=0,menubar=0,scrollbars=1,resizable=1,status=0');
//  newWindow.focus();
//}
//查看冲减保额
//function showLendor(strClaimNo)
//{
//  var strURL = "/prpall/temp/common/lp/UILendorShow.jsp?ClaimNo="+strClaimNo;
//  var newWindow = window.open(strURL,"Relate",'width=640,height=270,top=0,left=0,toolbar=0,location=0,directories=0,menubar=0,scrollbars=1,resizable=1,status=0');
//  newWindow.focus();
//}



//
//
//过期
//
//
//
////对格式字符串进行解析,返回一个关联数组
////格式字符串 FieldName:FieldValue|
////关联数组   array[FieldName]=FieldValue
//function splitField(record)
//{
//  var arrayField=record.split(FIELDDELIMITER);
//  var arrayReturn=new Array();
//  var i;
//  for(i=0;i<arrayField.length-1;i++)
//  {
//    var arrayNameValuePair=arrayField[i].split(NAMEVALUEDELIMITER);
//   //分割出一对域名和域值
//    arrayReturn[arrayNameValuePair[0]]=arrayNameValuePair[1];
//  }
//  return arrayReturn;
//}
//
///* 在指定的变量前加0，直至满足指定位数 */
//function addZero(strValue,intLen)
//{
//  var i,len;
//  var strRet;
//  strRet=strValue.toString();
//  len=strRet.length;
//  if (len<intLen)
//  {
//    while (strRet.length!=intLen)
//    {
//      strRet="0"+strRet;
//    }
//    return strRet;
//  }
//  else
//  {
//    return strRet;
//  }
//}
//
//
////将空值输入域设为给定值，isMulti表示该域是否为多个输入域
//function setEmpty(FieldName,FieldValue,isMulti)
//{
//    var i = 0;
//    if (!isMulti)
//    {
//      if (fm.all(FieldName).value == "")
//        fm.all(FieldName).value = FieldValue;
//    }
//    else
//    {
//
//      for(i = 0; i< fm.all(FieldName).length; i++)
//      {
//        theField = fm.all(FieldName)[i];
//        if (trim(theField.value) == "" || isNaN(eval(theField.value)) || eval(theField.value) == 0)
//          theField.value = FieldValue;
//      }
//    }
//}
//
//分割代码并放在select域里
//串的格式: 值FIELD_SEPARATOR文本GROUP_SEPARATOR值FIELD_SEPARATOR文本...
function setObjOption(selectObj,strValue)
{
  //查不到代码返回
  if(strValue==null || trim(strValue)=="")
  {
    return;
  }
  var arrayField=strValue.split(GROUP_SEPARATOR);
  var i=0;
  selectObj.options.length = 0;
  while(i<arrayField.length)
  {
    var option=document.createElement("option");
    var arrayTemp=arrayField[i].split(FIELD_SEPARATOR);
    var strFieldName=arrayTemp[0];
    var strFieldValue=unescape(arrayTemp[1]);
    option.value=strFieldName;
    option.text=strFieldValue;
    selectObj.add(option);
    i++;
  }
}
//public
//过程部分可逆,select-one所有附加事件被取消 --OK了
function undoSetReadonlyOfElement(iElement)
{
  if(iElement.type=="select-one")
  {
    if(iElement.setReadonlyFlag!=true)
    {
      return;
    }
    else
    {
      iElement.setReadonlyFlag = false;
    }

    var optionTags = iElement.optionTags;
    var currentValue = iElement.value;

    for(var i=iElement.options.length-1;i>=0;i--)
    {
      iElement.remove(i);
    }

    for(var i=optionTags.length-1;i>=0;i--)
    {
      var tag = optionTags[i];
      var op = document.createElement("OPTION");
      op.value = tag.value;
      op.text =  tag.text;
      iElement.add(op);
    }
    iElement.value = currentValue;

  }
  else if ((iElement.type=="hidden") ||
            (iElement.type=="password") ||
            (iElement.type=="text") ||
            (iElement.type=="textarea"))
  {
    if(iElement.setReadonlyFlag!=true)
    {
      return;
    }
    else
    {
      iElement.setReadonlyFlag = false;
    }

    iElement.onblur = iElement.oldOnblur;
    iElement.ondblclick = iElement.oldOndblclick;
    iElement.onfocus = iElement.oldOnfocus;

    iElement.readOnly = false;
    iElement.className = iElement.oldClassName;
  }
  else if(iElement.type=="button")
  {
    if(iElement.setReadonlyFlag!=true)
    {
      return;
    }
    else
    {
      iElement.setReadonlyFlag = false;
    }

    if(iElement.name.indexOf("Delete")>-1 || iElement.name.indexOf("Insert")>-1)
    {
      iElement.disabled = false;
    }
  }
  else if(iElement.type=="checkbox")
  {
    setCheckBoxReadonly(iElement,false);
  }
  else if(iElement.type=="radio")
  {
    setRadioReadonly(iElement,false);
  }
}
/**
 @Author     : 国寿项目组
 @description 查询车型代码
 @param       无
 @return      无
 */
function queryModelCode()
{
  var strURL = "/prpall/common/pub/UIModelCodeQueryInputJY.jsp";
  window.open(strURL,'查询车型代码','top=0,left=0,toolbar=0,location=0,directories=0,menubar=0,scrollbars=1,resizable=1,status=0');
}
/**
 @Author     : 国寿项目组-许宁
 @description 其他归属业务部门的业务员
 @param       无
 @return      无
 */
function queryHandler1Code()
{
		if(fm.ComCode.value==""||fm.ComCode.value== null)
	{
		alert("请先选择“归属部门”！");
    return false;
	}
	if(fm.ChannelType.value==""||fm.ChannelType.value== null)
	{
		alert("请先选择“销售渠道”！");
    return false;
	}
	if(checkGroupNature()==false){
	return false;
	}
  var strURL = "/prpall/common/pub/UIHandler1CodeQueryInput.jsp?ChannelType="+fm.ChannelType.value;
  window.open(strURL,'查询其他人员','top=0,left=0,toolbar=0,location=0,directories=0,menubar=0,scrollbars=1,resizable=1,status=0');
}

function checkGroupNature(){
	if(fm.GroupNature01Flag.value=="1"){//对接营销的销售渠道，才不允许选择其他业务员
		if(fm.ChannelType.value=="01"){
			errorMessage("销售渠道为营销，不允许进行此操作!");
    		return false;
		}
	
	}
}

/* add by xiaojian 20051209 begin reason：因增加Prp*main的备注而增加函数 */
function checkLength1(field)
{
  var strValue = field.value;
  var strDesc = field.description;
  var intMaxlength = field.maxlength;
  var intCount = 0;
  var vChar;
  var i;

  if(trim(strValue).length==0)
    return true;
  if(strDesc==null)
    strDesc = field.name;
  if(isNaN(parseInt(intMaxlength,10)))
    return true;

  if(strValue.indexOf("^")>-1||
     strValue.indexOf(FIELD_SEPARATOR)>-1||
     strValue.indexOf(GROUP_SEPARATOR)>-1)
  {
    errorMessage("^为系统保留字符，不允许输入！");
    field.focus();
    field.select();
    return false;
  }

  for(i=0;i<strValue.length;i++)
  {
    vChar = escape(strValue.charAt(i));
    if(vChar.substring(0,2)=="%u"&&vChar.length==6)
      intCount = intCount+2;
    else
      intCount = intCount+1;
  }

  if(intCount>intMaxlength)
  {
    errorMessage(strDesc+"输入的内容超长！\n"+strDesc+"的最大长度为"+intMaxlength+"个英文字符！\n请重新输入！");
    field.focus();
    field.select();
    return false;
  }
  return true;
}
/* add by xiaojian 20051209 end */
//交验是否有未决赔案
function checkNoPay()
{
  var strQueryString = "?PolicyNo="+ trim(fm.PolicyNo.value);
  var strURL = "/prpall/common/pub/UICheckNoPay.jsp"+strQueryString;
  var strXmlText = getResponseXmlText(strURL);
  if(trim(strXmlText)=="Y")
    return true;
  else
    return false;
}

//add by luyang reason:车险定额特殊界面处理 2006-6-7 02:31下午
function changePolicySort()
{
  try{
    var policySort = fm.PolicySort.value ;  //保单种类
    if(policySort=="1" || policySort=="定额" )
    {
      trGoalInsuredFlag.style.display = 'none';
      tdShareHolderFlagTitle.style.display = 'none';
      tdShareHolderFlagInput.style.display = 'none';
      //投保人邮编、邮箱
      trAppliPostCodeEmail.style.display = 'none';
      //被保人邮编、邮箱
      trInsuredPostCodeEmail.style.display = 'none';
      //被保人性别年龄
      trInsuredSexAge.style.display = 'none';
      //被保人职业婚否
      trInsuredJobMarriage.style.display = 'none';
      //被保险人与车辆的关系
      trCarInsuredRelation.style.display = 'none';
      //进口、国产
      tdCountryNatureTitle.style.display = 'none';
      tdCountryNatureInput.style.display = 'none';
      //新车购置价
      tdPurchasePriceTitle.style.display = 'none';
      tdPurchasePriceInput.style.display = 'none';
      //已行驶里程
      tdRunMilesTitle.style.display = 'none';
      tdRunMilesInput.style.display = 'none';
      //车身颜色
      tdColorCodeTitle.style.display = 'none';
      tdColorCodeInput.style.display = 'none';
    }
    else  if(policySort=="0" || policySort=="普通" )
    {
      trGoalInsuredFlag.style.display = '';
      tdShareHolderFlagTitle.style.display = '';
      tdShareHolderFlagInput.style.display = '';
      trAppliPostCodeEmail.style.display = '';
      trInsuredPostCodeEmail.style.display = '';
      trInsuredSexAge.style.display = '';
      trInsuredJobMarriage.style.display = '';
      trCarInsuredRelation.style.display = '';
      tdCountryNatureTitle.style.display = '';
      tdCountryNatureInput.style.display = '';
      tdPurchasePriceTitle.style.display = '';
      tdPurchasePriceInput.style.display = '';
      tdRunMilesTitle.style.display = '';
      tdRunMilesInput.style.display = '';
      tdColorCodeTitle.style.display = '';
      tdColorCodeInput.style.display = '';
    }
  }catch(e){}
}

//人民币数字转换成中文大写货币形式
function convertCurrency(currencyDigits) {
// Constants:
 var MAXIMUM_NUMBER = 99999999999.99;
 // Predefine the radix characters and currency symbols for output:
 var CN_ZERO = "零";
 var CN_ONE = "壹";
 var CN_TWO = "贰";
 var CN_THREE = "叁";
 var CN_FOUR = "肆";
 var CN_FIVE = "伍";
 var CN_SIX = "陆";
 var CN_SEVEN = "柒";
 var CN_EIGHT = "捌";
 var CN_NINE = "玖";
 var CN_TEN = "拾";
 var CN_HUNDRED = "佰";
 var CN_THOUSAND = "仟";
 var CN_TEN_THOUSAND = "万";
 var CN_HUNDRED_MILLION = "亿";
 var CN_SYMBOL = "人民币：";
 var CN_DOLLAR = "元";
 var CN_TEN_CENT = "角";
 var CN_CENT = "分";
 var CN_INTEGER = "整";
 
// Variables:
 var integral; // Represent integral part of digit number.
 var decimal; // Represent decimal part of digit number.
 var outputCharacters; // The output result.
 var parts;
 var digits, radices, bigRadices, decimals;
 var zeroCount;
 var i, p, d;
 var quotient, modulus;
 
// Validate input string:
 currencyDigits = currencyDigits.toString();
 if (currencyDigits.match(/[^,.\d]/) != null) {
  return "";
 }
 if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
  return "";
 }
 
// Normalize the format of input digits:
 currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma delimiters.
 currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning.
 // Assert the number is not greater than the maximum number.
 if (Number(currencyDigits) > MAXIMUM_NUMBER) {
  return "";
 }
 
// Process the coversion from currency digits to characters:
 // Separate integral and decimal parts before processing coversion:
 parts = currencyDigits.split(".");
 if (parts.length > 1) {
  integral = parts[0];
  decimal = parts[1];
  // Cut down redundant decimal digits that are after the second.
  decimal = decimal.substr(0, 2);
 }
 else {
  integral = parts[0];
  decimal = "";
 }
 // Prepare the characters corresponding to the digits:
 digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
 radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
 bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
 decimals = new Array(CN_TEN_CENT, CN_CENT);
 // Start processing:
 outputCharacters = "";
 // Process integral part if it is larger than 0:
 if (Number(integral) > 0) {
  zeroCount = 0;
  for (i = 0; i < integral.length; i++) {
   p = integral.length - i - 1;
   d = integral.substr(i, 1);
   quotient = p / 4;
   modulus = p % 4;
   if (d == "0") {
    zeroCount++;
   }
   else {
    if (zeroCount > 0)
    {
     outputCharacters += digits[0];
    }
    zeroCount = 0;
    outputCharacters += digits[Number(d)] + radices[modulus];
   }
   if (modulus == 0 && zeroCount < 4) {
    outputCharacters += bigRadices[quotient];
   }
  }
  outputCharacters += CN_DOLLAR;
 }
 // Process decimal part if there is:
 if (decimal != "") {
  for (i = 0; i < decimal.length; i++) {
   d = decimal.substr(i, 1);
   if (d != "0") {
    outputCharacters += digits[Number(d)] + decimals[i];
   }
  }
 }
 // Confirm and return the final output string:
 if (outputCharacters == "") {
  outputCharacters = CN_ZERO + CN_DOLLAR;
 }
 if (decimal == "") {
  outputCharacters += CN_INTEGER;
 }
 outputCharacters = CN_SYMBOL + outputCharacters;
 return outputCharacters;
}

/**
 * 扩展String类型，将全角SBC字符转化为半角DBC字符
 * 全角空格为12288，半角空格为32；其他字符半角(33-126)与全角(65281-65374)的对应关系是：均相差65248
 * "我爱看３Ｄ阿凡达".sbc2dbc()->我爱看3D阿凡达
 * @author 庄元
 */
String.prototype.sbc2dbc = function ()
{
  return this.replace(/[\uff01-\uff5e]/g,function(a){return String.fromCharCode(a.charCodeAt(0)-65248);}).replace(/\u3000/g," ");
}
/**
 * 扩展Date类型，将 Date 转化为fmt格式的String
 * new Date().format('yyyy年MM月dd日 HH时mm分')->2009年7月24日 10时36分
 * new Date().format('yyyy-MM-dd HH:mm:ss')->2009-07-24 10:37:00
 * new Date().format('HH时mm分')->10时36分
 * @author 庄元
 */
Date.prototype.format = function(fmt)
{
  var o = 
  {
    "M+" :this.getMonth() + 1,//月份
    "d+" :this.getDate(),//日
    "h+" :this.getHours() % 12 == 0 ? 12 : this.getHours() % 12,//12小时
    "H+" :this.getHours(),//24小时
    "m+" :this.getMinutes(),//分
    "s+" :this.getSeconds(),//秒
    "S"  :this.getMilliseconds()//毫秒
  };
  
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  
  for( var k in o)
  {
    if(new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1,(RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  }
  return fmt;
}

/**
 * 将string解析为Date
 * 2009-07-24 10:37:00->Date
 * 2009-07-24->Date
 * 2009/07/24 10:37->Date
 * @author 庄元
 */
function parseDate(str)
{
  return new Date(str.replace(/-/g,"/"));
}

//add by mxy 20091128 begin TASK-1347 浙江商业险集中
function checkOptionValues(field){
    var isTrue = false;
    try{
	    for(var i=0;i<field.options.length;i++){
	        if(field.value == field.options[i].value){
	            isTrue = true;
	            break;
	        }
	    }
	    if(!isTrue){
	        field.value = "";
	    }
    }catch(e){
    
    }
}
//add by mxy 20091128 end TASK-1347 浙江商业险集中
//zhanglong 20100126 task-1138 begin
var vcity={ 11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",
            21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",
            33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",
            42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",
            51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",
            63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"
           };
 //不校验性别身份证校验          
 function checkCard1(identifyType,identifyNumber,fieldID,focusFlag){
 	var card = identifyNumber; 
 	if(identifyType != ''){
 		if(identifyType == '01'){
		    	//是否为空
		    if(card == '')
		    {
		        alert('请输入证件号码，证件号码不能为空');
		        if(focusFlag != '1'){
		        	fieldID.focus();
		        }
		        return false;
		    }    
		    //校验长度，类型
		    if(isCardNo(card) == false)
		    {
		        alert('证件号码:'+card+ '不正确，请检查长度和确定是否含有特殊字符后重新输入或进行修改');
		        if(focusFlag != '1'){
		        	fieldID.focus();
		        }
		        return false;
		    }    
		    //检查省份
		    if(checkProvince(card) == false)
		    {
		        alert('证件号码:'+card+'不正确，请检查身份证0-6位后重新输入或进行修改');
		        if(focusFlag != '1'){
		        	fieldID.focus();
		        }
		        return false;
		    }    	    
		    //校验生日
		    if(checkBirthday(card,fieldID,focusFlag) == false)
		    {
		        return false;
		    }
		    //校验性别
		    //if(checkSex(card,sex,fieldID,focusFlag) == false){
		    //	return false;
		    //}    
		    //检验位的检测	    
		    if(checkParity(card) == false)
		    {
		        alert('您的证件号码'+ card + '的最后一位校验位不正确,请重新输入');
		        if(focusFlag != '1'){
		        	fieldID.focus();
		        }
		        return false;
		    }
		    return true;
      }
      return true;
 	}else{
 		alert('证件类型不能空,请检查后重新输入');
    	return false;
 	}
    
 }          
 function checkCard(identifyType,identifyNumber,sex,fieldID,focusFlag) 
{   
    var card = identifyNumber; 
    if(identifyType != ''){
    	if(identifyType == '01'){
	    	//是否为空
		    if(card == '')
		    {
		        alert('请输入身份证号，身份证号不能为空');
		        
		        if(focusFlag != '1'){
				  fieldID.focus();
				}
		        return false;
		    }
		    //校验长度，类型   
		    if(isCardNo(card) == false)
		    {
		        alert('身份证号码:'+card +'不正确，请检查长度和确定是否含有特殊字符后重新输入或进行修改');
		        if(focusFlag != '1'){
		        	fieldID.focus();
		        }
		        return false;
		    }   
		    //检查省份
		    if(checkProvince(card) == false)
		    {
		        alert('身份证号码:'+card +'不正确，请检查身份证0-6位后重新输入或进行修改');
		        if(focusFlag != '1'){
		        	fieldID.focus();
		        }
		        return false;
		    }	    
		    //校验生日
		    if(checkBirthday(card,fieldID,focusFlag) == false)
		    {
		        return false;
		    }  
		    //校验性别	    
		    if(checkSex(card,sex,fieldID,focusFlag) == false){
		    	return false;
		    } 	    
		    //检验位的检测	    
		    if(checkParity(card) == false)
		    {
		        alert('您的身份证号码:'+card +'的最后一位校验位不正确,请重新输入');
		        if(focusFlag != '1'){
				  fieldID.focus();
				}
		        return false;
		    }
		    return true;
    	}
    	return true;
    }else{
    	alert('证件类型不能空,请检查后重新输入');
    	return false;
    }
   
    
}; 
//检查号码是否符合规范，包括长度，类型
isCardNo = function(card)
{
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{17}(\d|X)$)/;
    if(reg.test(card) == false)
    {
        return false;
    }

    return true;
};

//取身份证前两位,校验省份
checkProvince = function(card)
{
    var province = card.substr(0,2);   
    if(vcity[province] == undefined)
    {
        return false;
    }
    return true;
};

//检查生日是否正确
checkBirthday = function(card,fieldID,focusFlag)
{
    var len = card.length;
    var ereg;
    //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
    if(len == '15')
    {
        if ( (parseInt(card.substr(6,2))+1900) % 4 == 0 || ((parseInt(card.substr(6,2))+1900) % 100 == 0 && (parseInt(card.substr(6,2))+1900) % 4 == 0 )){
			ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;//测试出生日期的合法性
		} else {
			ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;//测试出生日期的合法性
		}
		if(ereg.test(card)){
			return true;
		}else{
			alert('身份证号码:'+card +'生日不正确,请重新输入或进行修改');	
			if(focusFlag != '1'){
			  fieldID.focus();
			}	
			return false;
		}
		
    }
    //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
    else if(len == '18')
    {
        if ( parseInt(card.substr(6,4)) % 4 == 0 || (parseInt(card.substr(6,4)) % 100 == 0 && parseInt(card.substr(6,4))%4 == 0 )){
			ereg=/^[1-9][0-9]{5}(20|19)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;//闰年出生日期的合法性正则表达式
		} else {
			ereg=/^[1-9][0-9]{5}(20|19)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;//平年出生日期的合法性正则表达式
		}
		if(ereg.test(card)){
			return true;
		}else{
			alert('身份证号码:'+card +'生日不正确,请检查后重新输入或进行修改');	
			if(focusFlag != '1'){
			  fieldID.focus();
			}	
			return false;
		}
     }else{
     	alert('身份证号码:'+card +'不正确，请检查长度后重新输入或进行修改');
     	if(focusFlag != '1'){
     		fieldID.focus();
     	}
     	return false;
     }
};
 
//校验位的检测
checkParity = function(card)
{
    //15位转18位
    card = changeFivteenToEighteen(card);
    var len = card.length;
    if(len == '18')
    {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); 
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); 
        var cardTemp = 0, i, valnum; 
        for(i = 0; i < 17; i ++) 
        { 
            cardTemp += card.substr(i, 1) * arrInt[i]; 
        } 
        valnum = arrCh[cardTemp % 11]; 
        if (valnum == card.substr(17, 1)) 
        {
            return true;
        }
        return false;
    }
    return false;
};

//15位转18位身份证号
changeFivteenToEighteen = function(card)
{
    if(card.length == '15')
    {
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); 
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); 
        var cardTemp = 0, i;   
        card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
        for(i = 0; i < 17; i ++) 
        { 
            cardTemp += card.substr(i, 1) * arrInt[i]; 
        } 
        card += arrCh[cardTemp % 11]; 
        return card;
    }
    return card;
}; 
checkSex = function(card,sex,fieldID,focusFlag){
	var sexShow ;
	if(trim(sex) == ''){
		return true;
	}
	if(card.length == '15'){
		sexShow = card.slice(14,15)%2?'1':'2';
		if(sex == sexShow){
			return true;
		}else{
			alert('身份证号码:'+card +'所标识的性别与已有性别不一致，请检查后重新输入或进行修改');
			if(focusFlag != '1'){
				fieldID.focus();
			}
			return false;
		}
	}
	else if(card.length == '18'){
		sexShow = card.slice(16,17)%2?'1':'2';

		if(sex == sexShow){
			return true;
		}else{
			alert('身份证号码:'+card +'所标识的性别与已有性别不一致，请检查后重新输入或进行修改');
			if(focusFlag != '1'){
				fieldID.focus();
			}
			return false;
		}
	}else{
		alert('身份证号码:'+card +'不正确，请检查长度和确定是否含有特殊字符后重新输入或进行修改');
		if(focusFlag != '1'){
			fieldID.focus();
		}
		
		return false;
	}

};
//modify by mxy 20100521 增加几个特殊符号，允许使用（）()<>&
//检查姓名是否存在非汉字编码的特殊字符(含空格)
function checkCname(Cname,fieldID,focusFlag){
	//var ereg = /[^\u4E00-\u9FA5]/g;
	//var ereg = /^([\u4E00-\u9FA5]|[a-z]|[（]|[）]|[(]|[)]|[<]|[>]|[&]|[＇]|[.])*$/gi;
	//updated by niushanshan 20110803 task-10041 匹配类似'中文-中文'名字 begin
	//var ereg = /^([\u4E00-\u9FA5]|[a-z]|[（]|[）]|[(]|[)]|[<]|[>]|[&]|[＇]|[.]|[0-9])*$/gi;
	var ereg = /^([\u4E00-\u9FA5]|[a-z]|[-]|[（]|[）]|[(]|[)]|[<]|[>]|[&]|[＇]|[.]|[0-9])*$/gi;
	//updated by niushanshan 20110803 task-10041 匹配类似'中文-中文'名字 end
	if(trim(Cname) == ''){
		alert('客户名称不能为空');
		if(focusFlag != '1'){
			fieldID.focus();
		}
		return false;
	}
	
	if(ereg.test(Cname)){	
		return true;
	}else{
		alert("姓名不正确，正确的姓名应该为中文、字母或包含<>（）()&＇.-符号，且不能包含空格。请检查后重新输入或修改！");
		if(focusFlag != '1'){
			fieldID.focus();
		}
		return false;
	}
} 
//检查组织机构代码 正确的组织机构代码：12345678-9
function checkOrganizeCode(OrganizeCode){
	if(OrganizeCode == 'L999999999'){
		return true;
	}
	var ereg = /(\d|[a-z]|[A-Z]){8}-(\d|[a-z]|[A-Z])/;
	if(trim(OrganizeCode) == ''){
		alert('组织机构代码不能为空');
		return false;
	}
	if(trim(OrganizeCode).length != 10){
		alert('组织机构代码长度应为10位');
		return false;
	}
	if(ereg.test(OrganizeCode)){
		return true;
	}else{
		alert("组织机构代码不正确(正确的格式为1-8位是字母或者数字,9位是'-',10位是字母或者数字),请检查后重新输入或修改");
		return false;
	}
	
}  
 	/**
 @author      zhanglong
 @description 检查身份证长度，并根据身份证确定年龄
 @param       无
 @return      通过返回true,否则返回false
 */
function changeAge(field)
{

  if(trim(field.value).length!=0)
  {
    var inputYear;
    var inputMonth;
    var currentDate = new Date().format('yyyy-MM-dd');  
    var currentYear = currentDate.substring(0,4);
    var currentMonth= currentDate.substring(5);
        currentMonth= currentMonth.substring(0,currentMonth.indexOf("-"));

    currentYear = parseInt(currentYear);
    currentMonth= parseInt(currentMonth);
    if(trim(field.value).length==15)
    {
      inputYear   = "19" + field.value.substring(6,8);
      intputMonth = field.value.substring(8,10);
      inputYear   = parseInt(inputYear);
      intputMonth = parseInt(intputMonth);
    }
    if(trim(field.value).length==18)
    {
      inputYear   = field.value.substring(6,10);
      intputMonth = field.value.substring(10,12);
      inputYear   = parseInt(inputYear);
      intputMonth = parseInt(intputMonth);
    }
    var age = currentYear - inputYear;
    if (currentMonth<intputMonth)
    {
      age = age -1;
    }

    var intIndex = parseInt(getElementOrder(field)) - 1;
    fm.InsuredAge.value = age;
  }
}
//根据身份证号改变性别
function changeSex(field){
	var sexShow,sex,sexCname; 
	sexShow = field.value;
	if(sexShow.length == '15'){
		sex = sexShow.slice(14,15)%2?'1':'2';
		sexCname = sexShow.slice(14,15)%2?'男':'女';
	}else if(sexShow.length == '18'){
		sex = sexShow.slice(16,17)%2?'1':'2';
		sexCname = sexShow.slice(16,17)%2?'男':'女';
	}else{
		return false;
	}
	fm.InsuredSex.value = sex;
	fm.InsuredSexCname.value = sexCname;
}
//根据身份证联动年龄和性别
function changeSexAgeForCardID(field){
	changeSex(field);
	changeAge(field);
	
}     
//zhanglong 20100126 task-1138 end
//jqx-685 task-zhanglong 2010-03-29
function replaced(strings,delimiterChar){
	var str=strings;
	
	if(strings == null || strings == ""){
	    return;	
	}
	
	if(delimiterChar == null || delimiterChar == ""){
	    delimiterChar = ",";	
	}
	
	do{
		strings= '' + str;
		
		str=strings.replace(delimiterChar,"");
		
	}while(strings!=str);	
	return str;	
}
function setReadonlyOfRow(strPageCode,index)
{
  var elements = null;
  var i = 0;
  elements = document.all(strPageCode).tBodies.item(0).getElementsByTagName("input");
  for(i=0;i<elements.length;i++)
  {
    setReadonlyOfElement(fm.all(elements[i].name)[index]);
    if(fm.all(elements[i].name)[index].type!="button")
      fm.all(elements[i].name)[index].className = "readonly3";
    else if(fm.all(elements[i].name)[index].alt!="确定"&&
            fm.all(elements[i].name)[index].alt!="...")
      fm.all(elements[i].name)[index].disabled = true;
  }
  elements = document.all(strPageCode).tBodies.item(0).getElementsByTagName("select");
  for(i=0;i<elements.length;i++)
  {
    setReadonlyOfElement(fm.all(elements[i].name)[index]);
    fm.all(elements[i].name)[index].className = "readonly3";
  }
  elements = document.all(strPageCode).tBodies.item(0).getElementsByTagName("textarea");
  for(i=0;i<elements.length;i++)
  {
    setReadonlyOfElement(fm.all(elements[i].name)[index]);
    fm.all(elements[i].name)[index].className = "readonly3";
  }
}

/**
* 肖广杰 2011-04-11 Js计算精度 TASK-8440
*
*/
function floatMul(arg1, arg2) {
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();   
    try {   
        m += s1.split(".")[1].length   
    } catch (e) {   
    }   
    try {   
        m += s2.split(".")[1].length   
    } catch (e) {   
    }   
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);   
}
/**
*验证电子邮箱的格式
*add by niushanshan task-10429 
*返回值：
*如果为空，定义校验通过          
*如果电子邮箱格式正确，验证通过  
*如果电子邮箱格式错误，不通过    参考提示信息：电子邮箱格式不正确，请重新输入
*/
function checkEmailCommon(field)
{
  if(!field.value==""){
	  if(field.value.match(/[\w-]+@{1}[\w-]+\.{1}\w{2,4}(\.{0,1}\w{2}){0,1}/ig)!=field.value)
	  {
	  	alert("电子邮箱格式不正确，请重新输入");
	    field.value = "";
	    field.focus();
	    return false;
	  }else{
		return true;
	  }
  }
}
/**
*校验字符串是否为整型
*add by niushanshan task-10429 
*返回值：
*如果为空，定义校验通过，      返回true
*如果字串全部为数字，校验通过，返回true
*如果校验不通过，              返回false     参考提示信息：输入域必须为数字！
*/
function checkIsIntegerCommon(field)
{
	var str = field.value;
	if(str!="")
	{ 
	    if(/^(\-?)(\d+)$/.test(str))
	    {
	    	return true;
	    }
	    else
	    {
	    	alert("请输入合理的数字");
	      field.value = "";
	      field.focus(); 
	      field.select();
	      return false;
	    }
	}
}

//根据单号查询绩效工资
// no   单号（投保单、保单、批单）。
//type 单号类型。
function SalaryProposalNo (no, type) {
	var strProposalNo = fm[no].value;
	if(strProposalNo == null) {
		window.alert("没有提供有效的单号！");
		return;
	}
	var strURL = "/prpall/commonship/pub/UISalesSalaryProposalNo.jsp?ProposalNo=" + strProposalNo + "&BizType=" + type;
	var newWindow = window.open(strURL,"SalesSalary",'width=640,height=300,top=0,left=0,toolbar=0,location=0,directories=0,menubar=0,scrollbars=1,resizable=1,status=0');
	newWindow.focus();
}
/**
 * 按钮等待一段时间恢复功能
 */

var buttons=new Array();
function waitSecond(tag, second,i){

	if (tag != null) {
		tag.disabled = true;
		secondNumber = second;
		var v_btn=new btn();
		v_btn.tag=tag;
		v_btn.secondNumber=secondNumber;
		buttons.push(v_btn);
	}
	if (secondNumber == 0 || isNaN(secondNumber)) {
		
		if(!isNaN(i))
		{
			buttons[i-1].tag.disabled = false;
		}
		return;
	}
	secondNumber--;
	if(isNaN(i))
	{
		i=buttons.length;
	}
	buttons[i-1].secondNumber=secondNumber;
	window.setTimeout("doNoneWait("+i+")", 1000);
}

/* 什么也不做，占位用。 */
function doNoneWait(i){
	waitSecond(null, 1000,i);
}

btn=function()
{
	this.tag;
	this.secondNumber;
}
//处理浮点数相加出现的精度问题 jqx-3065
function Sum_TwoFloatNumber(val1,val2) {   
    var TotalNum;   
    val1 = val1 + '' ;   
    var sp_val1 = val1.split(".") ;   
    val2 = val2 + '' ;   
    var sp_val2 = val2.split(".") ;   
    if ((sp_val1.length==2) && (sp_val2.length==2)) {   
        //两个浮点数相加  
        TotalNum = TotalNum + 0 ;   
        TotalNum = parseFloat(sp_val1[0]) + parseFloat(sp_val2[0]) ;   
        var length1 = sp_val1[1].length;   
        var length2 = sp_val2[1].length;   
        var length;   
        if(length1>=length2){   
            length = length1;   
            sp_val2[1] = sp_val2[1]*Math.pow(10,length1 - length2);   
        }else if(length1<length2 ){   
            length = length2;   
            sp_val1[1] = sp_val1[1]*Math.pow(10,length2 - length1);   
        }   
        var temp_second_part = Number(sp_val1[1]) + Number(sp_val2[1]);   
        temp_second_part = temp_second_part/Math.pow(10,length);   
        TotalNum = TotalNum + temp_second_part;   
    }   
    else {   
        TotalNum = parseFloat(val1) + parseFloat(val2) ;   
    }   
    return TotalNum;   
}

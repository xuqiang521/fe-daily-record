/**
 * Aquery Library v1.0.0
 *
 * @author [xuqiang]
 *
 * Date 2016-9-21
 */
~(function(window){
/**
 * [A 框架单体对象A]
 * @param {[type]} selector [选择器或页面加载回调函数]
 * @param {[type]} context  [查找元素上下文]
 */
var A = function(selector,context){
  // 如果selector为方法则为窗口添加页面加载完成事件监听
  if(typeof selector == 'function'){
    A(window).on('load',selector);
  }else{
    // 创建A对象
    return new A.fn.init(selector,context);
  }
}
// 原型方法
A.fn = A.prototype = {
  // 强化构造函数
  constructor : A,
  // 构造函数
  init : function(selector,context){
    if(typeof selector === 'object'){
      this[0] = selector;
      this.length = 1;
      return this;
    };
    this.length = 0;
    context = document.getElementById(context) || document;
    // id
    if(~selector.indexOf('#')){
      this[0] = document.getElementById(selector.slice(1));
      this.length = 1;
    }
    // class
    else if(~selector.indexOf('.')){
      var doms = []
        , className = selector.slice(1);
      if(context.getElementsByClassName){
        doms = context.getElementsByClassName(className);
      }else{
        doms = context.getElementsByTagName('*');
      }
      for(var i=0,len = doms.length;i<len;i++){
        if(doms[i].className && !!~doms[i].className.indexOf(className)){
          this[this.length] = doms[i];
          this.length++;
        }
      }
    }
    // tag
    else{
      var doms = context.getElementsByTagName(selector)
        , i = 0
        , len = doms.length;
      for(;i<len;i++){
        this[i] = doms[i];
      }
      this.length = len;
    }
    this.context = context;
    this.selector = selector;
    return this;
  },
  // 元素长度
  length : 0,
  // 增强数组
  push : [].push,
  splice : [].splice
}
// 设置构造函数原型
A.fn.init.prototype = A.fn;
/**
 * [extend 对象拓展]
 * @param[0]  目标对象
 * @param[1,...]  拓展对象
 */
A.extend = A.fn.extend = function(){
  var i = 1
    , len = arguments.length
    , target = arguments[0]
    , j;
  if(i == len){
    target = this;
    i--;
  }
  for(;i<len;i++){
    for(j in arguments[i]){
      target[j] = arguments[i][j];
    }
  }
  return target;
}
// 单体对象A方法拓展
A.extend({
  /**
   * [camelCase 将横线式命名字符串转换为驼峰式]
   * @param  {[type]} str [description]
   * @return {[type]}     ['test-demo'->'testDemo']
   */
  camelCase : function(str){
    return str.replace(/\-(\w)/g,function(match,letter){
      return letter.toUpperCase();
    });
  },
  /**
   * [trim 去除字符串两端字符串]
   * @param  {[type]} str [description]
   * @return {[type]}     [' test '->'test']
   */
  trim : function(str){
    return str.replace(/^\s+|\s+$/g,'');
  },
  create : function(type,value){
    var dom = document.createElement(type);
    return A(dom).attr(value);
  }
});

})(window);
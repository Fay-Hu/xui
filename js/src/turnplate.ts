/**
 * Created by Fay on 2016/9/11.
 */
// jQuery.support.transition
// to verify that CSS3 transition is supported (or any of its browser-specific implementations)
$.support.transition = (function(){
    var thisBody = document.body || document.documentElement,
        thisStyle = thisBody.style,
        support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;

    return support;
})();

const Turnplate = (($)=> {

    const DATA_KEY = 'x.turnplate';
    const EVENT_KEY = `.${DATA_KEY}`;
    const SELECTOR ={
        plate:'.turnplate-plate',
        pointer:'.turnplate-pointer'
    };
    const CLASS = {
        disabled : 'disabled'
    };

    class Turnplate {
         element: $;
         $plate:$;
         $pointer:$;
         angle;
         options : any;
         isAnimating :boolean;

        public static defaults = {
            disabled:false,
            rotateNum:5,      //转盘转动圈数
            direction: 0,    //0为顺时针转动,1为逆时针转动
            duration:5000,
            timing:'ease-out',  //IE10以上有效（支持transition属性浏览器下设置有效）
            handleStart:$.noop,
            handleStop:$.noop,
            handleDisable:$.noop
        };

        constructor(element: $,options:any ) {
            this.element = element;
            this.$plate = this.element.find(SELECTOR.plate);
            this.$pointer = this.element.find(SELECTOR.pointer);
            this.options = $.extend({}, Turnplate.defaults, options);
            this.angle = 0;
            this.isAnimating = false;
            this.init();
        }

        private init(){
            this.element.toggleClass(CLASS.disabled,this.options.disabled)
            this.$pointer.on('click',$.proxy(this.bindClick,this));
        }
        private getAngle(){
            return this.options.rotateNum *360 + Math.ceil(Math.random()*360);
        }

        private bindClick(){
            var opts = this.options;
            opts.disabled ? opts.handleDisable():this.run();
        }

        run(){
            let deg = this.angle + this.getAngle(),
                opts = this.options,
                self = this;

            if(self.isAnimating){
                return ;
            }

            this.isAnimating = true;

            if($.support.transition){
                this.$plate.css({
                    '-webkit-transition':`transform ${opts.timing}  ${opts.duration/1000}s`,
                    'transition': `transform ${opts.timing} ${opts.duration/1000}s`,
                    '-webkit-transform':`rotate(${deg}deg)`,
                    'transform': `rotate(${deg}deg)`
                }).one('transitionend webkitAnimationEnd oTransitionEnd otransitionend',function () {
                    self.isAnimating = false;
                    return opts.handleStop.call(self,deg%360);
                });
            }else{
                this.$plate.animate({
                    deg: deg
                }, {
                    step: function(n, fx) {
                        $(this).css({'-webkit-transform':`rotate(${deg}deg)`,'transform':`rotate(${n}deg)`});
                    },
                    duration:2000
                },function () {
                    self.isAnimating = false;
                    return opts.handleStop.call(self,deg%360);
                });
            }
            this.angle = deg;
        }

        setDisabled(disabled:boolean){
            this.options.disable = disabled;
            this.element.toggleClass(CLASS.disabled,disabled);
        }

        dispose(){
            this.element.off(EVENT_KEY);
            $.removeData(this.element,DATA_KEY);
        }

        static _jqInterface(options) {
            this.each(function () {
                let $this = $(this),
                    data = $this.data(DATA_KEY);

                if(!data){
                    $this.data(DATA_KEY,data = new Turnplate($this,options));
                }
            });

            return !this.length ? this: $(this).first().data(DATA_KEY);
        }
    }
    $.fn.turnplate = Turnplate._jqInterface;

    return Turnplate;
})(jQuery);
//export default Turnplate;

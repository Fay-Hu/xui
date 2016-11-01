/**
 * Created by hufei on 16/11/1.
 */
/**
 * Created by Fay on 2016/10/19.
 */
const Resizable = (($)=> {

    const DATA_KEY = 'x.resizable';
    const EVENT_KEY = `.${DATA_KEY}`;

    class Resizable {

        public static defaults = {
            directions:['right','bottom','right-bottom'],
            reducible:false
        };

        options:{};
        element:$;
        oR:{};
        oB:{};
        oBR:{};

        constructor(element: $,options:{}) {
            element.css('position') === 'static' && element.css('position','relative');
            this.element = element;
            this.options = $.extend({}, Resizable.defaults, options);
            this.init();
        }

        private init(){

            let opts = this.options;

            if(~$.inArray("right", opts.directions)){
                this.oR = $('<div class="resizable-right"></div>');
                this.oR.appendTo(this.element);
            }

            if(~$.inArray("bottom", opts.directions)){
                this.oB = $('<div class="resizable-bottom"></div>');
                this.oB.appendTo(this.element);
            }

            if(~$.inArray("right-bottom", opts.directions)){
                this.oBR = $('<div class="resizable-right-bottom"></div>');
                this.oBR.appendTo(this.element);
            }

            this.bind();

        }
        private bind () {
            this.oR instanceof $ && this.oR.on('mousedown',this.handle.bind(this));
            this.oB instanceof $ && this.oB.on('mousedown',this.handle.bind(this));
            this.oBR instanceof $ && this.oBR.on('mousedown',this.handle.bind(this));
        }

        private handle (e) {
            let x0 = e.clientX,
                y0 = e.clientY,
                w = this.element.width(),
                h = this.element.height();

            let _this = this,
                $target = $(e.target),
                opts =this.options;

            document.onmousemove = function(e) {
                let event = e || event,
                    diffX = event.clientX - x0,
                    diffY = event.clientY - y0;

                if($target.is(_this.oR)){
                    _this.element.width(w+(opts.reducible?diffX:diffX>0?diffX:0));
                }

                if($target.is(_this.oB)){
                    _this.element.height(h+(opts.reducible?diffY:diffY>0?diffY:0));
                }

                if($target.is(_this.oBR)){
                    _this.element.width(w+(opts.reducible?diffX:diffX>0?diffX:0));
                    _this.element.height(h+(opts.reducible?diffY:diffY>0?diffY:0));
                }

                event.preventDefault && event.preventDefault();
                return false;
            }
            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
            }
        }

        //释放对象
        dispose(){
            this.element.off(EVENT_KEY).attr('style','');
            this.oR.remove();
            this.oB.remove();
            this.oBR.remove();
            $.removeData(this.element,DATA_KEY);
        }

        static _jqInterface(options) {
            this.each(function () {
                let $this = $(this),
                    data = $this.data(DATA_KEY);

                if(!data){
                    $this.data(DATA_KEY,data = new Resizable($this,options));
                }
            });

            return !this.length ? this: $(this).first().data(DATA_KEY);
        }
    }
    $.fn.resizable = Resizable._jqInterface;

    return Resizable;
})(jQuery);
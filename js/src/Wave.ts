/**
 * Created by Fay on 2016/10/19.
 */
const Wave = (($)=> {
    
    const DATA_KEY = 'x.wave';
    const EVENT_KEY = `.${DATA_KEY}`;

    //缓动函数
    const easeInOut = function(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t-2) - 1) + b;
    };

    class Wave {
        element: $;
        width:number;
        height:number;
        devicePixelRatio:number;
        $stage:$;
        options:{};
        context:{};

        public static defaults = {
            color:'green',//波浪颜色
            lineWidth:1,
            duration:500 //动画速度
        };
        
        constructor(element: $,options:{}) {
            this.element = element;
            this.$stage = $(document.createElement('canvas'));
            this.options = $.extend({}, Wave.defaults, options);

            this.devicePixelRatio = devicePixelRatio || 1; //dpr值

            this.context = this.$stage[0].getContext('2d');

            this.init();
            this.$stage.appendTo(this.element);
            this.run();

        }
        
        private init(){
            this.width = this.devicePixelRatio * this.element.width();
            this.height =this.devicePixelRatio * this.element.height();

            this.$stage.prop({
                width : this.width,
                height : this.height
            });

            this.$stage.css({
                width : this.width/devicePixelRatio,
                height : this.element.height/devicePixelRatio
            });

        }

        private draw(){
            this.clear();

            let start = 0,
                during = this.options.duration;
            let _run = function() {
                start++;
                this.drawWave({
                    start:{
                        x:0,
                        y:this.height
                    },
                    ctrl:[{
                        x:easeInOut(start,0, 200,during),
                        y:easeInOut(start,10, 200,during)
                    }, {
                        x: easeInOut(start,300,1000,during),
                        y: easeInOut(start,500,100,during)
                    }],
                    end:{
                        x:this.width,
                        y:this.height
                    }
                });

                if (start < during) requestAnimationFrame(_run);
            }.bind(this);
            _run();
        }

        /**
         * 绘制贝塞尔闭合曲线
         */
        private drawWave(ctrls:{}){
            let ctx = this.context;
            let {start,ctrl,end} = ctrls;

            ctx.beginPath();
            ctx.strokeStyle = this.options.color;
            ctx.lineWidth = this.options.lineWidth;
            ctx.fillStyle = this.options.color;

            ctx.lineTo(start.x,start.y);
            ctx.bezierCurveTo(ctrl[0].x,ctrl[0].y,ctrl[1].x,ctrl[1].y,end.x,end.y);
            ctx.lineTo(this.width,0);
            ctx.lineTo(0,0);

            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        /**
         * 清除画线
         */
        private clear (){
            this.context.globalCompositeOperation = 'destination-out';
            this.context.fillRect(0, 0, this.width, this.height);
            this.context.globalCompositeOperation = 'source-over';
        }

        /**
         * 执行动画
         */

        run(){
           this.draw();
        }

        //释放对象
        dispose(){
            this.element.off(EVENT_KEY);
            $.removeData(this.element,DATA_KEY);
        }
        
        static _jqInterface(options) {
            this.each(function () {
                let $this = $(this),
                    data = $this.data(DATA_KEY);
                
                if(!data){
                    $this.data(DATA_KEY,data = new Wave($this,options));
                }
            });
            
            return !this.length ? this: $(this).first().data(DATA_KEY);
        }
    }
    $.fn.wave = Wave._jqInterface;
    
    return Wave;
})(jQuery);
/**
 * Created by Fay on 2016/9/11.
 */
// jQuery.support.transition
// to verify that CSS3 transition is supported (or any of its browser-specific implementations)
$.support.transition = (function () {
    var thisBody = document.body || document.documentElement, thisStyle = thisBody.style, support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
    return support;
})();
var Turnplate = (function ($) {
    var DATA_KEY = 'x.turnplate';
    var EVENT_KEY = "." + DATA_KEY;
    var SELECTOR = {
        plate: '.turnplate-plate',
        pointer: '.turnplate-pointer'
    };
    var CLASS = {
        disabled: 'disabled'
    };
    var Turnplate = (function () {
        function Turnplate(element, options) {
            this.element = element;
            this.$plate = this.element.find(SELECTOR.plate);
            this.$pointer = this.element.find(SELECTOR.pointer);
            this.options = $.extend({}, Turnplate.defaults, options);
            this.angle = 0;
            this.isAnimating = false;
            this.init();
        }
        Turnplate.prototype.init = function () {
            this.element.toggleClass(CLASS.disabled, this.options.disabled);
            this.$pointer.on('click', $.proxy(this.bindClick, this));
        };
        Turnplate.prototype.getAngle = function () {
            return this.options.rotateNum * 360 + Math.ceil(Math.random() * 360);
        };
        Turnplate.prototype.bindClick = function () {
            var opts = this.options;
            opts.disabled ? opts.handleDisable() : this.run();
        };
        Turnplate.prototype.run = function () {
            var deg = this.angle + this.getAngle(), opts = this.options, self = this;
            if (self.isAnimating) {
                return;
            }
            this.isAnimating = true;
            if ($.support.transition) {
                this.$plate.css({
                    '-webkit-transition': "transform " + opts.timing + "  " + opts.duration / 1000 + "s",
                    'transition': "transform " + opts.timing + " " + opts.duration / 1000 + "s",
                    '-webkit-transform': "rotate(" + deg + "deg)",
                    'transform': "rotate(" + deg + "deg)"
                }).one('transitionend webkitAnimationEnd oTransitionEnd otransitionend', function () {
                    self.isAnimating = false;
                    return opts.handleStop.call(self, deg % 360);
                });
            }
            else {
                this.$plate.animate({
                    deg: deg
                }, {
                    step: function (n, fx) {
                        $(this).css({ '-webkit-transform': "rotate(" + deg + "deg)", 'transform': "rotate(" + n + "deg)" });
                    },
                    duration: 2000
                }, function () {
                    self.isAnimating = false;
                    return opts.handleStop.call(self, deg % 360);
                });
            }
            this.angle = deg;
        };
        Turnplate.prototype.setDisabled = function (disabled) {
            this.options.disable = disabled;
            this.element.toggleClass(CLASS.disabled, disabled);
        };
        Turnplate.prototype.dispose = function () {
            this.element.off(EVENT_KEY);
            $.removeData(this.element, DATA_KEY);
        };
        Turnplate._jqInterface = function (options) {
            this.each(function () {
                var $this = $(this), data = $this.data(DATA_KEY);
                if (!data) {
                    $this.data(DATA_KEY, data = new Turnplate($this, options));
                }
            });
            return !this.length ? this : $(this).first().data(DATA_KEY);
        };
        Turnplate.defaults = {
            disabled: false,
            rotateNum: 5,
            direction: 0,
            duration: 5000,
            timing: 'ease-out',
            handleStart: $.noop,
            handleStop: $.noop,
            handleDisable: $.noop
        };
        return Turnplate;
    }());
    $.fn.turnplate = Turnplate._jqInterface;
    return Turnplate;
})(jQuery);
//export default Turnplate;
//# sourceMappingURL=turnplate.js.map
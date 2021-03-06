/**
 * Created by Fay on 2016/12/3.
 */
const Grid = (($) => {

    const DATA_KEY = 'x.grid';
    const EVENT_KEY = `.${DATA_KEY}`;

    const NS_svg = "http://www.w3.org/2000/svg";

    const CLASSES = {
            stage: 'stage',
            item: 'item',
            dot: 'dot'
        },
        ATTRS = {
            position: 'data-pos'
        },
        SELECTORS = {
            position:'[data-pos="${pos}"]'
        };
    class Grid {

        public static defaults = {
            dotSize: 4,
            dotPath: 'M 4,0 V 8 M 0,4 H 8 Z',
            itemWid: 80,
            itemHigh: 80
        };

        options: {};
        element: $;
        $stage: $;
        xLength: number;
        yLength: number;

        constructor(element: $, options: {}) {
            this.element = element;
            this.options = $.extend({}, Grid.defaults, options);
            this.$stage = $(document.createElementNS(NS_svg, 'svg')).attr({
                'class': CLASSES.stage
            });
            this._init();
        }

        private _init() {
            var opts = this.options,
                bBox = this.$stage[0].getBBox();

            this.xLength = Math.ceil(this.element.width() / opts.itemWid);
            this.yLength = Math.ceil(this.element.height() / opts.itemHigh);

            for (let i = 0; i < this.xLength; i++) {
                for (let j = 0; j < this.yLength; j++) {
                    this._createItem(opts.itemWid * i, opts.itemHigh * j,).attr(ATTRS.position, i + ',' + j).appendTo(this.$stage);
                }
            }
            this.element.append(this.$stage);

            var self = this;
            this.$stage.on('mousemove',function (e) {
                var offset = $(this).offset();
                console.log(self._getClosestItem(e.pageX - offset.left,e.pageY - offset.top));
            })
        }

        private _addRow() {
            var opts = this.options;
            this.xLength++;
            for (let i = 0; i < this.yLength;) {
                this._createItem(opts.itemWid * this.xLength, opts.itemHigh * i++).attr(ATTRS.position, this.xLength + ',' + i).appendTo(this.$stage);
            }
        }

        private _addCol() {
            var opts = this.options;
            this.yLength++;
            for (let i = 0; i < this.xLength;) {
                this._createItem(opts.itemWid * i++, opts.itemHigh * this.yLength).attr(ATTRS.position, i + ',' + this.yLength).appendTo(this.$stage);
            }
        }

        private _createItem(x, y) {
            var opts = this.options;

            return $(document.createElementNS(NS_svg, 'g')).attr({
                transform: `translate(${x},${y})`,
                class: CLASSES.item
            })
                .append($(document.createElementNS(NS_svg, 'path')).attr({
                    d: opts.dotPath, class: CLASSES.dot,
                    transform: `translate(${opts.itemWid / 2 - opts.dotSize},${opts.itemHigh / 2 - opts.dotSize})`
                }));
        }

        private _getClosestItem(cx, cy) {
            var opts = this.options,
                posX = Math.floor(cx/opts.itemWid),
                posY = Math.floor(cy/opts.itemHigh);

            return this.$stage.find(SELECTORS.position.replace(/\$\{pos\}/,posX + ',' + posY));
        }

        //释放对象
        dispose() {
            this.element.off(EVENT_KEY).attr('style', '');
            $.removeData(this.element, DATA_KEY);
        }

        static _jqInterface(options) {
            this.each(function () {
                let $this = $(this),
                    data = $this.data(DATA_KEY);

                if (!data) {
                    $this.data(DATA_KEY, data = new Grid($this, options));
                }
            });

            return !this.length ? this : $(this).first().data(DATA_KEY);
        }
    }
    $.fn.grid = Grid._jqInterface;

    return Grid;
})(jQuery);
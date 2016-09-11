/**
 * Created by Fay on 2016/9/11.
 */

const Menu = (($)=> {

    const DATA_KEY = 'x.menu';
    const EVENT_KEY = `.${DATA_KEY}`;

    class Menu {
         _element: $;
         options : any;

        public static defaults = {};

        constructor(element: $,options:any ) {
            this._element = element;
            this.options = $.extend({}, Menu.defaults, options);
        }


        dispose(){
            this._element.off(EVENT_KEY);
            $.removeData(this._element,DATA_KEY);
        }

        static _jqInterface(options) {
            this.each(function () {
                let $this = $(this),
                    data = $this.data(DATA_KEY);

                if(!data){
                    $this.data(DATA_KEY,data = new Menu($this,options));
                }
            });

            return !this.length ? this: $(this).first().data(DATA_KEY);
        }
    }

    $.fn.menu = Menu._jqInterface;

    return Menu;
})(jQuery);
export default Menu;

/**
 * Created by Fay on 2016/9/10
 */

const Util = (()=> {
    let util = {
        getUID(prefix:string) {
            do {
                prefix += ~~(Math.random() * 1000000)
            } while (document.getElementById(prefix));
            return prefix;
        },

        toType(obj) {
            return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
        },

        isElement(obj) {
            return (obj[0] || obj).nodeType;
        },
        autoPrefix(obj){

            var prefixes = ['-webkit-', '-moz-', '-o-', '-ms-'];

            $.each(obj, function (key, val) {
                if(key == 'transform' || key == 'transition'){
                    $.each(prefixes, function (i, v) {
                        obj[v + key] = val;
                    });
                }
            });

            return obj;
        }
    };
    return util; 
})();
export default Util;
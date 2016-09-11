/**
 * Created by Fay on 2016/9/10
 */

const Util = (()=> {
    let util = {
        getUID(prefix) {
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
        }
    };
    return util; 
})();
export default Util;
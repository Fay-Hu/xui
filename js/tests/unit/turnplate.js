/**
 * Created by Fay on 2016/9/10.
 */
QUnit.test( "hello test", function( assert ) {
    $('.turnplate').turnplate({
        items:7,
        map:[{
            text:'1奖'
        },{
            text:'2奖'
        },{
            text:'3奖'
        },{
            text:'4奖'
        },{
            text:'5奖'
        },{
            text:'6奖'
        },{
            text:'7奖'
        }],
        handleStop:function (deg) {
            alert(this.options.map[Math.ceil(deg/(360/(this.options.items -1)))].text);
        }
    });

    assert.ok( "hello world" == "hello world", true );
});
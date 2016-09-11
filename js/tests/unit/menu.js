/**
 * Created by Fay on 2016/9/10.
 */
QUnit.test( "hello test", function( assert ) {
    console.log($('#qunit').menu().options)
    assert.ok( "hello world" == "hello world", $('#qunit').menu().defaults );
});
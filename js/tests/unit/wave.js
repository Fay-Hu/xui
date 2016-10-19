/**
 * Created by Fay on 2016/10/19.
 */
QUnit.test( "hello test", function( assert ) {
    $('.wave').wave();

    assert.ok( "hello world" == "hello world", true );
});
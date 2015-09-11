var test = require('tap').test;

var asyncReplace = require('../async-replace');

test('async-replace', function(t) {
    t.test('no match local', function(t) {
        asyncReplace('aaa', /(\d)/, function() {}, function(err, newString) {
            t.notOk(err, 'should not error');
            t.equal(newString, 'aaa');
            t.end();
        });
    });

    t.test('no match global', function(t) {
        asyncReplace('aaa', /(\d)/g, function() {}, function(err, newString) {
            t.notOk(err, 'should not error');
            t.equal(newString, 'aaa');
            t.end();
        });
    });


    t.test('simple local', function(t) {
        asyncReplace(' foo ', /(fo)(.)/, function(match, p1, p2, offset, input, callback) {
            t.equal(match, 'foo');
            t.equal(p1, 'fo');
            t.equal(p2, 'o');
            t.equal(offset, 1);
            t.equal(input, ' foo ');
            process.nextTick(function() {
                callback(null, p2 + '-' + p1);
            });
        }, function(err, newString) {
            t.equal(err, null);
            t.equal(newString, ' o-fo ');
            t.end();
        });
    });


    t.test('simple global', function(t) {
        asyncReplace(' foo ', /(fo)(.)/g, function(match, p1, p2, offset, input, callback) {
            t.equal(match, 'foo');
            t.equal(p1, 'fo');
            t.equal(p2, 'o');
            t.equal(offset, 1);
            t.equal(input, ' foo ');
            process.nextTick(function() {
                callback(null, p2 + '-' + p1);
            });
        }, function(err, newString) {
            t.equal(err, null);
            t.equal(newString, ' o-fo ');
            t.end();
        });
    });

    t.test('messy global', function(t) {
        var matches = ['foo', 'foz'];
        var offsets = [1, 5];
        var p2s = ['o', 'z'];
        asyncReplace('1foo2foz3', /(fo)(.)/g, function(match, p1, p2, offset, input, callback) {
            t.equal(match, matches.shift());
            t.equal(p1, 'fo');
            t.equal(p2, p2s.shift());
            t.equal(offset, offsets.shift());
            t.equal(input, '1foo2foz3');
            process.nextTick(function() {
                callback(null, p2.toUpperCase() + p1);
            });
        }, function(err, newString) {
            t.equal(err, null);
            t.equal(newString, '1Ofo2Zfo3');
            t.end();
        });
    });

    t.test('global and ignoreCase', function(t) {
        asyncReplace(' Foo foo ', /(f)oo/gi, function(match, p1, offset, input, callback) {
            process.nextTick(function() {
                callback(null, p1);
            });
        }, function(err, newString) {
            t.equal(err, null);
            t.equal(newString, ' F f ');
            t.end();
        });
    });

    t.test('local and ignoreCase', function(t) {
        asyncReplace(' Foo foo ', /(f)oo/i, function(match, p1, offset, input, callback) {
            process.nextTick(function() {
                callback(null, p1);
            });
        }, function(err, newString) {
            t.equal(err, null);
            t.equal(newString, ' F foo ');
            t.end();
        });
    });
    t.end();
});
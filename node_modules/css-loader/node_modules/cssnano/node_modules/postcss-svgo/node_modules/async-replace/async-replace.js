var async = require('async');

function toLocal(regexp) {
    var flags = '';
    if (regexp.ignoreCase) flags += 'i';
    var copy = new RegExp(regexp.source, flags);
    return copy;
}

function replaceLocal(string, regexp, replacer, callback) {
    var matched = string.match(regexp);
    if (!matched)
        return callback(null, string);

    var args = matched.slice();
    args.push(matched.index);
    args.push(matched.input);
    args.push(function(err, newString) {
        if (err) return callback(err);

        callback(null, string.replace(regexp, newString));
    });

    replacer.apply(null, args);
}

module.exports = function(string, regexp, replacer, callback) {
    if (!regexp.global) return replaceLocal(string, regexp, replacer, callback);

    var matched = string.match(regexp);
    // If there were no matches, the callback may be called and nothing further has to happen. According to node's
    // documentation "it is very important for APIs to be either 100% synchronous or 100% asynchronous". process.nextTick is
    // used to ensure that this function is asynchronous, even if there are no matches.
    // 	(Source: http://nodejs.org/api/process.html#process_process_nexttick_callback)
    if (!matched) {
        process.nextTick(callback.bind(this, null, string));
        return;
    }

    // matched is an array of matched strings
    var result = [];
    var i = 0;
    var index = 0;
    var copy = toLocal(regexp);
    copy.global = false;
    var callbacks = [];
    while(matched.length > 0) {
        var subString = matched.shift();
        var nextIndex = string.indexOf(subString, index);
        result[i] = string.slice(index, nextIndex);
        i++;
        (function(j, index, subString) {
            callbacks.push(function(done) {
                var match = subString.match(copy);
                var args = match.slice();
                args.push(index);
                args.push(string);
                args.push(function(err, newString) {
                    if (err) return done(err);
                    result[j] = newString;
                    done(null);
                });
                replacer.apply(null, args);
            });
        })(i, nextIndex, subString);

        index = nextIndex + subString.length;
        i++;
    }
    result[i] = string.slice(index);
    async.parallel(callbacks, function(err) {
        if (err) return callback(err);
        callback(null, result.join(''));
    });
}

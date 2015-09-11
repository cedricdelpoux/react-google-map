#async-replace[![build status](https://secure.travis-ci.org/kesla/async-replace.png)](http://travis-ci.org/kesla/async-replace)

Run replace on a string and update it asynchronous.

## usage

async-replace have the same api as the callback-version of `String.prototype.replace` but instead of returning the changed data another callback is called, making it possible to do asynchronous stuff in the callback.

This may sound more complicated than it is, so let's look at an example.

```js
function replacer(match, p1, p2, p3, offset, string){
    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
    return [p1, p2, p3].join(' - ');
};
newString = "abc12345#$*%".replace(/([^\d]*)(\d*)([^\w]*)/, replacer);
```

Above is an example of using `String.prototype.replace` with a callback. The above could then be written in async-replace like this

```js
function replacer(match, p1, p2, p3, offset, string, done){
    // p1 is nondigits, p2 digits, and p3 non-alphanumerics
    setTimeout(function() {
        done(null, [p1, p2, p3].join(' - '));
    }, 100);
};
asyncReplace("abc12345#$*%", /([^\d]*)(\d*)([^\w]*)/, replacer, function(err, result) {
    console.log(result); // will print 'abc - 12345 - #$*%';
});
```
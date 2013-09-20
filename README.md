# HANDOB.js

HANDOB.js is an idiomatic handler-observer pattern library for web frontends.

It enables you to set DOM elements as either an observer of an event or a
handler which can trigger an event.


## Installation

If you have [bower](http://bower.io/ "A package manager for the web")
installed, which you should.

    $ bower install HANDOB.js

Or simply download or clone the repository and grab the [HANDOB.js](https://github.com/StupidStudio/HANDOB.js/blob/master/HANDOB.js) file.

## Dependencies

HANDOB.js requires jQuery 1.7 or later.

If you install HANDOB.js via bower it will take care of the dependencies too.

## Usage

This example enables two buttons to write text into a div.

```html
<div data-handob-observer="write-observer"></div>
<button data-handob-handler="write-handler" data-text="Hello">Hello</button>
<button data-handob-handler="write-handler" data-text="You">You</button>
```

```javascript
HANDOB

.AddHandler('write-handler', function(event, elm) {
    var text = $(elm).attr('data-text');
    $(document).trigger('write-now', [text]);
})

.AddObserver('write-now', 'write-observer', function(event, elm, text) {
    $(elm).text(text);
});
```

There also a more feature-rich example in [examples/bucket.html](https://github.com/StupidStudio/HANDOB.js/blob/master/examples/bucket.html).

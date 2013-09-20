# HANDOB.js

HANDOB.js is an idiomatic handler-observer pattern library for web frontends.

It enables you to set DOM elements as either an observer of an event or a
handler which can trigger an event.


## Installation

    $ bower install HANDOB.js

## Usage

```html
<div data-handob-observer="write"></div>
<button data-handob-handler="write" data-text="Hello">Hello</button>
<button data-handob-handler="write" data-text="You">You</button>
```

```javascript
HANDOB

.AddHandler('speak', function(event, elm) {
    var text = $(elm).attr('data-text');
    $(document).trigger('write-now', [text]);
})

.AddObserver('write-now', 'write', function(event, elm, text) {
    $(elm).text(text);
});
```

Check out a full example in *examples/bucket.html*.

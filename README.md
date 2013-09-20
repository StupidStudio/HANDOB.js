# HANDOB.js

HANDOB.js is an idiomatic handler-observer pattern library for web frontends.

It enables you to set DOM elements as either an observer of an event or a
handler which can trigger an event.


## Installation

    $ bower install HANDOB.js

## Usage

This example enables to buttons to write text into a div.

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

Check out a full example in *examples/bucket.html*.

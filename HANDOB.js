;(function(window, jQuery, undefined) {

if (window.HANDOB || !jQuery) return false;

var $ = jQuery;

var HANDOB = {};

var handlers = {},
    observers = {};

var attr_prefix = 'handob-',
    attr_prefix_in_use = attr_prefix,
    handler_attr = 'handler',
    observer_attr = 'observer';

var prop_name;

// PRIVATE METHODS ------------------------------------------------------------

/**
 * Bind a callback to when an event is triggered on a DOM element with
 * a handler attribute
 *
 * @private
 * @param {String} event_name The name of the event to listen to
 **/
HANDOB.bindHandlerEvent = function(event_name) {
    $(document).on(event_name, '[data-'+attr_prefix_in_use+handler_attr+']', function(event) {
        event.stopPropagation();
        HANDOB.handlerEvent(event);
    });
};

/**
 * When a DOM element with a handler attribute is triggered by some event,
 * HANDOB.handlerEvent's job is to figure out which callback function
 * should be executed
 *
 * @private
 * @param {Object} event The event object
 **/
HANDOB.handlerEvent = function(event) {
    var event_name = event.type,
        elm = $(event.currentTarget),
        elm_handlers, handler, fn, i, j;

    elm_handlers = elm.attr('data-'+attr_prefix_in_use+handler_attr).split(' ');

    for (i in elm_handlers) {
        if (!elm_handlers.hasOwnProperty(i)) break;
        handler = elm_handlers[i];
        if (handlers.hasOwnProperty(event_name) &&
            handlers[event_name].hasOwnProperty(handler)) {
            for (j in handlers[event_name][handler]) {
                if (!handlers[event_name][handler].hasOwnProperty(j)) break;
                fn = handlers[event_name][handler][j];
                fn.apply(fn, [event, elm]);
            }
        }
    }
};

/**
 * Bind a callback to when an event is triggered on the document object
 * so the observing DOM element can get notified
 *
 * @private
 * @param {String} event_name Name of the event to be observed
 **/
HANDOB.bindObserverEvent = function(event_name) {
    $(document).on(event_name, function(event) {
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        HANDOB.observerEvent(event, args);
    });
};

/**
 * When an observer event is triggered, HANDOB.observerEvent figures out
 * which observer-callback should be executed and which DOM elements should
 * by notified by this
 *
 * @private
 * @param {Object} event The event object
 * @param {Object} [args=[]] List of arguments the event was triggered with
 **/
HANDOB.observerEvent = function(event, args) {
    var event_name = event.type, item, i;

    if (observers.hasOwnProperty(event_name)) {
        for (i in observers[event_name]) {
            if (!observers[event_name].hasOwnProperty(i)) break;
            item = observers[event_name][i];
            $('[data-'+attr_prefix_in_use+observer_attr+'*="'+item.observer+'"]').each(function() {
                var $elm = $(this),
                    elm_observers = $elm.attr('data-'+attr_prefix_in_use+observer_attr).split(' ');
                if (elm_observers.indexOf(item.observer) !== -1) {
                    var these_args = [].concat(args),
                        elm = $(this)[0];
                    these_args.unshift(elm);
                    these_args.unshift(event);
                    item.fn.apply(item.fn, these_args);
                }
            });
        }
    }
};

// PUBLIC METHODS -------------------------------------------------------------

/**
 * Set up event(s) to listen for on the DOM handlers and execute the
 * callback function with each handler element in context when the event
 * is triggered
 *
 * @public
 * @returns {Object} Returns the HANDOB object
 **/
HANDOB.AddHandler = function() {
    var handler = arguments[0],
        events = [],
        fns = [],
        event, i, j, trigger, fn;

    switch (typeof arguments[1]) {
        case 'string':
            events.push(arguments[1]);
            fns.push(arguments[2]);
            if (arguments[3]) trigger = arguments[3];
            break;
        case 'function':
            events.push('click');
            fns.push(arguments[1]);
            if (arguments[2]) trigger = arguments[2];
            break;
        case 'object':
            for (event in arguments[1]) {
                events.push(event);
                fns.push(arguments[1][event]);
            }
            if (arguments[2]) trigger = arguments[2];
            break;
    }

    if (typeof trigger !== 'undefined') {
        for (i = 0; i < fns.length; i++) {
            fn = fns[i];
            fns[i] = function() {
                fn.apply(fn, arguments);
                $(document).trigger(trigger);
            };
        }
    }

    for (i = 0, j = 0; i < events.length && j < fns.length; i++, j++) {
        if (!handlers.hasOwnProperty(events[i])) {
            handlers[events[i]] = {};
            HANDOB.bindHandlerEvent(events[i]);
        }

        if (!handlers[events[i]].hasOwnProperty(handler))
            handlers[events[i]][handler] = [];

        handlers[events[i]][handler].push(fns[j]);
    }

    return this;
};

/**
 * Set up an observer, taking the event(s) to listen for and the observer
 * element name to notify when the event(s) are triggered, executing the
 * callback function with each observing DOM element in context
 *
 * @public
 * @param {String} event_names Space seperated list of events to observe
 * @param {String} observer The HTML data attribute value to bind to
 * @param {Function} [fn] The callback called for each binded observer
 * @returns {Object} Returns the HANDOB object
 **/
HANDOB.AddObserver = function(event_names, observer, fn) {
    event_names = event_names.split(' ');

    for (var i = 0; i < event_names.length; i++) {
        var event_name = event_names[i];

        if (!observers.hasOwnProperty(event_name)) {
            observers[event_name] = [];
            HANDOB.bindObserverEvent(event_name);
        }

        observers[event_name].push({
            'observer': observer,
            'fn': fn});
    }

    return this;
};

/**
 * Attribute prefix is enabled by default. This just re-enables for the
 * case when you've had it disabled with HANDOB.DisablePrefix
 *
 * @public
 * @returns {Object} Returns the HANDOB object
 **/
HANDOB.EnablePrefix = function() {
    attr_prefix_in_use = attr_prefix;
    return this;
};

/**
 * Disable prefixing of attribute-names so that data-handob-handler and
 * data-handob-observer becomes data-handler and data-observer.
 *
 * @public
 * @returns {Object} Returns the HANDOB object
 **/
HANDOB.DisablePrefix = function() {
    attr_prefix_in_use = '';
    return this;
};

// EXPORT ---------------------------------------------------------------------

// All properties and members of the HANDOB object that begins with a
// capital letter gets exported to window.HANDOB object making it public,
// the rest are left as private

window.HANDOB = {};

for (prop_name in HANDOB) {
    if (prop_name == prop_name[0].toUpperCase() + prop_name.slice(1))
        window.HANDOB[prop_name] = HANDOB[prop_name];
}

})(window, jQuery);

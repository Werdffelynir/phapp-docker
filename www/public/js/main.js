
const Util = {
    query: function (selector, from, callback, thisInstance) {
        let elements = [];
        from = from || document;

        if (Util.isNode(selector))
            return [selector];
        if (Util.typeOf(from, 'string'))
            from = document.querySelector(from);
        if (from)
            elements = [].slice.call(from.querySelectorAll(selector));
        if (callback)
            elements.forEach((element) => {callback.call(thisInstance || {}, element)});

        return elements;
    },
    isNode: function (value) {
        return value && (value.nodeType === Node.TEXT_NODE ||
            value.nodeType === Node.ELEMENT_NODE ||
            value.nodeType === Node.DOCUMENT_FRAGMENT_NODE ||
            value.nodeType === Node.DOCUMENT_NODE)
    },
    typeOf: function (value, type) {
        const simpleTypes = ['null', 'boolean', 'undefined', 'function', 'string', 'number', 'date', 'array', 'object'];
        let t = Util.typeOfStrict(value).toLowerCase();
        if (simpleTypes.indexOf(t) === -1 && typeof value === 'object')
            t = 'object';
        return typeof type === 'string' ? type.toLowerCase() === t : t;
    },
    typeOfStrict: function (value, type) {
        const t = Object.prototype.toString.call(value).slice(8, -1);
        return typeof type === 'string' ? type === t : t;
    },
    domLoaded: function (callback) {
        if (document.querySelector('body'))
            callback.call();
        else
            document.addEventListener('DOMContentLoaded', function () {
                callback.call()
            }, false);
    },
    search: function (selector, attr, from) {
        from = Util.isNode(from) ? from : Util.query(from)[0];
        let i = 0,
            key,
            elements = {},
            queryElements = Util.query(selector, from || document.body);

        if (queryElements) {
            while (i < queryElements.length) {
                if (!attr)
                    elements[i] = queryElements[i];
                else {
                    if (queryElements[i].hasAttribute(attr)) {
                        key = queryElements[i].getAttribute(attr);
                        elements[key] = queryElements[i];
                    }
                }
                i++;
            }
        }
        return elements;
    },
    on: function (selector, eventName, callback, bubble) {
        let i, elements = [];

        switch (Util.typeOf(selector)) {
            case 'string':
                elements = Util.query(selector);
                break;
            case 'object':
                if (Util.isNode(selector))
                    elements = [selector];
                break;
            case 'array':
                elements = selector;
                break;
        }

        for (i = 0; i < elements.length; i++) {
            if (elements[i] && elements[i].addEventListener)
                elements[i].addEventListener(eventName, callback, !!bubble);
        }
    },
    httpRequest: function (config, callback, thisInstance) {
        let key;
        let sendData = {};
        const xhr = new XMLHttpRequest();
        const options = {
            data: config.data || {},
            action: config.action || config.url || document.location.href,
            method: config.method ? config.method.toUpperCase() : 'GET',
            headers: config.headers || {},
            useEncode: config.useEncode === undefined ? true : !!config.useEncode,
            useFormData: config.useFormData === undefined ? false : !!config.useFormData,
            async: config.async === undefined ? true : !!config.async,
            user: config.user || null,
            password: config.user || null,
        };

        const concateString = function (params) {
            let result = '';
            for (key in params) {
                result += '&' + key + '=' + (options.useEncode ? encodeURIComponent(params[key]) : params[key]);
            }
            return result;
        };
        thisInstance = (Util.typeOf(thisInstance, 'object')) ? thisInstance : {};

        if (options.method === 'GET') {
            options.action += options.action.indexOf('?') === -1 ? '?' : '';
            options.action += concateString(options.data);
            sendData = {};
        } else {
            if (options.data instanceof FormData) {
                options.data = {};
                options.useFormData = true;
                sendData = options.data;
            }
            if (options.data instanceof HTMLFormElement) {
                sendData = new FormData(options.data);
                options.useFormData = true;
                options.data = {};
            }
            if (options.useFormData) {
                if (!(sendData instanceof FormData)) sendData = new FormData();
                Object.keys(options.data).forEach((key) => {
                    sendData.append(key, options.useEncode ? encodeURIComponent(options.data[key]) : options.data[key]);
                });
            } else {
                sendData = concateString(options.data);
            }
        }

        xhr.open(options.method, options.action, options.async, options.user, options.password);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        if (options.method !== 'GET' && !options.useFormData) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        Object.keys(options.headers).forEach((key) => {
            xhr.setRequestHeader(key, options.headers[key]);
        });

        xhr.onloadend = function () {
            thisInstance.XMLHttpRequest = xhr;
            if (typeof callback === 'function') {
                callback.call(thisInstance, xhr.status, xhr.responseText, xhr);
            }
        };
        xhr.sendOptions = options;
        xhr.send(sendData);
        return xhr;
    },

    validText: function (text) {
        return text && !text.match(/\s+/);
    },

    validPassword: function (text) {
        return text && Util.validText(text) && !!text.match(/\w{5,14}$/);
    },

    validEmail: function (text) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(text);
    },

};



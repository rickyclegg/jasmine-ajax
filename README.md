# jasmine-ajax

A simple Ajax plugin for [Jasmine](http://pivotal.github.com/jasmine/) originally created ages ago for when there were only Query ones floating about. I have not updated it and put it on GitHub in case anyone wants to use it.

## Getting Started

Download the [jasmine-ajax.js](https://github.com/rickyclegg/jasmine-ajax/blob/master/src/jasmine-ajax.js) and add to your library.

In your test configuration make sure you load it after Jasmine has been loaded because of dependancies.

jasmine-ajax can be used with any type of JavaScript Ajax library including jQuery, Ext and the standard XMLHttpRequest.

### Starting the plugin:

```javascript
jasmine.Ajax.useMock();
```

After you have installed the plugin you will get a new property available for monitoring the server calls.

At present with this simple plugin you can only create one instance of a XMLHttpRequest to test at a time.

### Setting up the server:

server.respondWith(); Takes an object with 3 arguments.

* url
* responseText
* status

url - is used to match against calls for an Ajax request.

responseText - is the data sent back to the Ajax request if the url matches.

status - Is the status code of the request 404, 200, 305.

#### Twitter search example

```javascript
jasmine.Ajax.server.respondWith({
    url: 'http://search.twitter.com/search.json?q=@ricky_clegg',
    responseText: '{"results":[{"created_at":"Sat, 02 Feb 2013 20:19:27 +0000","from_user":"H4zster","from_user_id":79527902,"from_user_id_str":"79527902","from_user_name":"Haz Mack"}]}',
    status: '200'
});
```

When you are ready for the reserver to respond to all requests it has received you must call the respond method.

```javascript
jasmine.Ajax.server.respond();
```

Anyone that called a url on XMLHttpRequest object will now be tested and the response will be sent and can be tested.

## Examples

### jQuery Example:

```javascript
describe('Using the Jasmine plugin for mocking AJAX requests', function () {
    beforeEach(function () {
        jasmine.Ajax.useMock();
    });

    it('Making a GET using jQuery', function () {
        var url = 'http://someurl.com/myPage.asp',
            text = '{"success":true}',
            status = '200',
            jQuery_onComplete = jasmine.createSpy('jQuery_onComplete');

        jasmine.Ajax.server.respondWith({
            url: url,
            responseText: text,
            status: status
        });

        jQuery.ajax({
            url: url,
            success: jQuery_onComplete
        });

        jasmine.Ajax.server.respond();

        expect(jQuery_onComplete).toHaveBeenCalled();
        expect(JSON.stringify(jQuery_onComplete.calls[0].args[0])).toBe(text);
    });
});
```

### Native Example

```javascript
describe('Using the Jasmine plugin for mocking AJAX requests', function () {
    var xmlHttpRequest;

    beforeEach(function () {
        jasmine.Ajax.useMock();

        xmlHttpRequest = new XMLHttpRequest();
    });

    it('Making a successful GET request', function () {
        var url = 'http://someurl.com/my.json',
            text = '{"success":true}',
            status = '200';

        jasmine.Ajax.server.respondWith({
            url: url,
            responseText: text,
            status: status
        });

        xmlHttpRequest.open('GET', url, true);
        xmlHttpRequest.send();

        jasmine.Ajax.server.respond();

        expect(xmlHttpRequest.status).toBe(status);
        expect(xmlHttpRequest.responseText).toBe(text);
    });
});
```

You can easily test for servers failing with the responds with.

```javascript
jasmine.Ajax.server.respondWith({
    url: 'http://www.someurl.com/get_user.asp?userId=1',
    responseText: '<p>Error: No user found</p>',
    status: "404"
});
```

## Contributing
Let me now if you experience any bugs. I have not spent long on this plugin, but there was definitely a whole where people are only testing on Webkit.


## Release History
* 2012/05/2 - v1.0.0 - First version.

## License
Copyright (c) 2013 Ricky Clegg
Licensed under the MIT license.
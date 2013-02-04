describe("Using the Jasmine plugin for mocking AJAX requests", function () {
    "use strict";

    var xmlHttpRequest;

    beforeEach(function () {
        jasmine.Ajax.useMock();

        xmlHttpRequest = new XMLHttpRequest();
    });

    function addSimpleRespondsWith(url, text, status) {
        jasmine.Ajax.server.respondWith({
            url: url,
            responseText: text,
            status: status
        });
    }

    function createSendAndTestSimpleGetRequest(url, text, status) {
        xmlHttpRequest.open('GET', url, true);
        xmlHttpRequest.send();

        jasmine.Ajax.server.respond();

        expect(xmlHttpRequest.status).toBe(status);
        expect(xmlHttpRequest.responseText).toBe(text);
    }

    function createSendAndTestSimplePostRequest(url, text, status, data) {
        xmlHttpRequest.open('POST', url, true);
        xmlHttpRequest.send(data);

        jasmine.Ajax.server.respond();

        expect(xmlHttpRequest.status).toBe(status);
        expect(xmlHttpRequest.responseText).toBe(text);
    }

    it("Making a successful GET request", function () {
        var url = 'http://someurl.com/my.json',
            text = '{"success":true}',
            status = '200';

        addSimpleRespondsWith(url, text, status);

        createSendAndTestSimpleGetRequest(url, text, status);
    });

    it("Making a 404 GET request", function () {
        var url = 'http://someurl.com/missing.json',
            text = '<h1>Page not found</h1>',
            status = '404';

        addSimpleRespondsWith(url, text, status);

        createSendAndTestSimpleGetRequest(url, text, status);
    });

    it("Making a successful GET request with a query string", function () {
        var url = 'http://someurl.com/my.json?userId=1',
            text = '{"id":1,"name":"Ricky"}',
            status = '200';

        addSimpleRespondsWith(url, text, status);

        createSendAndTestSimpleGetRequest(url, text, status);
    });

    it("Making several responds with gets correct result", function () {
        var successUrl = 'http://someurl.com/my.json?userId=1',
            successText = '{"id":1,"name":"Ricky"}',
            successStatus = '200',
            missingUrl = 'http://someurl.com/my.json?userId=2',
            missingText = '<h1>No valid user</h1>',
            missingStatus = '404';

        addSimpleRespondsWith(successUrl, successText, successStatus);
        addSimpleRespondsWith(missingUrl, missingText, missingStatus);

        createSendAndTestSimpleGetRequest(missingUrl, missingText, missingStatus);
        createSendAndTestSimpleGetRequest(successUrl, successText, successStatus);
    });

    it("Making a successful POST request", function () {
        var url = 'http://someurl.com/myPage.asp',
            text = '{"success":true}',
            status = '200',
            json = {
                userId: 2
            };

        addSimpleRespondsWith(url, text, status);

        createSendAndTestSimplePostRequest(url, text, status, JSON.stringify(json));
    });

    it("Making a GET using jQuery", function () {
        var url = 'http://someurl.com/myPage.asp',
            text = '{"success":true}',
            status = '200',
            jQuery_onComplete = jasmine.createSpy('jQuery_onComplete');

        jQuery.ajax({
            url: url,
            success: jQuery_onComplete
        });

        addSimpleRespondsWith(url, text, status);

        jasmine.Ajax.server.respond();

        expect(jQuery_onComplete).toHaveBeenCalled();
        expect(JSON.stringify(jQuery_onComplete.calls[0].args[0])).toBe(text);
    });

});
// ajaxUtil
(function (au, $) {
    au.callAsmxWebService = function (webService, data, callback) {
        $.ajax({
            type: 'POST',
            url: webService,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            dataType: 'json',
            success: callback
        });
    };
} (window.ajaxUtil = window.ajaxUtil || {}, jQuery));
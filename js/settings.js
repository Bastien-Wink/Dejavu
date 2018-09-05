$("button#reset").on("click", function () {
    chrome.storage.local.set({
        'storyIds-facebook': new Array,
        'storyIds-twitter': new Array
    }, function () {
        alert('Done !');
    });
});

$.each(['facebook', 'twitter'], function (key, service) {

    $("button#feed-" + service).on("click", function () {
        window.open('https://www.' + service + '.com', '_blank');
    });

    chrome.storage.local.get(["active-" + service], function (result) {

        if (result["active-" + service] != false)
            $("input#active-" + service).prop('checked', true);

        $("input#active-" + service).on("change", function () {

            result["active-" + service] = $(this).is(':checked');
            chrome.storage.local.set(result);

            chrome.tabs.executeScript({
                code: 'if(window.location.hostname == "www.' + service + '.com" || window.location.hostname == "c' + service + '.com"){ location.reload() };'
            });


        });

    });

})


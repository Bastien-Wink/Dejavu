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
        window.open('https://www.' + this + '.com', '_blank');
    });

    chrome.storage.local.get(["storyIds-" + this], function (result) {

        if (result["storyIds-" + service] != false)
            $("input#active-" + service).prop('checked', true);

        $("input#" + service).on("change", function () {

            chrome.storage.local.set({
                this: $(this).is(':checked')
            });

            chrome.tabs.executeScript({
                code: 'if(window.location.hostname == "www.' + this + '.com"){ location.reload() };'
            });
        });

    });

})


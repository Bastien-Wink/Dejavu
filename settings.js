$("button#reset").on("click", function() {
    chrome.storage.local.set({
        'activityIds': new Array
    }, function() {
        alert('Done !');
    });
});

$("button#feed").on("click", function() {
      window.open('https://www.facebook.com','_blank');
});

chrome.storage.local.get(['hideSeen'], function(result) {
    if (result.hideSeen == true) {
        $("input#hideSeen").prop('checked', true);
    }

    $("input#hideSeen").on("change", function() {

        chrome.storage.local.set({
            'hideSeen': $(this).is(':checked')
        });

        chrome.tabs.executeScript({
            code: 'if(window.location.hostname == "www.facebook.com"){ location.reload() };'
        });
        window.close();
    });

});

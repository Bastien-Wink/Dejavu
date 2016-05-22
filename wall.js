/*

This script be improved by removing ellement once they pass the float-line instead of on-arrive
Otherwise we skip activities with might have not been seen yet (bellow float line)

*/

// scrollLoad();
window.scrollTo(0, document.body.scrollHeight);
window.scrollTo(0, 0);

function manageActivity(element, result) {
    //Not sure why some elements don't have a key, let's skip them
    if (element.attr("data-dedupekey") == undefined)
        return;

    if ($.inArray(element.attr("data-dedupekey"), result.activityIds) > -1) {
        console.log(element.attr("data-dedupekey") + " Already seen, hiding it");

        countHidden = countHidden + 1;
        chrome.runtime.sendMessage({
            type: "setCount",
            count: countHidden
        });

        if (hideSeen == true) {
            element.css("display", "none");
        }
    } else {
        console.log(element.attr("data-dedupekey") + " Not seen, saving it.")

        //Mark the activity as seen
        result.activityIds.unshift(element.attr("data-dedupekey"));

        // console.log(result.activityIds.length + " activities saved : " + result.activityIds);

        //Remove lastest ellement
        if (result.activityIds.length >= 500) {
            result.activityIds.length = 500;
        }

        chrome.storage.local.set({
            'activityIds': result.activityIds
        });
    }
}

var countHidden = 0;
chrome.runtime.sendMessage({
    type: "setCount",
    count: countHidden
});
//Retreive activityIds from localed storage
chrome.storage.local.get(['activityIds','hideSeen'], function(result) {

    hideSeen = result.hideSeen;

    result.activityIds = result.activityIds;
    if (result.activityIds instanceof Array == false)
        result.activityIds = new Array;

    console.log("let's hide these : " + result.activityIds);

    $("._5jmm").each(function() {
        manageActivity($(this), result);
    });

    $('body').arrive('._5jmm', function() {
        manageActivity($(this), result);
    });

});

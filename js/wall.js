function setVisibleAsSeen() {

    chrome.storage.local.get(['activityIds'], function(result) {

        result.activityIds = result.activityIds;
        if (result.activityIds instanceof Array == false)
            result.activityIds = new Array;

        $("._5jmm:not(.seenSet)").filter(":onScreen").each(function() {
            console.log("Set as seen : " + $(this).attr("data-dedupekey"));

            //Mark the activity as seen
            result.activityIds.unshift($(this).attr("data-dedupekey"));

            // console.log(result.activityIds.length + " activities saved : " + result.activityIds);

            $(this).addClass("seenSet");
        });

        //Only keep recent elements to save storage
        if (result.activityIds.length >= 500) {
            result.activityIds.length = 500;
        }

        chrome.storage.local.set({
            'activityIds': result.activityIds
        });
    });

}

function hideIfSeen(element, activityIds, hideSeen) {
    //Not sure why some elements don't have a key, let's skip them
    if (element.attr("data-dedupekey") == undefined)
        return;

    if ($.inArray(element.attr("data-dedupekey"), activityIds) > -1) {
        console.log(element.attr("data-dedupekey") + " Already seen, hiding it");

        countHidden = countHidden + 1;
        chrome.runtime.sendMessage({
            type: "setCount",
            count: countHidden
        });

        if (hideSeen != false) {
            element.css("display", "none");
        }
    } else {
        console.log("Not seen: " + element.attr("data-dedupekey"))
    }
}

var countHidden = 0;
chrome.runtime.sendMessage({
    type: "setCount",
    count: countHidden
});
//Retreive activityIds from localed storage
chrome.storage.local.get(['activityIds', 'hideSeen'], function(result) {

    console.log("hideSeen: " + result.hideSeen)

    result.activityIds = result.activityIds;
    if (result.activityIds instanceof Array == false)
        result.activityIds = new Array;

    console.log("let's hide these : " + result.activityIds);

    $(document).on("scroll", function() {
        setVisibleAsSeen();
    });


    $('._5jmm').each(function() {
        hideIfSeen($(this), result.activityIds, result.hideSeen);
    });

    $('body').arrive('._5jmm', function() {
        hideIfSeen($(this), result.activityIds, result.hideSeen);
    });
});

//Css injection
var node = document.createElement('style');
node.innerHTML = ".seenSet ._5pcp::after {content:' - Seen'} ";
document.body.appendChild(node);

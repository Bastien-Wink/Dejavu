var countHidden = 0;
var lastSetVisibleAsSeenCall = -199;

function setVisibleAsSeen() {
    console.log("setVisibleAsSeen()");

    chrome.storage.local.get(["storyIds-" + serviceName], function (result) {

        result["storyIds-" + serviceName] = result["storyIds-" + serviceName];
        if (result["storyIds-" + serviceName] instanceof Array == false)
            result["storyIds-" + serviceName] = new Array;

        $(storyLocation + ":not(.seenSet)").filter(":onScreen").each(function () {
            console.log("Set as seen : " + $(this).attr(storyKeyName));

            //Mark the story as seen
            result["storyIds-" + serviceName].unshift($(this).attr(storyKeyName));

            $(this).addClass("seenSet");
        });

        //Only keep the latest 500 stories to save storage
        if (result["storyIds-" + serviceName].length >= 500) {
            result["storyIds-" + serviceName].length = 500;
        }

        chrome.storage.local.set(result);
    });

}

function hideIfSeen(story, storyIds, hide) {
    //Not sure why some stories don't have a key, let's skip them
    if (story.attr(storyKeyName) == undefined)
        return;

    if ($.inArray(story.attr(storyKeyName), storyIds) > -1) {
        console.log("hideIfSeen() - Seen: " + story.attr(storyKeyName))
        countHidden = countHidden + 1;
        chrome.runtime.sendMessage({
            type: "setCount",
            count: countHidden
        });

        $(this).addClass("seenSet");

        if (hide != false) {
            story.css("display", "none");
        }
    } else {
        console.log("hideIfSeen() - Not seen: " + story.attr(storyKeyName))
    }
}


function init() {
    chrome.runtime.sendMessage({
        type: "setCount",
        count: countHidden
    });

    //Retrieve history and conf from local storage
    chrome.storage.local.get(["storyIds-" + serviceName, serviceName], function (result) {

        console.log(serviceName + " conf: " + result["storyIds-" + serviceName])

        result["storyIds-" + serviceName] = result["storyIds-" + serviceName];
        if (result["storyIds-" + serviceName] instanceof Array == false)
            result["storyIds-" + serviceName] = new Array;

        console.log("let's hide these stories : " + result["storyIds-" + serviceName]);

        //Hide loaded stories
        $(storyLocation).each(function () {
            hideIfSeen($(this), result["storyIds-" + serviceName], result[serviceName]);
        });

        //Hide arriving stories
        $('body').arrive(storyLocation, function () {
            hideIfSeen($(this), result["storyIds-" + serviceName], result[serviceName]);
        });
    });

    $(document).on("scroll", function () {
        //Call setVisibleAsSeen each 50 pixels have been scrolled
        var step = 200;
        if (window.scrollY > lastSetVisibleAsSeenCall + step) {
            lastSetVisibleAsSeenCall = window.scrollY;
            setVisibleAsSeen();
        }
    });

    //Style
    $(function () {
        var node = document.createElement('style');
        node.innerHTML = ".seenSet " + storyStatusLocation + "::after {\
        content: ' #Dejavu';\
        font-size: 12px;\
        color: lightgrey;}"
        document.body.appendChild(node);
    });
}

//http://benpickles.github.io/onScreen/
(function (a) {
    a.expr[":"].onScreen = function (b) {
        var c = a(window),
            d = c.scrollTop(),
            e = c.height(),
            f = d + e,
            g = a(b),
            h = g.offset().top,
            i = g.height(),
            j = h + i;
        return h >= d && h < f || j > d && j <= f || i > e && h <= d && j >= f
    }
})(jQuery);

String.prototype.cleanup = function () {
    return this.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
}
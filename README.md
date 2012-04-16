###description:###
swipe.js - zepto plugin for minimal implementation of swipe functionality

- pretty much still in beta, work in progress.
- a lot of missing functionality like allow page scroll, multi touch etc.


###usage###

    $(selector).swipe({
        status:function (event, phase, direction, distance) {
            //code
        })
    });
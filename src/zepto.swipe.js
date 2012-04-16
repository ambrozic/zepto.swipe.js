/*
 * zepto.swipe.js -  zepto plugin for minimal implementation of swipe functionality
 *
 * (c) Gregor Ambrozic (sensehack.com)
 *
 * @version 0.1
 */

(function ($) {
    $.fn.swipe = function (options) {
        if (!this)return false;
        var touchable = "ontouchstart" in window,
            START = "start",
            MOVE = "move",
            END = "end",
            CANCEL = "cancel",
            LEFT = "left",
            RIGHT = "right",
            UP = "up",
            DOWN = "down",
            phase = START;

        return this.each(function () {
            var self = this,
                $self = $(this),
                start = {x:0, y:0},
                end = {x:0, y:0},
                delta = {x:0, y:0},
                distance = {x:0, y:0},
                direction = undefined,
                touches = 0;

            function validate(event) {
                var evt = touchable ? event.touches[0] : event;
                distance.x = evt.pageX - start.x;
                distance.y = evt.pageY - start.y;
                delta.x = evt.pageX - end.x;
                delta.y = evt.pageY - end.y;
                end.x = evt.pageX;
                end.y = evt.pageY;

                var angle = Math.round(Math.atan2(end.y - start.y, start.x - end.x) * 180 / Math.PI);
                if (angle < 0) angle = 360 - Math.abs(angle);
                if ((angle <= 360) && (angle >= 315) || (angle <= 45) && (angle >= 0)) {
                    direction = LEFT;
                } else if ((angle <= 225) && (angle >= 135)) {
                    direction = RIGHT;
                } else if ((angle < 135) && (angle > 45)) {
                    direction = DOWN;
                } else {
                    direction = UP;
                }
            }

            function swipeStart(event) {
                var evt = touchable ? event.touches[0] : event;
                if (touchable) touches = event.touches.length;
                phase = START;
                start.x = evt.pageX;
                start.y = evt.pageY;
                validate(event);

                self.addEventListener((touchable) ? "touchmove" : "mousemove", swipeMove, false);
                self.addEventListener((touchable) ? "touchend" : "mouseup", swipeEnd, false);

                if (options.status) options.status.call($self, event, phase, direction, distance);
            }

            function swipeMove(event) {
                if (phase === END) return;
                phase = MOVE;
                validate(event);
                //todo implement page scrolling
                if (direction === LEFT || direction === RIGHT)
                    event.preventDefault();
                if (options.status) options.status.call($self, event, phase, direction, distance);
            }

            function swipeEnd(event) {
                phase = END;
                if (options.status) options.status.call($self, event, phase, direction, distance);
            }

            function swipeCancel(event) {
                phase = CANCEL;
                if (options.status) options.status.call($self, event, phase);
                start = {x:0, y:0}, end = {x:0, y:0}, delta = {x:0, y:0}, distance = {x:0, y:0}, direction = undefined, touches = 0;
            }

            self.addEventListener((touchable) ? "touchstart" : "mousedown", swipeStart, false);
            self.addEventListener("touchcancel", swipeCancel, false);
        });
    }
})(window.Zepto);
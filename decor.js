/* Vintage-print decor: ambient float + scroll/mouse parallax + scroll-reveal.
   Progressive enhancement — content is fully visible without JS.
   Transform/opacity only, one rAF loop, no layout reads inside it. */
(function () {
    "use strict";

    var reduce = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---- Scroll reveal (only enhances when IntersectionObserver exists) ---- */
    var revealEls = document.querySelectorAll("[data-reveal]");
    if (revealEls.length && "IntersectionObserver" in window) {
        document.documentElement.classList.add("js-reveal");
        if (reduce) {
            // reduced motion: reveal immediately, no transition
            for (var i = 0; i < revealEls.length; i++) revealEls[i].classList.add("in");
        } else {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in");
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
            for (var j = 0; j < revealEls.length; j++) io.observe(revealEls[j]);

            /* The observer deliberately waits until an element is well inside the
               viewport, which is right for anything you scroll down to and wrong
               for anything already on screen when the page opens: the bottom of
               the first screen would sit at opacity 0 and read as empty space
               rather than as content continuing below. Anything on screen already
               is therefore let through on its own, keeping the observer for the
               parts that are genuinely further down. Runs again after load in
               case webfonts reflow the column. */
            var showOnScreen = function () {
                for (var k = 0; k < revealEls.length; k++) {
                    var el = revealEls[k];
                    if (el.classList.contains("in")) continue;
                    if (el.getBoundingClientRect().top < window.innerHeight) {
                        el.classList.add("in");
                        io.unobserve(el);
                    }
                }
            };
            requestAnimationFrame(showOnScreen);
            window.addEventListener("load", function () {
                requestAnimationFrame(showOnScreen);
            });
        }
    }

    /* ---- Ambient float + parallax on the collage pieces ------------------
       One owner for all decor motion. The pieces used to drift on a CSS
       keyframe, which walks a straight line between two fixed points and back;
       however slow you make it, the eye learns the path and reads it as a
       mechanism. Floating needs a path that never quite repeats, so each piece
       gets its own pair of detuned sine waves per axis. The two waves drift in
       and out of step over minutes, which is what stops the motion resolving
       into a loop. Rotation and scale ride along on slower waves again, so a
       piece also turns a little and drifts nearer and further.

       Everything composes into one transform per piece per frame, on top of the
       parallax translation, so nothing fights anything else. */
    var scene = document.querySelector(".art-scene");
    var pieces = Array.prototype.slice.call(document.querySelectorAll(".art"));
    if (reduce || !scene || !pieces.length) return;

    var TAU = Math.PI * 2;

    /* Amplitude follows apparent size, the same rule the scroll depth uses, so a
       piece that reads as nearer both parallaxes further and floats further, and
       the ambient motion reinforces the depth order instead of flattening it.
       Peak excursion is exactly AMP * sqrt(w*h) either side of the authored
       position — the clearance analysis depends on that bound being exact.

       What the eye actually judges is speed, not distance or duration, and the
       two only reach it through their ratio: peak velocity is 2*pi*A/T. Under
       about 2px/s a piece reads as having changed rather than as moving, which
       is the worst possible result — the field looks like it is shimmering.
       Around 5-8px/s it reads as unmistakable, unhurried floating. Enlarging the
       path and stretching the period together is a trap, because it leaves the
       ratio alone; the period has to come DOWN as the amplitude goes up.

       PERIOD therefore shortens the authored duration rather than stretching it.
       Gutters are much narrower than they are tall, so horizontal travel is
       damped: pieces mostly rise and settle, the way something suspended in a
       shaft would, and the sideways sway stays inside the column. */
    var AMP = 0.2;
    var PERIOD = 0.75;     // multiplier on the authored duration
    var HORIZ = 0.55;      // horizontal travel, as a share of the vertical
    var SPIN = 0.45;       // share of the authored tilt swing to oscillate through
    var SPIN_CAP = 3;      // degrees
    var BREATHE = 0.02;    // scale, either side of 1

    /* The mouse follow used to be the largest motion in the field. Now that the
       pieces genuinely drift it steps back into a supporting role, which also
       hands its share of the gutter clearance over to the float. */
    var MOUSE = 0.6;

    /* Weights sum to 1 so two waves still peak at the stated amplitude. The
       period multipliers avoid small whole-number ratios in both directions, or
       the waves would re-align on a short cycle and the shuttle would come back. */
    var W1 = 0.62, W2 = 0.38;
    var T2 = 1.618, T3 = 1.27, T4 = 0.83, T5 = 2.4, T6 = 1.93;

    // Deterministic per-piece phases, so a reload looks the same as a resize.
    function phase(n) {
        var x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
        return (x - Math.floor(x)) * TAU;
    }

    /* The mouse follow is eased toward a target rather than taken straight from
       the event. A pointer can cross the window boundary between two frames, so
       reading the raw position moves every piece its full offset in a single
       frame and the whole field appears to flinch as the cursor arrives. Holding
       a target and easing the rendered value toward it bounds how far anything
       can travel per frame, and gives the same protection in reverse when the
       pointer leaves. The share is per frame rather than per second on purpose:
       it caps the step whatever the refresh rate, and the largest offset in the
       field is about 22px, so no frame can move a piece more than ~1.3px. */
    var MOUSE_EASE = 0.06;

    var state = [];
    var sy = window.pageYOffset || document.documentElement.scrollTop || 0;
    var mx = 0, my = 0, tmx = 0, tmy = 0;

    /* The only layout reads in the file. Run at startup and after a resize,
       never inside the frame loop. */
    function measure() {
        state.length = 0;
        for (var k = 0; k < pieces.length; k++) {
            var el = pieces[k];
            var inner = el.firstElementChild;
            var cs = getComputedStyle(inner);
            var dur = (parseFloat(cs.getPropertyValue("--dur")) || 24) * PERIOD;
            /* The authored drift vector no longer moves anything by itself. It
               now describes the piece's character: the ratio of its two
               components sets how much of the float goes sideways versus up and
               down, and their signs set which way it sets off. Magnitude comes
               from the piece's size instead, so the field stays coherent. */
            var dx = Math.abs(parseFloat(cs.getPropertyValue("--dx")) || 0);
            var dy = Math.abs(parseFloat(cs.getPropertyValue("--dy")) || 0);
            var lead = (parseFloat(cs.getPropertyValue("--dx")) || 0) < 0 ? Math.PI : 0;
            var leadY = (parseFloat(cs.getPropertyValue("--dy")) || 0) < 0 ? Math.PI : 0;
            var spin = Math.abs(parseFloat(cs.getPropertyValue("--rot")) || 0);

            var w = el.offsetWidth, h = el.offsetHeight;
            /* data-float trims a single piece that has less room than its size
               would otherwise claim, rather than holding the whole field back to
               suit the most boxed-in member of it. */
            var amp = AMP * Math.sqrt(w * h) * (parseFloat(el.getAttribute("data-float")) || 1);
            var lean = Math.max(dx, dy) || 1;

            state.push({
                el: el,
                ax: amp * (dx / lean) * HORIZ,
                ay: amp * (dy / lean),
                spin: Math.min(spin * SPIN, SPIN_CAP),
                depth: parseFloat(el.getAttribute("data-depth")) || 0.1,
                mfx: (parseFloat(el.getAttribute("data-mouse")) || 0) * MOUSE,
                /* Each piece leans on one axis: wide objects swing across, tall
                   ones up and down. Falls back to the horizontal figure when
                   unset, and a negative amplitude makes a piece counter-move
                   against its neighbours. */
                mfy: (el.getAttribute("data-mouse-y") === null
                    ? (parseFloat(el.getAttribute("data-mouse")) || 0)
                    : (parseFloat(el.getAttribute("data-mouse-y")) || 0)) * MOUSE,
                w1: TAU / dur, w2: TAU / (dur * T2),
                w3: TAU / (dur * T3), w4: TAU / (dur * T4),
                w5: TAU / (dur * T5), w6: TAU / (dur * T6),
                p1: phase(k) + lead, p2: phase(k + 17),
                p3: phase(k + 31) + leadY, p4: phase(k + 47),
                p5: phase(k + 61), p6: phase(k + 73)
            });
        }
    }

    function apply(t) {
        for (var k = 0; k < state.length; k++) {
            var p = state[k];
            var fx = p.ax * (W1 * Math.sin(p.w1 * t + p.p1) + W2 * Math.sin(p.w2 * t + p.p2));
            var fy = p.ay * (W1 * Math.sin(p.w3 * t + p.p3) + W2 * Math.sin(p.w4 * t + p.p4));
            var tx = mx * p.mfx + fx;
            var ty = sy * p.depth + my * p.mfy + fy;
            p.el.style.transform =
                "translate3d(" + tx.toFixed(2) + "px," + ty.toFixed(2) + "px,0)" +
                " rotate(" + (p.spin * Math.sin(p.w5 * t + p.p5)).toFixed(3) + "deg)" +
                " scale(" + (1 + BREATHE * Math.sin(p.w6 * t + p.p6)).toFixed(4) + ")";
        }
    }

    /* Time accumulates only while the loop runs, so coming back to a backgrounded
       tab resumes the drift where it left off instead of snapping to where it
       would have got to. Wall-clock time would carry on while the tab is away and
       land every piece somewhere else entirely on the first frame back. The step
       is capped as well, so even a throttled or dropped frame can only advance
       the drift by one plausible frame's worth. */
    var MAX_STEP = 0.05;
    var clock = 0, prev = 0, rafId = 0, onScreen = true;

    function tick(now) {
        rafId = requestAnimationFrame(tick);
        if (prev) {
            var dt = (now - prev) / 1000;
            clock += dt > MAX_STEP ? MAX_STEP : dt;
        }
        prev = now;
        mx += (tmx - mx) * MOUSE_EASE;
        my += (tmy - my) * MOUSE_EASE;
        apply(clock);
    }

    function sync() {
        var want = onScreen && !document.hidden;
        if (want && !rafId) { prev = 0; rafId = requestAnimationFrame(tick); }
        else if (!want && rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    }

    function readScroll() {
        sy = window.pageYOffset || document.documentElement.scrollTop || 0;
    }
    window.addEventListener("scroll", readScroll, { passive: true });
    /* A deferred script runs before the browser restores the previous scroll
       position or jumps to a fragment, so the offset read at startup can be a
       stale zero for the frame before the first scroll event lands. */
    window.addEventListener("load", readScroll);
    window.addEventListener("pageshow", readScroll);

    var resizeTimer = 0;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () { measure(); apply(clock); }, 150);
    }, { passive: true });

    if (window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("mousemove", function (e) {
            tmx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
            tmy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        }, { passive: true });

        /* Settle back to centre when the pointer goes away. Without this the
           field holds whatever deflection it had when the cursor left, so
           returning from the opposite edge asks it to cross the full range —
           smoothly, now, but still a long slide from a position that no longer
           means anything. */
        var neutral = function () { tmx = 0; tmy = 0; };
        // A mouseout carrying no relatedTarget is the pointer leaving the
        // document altogether, rather than moving between two elements in it.
        document.addEventListener("mouseout", function (e) {
            if (!e.relatedTarget) neutral();
        }, { passive: true });
        window.addEventListener("blur", neutral);
    }

    document.addEventListener("visibilitychange", sync);
    if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
            onScreen = entries[0].isIntersecting;
            sync();
        }).observe(scene);
    }

    measure();
    apply(0);
    sync();
})();

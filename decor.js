/* Vintage-print decor: scroll/mouse parallax + scroll-reveal.
   Progressive enhancement — content is fully visible without JS.
   Transform/opacity only, throttled with requestAnimationFrame. */
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
        }
    }

    /* ---- Parallax on the floating art pieces ---- */
    var pieces = Array.prototype.slice.call(document.querySelectorAll(".art"));
    if (reduce || !pieces.length) return;

    var mx = 0, my = 0, ticking = false;

    function apply() {
        ticking = false;
        var sy = window.pageYOffset || document.documentElement.scrollTop || 0;
        for (var i = 0; i < pieces.length; i++) {
            var el = pieces[i];
            var depth = parseFloat(el.getAttribute("data-depth")) || 0.1;
            var mfx = parseFloat(el.getAttribute("data-mouse")) || 0;
            // Each piece leans on one axis: wide objects swing across, tall ones
            // up and down. Falls back to the horizontal figure when unset, and a
            // negative amplitude makes a piece counter-move against its neighbours.
            var mfyAttr = el.getAttribute("data-mouse-y");
            var mfy = mfyAttr === null ? mfx : (parseFloat(mfyAttr) || 0);
            var tx = mx * mfx;
            var ty = sy * depth + my * mfy;
            el.style.transform = "translate3d(" + tx.toFixed(2) + "px," + ty.toFixed(2) + "px,0)";
        }
    }

    function request() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(apply);
        }
    }

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });

    if (window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("mousemove", function (e) {
            var cx = window.innerWidth / 2;
            var cy = window.innerHeight / 2;
            mx = (e.clientX - cx) / cx;
            my = (e.clientY - cy) / cy;
            request();
        }, { passive: true });
    }

    apply();
})();

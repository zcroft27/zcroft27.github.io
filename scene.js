/* Shared collage scene: the squiggle <symbol> sheet and every floating piece.
   One copy for the whole site, so the landing page and the inner pages float
   the same pieces in the same places, and a cross-page view transition can
   hold the layer still while only the content changes.

   Loaded as a plain (non-deferred) <script> right after <body> opens: it
   writes the markup in front of itself synchronously, before first paint and
   before decor.js (deferred) goes looking for .art pieces to animate. */
(function () {
    var html = `
    <!-- Hand-inked "odd squiggle" vocabulary, stamped with <use> in the scenes
         below. The paths are drawn deliberately off-true — control points
         nudged out of symmetry, arcs that don't quite match their neighbours —
         so the lines wobble like brushwork instead of reading as generated
         geometry. Children that need filling say so on themselves; everything
         else inherits fill/stroke from the .art-squig host. -->
    <svg class="svg-defs" aria-hidden="true" focusable="false">
        <defs>
            <symbol id="sq-arch" viewBox="0 0 100 72">
                <path d="M5 68C6 31 27 8 50 7c24-1 44 22 45 61"/>
                <path d="M17 68C18 39 32 20 50 19c19-1 34 20 34 49"/>
                <path d="M29 68c1-21 8-36 21-36.5C63 31 71 46 71.5 68"/>
                <path d="M41 68c.5-13 3-24 9-24.5C56 43 59 55 59.5 68"/>
            </symbol>
            <symbol id="sq-zigzag" viewBox="0 0 100 62">
                <path d="M4 26 17 6 27 27 40 5 51 26 64 6 74 27 87 5 96 22"/>
                <path d="M6 56 17 38 29 57 41 36 52 56 65 37 75 57 88 36 97 52"/>
            </symbol>
            <symbol id="sq-wave" viewBox="0 0 100 56">
                <path d="M4 12c8-9 14 8 22 0s14 9 22 1 14 8 22 0c4-4 6-2 8 0"/>
                <path d="M5 30c8-10 14 8 22 0s14 9 22 1 14 8 22-1c4-4 6-1 8 1"/>
                <path d="M4 48c8-9 14 8 22 0s14 9 22 1 14 8 22 0c4-4 6-2 8 1"/>
            </symbol>
            <symbol id="sq-stripes" viewBox="0 0 100 70">
                <path d="M8 8c22-2 46-1 81 1" stroke-width="3.2"/>
                <path d="M4 21c26-3 51 0 88 2" stroke-width="2"/>
                <path d="M11 34c20-1 44 1 77-1" stroke-width="3.6"/>
                <path d="M6 47c24 2 53-2 84 0" stroke-width="2.2"/>
                <path d="M13 60c18-2 41 1 71 1" stroke-width="3"/>
            </symbol>
            <symbol id="sq-vbars" viewBox="0 0 80 100">
                <path d="M7 6c-2 28-1 60 1 88"/>
                <path d="M20 9c2 26 0 58-1 84"/>
                <path d="M33 5c-1 30 1 62 0 90" stroke-width="3.2"/>
                <path d="M46 8c2 28-1 56 1 86"/>
                <path d="M59 6c-2 26 1 60-1 88" stroke-width="3.2"/>
                <path d="M72 10c1 28 0 54-1 82"/>
            </symbol>
            <symbol id="sq-spiral" viewBox="0 0 100 100">
                <path d="M50 7c24 0 43 19 43 43 0 23-19 42-44 42-23 0-40-17-40-40 0-21 16-36 37-36 18 0 32 13 32 31 0 15-12 27-28 27-13 0-23-10-23-24 0-11 9-20 21-20 10 0 17 8 17 18 0 8-6 14-14 14"/>
            </symbol>
            <symbol id="sq-loops" viewBox="0 0 100 92">
                <path d="M42 5c19-2 34 15 35 35 1 21-12 40-31 41C27 82 11 65 10 45 9 25 23 7 42 5Z"/>
                <path d="M64 12c17-1 27 17 28 34 1 20-10 37-27 38-18 1-29-17-30-36-1-18 10-35 29-36Z"/>
            </symbol>
            <symbol id="sq-rings" viewBox="0 0 100 72">
                <path d="M18 8c8 0 13 4 13 9.5S25 27 17 27 5 22 5 17.5 10 8 18 8Z"/>
                <path d="M51 5c7-1 11 4 11 8.5S57 22 50 22s-11-4-11-8.5S44 6 51 5Z"/>
                <path d="M83 10c8 0 12 5 12 10s-5 9-13 9-11-5-11-9.5S75 10 83 10Z"/>
                <path d="M26 42c8-1 12 4 12 8.5S33 59 25 59s-11-4-11-8 4-8 12-9Z"/>
                <path d="M61 42c9 0 14 5 14 10.5S69 63 60 63s-13-5-13-10 5-11 14-11Z"/>
                <path d="M91 40c6 0 9 4 9 7.5S96 55 90 55s-9-3-9-7 4-8 10-8Z"/>
            </symbol>
            <symbol id="sq-speckle" viewBox="0 0 100 100">
                <g stroke-width="5">
                    <path d="M11 13l5 6"/><path d="M33 8l6 4"/><path d="M56 14l4 6"/><path d="M79 9l6 5"/>
                    <path d="M20 32l6 5"/><path d="M44 29l4 6"/><path d="M67 34l6 4"/><path d="M88 30l4 6"/>
                    <path d="M9 52l6 5"/><path d="M32 55l4 5"/><path d="M55 50l6 5"/><path d="M78 55l5 5"/>
                    <path d="M19 74l5 6"/><path d="M42 78l6 4"/><path d="M65 73l4 6"/><path d="M87 77l6 5"/>
                    <path d="M30 94l5 4"/><path d="M62 92l5 5"/>
                </g>
            </symbol>
            <symbol id="sq-moon" viewBox="0 0 100 58">
                <path fill="currentColor" stroke="none"
                      d="M19 3c14 1 25 13 25 26 0 14-11 26-26 26-1 0-2-1-2-2V5c0-1 1-2 3-2Z"/>
                <path fill="currentColor" stroke="none"
                      d="M58 5c15 0 28 12 28 25S73 55 58 55c-2 0-3-1-3-2V7c0-1 1-2 3-2Z"/>
            </symbol>
            <symbol id="sq-sparkle" viewBox="0 0 100 100">
                <path fill="currentColor" stroke="none"
                      d="M50 2c4 31 16 44 47 47-30 4-44 17-47 49-4-31-17-44-48-48 31-4 44-17 48-48Z"/>
            </symbol>
            <symbol id="sq-scribble" viewBox="0 0 100 64">
                <path d="M6 40c-3-12 8-22 18-16s6 24 17 26 18-14 12-24S37 12 44 6s21 4 24 15-8 22 0 28 20-3 25-13"/>
            </symbol>
        </defs>
    </svg>
    <!-- Collage scene. Each cluster pairs a cutout with a squiggle nearby: the
         cutouts now carry their own colour, so they sit straight on the dark
         field rather than on an offset colour shape. -->
    <div class="art-scene" aria-hidden="true"><div class="art-field">
        <!-- left gutter -->
        <div class="art art-l-typewriter" style="--left:3.2%; --w:130px; --h:100px" data-depth="0.2096" data-mouse="12" data-mouse-y="7.7">
            <div class="art-i" style="--dur:26s; --dx:9px; --dy:-12px; --rot:2deg; --op:.46"><div class="art-cut art-cut--ink cut-typewriter" style="--tilt:-5deg; --ink:var(--collage-teal)"></div></div>
        </div>
        <!-- Vinyl record (Jordan Watkins' icon, used as-is). -->
        <div class="art art-l-record" style="--left:9.6%; --w:82px; --h:82px" data-depth="0.1158" data-mouse="11.3" data-mouse-y="5.4" data-float="0.6">
            <div class="art-i" style="--dur:23s; --dx:7px; --dy:-9px; --rot:-4deg; --op:.5"><div class="art-cut cut-record" style="--tilt:0deg"></div></div>
        </div>
        <div class="art art-l-pine" style="--left:8.4%; --w:88px; --h:118px" data-depth="0.1878" data-mouse="7.8" data-mouse-y="17.0">
            <div class="art-i" style="--dur:27s; --dx:-7px; --dy:10px; --rot:3deg; --op:.55"><div class="art-cut cut-pine" style="--tilt:7deg"></div></div>
        </div>
        <div class="art art-l-lobster" style="--left:3.4%; --w:74px; --h:126px" data-depth="0.1777" data-mouse="7.6" data-mouse-y="16.4">
            <div class="art-i" style="--dur:24s; --dx:6px; --dy:-13px; --rot:3deg; --op:.62"><div class="art-cut art-cut--ink cut-lobster" style="--tilt:-6deg; --ink:var(--collage-red)"></div></div>
        </div>
        <!-- Hand holding a camera (Jordan Watkins' icon, used as-is). -->
        <div class="art art-l-camera" style="--left:8.2%; --w:94px; --h:120px" data-depth="0.1104" data-mouse="8.6" data-mouse-y="8.6">
            <div class="art-i" style="--dur:22s; --dx:9px; --dy:-12px; --rot:6deg; --op:.5"><div class="art-cut cut-camera" style="--tilt:-6deg"></div></div>
        </div>

        <!-- right gutter -->
        <!-- A joker, dealt into the corner the loop squiggle used to hold. The
             jester is an ink-density cutout like the engravings, but it sits on
             its own cut-paper card with red corner indices, since a bare figure
             wouldn't read as a playing card. -->
        <div class="art art-r-joker" style="--left:85.4%; --w:100px; --h:140px" data-depth="0.1681" data-mouse="11.0" data-mouse-y="11.0">
            <div class="art-i" style="--dur:30s; --dx:-8px; --dy:11px; --rot:-4deg; --op:.46"><div class="art-card" style="--tilt:9deg"><span class="art-card-index">Joker</span><div class="art-card-face cut-joker"></div><span class="art-card-index art-card-index--flip">Joker</span></div></div>
        </div>
        <div class="art art-r-trumpet" style="--left:87.6%; --w:150px; --h:58px" data-depth="0.1712" data-mouse="12.4" data-mouse-y="6.8">
            <div class="art-i" style="--dur:28s; --dx:-9px; --dy:9px; --rot:-3deg; --op:.32"><div class="art-cut art-cut--ink cut-trumpet" style="--tilt:-4deg; --ink:var(--collage-mustard)"></div></div>
        </div>
        <!-- Stands in the long gap between the trumpet and the globe, facing in
             towards the column. A hand-coloured plate, so like the pine it keeps
             its own inks and paints as a background-image rather than being
             tinted from the palette — the stripes are the whole point of a zebra
             and a flat spot colour would erase them. -->
        <div class="art art-r-zebra" style="--left:85.4%; --w:110px; --h:105px" data-depth="0.1956" data-mouse="9.8" data-mouse-y="8.2">
            <div class="art-i" style="--dur:29s; --dx:7px; --dy:9px; --rot:-3deg; --op:.55"><div class="art-cut cut-zebra" style="--tilt:-2deg"></div></div>
        </div>
        <div class="art art-r-globe" style="--left:91.2%; --w:72px; --h:84px" data-depth="0.1418" data-mouse="9.9" data-mouse-y="9.9">
            <div class="art-i" style="--dur:25s; --dx:-6px; --dy:-11px; --rot:4deg; --op:.60"><div class="art-cut art-cut--ink cut-globe" style="--tilt:8deg; --ink:var(--collage-teal)"></div></div>
        </div>
        <!-- Retro computer (Jordan Watkins' icon, used as-is). -->
        <div class="art art-r-computer" style="--left:85.8%; --w:110px; --h:99px" data-depth="0.1499" data-mouse="10.3" data-mouse-y="10.3">
            <div class="art-i" style="--dur:23s; --dx:-8px; --dy:-12px; --rot:5deg; --op:.5"><div class="art-cut cut-computer" style="--tilt:4deg"></div></div>
        </div>

    </div></div>
`;
    var me = document.currentScript;
    me.insertAdjacentHTML("beforebegin", html);

    /* Nav feedback: move the underline to the clicked link at once, instead of
       leaving it on the old page's link until the next page has loaded. */
    document.addEventListener("click", function (e) {
        var a = e.target.closest && e.target.closest(".site-nav-links a");
        if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        var links = a.parentNode.querySelectorAll("a");
        for (var i = 0; i < links.length; i++) links[i].removeAttribute("aria-current");
        a.setAttribute("aria-current", "page");
    });

    /* Where supported (Chrome), fetch a page in the background once a link to
       it is hovered, so the click lands almost instantly. Prefetch only, not
       prerender: a prerendered page would start its decor clock early and the
       floating pieces would no longer pick up where the last page left off. */
    if (window.HTMLScriptElement && HTMLScriptElement.supports &&
            HTMLScriptElement.supports("speculationrules")) {
        var rules = document.createElement("script");
        rules.type = "speculationrules";
        rules.textContent = JSON.stringify({
            prefetch: [{ where: { href_matches: "/*" }, eagerness: "moderate" }]
        });
        document.head.appendChild(rules);
    }
})();

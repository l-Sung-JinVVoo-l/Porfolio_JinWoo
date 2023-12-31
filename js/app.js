(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function t() {
        return t = Object.assign ? Object.assign.bind() : function(t) {
            for (var e = 1; e < arguments.length; e++) {
                var i = arguments[e];
                for (var s in i) Object.prototype.hasOwnProperty.call(i, s) && (t[s] = i[s]);
            }
            return t;
        }, t.apply(this, arguments);
    }
    function e(t, e, i) {
        return Math.max(t, Math.min(e, i));
    }
    class i {
        advance(t) {
            var i;
            if (!this.isRunning) return;
            let s = !1;
            if (this.lerp) this.value = (o = this.value, n = this.to, (1 - (l = 1 - Math.exp(-60 * this.lerp * t))) * o + l * n), 
            Math.round(this.value) === this.to && (this.value = this.to, s = !0); else {
                this.currentTime += t;
                const i = e(0, this.currentTime / this.duration, 1);
                s = i >= 1;
                const o = s ? 1 : this.easing(i);
                this.value = this.from + (this.to - this.from) * o;
            }
            var o, n, l;
            null == (i = this.onUpdate) || i.call(this, this.value, s), s && this.stop();
        }
        stop() {
            this.isRunning = !1;
        }
        fromTo(t, e, {lerp: i = .1, duration: s = 1, easing: o = (t => t), onStart: n, onUpdate: l}) {
            this.from = this.value = t, this.to = e, this.lerp = i, this.duration = s, this.easing = o, 
            this.currentTime = 0, this.isRunning = !0, null == n || n(), this.onUpdate = l;
        }
    }
    class s {
        constructor({wrapper: t, content: e, autoResize: i = !0} = {}) {
            if (this.resize = () => {
                this.onWrapperResize(), this.onContentResize();
            }, this.onWrapperResize = () => {
                this.wrapper === window ? (this.width = window.innerWidth, this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth, 
                this.height = this.wrapper.clientHeight);
            }, this.onContentResize = () => {
                this.scrollHeight = this.content.scrollHeight, this.scrollWidth = this.content.scrollWidth;
            }, this.wrapper = t, this.content = e, i) {
                const t = function(t, e) {
                    let i;
                    return function() {
                        let e = arguments, s = this;
                        clearTimeout(i), i = setTimeout((function() {
                            t.apply(s, e);
                        }), 250);
                    };
                }(this.resize);
                this.wrapper !== window && (this.wrapperResizeObserver = new ResizeObserver(t), 
                this.wrapperResizeObserver.observe(this.wrapper)), this.contentResizeObserver = new ResizeObserver(t), 
                this.contentResizeObserver.observe(this.content);
            }
            this.resize();
        }
        destroy() {
            var t, e;
            null == (t = this.wrapperResizeObserver) || t.disconnect(), null == (e = this.contentResizeObserver) || e.disconnect();
        }
        get limit() {
            return {
                x: this.scrollWidth - this.width,
                y: this.scrollHeight - this.height
            };
        }
    }
    class o {
        constructor() {
            this.events = {};
        }
        emit(t, ...e) {
            let i = this.events[t] || [];
            for (let t = 0, s = i.length; t < s; t++) i[t](...e);
        }
        on(t, e) {
            var i;
            return (null == (i = this.events[t]) ? void 0 : i.push(e)) || (this.events[t] = [ e ]), 
            () => {
                var i;
                this.events[t] = null == (i = this.events[t]) ? void 0 : i.filter((t => e !== t));
            };
        }
        off(t, e) {
            var i;
            this.events[t] = null == (i = this.events[t]) ? void 0 : i.filter((t => e !== t));
        }
        destroy() {
            this.events = {};
        }
    }
    class n {
        constructor(t, {wheelMultiplier: i = 1, touchMultiplier: s = 2, normalizeWheel: n = !1}) {
            this.onTouchStart = t => {
                const {clientX: e, clientY: i} = t.targetTouches ? t.targetTouches[0] : t;
                this.touchStart.x = e, this.touchStart.y = i, this.lastDelta = {
                    x: 0,
                    y: 0
                };
            }, this.onTouchMove = t => {
                const {clientX: e, clientY: i} = t.targetTouches ? t.targetTouches[0] : t, s = -(e - this.touchStart.x) * this.touchMultiplier, o = -(i - this.touchStart.y) * this.touchMultiplier;
                this.touchStart.x = e, this.touchStart.y = i, this.lastDelta = {
                    x: s,
                    y: o
                }, this.emitter.emit("scroll", {
                    deltaX: s,
                    deltaY: o,
                    event: t
                });
            }, this.onTouchEnd = t => {
                this.emitter.emit("scroll", {
                    deltaX: this.lastDelta.x,
                    deltaY: this.lastDelta.y,
                    event: t
                });
            }, this.onWheel = t => {
                let {deltaX: i, deltaY: s} = t;
                this.normalizeWheel && (i = e(-100, i, 100), s = e(-100, s, 100)), i *= this.wheelMultiplier, 
                s *= this.wheelMultiplier, this.emitter.emit("scroll", {
                    deltaX: i,
                    deltaY: s,
                    event: t
                });
            }, this.element = t, this.wheelMultiplier = i, this.touchMultiplier = s, this.normalizeWheel = n, 
            this.touchStart = {
                x: null,
                y: null
            }, this.emitter = new o, this.element.addEventListener("wheel", this.onWheel, {
                passive: !1
            }), this.element.addEventListener("touchstart", this.onTouchStart, {
                passive: !1
            }), this.element.addEventListener("touchmove", this.onTouchMove, {
                passive: !1
            }), this.element.addEventListener("touchend", this.onTouchEnd, {
                passive: !1
            });
        }
        on(t, e) {
            return this.emitter.on(t, e);
        }
        destroy() {
            this.emitter.destroy(), this.element.removeEventListener("wheel", this.onWheel, {
                passive: !1
            }), this.element.removeEventListener("touchstart", this.onTouchStart, {
                passive: !1
            }), this.element.removeEventListener("touchmove", this.onTouchMove, {
                passive: !1
            }), this.element.removeEventListener("touchend", this.onTouchEnd, {
                passive: !1
            });
        }
    }
    class l {
        constructor({wrapper: e = window, content: l = document.documentElement, wheelEventsTarget: r = e, eventsTarget: h = r, smoothWheel: a = !0, smoothTouch: c = !1, syncTouch: u = !1, syncTouchLerp: p = .1, __iosNoInertiaSyncTouchLerp: d = .4, touchInertiaMultiplier: m = 35, duration: v, easing: g = (t => Math.min(1, 1.001 - Math.pow(2, -10 * t))), lerp: S = !v && .1, infinite: w = !1, orientation: f = "vertical", gestureOrientation: y = "vertical", touchMultiplier: T = 1, wheelMultiplier: z = 1, normalizeWheel: _ = !1, autoResize: M = !0} = {}) {
            this.onVirtualScroll = ({deltaX: e, deltaY: i, event: s}) => {
                if (s.ctrlKey) return;
                const o = s.type.includes("touch"), n = s.type.includes("wheel");
                if ("both" === this.options.gestureOrientation && 0 === e && 0 === i || "vertical" === this.options.gestureOrientation && 0 === i || "horizontal" === this.options.gestureOrientation && 0 === e || o && "vertical" === this.options.gestureOrientation && 0 === this.scroll && !this.options.infinite && i <= 0) return;
                let l = s.composedPath();
                if (l = l.slice(0, l.indexOf(this.rootElement)), l.find((t => {
                    var e;
                    return (null == t.hasAttribute ? void 0 : t.hasAttribute("data-lenis-prevent")) || o && (null == t.hasAttribute ? void 0 : t.hasAttribute("data-lenis-prevent-touch")) || n && (null == t.hasAttribute ? void 0 : t.hasAttribute("data-lenis-prevent-wheel")) || (null == (e = t.classList) ? void 0 : e.contains("lenis"));
                }))) return;
                if (this.isStopped || this.isLocked) return void s.preventDefault();
                if (this.isSmooth = (this.options.smoothTouch || this.options.syncTouch) && o || this.options.smoothWheel && n, 
                !this.isSmooth) return this.isScrolling = !1, void this.animate.stop();
                s.preventDefault();
                let r = i;
                "both" === this.options.gestureOrientation ? r = Math.abs(i) > Math.abs(e) ? i : e : "horizontal" === this.options.gestureOrientation && (r = e);
                const h = o && this.options.syncTouch, a = o && "touchend" === s.type && Math.abs(r) > 1;
                a && (r = this.velocity * this.options.touchInertiaMultiplier), this.scrollTo(this.targetScroll + r, t({
                    programmatic: !1
                }, h && {
                    lerp: a ? this.syncTouchLerp : this.options.__iosNoInertiaSyncTouchLerp
                }));
            }, this.onNativeScroll = () => {
                if (!this.__preventNextScrollEvent && !this.isScrolling) {
                    const t = this.animatedScroll;
                    this.animatedScroll = this.targetScroll = this.actualScroll, this.velocity = 0, 
                    this.direction = Math.sign(this.animatedScroll - t), this.emit();
                }
            }, window.lenisVersion = "1.0.29", e !== document.documentElement && e !== document.body || (e = window), 
            this.options = {
                wrapper: e,
                content: l,
                wheelEventsTarget: r,
                eventsTarget: h,
                smoothWheel: a,
                smoothTouch: c,
                syncTouch: u,
                syncTouchLerp: p,
                __iosNoInertiaSyncTouchLerp: d,
                touchInertiaMultiplier: m,
                duration: v,
                easing: g,
                lerp: S,
                infinite: w,
                gestureOrientation: y,
                orientation: f,
                touchMultiplier: T,
                wheelMultiplier: z,
                normalizeWheel: _,
                autoResize: M
            }, this.animate = new i, this.emitter = new o, this.dimensions = new s({
                wrapper: e,
                content: l,
                autoResize: M
            }), this.toggleClass("lenis", !0), this.velocity = 0, this.isLocked = !1, this.isStopped = !1, 
            this.isSmooth = u || a || c, this.isScrolling = !1, this.targetScroll = this.animatedScroll = this.actualScroll, 
            this.options.wrapper.addEventListener("scroll", this.onNativeScroll, {
                passive: !1
            }), this.virtualScroll = new n(h, {
                touchMultiplier: T,
                wheelMultiplier: z,
                normalizeWheel: _
            }), this.virtualScroll.on("scroll", this.onVirtualScroll);
        }
        destroy() {
            this.emitter.destroy(), this.options.wrapper.removeEventListener("scroll", this.onNativeScroll, {
                passive: !1
            }), this.virtualScroll.destroy(), this.dimensions.destroy(), this.toggleClass("lenis", !1), 
            this.toggleClass("lenis-smooth", !1), this.toggleClass("lenis-scrolling", !1), this.toggleClass("lenis-stopped", !1), 
            this.toggleClass("lenis-locked", !1);
        }
        on(t, e) {
            return this.emitter.on(t, e);
        }
        off(t, e) {
            return this.emitter.off(t, e);
        }
        setScroll(t) {
            this.isHorizontal ? this.rootElement.scrollLeft = t : this.rootElement.scrollTop = t;
        }
        resize() {
            this.dimensions.resize();
        }
        emit() {
            this.emitter.emit("scroll", this);
        }
        reset() {
            this.isLocked = !1, this.isScrolling = !1, this.animatedScroll = this.targetScroll = this.actualScroll, 
            this.velocity = 0, this.animate.stop();
        }
        start() {
            this.isStopped = !1, this.reset();
        }
        stop() {
            this.isStopped = !0, this.animate.stop(), this.reset();
        }
        raf(t) {
            const e = t - (this.time || t);
            this.time = t, this.animate.advance(.001 * e);
        }
        scrollTo(t, {offset: i = 0, immediate: s = !1, lock: o = !1, duration: n = this.options.duration, easing: l = this.options.easing, lerp: r = !n && this.options.lerp, onComplete: h = null, force: a = !1, programmatic: c = !0} = {}) {
            if (!this.isStopped && !this.isLocked || a) {
                if ([ "top", "left", "start" ].includes(t)) t = 0; else if ([ "bottom", "right", "end" ].includes(t)) t = this.limit; else {
                    var u;
                    let e;
                    if ("string" == typeof t ? e = document.querySelector(t) : null != (u = t) && u.nodeType && (e = t), 
                    e) {
                        if (this.options.wrapper !== window) {
                            const t = this.options.wrapper.getBoundingClientRect();
                            i -= this.isHorizontal ? t.left : t.top;
                        }
                        const s = e.getBoundingClientRect();
                        t = (this.isHorizontal ? s.left : s.top) + this.animatedScroll;
                    }
                }
                if ("number" == typeof t) {
                    if (t += i, t = Math.round(t), this.options.infinite ? c && (this.targetScroll = this.animatedScroll = this.scroll) : t = e(0, t, this.limit), 
                    s) return this.animatedScroll = this.targetScroll = t, this.setScroll(this.scroll), 
                    this.reset(), void (null == h || h(this));
                    if (!c) {
                        if (t === this.targetScroll) return;
                        this.targetScroll = t;
                    }
                    this.animate.fromTo(this.animatedScroll, t, {
                        duration: n,
                        easing: l,
                        lerp: r,
                        onStart: () => {
                            o && (this.isLocked = !0), this.isScrolling = !0;
                        },
                        onUpdate: (t, e) => {
                            this.isScrolling = !0, this.velocity = t - this.animatedScroll, this.direction = Math.sign(this.velocity), 
                            this.animatedScroll = t, this.setScroll(this.scroll), c && (this.targetScroll = t), 
                            e || this.emit(), e && (this.reset(), this.emit(), null == h || h(this), this.__preventNextScrollEvent = !0, 
                            requestAnimationFrame((() => {
                                delete this.__preventNextScrollEvent;
                            })));
                        }
                    });
                }
            }
        }
        get rootElement() {
            return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
        }
        get limit() {
            return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
        }
        get isHorizontal() {
            return "horizontal" === this.options.orientation;
        }
        get actualScroll() {
            return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop;
        }
        get scroll() {
            return this.options.infinite ? (this.animatedScroll % (t = this.limit) + t) % t : this.animatedScroll;
            var t;
        }
        get progress() {
            return 0 === this.limit ? 1 : this.scroll / this.limit;
        }
        get isSmooth() {
            return this.__isSmooth;
        }
        set isSmooth(t) {
            this.__isSmooth !== t && (this.__isSmooth = t, this.toggleClass("lenis-smooth", t));
        }
        get isScrolling() {
            return this.__isScrolling;
        }
        set isScrolling(t) {
            this.__isScrolling !== t && (this.__isScrolling = t, this.toggleClass("lenis-scrolling", t));
        }
        get isStopped() {
            return this.__isStopped;
        }
        set isStopped(t) {
            this.__isStopped !== t && (this.__isStopped = t, this.toggleClass("lenis-stopped", t));
        }
        get isLocked() {
            return this.__isLocked;
        }
        set isLocked(t) {
            this.__isLocked !== t && (this.__isLocked = t, this.toggleClass("lenis-locked", t));
        }
        get className() {
            let t = "lenis";
            return this.isStopped && (t += " lenis-stopped"), this.isLocked && (t += " lenis-locked"), 
            this.isScrolling && (t += " lenis-scrolling"), this.isSmooth && (t += " lenis-smooth"), 
            t;
        }
        toggleClass(t, e) {
            this.rootElement.classList.toggle(t, e), this.emitter.emit("className change", this);
        }
    }
    window.addEventListener(`scroll`, (e => {
        document.body.style.cssText += `--scrollTop: ${window.scrollY}px`;
    }));
    document.addEventListener(`mousemove`, (e => {
        Object.assign(document.documentElement, {
            style: `\n\t\t--move-x: ${(e.clientX - window.innerWidth / 2) * -7e-4}deg;\n\t\t--move-y: ${(e.clientY - window.innerHeight / 2) * -7e-4}deg;\n\t\t`
        });
    }));
    const lenis = new l({
        duration: 1.8,
        easing: t => Math.min(1, 1.03 - Math.pow(2, -6 * t))
    });
    lenis.on("scroll", (e => {
        console.log(e);
    }));
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    let canvas = document.getElementsByClassName("rain")[0];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let c = canvas.getContext("2d");
    function randomNum(max, min) {
        return Math.floor(Math.random() * max) + min;
    }
    function RainDrops(x, y, endy, velocity, opacity) {
        this.x = x;
        this.y = y;
        this.endy = endy;
        this.velocity = velocity;
        this.opacity = opacity;
        this.draw = function() {
            c.beginPath();
            c.moveTo(this.x, this.y);
            c.lineTo(this.x, this.y - this.endy);
            c.lineWidth = 1;
            c.strokeStyle = "rgba(255, 255, 255, " + this.opacity + ")";
            c.stroke();
        };
        this.update = function() {
            let rainEnd = window.innerHeight + 100;
            if (this.y >= rainEnd) this.y = this.endy - 100; else this.y = this.y + this.velocity;
            this.draw();
        };
    }
    let rainArray = [];
    for (let i = 0; i < 140; i++) {
        let rainXLocation = Math.floor(Math.random() * window.innerWidth) + 1;
        let rainYLocation = Math.random() * -500;
        let randomRainHeight = randomNum(10, 2);
        let randomSpeed = randomNum(20, .2);
        let randomOpacity = Math.random() * .55;
        rainArray.push(new RainDrops(rainXLocation, rainYLocation, randomRainHeight, randomSpeed, randomOpacity));
    }
    function animateRain() {
        requestAnimationFrame(animateRain);
        c.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (let i = 0; i < rainArray.length; i++) rainArray[i].update();
    }
    animateRain();
    window["FLS"] = true;
    isWebp();
    //!===================================
})();
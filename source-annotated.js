/*
 *  THIS IS THE SOURCE OF THE ALT-J RELAXER WEBGAME
 *  I've annotated it in some places and modified
 *  various variable names to make it more readable
 *  but it's pretty much as-is.
 *
 *  It appears as though the source has been obfuscated
 *  with something like Google's Closure Compiler, so
 *  it's really difficult to read.
 */

!function() {
    "use strict";
    function t(t, e, a) {
        return (1 - a) * t + a * e
    }
    function e(t, e, a) {
        return t < e ? e : t > a ? a : t
    }
    function a(t, e) {
        for (var a = 0, n = 0; a < t.length; ) {
            var r = t.indexOf("\n", a);
            r == -1 && (r = t.length);
            var o = t.substr(a, r - a);
            a = r + 1,
            e(o, n++)
        }
    }
    function n(t, e, a) {
        a = a || "application/octet-binary";
        var n = new Blob([t],{
            type: a
        })
          , r = URL.createObjectURL(n)
          , o = document.createElement("a");
        o.setAttribute("href", r),
        o.setAttribute("download", e),
        o.click(),
        URL.revokeObjectURL(n)
    }
    function r(t, e) {
        _.isUndefined(e.offsetX) ? (t[0] = e.layerX,
        t[1] = e.layerY) : (t[0] = e.offsetX,
        t[1] = e.offsetY)
    }
    function o(t) {
        return fetch(t).then(function(t) {
            return t.arrayBuffer()
        }).then(function(t) {
            var e = pako.inflate(t);
            return msgpack.decode(e)
        })
    }
    function i(t, e) {
        for (var a = atob(t), n = a.length, r = new ArrayBuffer(n), o = new Uint8Array(r), i = 0; i < n; ++i)
            o[i] = a.charCodeAt(i);
        return e ? new e(r) : r
    }
    function s(t) {
        t = t instanceof ArrayBuffer ? new Uint8Array(t) : new Uint8Array(t.buffer,t.byteOffset,t.byteLength);
        for (var e = t.length, a = "", n = 0; n < e; ++n)
            a += String.fromCharCode(t[n]);
        return btoa(a)
    }
    function l() {
        this.fov = 60,
        this.near = .01,
        this.far = 150,
        this.viewport = ft.fromValues(0, 0, 1, 1),
        this.proj = lt.create(),
        this.view = lt.create(),
        this.bill = st.create(),
        this.mvp = lt.create(),
        this.inv_mvp = lt.create(),
        this.inv_view = lt.create(),
        this.inv_proj = lt.create(),
        this.view_pos = dt.create(),
        this.view_dir = dt.create(),
        this.wide = 1024 / 720,
        this.wide = 1,
        this.ortho = 0
    }
    function u(t, e, a, n, r, o, i) {
        if (!l.use_frustum)
            return void lt.perspective(t, e, a, n, r);
        o = o || 0,
        i = i || 0;
        var s = 1 * n * Math.tan(e / 2)
          , u = -s
          , c = s * a
          , d = -c
          , f = n
          , h = r;
        o *= c - d,
        i *= s - u,
        lt.frustum(t, d - o, c - o, u - i, s - i, f, h)
    }
    function c(t) {
        this.name = t,
        this.program = null,
        this.attribs = {},
        this.uniforms = {}
    }
    function d(t, e, n) {
        var r = gl.createShader(t);
        if (gl.shaderSource(r, e),
        gl.compileShader(r),
        gl.getShaderParameter(r, gl.COMPILE_STATUS))
            return r;
        gl.getShaderInfoLog(r);
        throw console.log("Shader: " + n),
        console.log("Type: " + (t == gl.VERTEX_SHADER ? "vertex" : "fragment")),
        a(e, function(t, e) {
            var a = ("  " + (e + 1)).slice(-3);
            console.log(a + ": " + t)
        }),
        console.log("Error:", gl.getShaderInfoLog(r)),
        {
            type: "COMPILE",
            shaderType: t == gl.VERTEX_SHADER ? "vertex" : "fragment",
            name: n,
            shader: r,
            source: gl.getShaderSource(r),
            log: gl.getShaderInfoLog(r)
        }
    }
    function f(t) {
        var e = "precision " + mt + "p float;\n"
          , a = gl.createProgram();
        if (gl.attachShader(a, d(gl.VERTEX_SHADER, t.vertexSource, t.name)),
        gl.attachShader(a, d(gl.FRAGMENT_SHADER, e + t.fragmentSource, t.name)),
        gl.linkProgram(a),
        gl.getProgramParameter(a, gl.LINK_STATUS))
            return a;
        throw console.log("Link Error:", gl.getProgramInfoLog(a)),
        {
            type: "LINK",
            name: t.name,
            program: a,
            log: gl.getProgramInfoLog(a)
        }
    }
    function h(t) {
        function e(t) {
            var e = /^\/\/\s*(\w+(?:.(vertex|fragment))?)\s*\/\//
              , n = [];
            a(t, function(t) {
                var a = e.exec(t);
                if (a) {
                    var r = a[1];
                    Mt[r] = n = []
                } else
                    n.push(t)
            })
        }
        Mt = {},
        _.each(t, function(t) {
            _.endsWith(t, ".glsl") ? $.ajax({
                url: t,
                async: !1,
                cache: !1,
                success: e
            }) : e(t)
        }),
        _.each(Mt, function(t, e) {
            Mt[e] = t.join("\n")
        })
    }
    function p(t, e, a) {
        a = a || gl.STATIC_DRAW;
        var n = gl.createBuffer();
        return gl.bindBuffer(t, n),
        gl.bufferData(t, e, a),
        n
    }
    function v(t, e) {
        return p(gl.ARRAY_BUFFER, t, e)
    }
    function m(t, e) {
        return p(gl.ELEMENT_ARRAY_BUFFER, t, e)
    }
    function g(t) {
        gl.bindBuffer(gl.ARRAY_BUFFER, t)
    }
    function M(t) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, t)
    }
    function x(t, e) {
        function a(a) {
            try {
                return t.getContext(a, e)
            } catch (t) {
                return null
            }
        }
        e = e || {},
        e = _.defaults(e, {
            antialias: !1,
            preserveDrawingBuffer: !0,
            extensions: [],
            shaderSources: []
        });
        var n = a("webgl") || a("experimental-webgl");
        return n && (bt = {},
        _.each(e.extensions, function(t) {
            bt[t] = n.getExtension(t)
        }),
        window.gl = n,
        h(e.shaderSources)),
        n
    }
    function b(t) {
        var e = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, e),
        t = t || {},
        t.width = t.width || t.size || 4,
        t.height = t.height || t.width,
        t.format = t.format || gl.RGBA,
        t.type = t.type || gl.UNSIGNED_BYTE,
        t.mag = t.mag || t.filter || gl.NEAREST,
        t.min = t.min || t.mag,
        t.wrapS = t.wrapS || t.wrap || gl.CLAMP_TO_EDGE,
        t.wrapT = t.wrapT || t.wrapS,
        t.dataFormat = t.dataFormat || t.format,
        t.data = t.data || null;
        if (gl.texImage2D(gl.TEXTURE_2D, 0, t.format, t.width, t.height, 0, t.dataFormat, t.type, t.data),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, t.min),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, t.mag),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, t.wrapS),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, t.wrapT),
        t.aniso) {
            var a = bt.EXT_texture_filter_anisotropic;
            a && gl.texParameteri(gl.TEXTURE_2D, a.TEXTURE_MAX_ANISOTROPY_EXT, t.aniso)
        }
        return e
    }
    function y(t, e) {
        e = e || {},
        e = _.defaults(e, {
            mipmap: !1,
            flip: !1,
            callback: null,
            filter: gl.LINEAR
        });
        var a = b(e)
          , n = new Image;
        return e.cors && (n.crossOrigin = "anonymous"),
        n.src = t,
        n.onload = function() {
            gl.bindTexture(gl.TEXTURE_2D, a),
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, e.flip ? 1 : 0),
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, n),
            e.mipmap && (gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR),
            gl.generateMipmap(gl.TEXTURE_2D)),
            e.callback && e.callback(a)
        }
        ,
        a
    }
    function w(t) {
        return _.times(16, t.create)
    }
    function S(t, e, a, n, r) {
        dt.sub(At, n, a),
        dt.sub(Et, r, a),
        dt.cross(Tt, e, Et);
        var o = dt.dot(At, Tt);
        if (Math.abs(o) < kt)
            return Lt;
        var i = 1 / o;
        dt.sub(Pt, t, a);
        var s = i * dt.dot(Pt, Tt);
        if (s < 0 || s > 1)
            return Lt;
        dt.cross(Rt, Pt, At);
        var l = i * dt.dot(e, Rt);
        return l < 0 || s + l > 1 ? Lt : i * dt.dot(Et, Rt)
    }
    function I(t, e, a) {
        this.x = t,
        this.y = e,
        this.z = a
    }
    function D(t, e) {
        var a, n, r, o, i, s = (t + e) * Bt, l = Math.floor(t + s), u = Math.floor(e + s), c = (l + u) * qt, d = t - l + c, f = e - u + c;
        d > f ? (o = 1,
        i = 0) : (o = 0,
        i = 1);
        var h = d - o + qt
          , _ = f - i + qt
          , p = d - 1 + 2 * qt
          , v = f - 1 + 2 * qt;
        l &= 255,
        u &= 255;
        var m = Ut[l + Nt[u]]
          , g = Ut[l + o + Nt[u + i]]
          , M = Ut[l + 1 + Nt[u + 1]]
          , x = .5 - d * d - f * f;
        x < 0 ? a = 0 : (x *= x,
        a = x * x * m.dot2(d, f));
        var b = .5 - h * h - _ * _;
        b < 0 ? n = 0 : (b *= b,
        n = b * b * g.dot2(h, _));
        var y = .5 - p * p - v * v;
        return y < 0 ? r = 0 : (y *= y,
        r = y * y * M.dot2(p, v)),
        70 * (a + n + r)
    }
    function F(t, e) {
        t[0] = t[2] = e[0],
        t[1] = t[3] = e[1];
        for (var a = 2; a < e.length; a += 2) {
            var n = e[a + 0]
              , r = e[a + 1];
            t[0] = Math.min(t[0], n),
            t[1] = Math.min(t[1], r),
            t[2] = Math.max(t[2], n),
            t[3] = Math.max(t[3], r)
        }
    }
    function A(t, e) {
        console.assert(8 === t.length);
        for (var a = t.length, n = 0, r = 0; r < a; r += 2) {
            var o = t[r + 0]
              , i = t[r + 1]
              , s = (r + 2) % a
              , l = t[s + 0]
              , u = t[s + 1]
              , c = l - o
              , d = u - i
              , f = -d
              , h = c
              , _ = -(f * o + h * i)
              , p = f < 0 ? 0 : 1
              , v = h < 0 ? 0 : 1
              , m = f * p + h * v + _;
            Ct[n++] = f,
            Ct[n++] = h,
            Ct[n++] = m
        }
        var g = ft.create();
        F(g, t);
        for (var o = ~~g[0], i = ~~g[1], l = ~~g[2], u = ~~g[3], M = i; M <= u; ++M)
            for (var x = o; x <= l; ++x) {
                for (var b = !0, y = 0, r = 0; r < 4; ++r) {
                    var f = Ct[y++]
                      , h = Ct[y++]
                      , m = Ct[y++]
                      , w = f * x + h * M + m;
                    if (w < 0) {
                        b = !1;
                        break
                    }
                }
                b && e(x, M)
            }
    }
    function E(t, e, a, n, r) {
        Gt[0] = n,
        Gt[1] = 0,
        Gt[2] = r,
        dt.transformMat4(Gt, Gt, a),
        t[e + 0] = Gt[0],
        t[e + 1] = -Gt[2]
    }
    function createAndBindTexture(t, e, a) {
        var n = gl.createTexture();
        return gl.bindTexture(gl.TEXTURE_2D, n),
        gl.texImage2D(gl.TEXTURE_2D, 0, t, e, a, 0, t, gl.UNSIGNED_BYTE, null),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE),
        n
    }

    // NOTE: loading texture from file??
    function P(t) {
        for (var e = new Uint8Array(4 * t.w * t.h), a = 0, n = 0, r = 0; r < t.h; ++r)
            for (var o = 0; o < t.w; ++o) {
                var i = t.data[n++]
                  , s = t.clut[i];
                e[a + 0] = Vt[31 & s],
                e[a + 1] = Vt[s >> 5 & 31],
                e[a + 2] = Vt[s >> 10 & 31];
                var l = 32768 & s;
                e[a + 3] = 0 == (32767 & s) ? l ? 255 : 0 : l ? 128 : 255,
                a += 4
            }
        return e
    }
    function R(t, e, a) {
        t[0] = e.getInt16(a + 0, !0),
        t[1] = -e.getInt16(a + 2, !0),
        t[2] = -e.getInt16(a + 4, !0),
        dt.transformMat4(t, t, re)
    }
    function k(t, e, a, n, r) {
        var o = t.models[e.model]
          , i = t.buffers[o.buffer]
          , s = re;
        lt.identity(s),
        lt.translate(s, s, [.5, 0, .5]),
        lt.scale(s, s, [.5 / 1024, .5 / 1024, .5 / 1024]),
        lt.rotateY(s, s, -.5 * e.rotate * Math.PI),
        dt.set(ae, a, r, 1 - n),
        dt.set(ne, 0, -1, 0);
        for (var l = new DataView(i.buffer), u = Yt, c = u * o.start, d = c + u * o.count, f = 1 / 0; c < d; ) {
            R(Jt, l, c + 0 * u),
            R(te, l, c + 1 * u),
            R(ee, l, c + 2 * u),
            c += 3 * u;
            var h = S(ae, ne, Jt, te, ee);
            h < 0 || h < f && (f = h)
        }
        return f >= 0 && (r = ae[1] + f * ne[1]),
        r
    }
    function L(t) {
        var e = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
        return t.replace(/#{\s*key\s*}/g, e)
    }
    function z(t, e) {
        var a, n, r, o, i, s, l = !1;
        e || (e = {}),
        a = e.debug || !1;
        try {
            r = se(),
            o = document.createRange(),
            i = document.getSelection(),
            s = document.createElement("span"),
            s.textContent = t,
            s.setAttribute("style", ["all: unset", "position: fixed", "top: 0", "clip: rect(0, 0, 0, 0)", "white-space: pre", "-webkit-user-select: text", "-moz-user-select: text", "-ms-user-select: text", "user-select: text"].join(";")),
            document.body.appendChild(s),
            o.selectNode(s),
            i.addRange(o);
            if (!document.execCommand("copy"))
                throw new Error("copy command was unsuccessful");
            l = !0
        } catch (r) {
            a && console.error("unable to copy using execCommand: ", r),
            a && console.warn("trying IE specific stuff");
            try {
                window.clipboardData.setData("text", t),
                l = !0
            } catch (r) {
                a && console.error("unable to copy using clipboardData: ", r),
                a && console.error("falling back to prompt"),
                n = L("message"in e ? e.message : le),
                window.prompt(n, t)
            }
        } finally {
            i && ("function" == typeof i.removeRange ? i.removeRange(o) : i.removeAllRanges()),
            s && document.body.removeChild(s),
            r()
        }
        return l
    }
    function O() {
        pe || (pe = v(_e),
        ve = y("images/packshots.jpg", {
            filter: gl.NEAREST,
            flip: !0
        }),
        me = xt("placard"))
    }
    function N(t, e) {
        var a = ["ogg", "m4a", "mp3"]
          , n = _.map(a, function(e) {
            return "sounds/" + t + "." + e
        });
        return new de({
            src: n,
            loop: e
        })
    }
    function U() {
        return Modernizr.touchevents
    }
    function B(t, e) {
        var a = {
            adeline: "1XwU8H6e8Ts",
            in_cold_blood: "rP0uuI80wuY",
            _3ww: "ZwBkXgWNs_M",
            house_of_the_rising_sun: "X1Knskoe15g",
            hit_me_like_that_snare: "sXQVj2mQS5I",
            deadcrush: "LqdSvVpv3Zk",
            last_year: "-OjkHRp2ti0",
            pleader: "tD__QQvknXU",
            kimmel_3ww: "5SHTsgAvS88",
            holland_in_cold_blood: "3sHa0bGGrw0"
        };
        switch (t) {
        case "yt":
            e = a[e] || e;
            for (var n = "https://www.youtube.com/embed/" + e + "?autoplay=1", r = arguments.length, o = Array(r > 2 ? r - 2 : 0), i = 2; i < r; i++)
                o[i - 2] = arguments[i];
            return o && (n += "&" + o),
            console.log("link_url:", n),
            n;
        case "altj":
            return "https://alt-j.lnk.to/" + e;
        case "pic":
            return "photos.html#" + e;
        case "gif":
            return "gifs.html#Atl-J-" + e
        }
    }
    var q = function(t, e) {
        if (!(t instanceof e))
            throw new TypeError("Cannot call a class as a function")
    }
      , C = function() {
        function t(t, e) {
            for (var a = 0; a < e.length; a++) {
                var n = e[a];
                n.enumerable = n.enumerable || !1,
                n.configurable = !0,
                "value"in n && (n.writable = !0),
                Object.defineProperty(t, n.key, n)
            }
        }
        return function(e, a, n) {
            return a && t(e.prototype, a),
            n && t(e, n),
            e
        }
    }()
      , G = function() {
        function t(t, e) {
            var a = []
              , n = !0
              , r = !1
              , o = void 0;
            try {
                for (var i, s = t[Symbol.iterator](); !(n = (i = s.next()).done) && (a.push(i.value),
                !e || a.length !== e); n = !0)
                    ;
            } catch (t) {
                r = !0,
                o = t
            } finally {
                try {
                    !n && s.return && s.return()
                } finally {
                    if (r)
                        throw o
                }
            }
            return a
        }
        return function(e, a) {
            if (Array.isArray(e))
                return e;
            if (Symbol.iterator in Object(e))
                return t(e, a);
            throw new TypeError("Invalid attempt to destructure non-iterable instance")
        }
    }()
      , Y = Math.PI / 180
      , X = (function() {
        function t(e) {
            q(this, t),
            this.ab = e,
            this.dv = new DataView(e),
            this.sp = 0,
            this.end = e.byteLength,
            this.sp_stack = []
        }
        C(t, [{
            key: "read_u8",
            value: function() {
                return this.dv.getUint8(this.sp++)
            }
        }, {
            key: "read_i8",
            value: function() {
                return this.dv.getInt8(this.sp++)
            }
        }, {
            key: "read_u16",
            value: function() {
                var t = this.dv.getUint16(this.sp, !0);
                return this.sp += 2,
                t
            }
        }, {
            key: "read_i16",
            value: function() {
                var t = this.dv.getInt16(this.sp, !0);
                return this.sp += 2,
                t
            }
        }, {
            key: "read_u32",
            value: function() {
                var t = this.dv.getUint32(this.sp, !0);
                return this.sp += 4,
                t
            }
        }, {
            key: "read_i32",
            value: function() {
                var t = this.dv.getInt32(this.sp, !0);
                return this.sp += 4,
                t
            }
        }, {
            key: "skip",
            value: function(t) {
                this.sp += t
            }
        }, {
            key: "seek",
            value: function(t) {
                this.sp = t
            }
        }, {
            key: "push",
            value: function() {
                this.sp_stack.push(this.sp)
            }
        }, {
            key: "pop",
            value: function() {
                console.assert(this.sp_stack.length),
                this.sp = this.sp_stack.pop()
            }
        }]),
        t
    }(),
    "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {})
      , V = {};
    V.EPSILON = 1e-6,
    V.ARRAY_TYPE = "undefined" != typeof Float32Array ? Float32Array : Array,
    V.RANDOM = Math.random,
    V.ENABLE_SIMD = !1,
    V.SIMD_AVAILABLE = V.ARRAY_TYPE === Float32Array && "SIMD"in X,
    V.USE_SIMD = V.ENABLE_SIMD && V.SIMD_AVAILABLE,
    V.setMatrixArrayType = function(t) {
        V.ARRAY_TYPE = t
    }
    ;
    var H = Math.PI / 180;
    V.toRadian = function(t) {
        return t * H
    }
    ,
    V.equals = function(t, e) {
        return Math.abs(t - e) <= V.EPSILON * Math.max(1, Math.abs(t), Math.abs(e))
    }
    ;
    var j = V
      , W = {};
    W.create = function() {
        var t = new j.ARRAY_TYPE(9);
        return t[0] = 1,
        t[1] = 0,
        t[2] = 0,
        t[3] = 0,
        t[4] = 1,
        t[5] = 0,
        t[6] = 0,
        t[7] = 0,
        t[8] = 1,
        t
    }
    ,
    W.fromMat4 = function(t, e) {
        return t[0] = e[0],
        t[1] = e[1],
        t[2] = e[2],
        t[3] = e[4],
        t[4] = e[5],
        t[5] = e[6],
        t[6] = e[8],
        t[7] = e[9],
        t[8] = e[10],
        t
    }
    ,
    W.clone = function(t) {
        var e = new j.ARRAY_TYPE(9);
        return e[0] = t[0],
        e[1] = t[1],
        e[2] = t[2],
        e[3] = t[3],
        e[4] = t[4],
        e[5] = t[5],
        e[6] = t[6],
        e[7] = t[7],
        e[8] = t[8],
        e
    }
    ,
    W.copy = function(t, e) {
        return t[0] = e[0],
        t[1] = e[1],
        t[2] = e[2],
        t[3] = e[3],
        t[4] = e[4],
        t[5] = e[5],
        t[6] = e[6],
        t[7] = e[7],
        t[8] = e[8],
        t
    }
    ,
    W.fromValues = function(t, e, a, n, r, o, i, s, l) {
        var u = new j.ARRAY_TYPE(9);
        return u[0] = t,
        u[1] = e,
        u[2] = a,
        u[3] = n,
        u[4] = r,
        u[5] = o,
        u[6] = i,
        u[7] = s,
        u[8] = l,
        u
    }
    ,
    W.set = function(t, e, a, n, r, o, i, s, l, u) {
        return t[0] = e,
        t[1] = a,
        t[2] = n,
        t[3] = r,
        t[4] = o,
        t[5] = i,
        t[6] = s,
        t[7] = l,
        t[8] = u,
        t
    }
    ,
    W.identity = function(t) {
        return t[0] = 1,
        t[1] = 0,
        t[2] = 0,
        t[3] = 0,
        t[4] = 1,
        t[5] = 0,
        t[6] = 0,
        t[7] = 0,
        t[8] = 1,
        t
    }
    ,
    W.transpose = function(t, e) {
        if (t === e) {
            var a = e[1]
              , n = e[2]
              , r = e[5];
            t[1] = e[3],
            t[2] = e[6],
            t[3] = a,
            t[5] = e[7],
            t[6] = n,
            t[7] = r
        } else
            t[0] = e[0],
            t[1] = e[3],
            t[2] = e[6],
            t[3] = e[1],
            t[4] = e[4],
            t[5] = e[7],
            t[6] = e[2],
            t[7] = e[5],
            t[8] = e[8];
        return t
    }
    ,
    W.invert = function(t, e) {
        var a = e[0]
          , n = e[1]
          , r = e[2]
          , o = e[3]
          , i = e[4]
          , s = e[5]
          , l = e[6]
          , u = e[7]
          , c = e[8]
          , d = c * i - s * u
          , f = -c * o + s * l
          , h = u * o - i * l
          , _ = a * d + n * f + r * h;
        return _ ? (_ = 1 / _,
        t[0] = d * _,
        t[1] = (-c * n + r * u) * _,
        t[2] = (s * n - r * i) * _,
        t[3] = f * _,
        t[4] = (c * a - r * l) * _,
        t[5] = (-s * a + r * o) * _,
        t[6] = h * _,
        t[7] = (-u * a + n * l) * _,
        t[8] = (i * a - n * o) * _,
        t) : null
    }
    ,
    W.adjoint = function(t, e) {
        var a = e[0]
          , n = e[1]
          , r = e[2]
          , o = e[3]
          , i = e[4]
          , s = e[5]
          , l = e[6]
          , u = e[7]
          , c = e[8];
        return t[0] = i * c - s * u,
        t[1] = r * u - n * c,
        t[2] = n * s - r * i,
        t[3] = s * l - o * c,
        t[4] = a * c - r * l,
        t[5] = r * o - a * s,
        t[6] = o * u - i * l,
        t[7] = n * l - a * u,
        t[8] = a * i - n * o,
        t
    }
    ,
    W.determinant = function(t) {
        var e = t[0]
          , a = t[1]
          , n = t[2]
          , r = t[3]
          , o = t[4]
          , i = t[5]
          , s = t[6]
          , l = t[7]
          , u = t[8];
        return e * (u * o - i * l) + a * (-u * r + i * s) + n * (l * r - o * s)
    }
    ,
    W.multiply = function(t, e, a) {
        var n = e[0]
          , r = e[1]
          , o = e[2]
          , i = e[3]
          , s = e[4]
          , l = e[5]
          , u = e[6]
          , c = e[7]
          , d = e[8]
          , f = a[0]
          , h = a[1]
          , _ = a[2]
          , p = a[3]
          , v = a[4]
          , m = a[5]
          , g = a[6]
          , M = a[7]
          , x = a[8];
        return t[0] = f * n + h * i + _ * u,
        t[1] = f * r + h * s + _ * c,
        t[2] = f * o + h * l + _ * d,
        t[3] = p * n + v * i + m * u,
        t[4] = p * r + v * s + m * c,
        t[5] = p * o + v * l + m * d,
        t[6] = g * n + M * i + x * u,
        t[7] = g * r + M * s + x * c,
        t[8] = g * o + M * l + x * d,
        t
    }
    ,
    W.mul = W.multiply,
    W.translate = function(t, e, a) {
        var n = e[0]
          , r = e[1]
          , o = e[2]
          , i = e[3]
          , s = e[4]
          , l = e[5]
          , u = e[6]
          , c = e[7]
          , d = e[8]
          , f = a[0]
          , h = a[1];
        return t[0] = n,
        t[1] = r,
        t[2] = o,
        t[3] = i,
        t[4] = s,
        t[5] = l,
        t[6] = f * n + h * i + u,
        t[7] = f * r + h * s + c,
        t[8] = f * o + h * l + d,
        t
    }
    ,
    W.rotate = function(t, e, a) {
        var n = e[0]
          , r = e[1]
          , o = e[2]
          , i = e[3]
          , s = e[4]
          , l = e[5]
          , u = e[6]
          , c = e[7]
          , d = e[8]
          , f = Math.sin(a)
          , h = Math.cos(a);
        return t[0] = h * n + f * i,
        t[1] = h * r + f * s,
        t[2] = h * o + f * l,
        t[3] = h * i - f * n,
        t[4] = h * s - f * r,
        t[5] = h * l - f * o,
        t[6] = u,
        t[7] = c,
        t[8] = d,
        t
    }
    ,
    W.scale = function(t, e, a) {
        var n = a[0]
          , r = a[1];
        return t[0] = n * e[0],
        t[1] = n * e[1],
        t[2] = n * e[2],
        t[3] = r * e[3],
        t[4] = r * e[4],
        t[5] = r * e[5],
        t[6] = e[6],
        t[7] = e[7],
        t[8] = e[8],
        t
    }
    ,
    W.fromTranslation = function(t, e) {
        return t[0] = 1,
        t[1] = 0,
        t[2] = 0,
        t[3] = 0,
        t[4] = 1,
        t[5] = 0,
        t[6] = e[0],
        t[7] = e[1],
        t[8] = 1,
        t
    }
    ,
    W.fromRotation = function(t, e) {
        var a = Math.sin(e)
          , n = Math.cos(e);
        return t[0] = n,
        t[1] = a,
        t[2] = 0,
        t[3] = -a,
        t[4] = n,
        t[5] = 0,
        t[6] = 0,
        t[7] = 0,
        t[8] = 1,
        t
    }
    ,
    W.fromScaling = function(t, e) {
        return t[0] = e[0],
        t[1] = 0,
        t[2] = 0,
        t[3] = 0,
        t[4] = e[1],
        t[5] = 0,
        t[6] = 0,
        t[7] = 0,
        t[8] = 1,
        t
    }
    ,
    W.fromMat2d = function(t, e) {
        return t[0] = e[0],
        t[1] = e[1],
        t[2] = 0,
        t[3] = e[2],
        t[4] = e[3],
        t[5] = 0,
        t[6] = e[4],
        t[7] = e[5],
        t[8] = 1,
        t
    }
    ,
    W.fromQuat = function(t, e) {
        var a = e[0]
          , n = e[1]
          , r = e[2]
          , o = e[3]
          , i = a + a
          , s = n + n
          , l = r + r
          , u = a * i
          , c = n * i
          , d = n * s
          , f = r * i
          , h = r * s
          , _ = r * l
          , p = o * i
          , v = o * s
          , m = o * l;
        return t[0] = 1 - d - _,
        t[3] = c - m,
        t[6] = f + v,
        t[1] = c + m,
        t[4] = 1 - u - _,
        t[7] = h - p,
        t[2] = f - v,
        t[5] = h + p,
        t[8] = 1 - u - d,
        t
    }
    ,
    W.normalFromMat4 = function(t, e) {
        var a = e[0]
          , n = e[1]
          , r = e[2]
          , o = e[3]
          , i = e[4]
          , s = e[5]
          , l = e[6]
          , u = e[7]
          , c = e[8]
          , d = e[9]
          , f = e[10]
          , h = e[11]
          , _ = e[12]
          , p = e[13]
          , v = e[14]
          , m = e[15]
          , g = a * s - n * i
          , M = a * l - r * i
          , x = a * u - o * i
          , b = n * l - r * s
          , y = n * u - o * s
          , w = r * u - o * l
          , S = c * p - d * _
          , I = c * v - f * _
          , D = c * m - h * _
          , F = d * v - f * p
          , A = d * m - h * p
          , E = f * m - h * v
          , T = g * E - M * A + x * F + b * D - y * I + w * S;
        return T ? (T = 1 / T,
        t[0] = (s * E - l * A + u * F) * T,
        t[1] = (l * D - i * E - u * I) * T,
        t[2] = (i * A - s * D + u * S) * T,
        t[3] = (r * A - n * E - o * F) * T,
        t[4] = (a * E - r * D + o * I) * T,
        t[5] = (n * D - a * A - o * S) * T,
        t[6] = (p * w - v * y + m * b) * T,
        t[7] = (v * x - _ * w - m * M) * T,
        t[8] = (_ * y - p * x + m * g) * T,
        t) : null
    }
    ,
    W.str = function(t) {
        return "mat3(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ")"
    }
    ,
    W.frob = function(t) {
        return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2))
    }
    ,
    W.add = function(t, e, a) {
        return t[0] = e[0] + a[0],
        t[1] = e[1] + a[1],
        t[2] = e[2] + a[2],
        t[3] = e[3] + a[3],
        t[4] = e[4] + a[4],
        t[5] = e[5] + a[5],
        t[6] = e[6] + a[6],
        t[7] = e[7] + a[7],
        t[8] = e[8] + a[8],
        t
    }
    ,
    W.subtract = function(t, e, a) {
        return t[0] = e[0] - a[0],
        t[1] = e[1] - a[1],
        t[2] = e[2] - a[2],
        t[3] = e[3] - a[3],
        t[4] = e[4] - a[4],
        t[5] = e[5] - a[5],
        t[6] = e[6] - a[6],
        t[7] = e[7] - a[7],
        t[8] = e[8] - a[8],
        t
    }
    ,
    W.sub = W.subtract,
    W.multiplyScalar = function(t, e, a) {
        return t[0] = e[0] * a,
        t[1] = e[1] * a,
        t[2] = e[2] * a,
        t[3] = e[3] * a,
        t[4] = e[4] * a,
        t[5] = e[5] * a,
        t[6] = e[6] * a,
        t[7] = e[7] * a,
        t[8] = e[8] * a,
        t
    }
    ,
    W.multiplyScalarAndAdd = function(t, e, a, n) {
        return t[0] = e[0] + a[0] * n,
        t[1] = e[1] + a[1] * n,
        t[2] = e[2] + a[2] * n,
        t[3] = e[3] + a[3] * n,
        t[4] = e[4] + a[4] * n,
        t[5] = e[5] + a[5] * n,
        t[6] = e[6] + a[6] * n,
        t[7] = e[7] + a[7] * n,
        t[8] = e[8] + a[8] * n,
        t
    }
    ,
    W.exactEquals = function(t, e) {
        return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3] && t[4] === e[4] && t[5] === e[5] && t[6] === e[6] && t[7] === e[7] && t[8] === e[8]
    }
    ,
    W.equals = function(t, e) {
        var a = t[0]
          , n = t[1]
          , r = t[2]
          , o = t[3]
          , i = t[4]
          , s = t[5]
          , l = t[6]
          , u = t[7]
          , c = t[8]
          , d = e[0]
          , f = e[1]
          , h = e[2]
          , _ = e[3]
          , p = e[4]
          , v = e[5]
          , m = t[6]
          , g = e[7]
          , M = e[8];
        return Math.abs(a - d) <= j.EPSILON * Math.max(1, Math.abs(a), Math.abs(d)) && Math.abs(n - f) <= j.EPSILON * Math.max(1, Math.abs(n), Math.abs(f)) && Math.abs(r - h) <= j.EPSILON * Math.max(1, Math.abs(r), Math.abs(h)) && Math.abs(o - _) <= j.EPSILON * Math.max(1, Math.abs(o), Math.abs(_)) && Math.abs(i - p) <= j.EPSILON * Math.max(1, Math.abs(i), Math.abs(p)) && Math.abs(s - v) <= j.EPSILON * Math.max(1, Math.abs(s), Math.abs(v)) && Math.abs(l - m) <= j.EPSILON * Math.max(1, Math.abs(l), Math.abs(m)) && Math.abs(u - g) <= j.EPSILON * Math.max(1, Math.abs(u), Math.abs(g)) && Math.abs(c - M) <= j.EPSILON * Math.max(1, Math.abs(c), Math.abs(M))
    }
    ;
    var Q = W
      , K = {
        scalar: {},
        SIMD: {}
    };
    K.create = function() {
        var t = new j.ARRAY_TYPE(16);
        return t[0] = 1,
        t[1] = 0,
        t[2] = 0,
        t[3] = 0,
        t[4] = 0,
        t[5] = 1,
        t[6] = 0,
        t[7] = 0,
        t[8] = 0,
        t[9] = 0,
        t[10] = 1,
        t[11] = 0,
        t[12] = 0,
        t[13] = 0,
        t[14] = 0,
        t[15] = 1,
        t
    }
    ,
    K.clone = function(t) {
        var e = new j.ARRAY_TYPE(16);
        return e[0] = t[0],
        e[1] = t[1],
        e[2] = t[2],
        e[3] = t[3],
        e[4] = t[4],
        e[5] = t[5],
        e[6] = t[6],
        e[7] = t[7],
        e[8] = t[8],
        e[9] = t[9],
        e[10] = t[10],
        e[11] = t[11],
        e[12] = t[12],
        e[13] = t[13],
        e[14] = t[14],
        e[15] = t[15],
        e
    }
    ,
    K.copy = function(t, e) {
        return t[0] = e[0],
        t[1] = e[1],
        t[2] = e[2],
        t[3] = e[3],
        t[4] = e[4],
        t[5] = e[5],
        t[6] = e[6],
        t[7] = e[7],
        t[8] = e[8],
        t[9] = e[9],
        t[10] = e[10],
        t[11] = e[11],
        t[12] = e[12],
        t[13] = e[13],
        t[14] = e[14],
        t[15] = e[15],
        t
    }
    ,
    K.fromValues = function(t, e, a, n, r, o, i, s, l, u, c, d, f, h, _, p) {
        var v = new j.ARRAY_TYPE(16);
        return v[0] = t,
        v[1] = e,
        v[2] = a,
        v[3] = n,
        v[4] = r,
        v[5] = o,
        v[6] = i,
        v[7] = s,
        v[8] = l,
        v[9] = u,
        v[10] = c,
        v[11] = d,
        v[12] = f,
        v[13] = h,
        v[14] = _,
        v[15] = p,
        v
    }
    ,
    K.set = function(t, e, a, n, r, o, i, s, l, u, c, d, f, h, _, p, v) {
        return t[0] = e,
        t[1] = a,
        t[2] = n,
        t[3] = r,
        t[4] = o,
        t[5] = i,
        t[6] = s,
        t[7] = l,
        t[8] = u,
        t[9] = c,
        t[10] = d,
        t[11] = f,
        t[12] = h,
        t[13] = _,
        t[14] = p,
        t[15] = v,
        t
    }
    ,
    K.identity = function(t) {
        return t[0] = 1,
        t[1] = 0,
        t[2] = 0,
        t[3] = 0,
        t[4] = 0,
        t[5] = 1,
        t[6] = 0,
        t[7] = 0,
        t[8] = 0,
        t[9] = 0,
        t[10] = 1,
        t[11] = 0,
        t[12] = 0,
        t[13] = 0,
        t[14] = 0,
        t[15] = 1,
        t
    }
    ,
    K.scalar.transpose = function(t, e) {
        if (t === e) {
            var a = e[1]
              , n = e[2]
              , r = e[3]
              , o = e[6]
              , i = e[7]
              , s = e[11];
            t[1] = e[4],
            t[2] = e[8],
            t[3] = e[12],
            t[4] = a,
            t[6] = e[9],
            t[7] = e[13],
            t[8] = n,
            t[9] = o,
            t[11] = e[14],
            t[12] = r,
            t[13] = i,
            t[14] = s
        } else
            t[0] = e[0],
            t[1] = e[4],
            t[2] = e[8],
            t[3] = e[12],
            t[4] = e[1],
            t[5] = e[5],
            t[6] = e[9],
            t[7] = e[13],
            t[8] = e[2],
            t[9] = e[6],
            t[10] = e[10],
            t[11] = e[14],
            t[12] = e[3],
            t[13] = e[7],
            t[14] = e[11],
            t[15] = e[15];
        return t
    }
    ,
    K.SIMD.transpose = function(t, e) {
        var a, n, r, o, i, s, l, u, c, d;
        return a = SIMD.Float32x4.load(e, 0),
        n = SIMD.Float32x4.load(e, 4),
        r = SIMD.Float32x4.load(e, 8),
        o = SIMD.Float32x4.load(e, 12),
        i = SIMD.Float32x4.shuffle(a, n, 0, 1, 4, 5),
        s = SIMD.Float32x4.shuffle(r, o, 0, 1, 4, 5),
        l = SIMD.Float32x4.shuffle(i, s, 0, 2, 4, 6),
        u = SIMD.Float32x4.shuffle(i, s, 1, 3, 5, 7),
        SIMD.Float32x4.store(t, 0, l),
        SIMD.Float32x4.store(t, 4, u),
        i = SIMD.Float32x4.shuffle(a, n, 2, 3, 6, 7),
        s = SIMD.Float32x4.shuffle(r, o, 2, 3, 6, 7),
        c = SIMD.Float32x4.shuffle(i, s, 0, 2, 4, 6),
        d = SIMD.Float32x4.shuffle(i, s, 1, 3, 5, 7),
        SIMD.Float32x4.store(t, 8, c),
        SIMD.Float32x4.store(t, 12, d),
        t
    }
    ,
    K.transpose = j.USE_SIMD ? K.SIMD.transpose : K.scalar.transpose,
    K.scalar.invert = function(t, e) {
        var a = e[0]
          , n = e[1]
          , r = e[2]
          , o = e[3]
          , i = e[4]
          , s = e[5]
          , l = e[6]
          , u = e[7]
          , c = e[8]
          , d = e[9]
          , f = e[10]
          , h = e[11]
          , _ = e[12]
          , p = e[13]
          , v = e[14]
          , m = e[15]
          , g = a * s - n * i
          , M = a * l - r * i
          , x = a * u - o * i
          , b = n * l - r * s
          , y = n * u - o * s
          , w = r * u - o * l
          , S = c * p - d * _
          , I = c * v - f * _
          , D = c * m - h * _
          , F = d * v - f * p
          , A = d * m - h * p
          , E = f * m - h * v
          , T = g * E - M * A + x * F + b * D - y * I + w * S;
        return T ? (T = 1 / T,
        t[0] = (s * E - l * A + u * F) * T,
        t[1] = (r * A - n * E - o * F) * T,
        t[2] = (p * w - v * y + m * b) * T,
        t[3] = (f * y - d * w - h * b) * T,
        t[4] = (l * D - i * E - u * I) * T,
        t[5] = (a * E - r * D + o * I) * T,
        t[6] = (v * x - _ * w - m * M) * T,
        t[7] = (c * w - f * x + h * M) * T,
        t[8] = (i * A - s * D + u * S) * T,
        t[9] = (n * D - a * A - o * S) * T,
        t[10] = (_ * y - p * x + m * g) * T,
        t[11] = (d * x - c * y - h * g) * T,
        t[12] = (s * I - i * F - l * S) * T,
        t[13] = (a * F - n * I + r * S) * T,
        t[14] = (p * M - _ * b - v * g) * T,
        t[15] = (c * b - d * M + f * g) * T,
        t) : null
    }
    ,
    K.SIMD.invert = function(t, e) {
        var a, n, r, o, i, s, l, u, c, d, f = SIMD.Float32x4.load(e, 0), h = SIMD.Float32x4.load(e, 4), _ = SIMD.Float32x4.load(e, 8), p = SIMD.Float32x4.load(e, 12);
        return i = SIMD.Float32x4.shuffle(f, h, 0, 1, 4, 5),
        n = SIMD.Float32x4.shuffle(_, p, 0, 1, 4, 5),
        a = SIMD.Float32x4.shuffle(i, n, 0, 2, 4, 6),
        n = SIMD.Float32x4.shuffle(n, i, 1, 3, 5, 7),
        i = SIMD.Float32x4.shuffle(f, h, 2, 3, 6, 7),
        o = SIMD.Float32x4.shuffle(_, p, 2, 3, 6, 7),
        r = SIMD.Float32x4.shuffle(i, o, 0, 2, 4, 6),
        o = SIMD.Float32x4.shuffle(o, i, 1, 3, 5, 7),
        i = SIMD.Float32x4.mul(r, o),
        i = SIMD.Float32x4.swizzle(i, 1, 0, 3, 2),
        s = SIMD.Float32x4.mul(n, i),
        l = SIMD.Float32x4.mul(a, i),
        i = SIMD.Float32x4.swizzle(i, 2, 3, 0, 1),
        s = SIMD.Float32x4.sub(SIMD.Float32x4.mul(n, i), s),
        l = SIMD.Float32x4.sub(SIMD.Float32x4.mul(a, i), l),
        l = SIMD.Float32x4.swizzle(l, 2, 3, 0, 1),
        i = SIMD.Float32x4.mul(n, r),
        i = SIMD.Float32x4.swizzle(i, 1, 0, 3, 2),
        s = SIMD.Float32x4.add(SIMD.Float32x4.mul(o, i), s),
        c = SIMD.Float32x4.mul(a, i),
        i = SIMD.Float32x4.swizzle(i, 2, 3, 0, 1),
        s = SIMD.Float32x4.sub(s, SIMD.Float32x4.mul(o, i)),
        c = SIMD.Float32x4.sub(SIMD.Float32x4.mul(a, i), c),
        c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1),
        i = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(n, 2, 3, 0, 1), o),
        i = SIMD.Float32x4.swizzle(i, 1, 0, 3, 2),
        r = SIMD.Float32x4.swizzle(r, 2, 3, 0, 1),
        s = SIMD.Float32x4.add(SIMD.Float32x4.mul(r, i), s),
        u = SIMD.Float32x4.mul(a, i),
        i = SIMD.Float32x4.swizzle(i, 2, 3, 0, 1),
        s = SIMD.Float32x4.sub(s, SIMD.Float32x4.mul(r, i)),
        u = SIMD.Float32x4.sub(SIMD.Float32x4.mul(a, i), u),
        u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1),
        i = SIMD.Float32x4.mul(a, n),
        i = SIMD.Float32x4.swizzle(i, 1, 0, 3, 2),
        u = SIMD.Float32x4.add(SIMD.Float32x4.mul(o, i), u),
        c = SIMD.Float32x4.sub(SIMD.Float32x4.mul(r, i), c),
        i = SIMD.Float32x4.swizzle(i, 2, 3, 0, 1),
        u = SIMD.Float32x4.sub(SIMD.Float32x4.mul(o, i), u),
        c = SIMD.Float32x4.sub(c, SIMD.Float32x4.mul(r, i)),
        i = SIMD.Float32x4.mul(a, o),
        i = SIMD.Float32x4.swizzle(i, 1, 0, 3, 2),
        l = SIMD.Float32x4.sub(l, SIMD.Float32x4.mul(r, i)),
        u = SIMD.Float32x4.add(SIMD.Float32x4.mul(n, i), u),
        i = SIMD.Float32x4.swizzle(i, 2, 3, 0, 1),
        l = SIMD.Float32x4.add(SIMD.Float32x4.mul(r, i), l),
        u = SIMD.Float32x4.sub(u, SIMD.Float32x4.mul(n, i)),
        i = SIMD.Float32x4.mul(a, r),
        i = SIMD.Float32x4.swizzle(i, 1, 0, 3, 2),
        l = SIMD.Float32x4.add(SIMD.Float32x4.mul(o, i), l),
        c = SIMD.Float32x4.sub(c, SIMD.Float32x4.mul(n, i)),
        i = SIMD.Float32x4.swizzle(i, 2, 3, 0, 1),
        l = SIMD.Float32x4.sub(l, SIMD.Float32x4.mul(o, i)),
        c = SIMD.Float32x4.add(SIMD.Float32x4.mul(n, i), c),
        d = SIMD.Float32x4.mul(a, s),
        d = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(d, 2, 3, 0, 1), d),
        d = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(d, 1, 0, 3, 2), d),
        i = SIMD.Float32x4.reciprocalApproximation(d),
        d = SIMD.Float32x4.sub(SIMD.Float32x4.add(i, i), SIMD.Float32x4.mul(d, SIMD.Float32x4.mul(i, i))),
        (d = SIMD.Float32x4.swizzle(d, 0, 0, 0, 0)) ? (SIMD.Float32x4.store(t, 0, SIMD.Float32x4.mul(d, s)),
        SIMD.Float32x4.store(t, 4, SIMD.Float32x4.mul(d, l)),
        SIMD.Float32x4.store(t, 8, SIMD.Float32x4.mul(d, u)),
        SIMD.Float32x4.store(t, 12, SIMD.Float32x4.mul(d, c)),
        t) : null
    }
    ,
    K.invert = j.USE_SIMD ? K.SIMD.invert : K.scalar.invert,
    K.scalar.adjoint = function(t, e) {
        var a = e[0]
          , n = e[1]
          , r = e[2]
          , o = e[3]
          , i = e[4]
          , s = e[5]
          , l = e[6]
          , u = e[7]
          , c = e[8]
          , d = e[9]
          , f = e[10]
          , h = e[11]
          , _ = e[12]
          , p = e[13]
          , v = e[14]
          , m = e[15];
        return t[0] = s * (f * m - h * v) - d * (l * m - u * v) + p * (l * h - u * f),
        t[1] = -(n * (f * m - h * v) - d * (r * m - o * v) + p * (r * h - o * f)),
        t[2] = n * (l * m - u * v) - s * (r * m - o * v) + p * (r * u - o * l),
        t[3] = -(n * (l * h - u * f) - s * (r * h - o * f) + d * (r * u - o * l)),
        t[4] = -(i * (f * m - h * v) - c * (l * m - u * v) + _ * (l * h - u * f)),
        t[5] = a * (f * m - h * v) - c * (r * m - o * v) + _ * (r * h - o * f),
        t[6] = -(a * (l * m - u * v) - i * (r * m - o * v) + _ * (r * u - o * l)),
        t[7] = a * (l * h - u * f) - i * (r * h - o * f) + c * (r * u - o * l),
        t[8] = i * (d * m - h * p) - c * (s * m - u * p) + _ * (s * h - u * d),
        t[9] = -(a * (d * m - h * p) - c * (n * m - o * p) + _ * (n * h - o * d)),
        t[10] = a * (s * m - u * p) - i * (n * m - o * p) + _ * (n * u - o * s),
        t[11] = -(a * (s * h - u * d) - i * (n * h - o * d) + c * (n * u - o * s)),
        t[12] = -(i * (d * v - f * p) - c * (s * v - l * p) + _ * (s * f - l * d)),
        t[13] = a * (d * v - f * p) - c * (n * v - r * p) + _ * (n * f - r * d),
        t[14] = -(a * (s * v - l * p) - i * (n * v - r * p) + _ * (n * l - r * s)),
        t[15] = a * (s * f - l * d) - i * (n * f - r * d) + c * (n * l - r * s),
        t
    }
    ,
    K.SIMD.adjoint = function(t, e) {
        var a, n, r, o, i, s, l, u, c, d, f, h, _, a = SIMD.Float32x4.load(e, 0), n = SIMD.Float32x4.load(e, 4), r = SIMD.Float32x4.load(e, 8), o = SIMD.Float32x4.load(e, 12);
        return c = SIMD.Float32x4.shuffle(a, n, 0, 1, 4, 5),
        s = SIMD.Float32x4.shuffle(r, o, 0, 1, 4, 5),
        i = SIMD.Float32x4.shuffle(c, s, 0, 2, 4, 6),
        s = SIMD.Float32x4.shuffle(s, c, 1, 3, 5, 7),
        c = SIMD.Float32x4.shuffle(a, n, 2, 3, 6, 7),
        u = SIMD.Float32x4.shuffle(r, o, 2, 3, 6, 7),
        l = SIMD.Float32x4.shuffle(c, u, 0, 2, 4, 6),
        u = SIMD.Float32x4.shuffle(u, c, 1, 3, 5, 7),
        c = SIMD.Float32x4.mul(l, u),
        c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2),
        d = SIMD.Float32x4.mul(s, c),
        f = SIMD.Float32x4.mul(i, c),
        c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1),
        d = SIMD.Float32x4.sub(SIMD.Float32x4.mul(s, c), d),
        f = SIMD.Float32x4.sub(SIMD.Float32x4.mul(i, c), f),
        f = SIMD.Float32x4.swizzle(f, 2, 3, 0, 1),
        c = SIMD.Float32x4.mul(s, l),
        c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2),
        d = SIMD.Float32x4.add(SIMD.Float32x4.mul(u, c), d),
        _ = SIMD.Float32x4.mul(i, c),
        c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1),
        d = SIMD.Float32x4.sub(d, SIMD.Float32x4.mul(u, c)),
        _ = SIMD.Float32x4.sub(SIMD.Float32x4.mul(i, c), _),
        _ = SIMD.Float32x4.swizzle(_, 2, 3, 0, 1),
        c = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 2, 3, 0, 1), u),
        c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2),
        l = SIMD.Float32x4.swizzle(l, 2, 3, 0, 1),
        d = SIMD.Float32x4.add(SIMD.Float32x4.mul(l, c), d),
        h = SIMD.Float32x4.mul(i, c),
        c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1),
        d = SIMD.Float32x4.sub(d, SIMD.Float32x4.mul(l, c)),
        h = SIMD.Float32x4.sub(SIMD.Float32x4.mul(i, c), h),
        h = SIMD.Float32x4.swizzle(h, 2, 3, 0, 1),
        c = SIMD.Float32x4.mul(i, s),
        c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2),
        h = SIMD.Float32x4.add(SIMD.Float32x4.mul(u, c), h),
        _ = SIMD.Float32x4.sub(SIMD.Float32x4.mul(l, c), _),
        c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1),
        h = SIMD.Float32x4.sub(SIMD.Float32x4.mul(u, c), h),
        _ = SIMD.Float32x4.sub(_, SIMD.Float32x4.mul(l, c)),
        c = SIMD.Float32x4.mul(i, u),
        c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2),
        f = SIMD.Float32x4.sub(f, SIMD.Float32x4.mul(l, c)),
        h = SIMD.Float32x4.add(SIMD.Float32x4.mul(s, c), h),
        c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1),
        f = SIMD.Float32x4.add(SIMD.Float32x4.mul(l, c), f),
        h = SIMD.Float32x4.sub(h, SIMD.Float32x4.mul(s, c)),
        c = SIMD.Float32x4.mul(i, l),
        c = SIMD.Float32x4.swizzle(c, 1, 0, 3, 2),
        f = SIMD.Float32x4.add(SIMD.Float32x4.mul(u, c), f),
        _ = SIMD.Float32x4.sub(_, SIMD.Float32x4.mul(s, c)),
        c = SIMD.Float32x4.swizzle(c, 2, 3, 0, 1),
        f = SIMD.Float32x4.sub(f, SIMD.Float32x4.mul(u, c)),
        _ = SIMD.Float32x4.add(SIMD.Float32x4.mul(s, c), _),
        SIMD.Float32x4.store(t, 0, d),
        SIMD.Float32x4.store(t, 4, f),
        SIMD.Float32x4.store(t, 8, h),
        SIMD.Float32x4.store(t, 12, _),
        t
    }
    ,
    K.adjoint = j.USE_SIMD ? K.SIMD.adjoint : K.scalar.adjoint,
    K.determinant = function(t) {
        var e = t[0]
          , a = t[1]
          , n = t[2]
          , r = t[3]
          , o = t[4]
          , i = t[5]
          , s = t[6]
          , l = t[7]
          , u = t[8]
          , c = t[9]
          , d = t[10]
          , f = t[11]
          , h = t[12]
          , _ = t[13]
          , p = t[14]
          , v = t[15];
        return (e * i - a * o) * (d * v - f * p) - (e * s - n * o) * (c * v - f * _) + (e * l - r * o) * (c * p - d * _) + (a * s - n * i) * (u * v - f * h) - (a * l - r * i) * (u * p - d * h) + (n * l - r * s) * (u * _ - c * h)
    }
    ,
    K.SIMD.multiply = function(t, e, a) {
        var n = SIMD.Float32x4.load(e, 0)
          , r = SIMD.Float32x4.load(e, 4)
          , o = SIMD.Float32x4.load(e, 8)
          , i = SIMD.Float32x4.load(e, 12)
          , s = SIMD.Float32x4.load(a, 0)
          , l = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 0, 0, 0, 0), n), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 1, 1, 1, 1), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 2, 2, 2, 2), o), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 3, 3, 3, 3), i))));
        SIMD.Float32x4.store(t, 0, l);
        var u = SIMD.Float32x4.load(a, 4)
          , c = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(u, 0, 0, 0, 0), n), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(u, 1, 1, 1, 1), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(u, 2, 2, 2, 2), o), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(u, 3, 3, 3, 3), i))));
        SIMD.Float32x4.store(t, 4, c);
        var d = SIMD.Float32x4.load(a, 8)
          , f = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d, 0, 0, 0, 0), n), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d, 1, 1, 1, 1), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d, 2, 2, 2, 2), o), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(d, 3, 3, 3, 3), i))));
        SIMD.Float32x4.store(t, 8, f);
        var h = SIMD.Float32x4.load(a, 12)
          , _ = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(h, 0, 0, 0, 0), n), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(h, 1, 1, 1, 1), r), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(h, 2, 2, 2, 2), o), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(h, 3, 3, 3, 3), i))));
        return SIMD.Float32x4.store(t, 12, _),
        t
    }
    ,
    K.scalar.multiply = function(t, e, a) {
        var n = e[0]
          , r = e[1]
          , o = e[2]
          , i = e[3]
          , s = e[4]
          , l = e[5]
          , u = e[6]
          , c = e[7]
          , d = e[8]
          , f = e[9]
          , h = e[10]
          , _ = e[11]
          , p = e[12]
          , v = e[13]
          , m = e[14]
          , g = e[15]
          , M = a[0]
          , x = a[1]
          , b = a[2]
          , y = a[3];
        return t[0] = M * n + x * s + b * d + y * p,
        t[1] = M * r + x * l + b * f + y * v,
        t[2] = M * o + x * u + b * h + y * m,
        t[3] = M * i + x * c + b * _ + y * g,
        M = a[4],
        x = a[5],
        b = a[6],
        y = a[7],
        t[4] = M * n + x * s + b * d + y * p,
        t[5] = M * r + x * l + b * f + y * v,
        t[6] = M * o + x * u + b * h + y * m,
        t[7] = M * i + x * c + b * _ + y * g,
        M = a[8],
        x = a[9],
        b = a[10],
        y = a[11],
        t[8] = M * n + x * s + b * d + y * p,
        t[9] = M * r + x * l + b * f + y * v,
        t[10] = M * o + x * u + b * h + y * m,
        t[11] = M * i + x * c + b * _ + y * g,
        M = a[12],
        x = a[13],
        b = a[14],
        y = a[15],
        t[12] = M * n + x * s + b * d + y * p,
        t[13] = M * r + x * l + b * f + y * v,
        t[14] = M * o + x * u + b * h + y * m,
        t[15] = M * i + x * c + b * _ + y * g,
        t
    }
    ,
    K.multiply = j.USE_SIMD ? K.SIMD.multiply : K.scalar.multiply,
    K.mul = K.multiply,
    K.scalar.translate = function(t, e, a) {
        var n, r, o, i, s, l, u, c, d, f, h, _, p = a[0], v = a[1], m = a[2];
        return e === t ? (t[12] = e[0] * p + e[4] * v + e[8] * m + e[12],
        t[13] = e[1] * p + e[5] * v + e[9] * m + e[13],
        t[14] = e[2] * p + e[6] * v + e[10] * m + e[14],
        t[15] = e[3] * p + e[7] * v + e[11] * m + e[15]) : (n = e[0],
        r = e[1],
        o = e[2],
        i = e[3],
        s = e[4],
        l = e[5],
        u = e[6],
        c = e[7],
        d = e[8],
        f = e[9],
        h = e[10],
        _ = e[11],
        t[0] = n,
        t[1] = r,
        t[2] = o,
        t[3] = i,
        t[4] = s,
        t[5] = l,
        t[6] = u,
        t[7] = c,
        t[8] = d,
        t[9] = f,
        t[10] = h,
        t[11] = _,
        t[12] = n * p + s * v + d * m + e[12],
        t[13] = r * p + l * v + f * m + e[13],
        t[14] = o * p + u * v + h * m + e[14],
        t[15] = i * p + c * v + _ * m + e[15]),
        t
    }
    ,
    K.SIMD.translate = function(t, e, a) {
        var n = SIMD.Float32x4.load(e, 0)
          , r = SIMD.Float32x4.load(e, 4)
          , o = SIMD.Float32x4.load(e, 8)
          , i = SIMD.Float32x4.load(e, 12)
          , s = SIMD.Float32x4(a[0], a[1], a[2], 0);
        e !== t && (t[0] = e[0],
        t[1] = e[1],
        t[2] = e[2],
        t[3] = e[3],
        t[4] = e[4],
        t[5] = e[5],
        t[6] = e[6],
        t[7] = e[7],
        t[8] = e[8],
        t[9] = e[9],
        t[10] = e[10],
        t[11] = e[11]),
        n = SIMD.Float32x4.mul(n, SIMD.Float32x4.swizzle(s, 0, 0, 0, 0)),
        r = SIMD.Float32x4.mul(r, SIMD.Float32x4.swizzle(s, 1, 1, 1, 1)),
        o = SIMD.Float32x4.mul(o, SIMD.Float32x4.swizzle(s, 2, 2, 2, 2));
        var l = SIMD.Float32x4.add(n, SIMD.Float32x4.add(r, SIMD.Float32x4.add(o, i)));
        return SIMD.Float32x4.store(t, 12, l),
        t
    }
    ,
    K.translate = j.USE_SIMD ? K.SIMD.translate : K.scalar.translate,
    K.scalar.scale = function(t, e, a) {
        var n = a[0]
          , r = a[1]
          , o = a[2];
        return t[0] = e[0] * n,
        t[1] = e[1] * n,
        t[2] = e[2] * n,
        t[3] = e[3] * n,
        t[4] = e[4] * r,
        t[5] = e[5] * r,
        t[6] = e[6] * r,
        t[7] = e[7] * r,
        t[8] = e[8] * o,
        t[9] = e[9] * o,
        t[10] = e[10] * o,
        t[11] = e[11] * o,
        t[12] = e[12],
        t[13] = e[13],
        t[14] = e[14],
        t[15] = e[15],
        t
    }
    ,
    K.SIMD.scale = function(t, e, a) {
        var n, r, o, i = SIMD.Float32x4(a[0], a[1], a[2], 0);
        return n = SIMD.Float32x4.load(e, 0),
        SIMD.Float32x4.store(t, 0, SIMD.Float32x4.mul(n, SIMD.Float32x4.swizzle(i, 0, 0, 0, 0))),
        r = SIMD.Float32x4.load(e, 4),
        SIMD.Float32x4.store(t, 4, SIMD.Float32x4.mul(r, SIMD.Float32x4.swizzle(i, 1, 1, 1, 1))),
        o = SIMD.Float32x4.load(e, 8),
        SIMD.Float32x4.store(t, 8, SIMD.Float32x4.mul(o, SIMD.Float32x4.swizzle(i, 2, 2, 2, 2))),
        t[12] = e[12],
        t[13] = e[13],
        t[14] = e[14],
        t[15] = e[15],
        t
    }
    ,
    K.scale = j.USE_SIMD ? K.SIMD.scale : K.scalar.scale,
    K.rotate = function(t, e, a, n) {
        var r, o, i, s, l, u, c, d, f, h, _, p, v, m, g, M, x, b, y, w, S, I, D, F, A = n[0], E = n[1], T = n[2], P = Math.sqrt(A * A + E * E + T * T);
        return Math.abs(P) < j.EPSILON ? null : (P = 1 / P,
        A *= P,
        E *= P,
        T *= P,
        r = Math.sin(a),
        o = Math.cos(a),
        i = 1 - o,
        s = e[0],
        l = e[1],
        u = e[2],
        c = e[3],
        d = e[4],
        f = e[5],
        h = e[6],
        _ = e[7],
        p = e[8],
        v = e[9],
        m = e[10],
        g = e[11],
        M = A * A * i + o,
        x = E * A * i + T * r,
        b = T * A * i - E * r,
        y = A * E * i - T * r,
        w = E * E * i + o,
        S = T * E * i + A * r,
        I = A * T * i + E * r,
        D = E * T * i - A * r,
        F = T * T * i + o,
        t[0] = s * M + d * x + p * b,
        t[1] = l * M + f * x + v * b,
        t[2] = u * M + h * x + m * b,
        t[3] = c * M + _ * x + g * b,
        t[4] = s * y + d * w + p * S,
        t[5] = l * y + f * w + v * S,
        t[6] = u * y + h * w + m * S,
        t[7] = c * y + _ * w + g * S,
        t[8] = s * I + d * D + p * F,
        t[9] = l * I + f * D + v * F,
        t[10] = u * I + h * D + m * F,
        t[11] = c * I + _ * D + g * F,
        e !== t && (t[12] = e[12],
        t[13] = e[13],
        t[14] = e[14],
        t[15] = e[15]),
        t)
    }
    ,
    K.scalar.rotateX = function(t, e, a) {
        var n = Math.sin(a)
          , r = Math.cos(a)
          , o = e[4]
          , i = e[5]
          , s = e[6]
          , l = e[7]
          , u = e[8]
          , c = e[9]
          , d = e[10]
          , f = e[11];
        return e !== t && (t[0] = e[0],
        t[1] = e[1],
        t[2] = e[2],
        t[3] = e[3],
        t[12] = e[12],
        t[13] = e[13],
        t[14] = e[14],
        t[15] = e[15]),
        t[4] = o * r + u * n,
        t[5] = i * r + c * n,
        t[6] = s * r + d * n,
        t[7] = l * r + f * n,
        t[8] = u * r - o * n,
        t[9] = c * r - i * n,
        t[10] = d * r - s * n,
        t[11] = f * r - l * n,
        t
    }
    ,
    K.SIMD.rotateX = function(t, e, a) {
        var n = SIMD.Float32x4.splat(Math.sin(a))
          , r = SIMD.Float32x4.splat(Math.cos(a));
        e !== t && (t[0] = e[0],
        t[1] = e[1],
        t[2] = e[2],
        t[3] = e[3],
        t[12] = e[12],
        t[13] = e[13],
        t[14] = e[14],
        t[15] = e[15]);
        var o = SIMD.Float32x4.load(e, 4)
          , i = SIMD.Float32x4.load(e, 8);
        return SIMD.Float32x4.store(t, 4, SIMD.Float32x4.add(SIMD.Float32x4.mul(o, r), SIMD.Float32x4.mul(i, n))),
        SIMD.Float32x4.store(t, 8, SIMD.Float32x4.sub(SIMD.Float32x4.mul(i, r), SIMD.Float32x4.mul(o, n))),
        t
    }
    ,
    K.rotateX = j.USE_SIMD ? K.SIMD.rotateX : K.scalar.rotateX,
    K.scalar.rotateY = function(t, e, a) {
        var n = Math.sin(a)
          , r = Math.cos(a)
          , o = e[0]
          , i = e[1]
          , s = e[2]
          , l = e[3]
          , u = e[8]
          , c = e[9]
          , d = e[10]
          , f = e[11];
        return e !== t && (t[4] = e[4],
        t[5] = e[5],
        t[6] = e[6],
        t[7] = e[7],
        t[12] = e[12],
        t[13] = e[13],
        t[14] = e[14],
        t[15] = e[15]),
        t[0] = o * r - u * n,
        t[1] = i * r - c * n,
        t[2] = s * r - d * n,
        t[3] = l * r - f * n,
        t[8] = o * n + u * r,
        t[9] = i * n + c * r,
        t[10] = s * n + d * r,
        t[11] = l * n + f * r,
        t
    }
    ,
    K.SIMD.rotateY = function(t, e, a) {
        var n = SIMD.Float32x4.splat(Math.sin(a))
          , r = SIMD.Float32x4.splat(Math.cos(a));
        e !== t && (t[4] = e[4],
        t[5] = e[5],
        t[6] = e[6],
        t[7] = e[7],
        t[12] = e[12],
        t[13] = e[13],
        t[14] = e[14],
        t[15] = e[15]);
        var o = SIMD.Float32x4.load(e, 0)
          , i = SIMD.Float32x4.load(e, 8);
        return SIMD.Float32x4.store(t, 0, SIMD.Float32x4.sub(SIMD.Float32x4.mul(o, r), SIMD.Float32x4.mul(i, n))),
        SIMD.Float32x4.store(t, 8, SIMD.Float32x4.add(SIMD.Float32x4.mul(o, n), SIMD.Float32x4.mul(i, r))),
        t
    }
    ,
    K.rotateY = j.USE_SIMD ? K.SIMD.rotateY : K.scalar.rotateY,
    K.scalar.rotateZ = function(t, e, a) {
        var n = Math.sin(a)
          , r = Math.cos(a)
          , o = e[0]
          , i = e[1]
          , s = e[2]
          , l = e[3]
          , u = e[4]
          , c = e[5]
          , d = e[6]
          , f = e[7];
        return e !== t && (t[8] = e[8],
        t[9] = e[9],
        t[10] = e[10],
        t[11] = e[11],
        t[12] = e[12],
        t[13] = e[13],
        t[14] = e[14],
        t[15] = e[15]),
        t[0] = o * r + u * n,
        t[1] = i * r + c * n,
        t[2] = s * r + d * n,
        t[3] = l * r + f * n,
        t[4] = u * r - o * n,
        t[5] = c * r - i * n,
        t[6] = d * r - s * n,
        t[7] = f * r - l * n,
        t
    }
    ,
    K.SIMD.rotateZ = function(t, e, a) {
        var n = SIMD.Float32x4.splat(Math.sin(a))
          , r = SIMD.Float32x4.splat(Math.cos(a));
        e !== t && (t[8] = e[8],
        t[9] = e[9],
        t[10] = e[10],
        t[11] = e[11],
        t[12] = e[12],
        t[13] = e[13],
        t[14] = e[14],
        t[15] = e[15]);
        var o = SIMD.Float32x4.load(e, 0)
          , i = SIMD.Float32x4.load(e, 4);
        return SIMD.Float32x4.store(t, 0, SIMD.Float32x4.add(SIMD.Float32x4.mul(o, r), SIMD.Float32x4.mul(i, n))),
        SIMD.Float32x4.store(t, 4, SIMD.Float32x4.sub(SIMD.Float32x4.mul(i, r), SIMD.Float32x4.mul(o, n))),
        t
    }
    ,
    K.rotateZ = j.USE_SIMD ? K.SIMD.rotateZ : K.scalar.rotateZ,
    K.fromTranslation = function(t, e) {
        return t[0] = 1,
        t[1] = 0,
        t[2] = 0,
        t[3] = 0,
        t[4] = 0,
        t[5] = 1,
        t[6] = 0,
        t[7] = 0,
        t[8] = 0,
        t[9] = 0,
        t[10] = 1,
        t[11] = 0,
        t[12] = e[0],
        t[13] = e[1],
        t[14] = e[2],
        t[15] = 1,
        t
    }
    ,
    K.fromScaling = function(t, e) {
        return t[0] = e[0],
        t[1] = 0,
        t[2] = 0,
        t[3] = 0,
        t[4] = 0,
        t[5] = e[1],
        t[6] = 0,
        t[7] = 0,
        t[8] = 0,
        t[9] = 0,
        t[10] = e[2],
        t[11] = 0,
        t[12] = 0,
        t[13] = 0,
        t[14] = 0,
        t[15] = 1,
        t
    }
    ,
    K.fromRotation = function(t, e, a) {
        var n, r, o, i = a[0], s = a[1], l = a[2], u = Math.sqrt(i * i + s * s + l * l);
        return Math.abs(u) < j.EPSILON ? null : (u = 1 / u,
        i *= u,
        s *= u,
        l *= u,
        n = Math.sin(e),
        r = Math.cos(e),
        o = 1 - r,
        t[0] = i * i * o + r,
        t[1] = s * i * o + l * n,
        t[2] = l * i * o - s * n,
        t[3] = 0,
        t[4] = i * s * o - l * n,
        t[5] = s * s * o + r,
        t[6] = l * s * o + i * n,
        t[7] = 0,
        t[8] = i * l * o + s * n,
        t[9] = s * l * o - i * n,
        t[10] = l * l * o + r,
        t[11] = 0,
        t[12] = 0,
        t[13] = 0,
        t[14] = 0,
        t[15] = 1,
        t)
    }
    ,
    K.fromXRotation = function(t, e) {
        var a = Math.sin(e)
          , n = Math.cos(e);
        return t[0] = 1,
        t[1] = 0,
        t[2] = 0,
        t[3] = 0,
        t[4] = 0,
        t[5] = n,
        t[6] = a,
        t[7] = 0,
        t[8] = 0,
        t[9] = -a,
        t[10] = n,
        t[11] = 0,
        t[12] = 0,
        t[13] = 0,
        t[14] = 0,
        t[15] = 1,
        t
    }
    ,
    K.fromYRotation = function(t, e) {
        var a = Math.sin(e)
          , n = Math.cos(e);
        return t[0] = n,
        t[1] = 0,
        t[2] = -a,
        t[3] = 0,
        t[4] = 0,
        t[5] = 1,
        t[6] = 0,
        t[7] = 0,
        t[8] = a,
        t[9] = 0,
        t[10] = n,
        t[11] = 0,
        t[12] = 0,
        t[13] = 0,
        t[14] = 0,
        t[15] = 1,
        t
    }
    ,
    K.fromZRotation = function(t, e) {
        var a = Math.sin(e)
          , n = Math.cos(e);
        return t[0] = n,
        t[1] = a,
        t[2] = 0,
        t[3] = 0,
        t[4] = -a,
        t[5] = n,
        t[6] = 0,
        t[7] = 0,
        t[8] = 0,
        t[9] = 0,
        t[10] = 1,
        t[11] = 0,
        t[12] = 0,
        t[13] = 0,
        t[14] = 0,
        t[15] = 1,
        t
    }
    ,
    K.fromRotationTranslation = function(t, e, a) {
        var n = e[0]
          , r = e[1]
          , o = e[2]
          , i = e[3]
          , s = n + n
          , l = r + r
          , u = o + o
          , c = n * s
          , d = n * l
          , f = n * u
          , h = r * l
          , _ = r * u
          , p = o * u
          , v = i * s
          , m = i * l
          , g = i * u;
        return t[0] = 1 - (h + p),
        t[1] = d + g,
        t[2] = f - m,
        t[3] = 0,
        t[4] = d - g,
        t[5] = 1 - (c + p),
        t[6] = _ + v,
        t[7] = 0,
        t[8] = f + m,
        t[9] = _ - v,
        t[10] = 1 - (c + h),
        t[11] = 0,
        t[12] = a[0],
        t[13] = a[1],
        t[14] = a[2],
        t[15] = 1,
        t
    }
    ,
    K.getTranslation = function(t, e) {
        return t[0] = e[12],
        t[1] = e[13],
        t[2] = e[14],
        t
    }
    ,
    K.getRotation = function(t, e) {
        var a = e[0] + e[5] + e[10]
          , n = 0;
        return a > 0 ? (n = 2 * Math.sqrt(a + 1),
        t[3] = .25 * n,
        t[0] = (e[6] - e[9]) / n,
        t[1] = (e[8] - e[2]) / n,
        t[2] = (e[1] - e[4]) / n) : e[0] > e[5] & e[0] > e[10] ? (n = 2 * Math.sqrt(1 + e[0] - e[5] - e[10]),
        t[3] = (e[6] - e[9]) / n,
        t[0] = .25 * n,
        t[1] = (e[1] + e[4]) / n,
        t[2] = (e[8] + e[2]) / n) : e[5] > e[10] ? (n = 2 * Math.sqrt(1 + e[5] - e[0] - e[10]),
        t[3] = (e[8] - e[2]) / n,
        t[0] = (e[1] + e[4]) / n,
        t[1] = .25 * n,
        t[2] = (e[6] + e[9]) / n) : (n = 2 * Math.sqrt(1 + e[10] - e[0] - e[5]),
        t[3] = (e[1] - e[4]) / n,
        t[0] = (e[8] + e[2]) / n,
        t[1] = (e[6] + e[9]) / n,
        t[2] = .25 * n),
        t
    }
    ,
    K.fromRotationTranslationScale = function(t, e, a, n) {
        var r = e[0]
          , o = e[1]
          , i = e[2]
          , s = e[3]
          , l = r + r
          , u = o + o
          , c = i + i
          , d = r * l
          , f = r * u
          , h = r * c
          , _ = o * u
          , p = o * c
          , v = i * c
          , m = s * l
          , g = s * u
          , M = s * c
          , x = n[0]
          , b = n[1]
          , y = n[2];
        return t[0] = (1 - (_ + v)) * x,
        t[1] = (f + M) * x,
        t[2] = (h - g) * x,
        t[3] = 0,
        t[4] = (f - M) * b,
        t[5] = (1 - (d + v)) * b,
        t[6] = (p + m) * b,
        t[7] = 0,
        t[8] = (h + g) * y,
        t[9] = (p - m) * y,
        t[10] = (1 - (d + _)) * y,
        t[11] = 0,
        t[12] = a[0],
        t[13] = a[1],
        t[14] = a[2],
        t[15] = 1,
        t
    }
    ,
    K.fromRotationTranslationScaleOrigin = function(t, e, a, n, r) {
        var o = e[0]
          , i = e[1]
          , s = e[2]
          , l = e[3]
          , u = o + o
          , c = i + i
          , d = s + s
          , f = o * u
          , h = o * c
          , _ = o * d
          , p = i * c
          , v = i * d
          , m = s * d
          , g = l * u
          , M = l * c
          , x = l * d
          , b = n[0]
          , y = n[1]
          , w = n[2]
          , S = r[0]
          , I = r[1]
          , D = r[2];
        return t[0] = (1 - (p + m)) * b,
        t[1] = (h + x) * b,
        t[2] = (_ - M) * b,
        t[3] = 0,
        t[4] = (h - x) * y,
        t[5] = (1 - (f + m)) * y,
        t[6] = (v + g) * y,
        t[7] = 0,
        t[8] = (_ + M) * w,
        t[9] = (v - g) * w,
        t[10] = (1 - (f + p)) * w,
        t[11] = 0,
        t[12] = a[0] + S - (t[0] * S + t[4] * I + t[8] * D),
        t[13] = a[1] + I - (t[1] * S + t[5] * I + t[9] * D),
        t[14] = a[2] + D - (t[2] * S + t[6] * I + t[10] * D),
        t[15] = 1,
        t
    }
    ,
    K.fromQuat = function(t, e) {
        var a = e[0]
          , n = e[1]
          , r = e[2]
          , o = e[3]
          , i = a + a
          , s = n + n
          , l = r + r
          , u = a * i
          , c = n * i
          , d = n * s
          , f = r * i
          , h = r * s
          , _ = r * l
          , p = o * i
          , v = o * s
          , m = o * l;
        return t[0] = 1 - d - _,
        t[1] = c + m,
        t[2] = f - v,
        t[3] = 0,
        t[4] = c - m,
        t[5] = 1 - u - _,
        t[6] = h + p,
        t[7] = 0,
        t[8] = f + v,
        t[9] = h - p,
        t[10] = 1 - u - d,
        t[11] = 0,
        t[12] = 0,
        t[13] = 0,
        t[14] = 0,
        t[15] = 1,
        t
    }
    ,
    K.frustum = function(t, e, a, n, r, o, i) {
        var s = 1 / (a - e)
          , l = 1 / (r - n)
          , u = 1 / (o - i);
        return t[0] = 2 * o * s,
        t[1] = 0,
        t[2] = 0,
        t[3] = 0,
        t[4] = 0,
        t[5] = 2 * o * l,
        t[6] = 0,
        t[7] = 0,
        t[8] = (a + e) * s,
        t[9] = (r + n) * l,
        t[10] = (i + o) * u,
        t[11] = -1,
        t[12] = 0,
        t[13] = 0,
        t[14] = i * o * 2 * u,
        t[15] = 0,
        t
    }
    ,
    K.perspective = function(t, e, a, n, r) {
        var o = 1 / Math.tan(e / 2)
          , i = 1 / (n - r);
        return t[0] = o / a,
        t[1] = 0,
        t[2] = 0,
        t[3] = 0,
        t[4] = 0,
        t[5] = o,
        t[6] = 0,
        t[7] = 0,
        t[8] = 0,
        t[9] = 0,
        t[10] = (r + n) * i,
        t[11] = -1,
        t[12] = 0,
        t[13] = 0,
        t[14] = 2 * r * n * i,
        t[15] = 0,
        t
    }
    ,
    K.perspectiveFromFieldOfView = function(t, e, a, n) {
        var r = Math.tan(e.upDegrees * Math.PI / 180)
          , o = Math.tan(e.downDegrees * Math.PI / 180)
          , i = Math.tan(e.leftDegrees * Math.PI / 180)
          , s = Math.tan(e.rightDegrees * Math.PI / 180)
          , l = 2 / (i + s)
          , u = 2 / (r + o);
        return t[0] = l,
        t[1] = 0,
        t[2] = 0,
        t[3] = 0,
        t[4] = 0,
        t[5] = u,
        t[6] = 0,
        t[7] = 0,
        t[8] = -((i - s) * l * .5),
        t[9] = (r - o) * u * .5,
        t[10] = n / (a - n),
        t[11] = -1,
        t[12] = 0,
        t[13] = 0,
        t[14] = n * a / (a - n),
        t[15] = 0,
        t
    }
    ,
    K.ortho = function(t, e, a, n, r, o, i) {
        var s = 1 / (e - a)
          , l = 1 / (n - r)
          , u = 1 / (o - i);
        return t[0] = -2 * s,
        t[1] = 0,
        t[2] = 0,
        t[3] = 0,
        t[4] = 0,
        t[5] = -2 * l,
        t[6] = 0,
        t[7] = 0,
        t[8] = 0,
        t[9] = 0,
        t[10] = 2 * u,
        t[11] = 0,
        t[12] = (e + a) * s,
        t[13] = (r + n) * l,
        t[14] = (i + o) * u,
        t[15] = 1,
        t
    }
    ,
    K.lookAt = function(t, e, a, n) {
        var r, o, i, s, l, u, c, d, f, h, _ = e[0], p = e[1], v = e[2], m = n[0], g = n[1], M = n[2], x = a[0], b = a[1], y = a[2];
        return Math.abs(_ - x) < j.EPSILON && Math.abs(p - b) < j.EPSILON && Math.abs(v - y) < j.EPSILON ? K.identity(t) : (c = _ - x,
        d = p - b,
        f = v - y,
        h = 1 / Math.sqrt(c * c + d * d + f * f),
        c *= h,
        d *= h,
        f *= h,
        r = g * f - M * d,
        o = M * c - m * f,
        i = m * d - g * c,
        h = Math.sqrt(r * r + o * o + i * i),
        h ? (h = 1 / h,
        r *= h,
        o *= h,
        i *= h) : (r = 0,
        o = 0,
        i = 0),
        s = d * i - f * o,
        l = f * r - c * i,
        u = c * o - d * r,
        h = Math.sqrt(s * s + l * l + u * u),
        h ? (h = 1 / h,
        s *= h,
        l *= h,
        u *= h) : (s = 0,
        l = 0,
        u = 0),
        t[0] = r,
        t[1] = s,
        t[2] = c,
        t[3] = 0,
        t[4] = o,
        t[5] = l,
        t[6] = d,
        t[7] = 0,
        t[8] = i,
        t[9] = u,
        t[10] = f,
        t[11] = 0,
        t[12] = -(r * _ + o * p + i * v),
        t[13] = -(s * _ + l * p + u * v),
        t[14] = -(c * _ + d * p + f * v),
        t[15] = 1,
        t)
    }
    ,
    K.str = function(t) {
        return "mat4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ", " + t[9] + ", " + t[10] + ", " + t[11] + ", " + t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + ")"
    }
    ,
    K.frob = function(t) {
        return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2) + Math.pow(t[9], 2) + Math.pow(t[10], 2) + Math.pow(t[11], 2) + Math.pow(t[12], 2) + Math.pow(t[13], 2) + Math.pow(t[14], 2) + Math.pow(t[15], 2))
    }
    ,
    K.add = function(t, e, a) {
        return t[0] = e[0] + a[0],
        t[1] = e[1] + a[1],
        t[2] = e[2] + a[2],
        t[3] = e[3] + a[3],
        t[4] = e[4] + a[4],
        t[5] = e[5] + a[5],
        t[6] = e[6] + a[6],
        t[7] = e[7] + a[7],
        t[8] = e[8] + a[8],
        t[9] = e[9] + a[9],
        t[10] = e[10] + a[10],
        t[11] = e[11] + a[11],
        t[12] = e[12] + a[12],
        t[13] = e[13] + a[13],
        t[14] = e[14] + a[14],
        t[15] = e[15] + a[15],
        t
    }
    ,
    K.subtract = function(t, e, a) {
        return t[0] = e[0] - a[0],
        t[1] = e[1] - a[1],
        t[2] = e[2] - a[2],
        t[3] = e[3] - a[3],
        t[4] = e[4] - a[4],
        t[5] = e[5] - a[5],
        t[6] = e[6] - a[6],
        t[7] = e[7] - a[7],
        t[8] = e[8] - a[8],
        t[9] = e[9] - a[9],
        t[10] = e[10] - a[10],
        t[11] = e[11] - a[11],
        t[12] = e[12] - a[12],
        t[13] = e[13] - a[13],
        t[14] = e[14] - a[14],
        t[15] = e[15] - a[15],
        t
    }
    ,
    K.sub = K.subtract,
    K.multiplyScalar = function(t, e, a) {
        return t[0] = e[0] * a,
        t[1] = e[1] * a,
        t[2] = e[2] * a,
        t[3] = e[3] * a,
        t[4] = e[4] * a,
        t[5] = e[5] * a,
        t[6] = e[6] * a,
        t[7] = e[7] * a,
        t[8] = e[8] * a,
        t[9] = e[9] * a,
        t[10] = e[10] * a,
        t[11] = e[11] * a,
        t[12] = e[12] * a,
        t[13] = e[13] * a,
        t[14] = e[14] * a,
        t[15] = e[15] * a,
        t
    }
    ,
    K.multiplyScalarAndAdd = function(t, e, a, n) {
        return t[0] = e[0] + a[0] * n,
        t[1] = e[1] + a[1] * n,
        t[2] = e[2] + a[2] * n,
        t[3] = e[3] + a[3] * n,
        t[4] = e[4] + a[4] * n,
        t[5] = e[5] + a[5] * n,
        t[6] = e[6] + a[6] * n,
        t[7] = e[7] + a[7] * n,
        t[8] = e[8] + a[8] * n,
        t[9] = e[9] + a[9] * n,
        t[10] = e[10] + a[10] * n,
        t[11] = e[11] + a[11] * n,
        t[12] = e[12] + a[12] * n,
        t[13] = e[13] + a[13] * n,
        t[14] = e[14] + a[14] * n,
        t[15] = e[15] + a[15] * n,
        t
    }
    ,
    K.exactEquals = function(t, e) {
        return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3] && t[4] === e[4] && t[5] === e[5] && t[6] === e[6] && t[7] === e[7] && t[8] === e[8] && t[9] === e[9] && t[10] === e[10] && t[11] === e[11] && t[12] === e[12] && t[13] === e[13] && t[14] === e[14] && t[15] === e[15]
    }
    ,
    K.equals = function(t, e) {
        var a = t[0]
          , n = t[1]
          , r = t[2]
          , o = t[3]
          , i = t[4]
          , s = t[5]
          , l = t[6]
          , u = t[7]
          , c = t[8]
          , d = t[9]
          , f = t[10]
          , h = t[11]
          , _ = t[12]
          , p = t[13]
          , v = t[14]
          , m = t[15]
          , g = e[0]
          , M = e[1]
          , x = e[2]
          , b = e[3]
          , y = e[4]
          , w = e[5]
          , S = e[6]
          , I = e[7]
          , D = e[8]
          , F = e[9]
          , A = e[10]
          , E = e[11]
          , T = e[12]
          , P = e[13]
          , R = e[14]
          , k = e[15];
        return Math.abs(a - g) <= j.EPSILON * Math.max(1, Math.abs(a), Math.abs(g)) && Math.abs(n - M) <= j.EPSILON * Math.max(1, Math.abs(n), Math.abs(M)) && Math.abs(r - x) <= j.EPSILON * Math.max(1, Math.abs(r), Math.abs(x)) && Math.abs(o - b) <= j.EPSILON * Math.max(1, Math.abs(o), Math.abs(b)) && Math.abs(i - y) <= j.EPSILON * Math.max(1, Math.abs(i), Math.abs(y)) && Math.abs(s - w) <= j.EPSILON * Math.max(1, Math.abs(s), Math.abs(w)) && Math.abs(l - S) <= j.EPSILON * Math.max(1, Math.abs(l), Math.abs(S)) && Math.abs(u - I) <= j.EPSILON * Math.max(1, Math.abs(u), Math.abs(I)) && Math.abs(c - D) <= j.EPSILON * Math.max(1, Math.abs(c), Math.abs(D)) && Math.abs(d - F) <= j.EPSILON * Math.max(1, Math.abs(d), Math.abs(F)) && Math.abs(f - A) <= j.EPSILON * Math.max(1, Math.abs(f), Math.abs(A)) && Math.abs(h - E) <= j.EPSILON * Math.max(1, Math.abs(h), Math.abs(E)) && Math.abs(_ - T) <= j.EPSILON * Math.max(1, Math.abs(_), Math.abs(T)) && Math.abs(p - P) <= j.EPSILON * Math.max(1, Math.abs(p), Math.abs(P)) && Math.abs(v - R) <= j.EPSILON * Math.max(1, Math.abs(v), Math.abs(R)) && Math.abs(m - k) <= j.EPSILON * Math.max(1, Math.abs(m), Math.abs(k))
    }
    ;
    var Z = K
      , J = {};
    J.create = function() {
        var t = new j.ARRAY_TYPE(3);
        return t[0] = 0,
        t[1] = 0,
        t[2] = 0,
        t
    }
    ,
    J.clone = function(t) {
        var e = new j.ARRAY_TYPE(3);
        return e[0] = t[0],
        e[1] = t[1],
        e[2] = t[2],
        e
    }
    ,
    J.fromValues = function(t, e, a) {
        var n = new j.ARRAY_TYPE(3);
        return n[0] = t,
        n[1] = e,
        n[2] = a,
        n
    }
    ,
    J.copy = function(t, e) {
        return t[0] = e[0],
        t[1] = e[1],
        t[2] = e[2],
        t
    }
    ,
    J.set = function(t, e, a, n) {
        return t[0] = e,
        t[1] = a,
        t[2] = n,
        t
    }
    ,
    J.add = function(t, e, a) {
        return t[0] = e[0] + a[0],
        t[1] = e[1] + a[1],
        t[2] = e[2] + a[2],
        t
    }
    ,
    J.subtract = function(t, e, a) {
        return t[0] = e[0] - a[0],
        t[1] = e[1] - a[1],
        t[2] = e[2] - a[2],
        t
    }
    ,
    J.sub = J.subtract,
    J.multiply = function(t, e, a) {
        return t[0] = e[0] * a[0],
        t[1] = e[1] * a[1],
        t[2] = e[2] * a[2],
        t
    }
    ,
    J.mul = J.multiply,
    J.divide = function(t, e, a) {
        return t[0] = e[0] / a[0],
        t[1] = e[1] / a[1],
        t[2] = e[2] / a[2],
        t
    }
    ,
    J.div = J.divide,
    J.ceil = function(t, e) {
        return t[0] = Math.ceil(e[0]),
        t[1] = Math.ceil(e[1]),
        t[2] = Math.ceil(e[2]),
        t
    }
    ,
    J.floor = function(t, e) {
        return t[0] = Math.floor(e[0]),
        t[1] = Math.floor(e[1]),
        t[2] = Math.floor(e[2]),
        t
    }
    ,
    J.min = function(t, e, a) {
        return t[0] = Math.min(e[0], a[0]),
        t[1] = Math.min(e[1], a[1]),
        t[2] = Math.min(e[2], a[2]),
        t
    }
    ,
    J.max = function(t, e, a) {
        return t[0] = Math.max(e[0], a[0]),
        t[1] = Math.max(e[1], a[1]),
        t[2] = Math.max(e[2], a[2]),
        t
    }
    ,
    J.round = function(t, e) {
        return t[0] = Math.round(e[0]),
        t[1] = Math.round(e[1]),
        t[2] = Math.round(e[2]),
        t
    }
    ,
    J.scale = function(t, e, a) {
        return t[0] = e[0] * a,
        t[1] = e[1] * a,
        t[2] = e[2] * a,
        t
    }
    ,
    J.scaleAndAdd = function(t, e, a, n) {
        return t[0] = e[0] + a[0] * n,
        t[1] = e[1] + a[1] * n,
        t[2] = e[2] + a[2] * n,
        t
    }
    ,
    J.distance = function(t, e) {
        var a = e[0] - t[0]
          , n = e[1] - t[1]
          , r = e[2] - t[2];
        return Math.sqrt(a * a + n * n + r * r)
    }
    ,
    J.dist = J.distance,
    J.squaredDistance = function(t, e) {
        var a = e[0] - t[0]
          , n = e[1] - t[1]
          , r = e[2] - t[2];
        return a * a + n * n + r * r
    }
    ,
    J.sqrDist = J.squaredDistance,
    J.length = function(t) {
        var e = t[0]
          , a = t[1]
          , n = t[2];
        return Math.sqrt(e * e + a * a + n * n)
    }
    ,
    J.len = J.length,
    J.squaredLength = function(t) {
        var e = t[0]
          , a = t[1]
          , n = t[2];
        return e * e + a * a + n * n
    }
    ,
    J.sqrLen = J.squaredLength,
    J.negate = function(t, e) {
        return t[0] = -e[0],
        t[1] = -e[1],
        t[2] = -e[2],
        t
    }
    ,
    J.inverse = function(t, e) {
        return t[0] = 1 / e[0],
        t[1] = 1 / e[1],
        t[2] = 1 / e[2],
        t
    }
    ,
    J.normalize = function(t, e) {
        var a = e[0]
          , n = e[1]
          , r = e[2]
          , o = a * a + n * n + r * r;
        return o > 0 && (o = 1 / Math.sqrt(o),
        t[0] = e[0] * o,
        t[1] = e[1] * o,
        t[2] = e[2] * o),
        t
    }
    ,
    J.dot = function(t, e) {
        return t[0] * e[0] + t[1] * e[1] + t[2] * e[2]
    }
    ,
    J.cross = function(t, e, a) {
        var n = e[0]
          , r = e[1]
          , o = e[2]
          , i = a[0]
          , s = a[1]
          , l = a[2];
        return t[0] = r * l - o * s,
        t[1] = o * i - n * l,
        t[2] = n * s - r * i,
        t
    }
    ,
    J.lerp = function(t, e, a, n) {
        var r = e[0]
          , o = e[1]
          , i = e[2];
        return t[0] = r + n * (a[0] - r),
        t[1] = o + n * (a[1] - o),
        t[2] = i + n * (a[2] - i),
        t
    }
    ,
    J.hermite = function(t, e, a, n, r, o) {
        var i = o * o
          , s = i * (2 * o - 3) + 1
          , l = i * (o - 2) + o
          , u = i * (o - 1)
          , c = i * (3 - 2 * o);
        return t[0] = e[0] * s + a[0] * l + n[0] * u + r[0] * c,
        t[1] = e[1] * s + a[1] * l + n[1] * u + r[1] * c,
        t[2] = e[2] * s + a[2] * l + n[2] * u + r[2] * c,
        t
    }
    ,
    J.bezier = function(t, e, a, n, r, o) {
        var i = 1 - o
          , s = i * i
          , l = o * o
          , u = s * i
          , c = 3 * o * s
          , d = 3 * l * i
          , f = l * o;
        return t[0] = e[0] * u + a[0] * c + n[0] * d + r[0] * f,
        t[1] = e[1] * u + a[1] * c + n[1] * d + r[1] * f,
        t[2] = e[2] * u + a[2] * c + n[2] * d + r[2] * f,
        t
    }
    ,
    J.random = function(t, e) {
        e = e || 1;
        var a = 2 * j.RANDOM() * Math.PI
          , n = 2 * j.RANDOM() - 1
          , r = Math.sqrt(1 - n * n) * e;
        return t[0] = Math.cos(a) * r,
        t[1] = Math.sin(a) * r,
        t[2] = n * e,
        t
    }
    ,
    J.transformMat4 = function(t, e, a) {
        var n = e[0]
          , r = e[1]
          , o = e[2]
          , i = a[3] * n + a[7] * r + a[11] * o + a[15];
        return i = i || 1,
        t[0] = (a[0] * n + a[4] * r + a[8] * o + a[12]) / i,
        t[1] = (a[1] * n + a[5] * r + a[9] * o + a[13]) / i,
        t[2] = (a[2] * n + a[6] * r + a[10] * o + a[14]) / i,
        t
    }
    ,
    J.transformMat3 = function(t, e, a) {
        var n = e[0]
          , r = e[1]
          , o = e[2];
        return t[0] = n * a[0] + r * a[3] + o * a[6],
        t[1] = n * a[1] + r * a[4] + o * a[7],
        t[2] = n * a[2] + r * a[5] + o * a[8],
        t
    }
    ,
    J.transformQuat = function(t, e, a) {
        var n = e[0]
          , r = e[1]
          , o = e[2]
          , i = a[0]
          , s = a[1]
          , l = a[2]
          , u = a[3]
          , c = u * n + s * o - l * r
          , d = u * r + l * n - i * o
          , f = u * o + i * r - s * n
          , h = -i * n - s * r - l * o;
        return t[0] = c * u + h * -i + d * -l - f * -s,
        t[1] = d * u + h * -s + f * -i - c * -l,
        t[2] = f * u + h * -l + c * -s - d * -i,
        t
    }
    ,
    J.rotateX = function(t, e, a, n) {
        var r = []
          , o = [];
        return r[0] = e[0] - a[0],
        r[1] = e[1] - a[1],
        r[2] = e[2] - a[2],
        o[0] = r[0],
        o[1] = r[1] * Math.cos(n) - r[2] * Math.sin(n),
        o[2] = r[1] * Math.sin(n) + r[2] * Math.cos(n),
        t[0] = o[0] + a[0],
        t[1] = o[1] + a[1],
        t[2] = o[2] + a[2],
        t
    }
    ,
    J.rotateY = function(t, e, a, n) {
        var r = []
          , o = [];
        return r[0] = e[0] - a[0],
        r[1] = e[1] - a[1],
        r[2] = e[2] - a[2],
        o[0] = r[2] * Math.sin(n) + r[0] * Math.cos(n),
        o[1] = r[1],
        o[2] = r[2] * Math.cos(n) - r[0] * Math.sin(n),
        t[0] = o[0] + a[0],
        t[1] = o[1] + a[1],
        t[2] = o[2] + a[2],
        t
    }
    ,
    J.rotateZ = function(t, e, a, n) {
        var r = []
          , o = [];
        return r[0] = e[0] - a[0],
        r[1] = e[1] - a[1],
        r[2] = e[2] - a[2],
        o[0] = r[0] * Math.cos(n) - r[1] * Math.sin(n),
        o[1] = r[0] * Math.sin(n) + r[1] * Math.cos(n),
        o[2] = r[2],
        t[0] = o[0] + a[0],
        t[1] = o[1] + a[1],
        t[2] = o[2] + a[2],
        t
    }
    ,
    J.forEach = function() {
        var t = J.create();
        return function(e, a, n, r, o, i) {
            var s, l;
            for (a || (a = 3),
            n || (n = 0),
            l = r ? Math.min(r * a + n, e.length) : e.length,
            s = n; s < l; s += a)
                t[0] = e[s],
                t[1] = e[s + 1],
                t[2] = e[s + 2],
                o(t, t, i),
                e[s] = t[0],
                e[s + 1] = t[1],
                e[s + 2] = t[2];
            return e
        }
    }(),
    J.angle = function(t, e) {
        var a = J.fromValues(t[0], t[1], t[2])
          , n = J.fromValues(e[0], e[1], e[2]);
        J.normalize(a, a),
        J.normalize(n, n);
        var r = J.dot(a, n);
        return r > 1 ? 0 : Math.acos(r)
    }
    ,
    J.str = function(t) {
        return "vec3(" + t[0] + ", " + t[1] + ", " + t[2] + ")"
    }
    ,
    J.exactEquals = function(t, e) {
        return t[0] === e[0] && t[1] === e[1] && t[2] === e[2]
    }
    ,
    J.equals = function(t, e) {
        var a = t[0]
          , n = t[1]
          , r = t[2]
          , o = e[0]
          , i = e[1]
          , s = e[2];
        return Math.abs(a - o) <= j.EPSILON * Math.max(1, Math.abs(a), Math.abs(o)) && Math.abs(n - i) <= j.EPSILON * Math.max(1, Math.abs(n), Math.abs(i)) && Math.abs(r - s) <= j.EPSILON * Math.max(1, Math.abs(r), Math.abs(s))
    }
    ;
    var tt = J
      , et = {};
    et.create = function() {
        var t = new j.ARRAY_TYPE(4);
        return t[0] = 0,
        t[1] = 0,
        t[2] = 0,
        t[3] = 0,
        t
    }
    ,
    et.clone = function(t) {
        var e = new j.ARRAY_TYPE(4);
        return e[0] = t[0],
        e[1] = t[1],
        e[2] = t[2],
        e[3] = t[3],
        e
    }
    ,
    et.fromValues = function(t, e, a, n) {
        var r = new j.ARRAY_TYPE(4);
        return r[0] = t,
        r[1] = e,
        r[2] = a,
        r[3] = n,
        r
    }
    ,
    et.copy = function(t, e) {
        return t[0] = e[0],
        t[1] = e[1],
        t[2] = e[2],
        t[3] = e[3],
        t
    }
    ,
    et.set = function(t, e, a, n, r) {
        return t[0] = e,
        t[1] = a,
        t[2] = n,
        t[3] = r,
        t
    }
    ,
    et.add = function(t, e, a) {
        return t[0] = e[0] + a[0],
        t[1] = e[1] + a[1],
        t[2] = e[2] + a[2],
        t[3] = e[3] + a[3],
        t
    }
    ,
    et.subtract = function(t, e, a) {
        return t[0] = e[0] - a[0],
        t[1] = e[1] - a[1],
        t[2] = e[2] - a[2],
        t[3] = e[3] - a[3],
        t
    }
    ,
    et.sub = et.subtract,
    et.multiply = function(t, e, a) {
        return t[0] = e[0] * a[0],
        t[1] = e[1] * a[1],
        t[2] = e[2] * a[2],
        t[3] = e[3] * a[3],
        t
    }
    ,
    et.mul = et.multiply,
    et.divide = function(t, e, a) {
        return t[0] = e[0] / a[0],
        t[1] = e[1] / a[1],
        t[2] = e[2] / a[2],
        t[3] = e[3] / a[3],
        t
    }
    ,
    et.div = et.divide,
    et.ceil = function(t, e) {
        return t[0] = Math.ceil(e[0]),
        t[1] = Math.ceil(e[1]),
        t[2] = Math.ceil(e[2]),
        t[3] = Math.ceil(e[3]),
        t
    }
    ,
    et.floor = function(t, e) {
        return t[0] = Math.floor(e[0]),
        t[1] = Math.floor(e[1]),
        t[2] = Math.floor(e[2]),
        t[3] = Math.floor(e[3]),
        t
    }
    ,
    et.min = function(t, e, a) {
        return t[0] = Math.min(e[0], a[0]),
        t[1] = Math.min(e[1], a[1]),
        t[2] = Math.min(e[2], a[2]),
        t[3] = Math.min(e[3], a[3]),
        t
    }
    ,
    et.max = function(t, e, a) {
        return t[0] = Math.max(e[0], a[0]),
        t[1] = Math.max(e[1], a[1]),
        t[2] = Math.max(e[2], a[2]),
        t[3] = Math.max(e[3], a[3]),
        t
    }
    ,
    et.round = function(t, e) {
        return t[0] = Math.round(e[0]),
        t[1] = Math.round(e[1]),
        t[2] = Math.round(e[2]),
        t[3] = Math.round(e[3]),
        t
    }
    ,
    et.scale = function(t, e, a) {
        return t[0] = e[0] * a,
        t[1] = e[1] * a,
        t[2] = e[2] * a,
        t[3] = e[3] * a,
        t
    }
    ,
    et.scaleAndAdd = function(t, e, a, n) {
        return t[0] = e[0] + a[0] * n,
        t[1] = e[1] + a[1] * n,
        t[2] = e[2] + a[2] * n,
        t[3] = e[3] + a[3] * n,
        t
    }
    ,
    et.distance = function(t, e) {
        var a = e[0] - t[0]
          , n = e[1] - t[1]
          , r = e[2] - t[2]
          , o = e[3] - t[3];
        return Math.sqrt(a * a + n * n + r * r + o * o)
    }
    ,
    et.dist = et.distance,
    et.squaredDistance = function(t, e) {
        var a = e[0] - t[0]
          , n = e[1] - t[1]
          , r = e[2] - t[2]
          , o = e[3] - t[3];
        return a * a + n * n + r * r + o * o
    }
    ,
    et.sqrDist = et.squaredDistance,
    et.length = function(t) {
        var e = t[0]
          , a = t[1]
          , n = t[2]
          , r = t[3];
        return Math.sqrt(e * e + a * a + n * n + r * r)
    }
    ,
    et.len = et.length,
    et.squaredLength = function(t) {
        var e = t[0]
          , a = t[1]
          , n = t[2]
          , r = t[3];
        return e * e + a * a + n * n + r * r
    }
    ,
    et.sqrLen = et.squaredLength,
    et.negate = function(t, e) {
        return t[0] = -e[0],
        t[1] = -e[1],
        t[2] = -e[2],
        t[3] = -e[3],
        t
    }
    ,
    et.inverse = function(t, e) {
        return t[0] = 1 / e[0],
        t[1] = 1 / e[1],
        t[2] = 1 / e[2],
        t[3] = 1 / e[3],
        t
    }
    ,
    et.normalize = function(t, e) {
        var a = e[0]
          , n = e[1]
          , r = e[2]
          , o = e[3]
          , i = a * a + n * n + r * r + o * o;
        return i > 0 && (i = 1 / Math.sqrt(i),
        t[0] = a * i,
        t[1] = n * i,
        t[2] = r * i,
        t[3] = o * i),
        t
    }
    ,
    et.dot = function(t, e) {
        return t[0] * e[0] + t[1] * e[1] + t[2] * e[2] + t[3] * e[3]
    }
    ,
    et.lerp = function(t, e, a, n) {
        var r = e[0]
          , o = e[1]
          , i = e[2]
          , s = e[3];
        return t[0] = r + n * (a[0] - r),
        t[1] = o + n * (a[1] - o),
        t[2] = i + n * (a[2] - i),
        t[3] = s + n * (a[3] - s),
        t
    }
    ,
    et.random = function(t, e) {
        return e = e || 1,
        t[0] = j.RANDOM(),
        t[1] = j.RANDOM(),
        t[2] = j.RANDOM(),
        t[3] = j.RANDOM(),
        et.normalize(t, t),
        et.scale(t, t, e),
        t
    }
    ,
    et.transformMat4 = function(t, e, a) {
        var n = e[0]
          , r = e[1]
          , o = e[2]
          , i = e[3];
        return t[0] = a[0] * n + a[4] * r + a[8] * o + a[12] * i,
        t[1] = a[1] * n + a[5] * r + a[9] * o + a[13] * i,
        t[2] = a[2] * n + a[6] * r + a[10] * o + a[14] * i,
        t[3] = a[3] * n + a[7] * r + a[11] * o + a[15] * i,
        t
    }
    ,
    et.transformQuat = function(t, e, a) {
        var n = e[0]
          , r = e[1]
          , o = e[2]
          , i = a[0]
          , s = a[1]
          , l = a[2]
          , u = a[3]
          , c = u * n + s * o - l * r
          , d = u * r + l * n - i * o
          , f = u * o + i * r - s * n
          , h = -i * n - s * r - l * o;
        return t[0] = c * u + h * -i + d * -l - f * -s,
        t[1] = d * u + h * -s + f * -i - c * -l,
        t[2] = f * u + h * -l + c * -s - d * -i,
        t[3] = e[3],
        t
    }
    ,
    et.forEach = function() {
        var t = et.create();
        return function(e, a, n, r, o, i) {
            var s, l;
            for (a || (a = 4),
            n || (n = 0),
            l = r ? Math.min(r * a + n, e.length) : e.length,
            s = n; s < l; s += a)
                t[0] = e[s],
                t[1] = e[s + 1],
                t[2] = e[s + 2],
                t[3] = e[s + 3],
                o(t, t, i),
                e[s] = t[0],
                e[s + 1] = t[1],
                e[s + 2] = t[2],
                e[s + 3] = t[3];
            return e
        }
    }(),
    et.str = function(t) {
        return "vec4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
    }
    ,
    et.exactEquals = function(t, e) {
        return t[0] === e[0] && t[1] === e[1] && t[2] === e[2] && t[3] === e[3]
    }
    ,
    et.equals = function(t, e) {
        var a = t[0]
          , n = t[1]
          , r = t[2]
          , o = t[3]
          , i = e[0]
          , s = e[1]
          , l = e[2]
          , u = e[3];
        return Math.abs(a - i) <= j.EPSILON * Math.max(1, Math.abs(a), Math.abs(i)) && Math.abs(n - s) <= j.EPSILON * Math.max(1, Math.abs(n), Math.abs(s)) && Math.abs(r - l) <= j.EPSILON * Math.max(1, Math.abs(r), Math.abs(l)) && Math.abs(o - u) <= j.EPSILON * Math.max(1, Math.abs(o), Math.abs(u))
    }
    ;
    var at = et
      , nt = {};
    nt.create = function() {
        var t = new j.ARRAY_TYPE(4);
        return t[0] = 0,
        t[1] = 0,
        t[2] = 0,
        t[3] = 1,
        t
    }
    ,
    nt.rotationTo = function() {
        var t = tt.create()
          , e = tt.fromValues(1, 0, 0)
          , a = tt.fromValues(0, 1, 0);
        return function(n, r, o) {
            var i = tt.dot(r, o);
            return i < -.999999 ? (tt.cross(t, e, r),
            tt.length(t) < 1e-6 && tt.cross(t, a, r),
            tt.normalize(t, t),
            nt.setAxisAngle(n, t, Math.PI),
            n) : i > .999999 ? (n[0] = 0,
            n[1] = 0,
            n[2] = 0,
            n[3] = 1,
            n) : (tt.cross(t, r, o),
            n[0] = t[0],
            n[1] = t[1],
            n[2] = t[2],
            n[3] = 1 + i,
            nt.normalize(n, n))
        }
    }(),
    nt.setAxes = function() {
        var t = Q.create();
        return function(e, a, n, r) {
            return t[0] = n[0],
            t[3] = n[1],
            t[6] = n[2],
            t[1] = r[0],
            t[4] = r[1],
            t[7] = r[2],
            t[2] = -a[0],
            t[5] = -a[1],
            t[8] = -a[2],
            nt.normalize(e, nt.fromMat3(e, t))
        }
    }(),
    nt.clone = at.clone,
    nt.fromValues = at.fromValues,
    nt.copy = at.copy,
    nt.set = at.set,
    nt.identity = function(t) {
        return t[0] = 0,
        t[1] = 0,
        t[2] = 0,
        t[3] = 1,
        t
    }
    ,
    nt.setAxisAngle = function(t, e, a) {
        a *= .5;
        var n = Math.sin(a);
        return t[0] = n * e[0],
        t[1] = n * e[1],
        t[2] = n * e[2],
        t[3] = Math.cos(a),
        t
    }
    ,
    nt.getAxisAngle = function(t, e) {
        var a = 2 * Math.acos(e[3])
          , n = Math.sin(a / 2);
        return 0 != n ? (t[0] = e[0] / n,
        t[1] = e[1] / n,
        t[2] = e[2] / n) : (t[0] = 1,
        t[1] = 0,
        t[2] = 0),
        a
    }
    ,
    nt.add = at.add,
    nt.multiply = function(t, e, a) {
        var n = e[0]
          , r = e[1]
          , o = e[2]
          , i = e[3]
          , s = a[0]
          , l = a[1]
          , u = a[2]
          , c = a[3];
        return t[0] = n * c + i * s + r * u - o * l,
        t[1] = r * c + i * l + o * s - n * u,
        t[2] = o * c + i * u + n * l - r * s,
        t[3] = i * c - n * s - r * l - o * u,
        t
    }
    ,
    nt.mul = nt.multiply,
    nt.scale = at.scale,
    nt.rotateX = function(t, e, a) {
        a *= .5;
        var n = e[0]
          , r = e[1]
          , o = e[2]
          , i = e[3]
          , s = Math.sin(a)
          , l = Math.cos(a);
        return t[0] = n * l + i * s,
        t[1] = r * l + o * s,
        t[2] = o * l - r * s,
        t[3] = i * l - n * s,
        t
    }
    ,
    nt.rotateY = function(t, e, a) {
        a *= .5;
        var n = e[0]
          , r = e[1]
          , o = e[2]
          , i = e[3]
          , s = Math.sin(a)
          , l = Math.cos(a);
        return t[0] = n * l - o * s,
        t[1] = r * l + i * s,
        t[2] = o * l + n * s,
        t[3] = i * l - r * s,
        t
    }
    ,
    nt.rotateZ = function(t, e, a) {
        a *= .5;
        var n = e[0]
          , r = e[1]
          , o = e[2]
          , i = e[3]
          , s = Math.sin(a)
          , l = Math.cos(a);
        return t[0] = n * l + r * s,
        t[1] = r * l - n * s,
        t[2] = o * l + i * s,
        t[3] = i * l - o * s,
        t
    }
    ,
    nt.calculateW = function(t, e) {
        var a = e[0]
          , n = e[1]
          , r = e[2];
        return t[0] = a,
        t[1] = n,
        t[2] = r,
        t[3] = Math.sqrt(Math.abs(1 - a * a - n * n - r * r)),
        t
    }
    ,
    nt.dot = at.dot,
    nt.lerp = at.lerp,
    nt.slerp = function(t, e, a, n) {
        var r, o, i, s, l, u = e[0], c = e[1], d = e[2], f = e[3], h = a[0], _ = a[1], p = a[2], v = a[3];
        return o = u * h + c * _ + d * p + f * v,
        o < 0 && (o = -o,
        h = -h,
        _ = -_,
        p = -p,
        v = -v),
        1 - o > 1e-6 ? (r = Math.acos(o),
        i = Math.sin(r),
        s = Math.sin((1 - n) * r) / i,
        l = Math.sin(n * r) / i) : (s = 1 - n,
        l = n),
        t[0] = s * u + l * h,
        t[1] = s * c + l * _,
        t[2] = s * d + l * p,
        t[3] = s * f + l * v,
        t
    }
    ,
    nt.sqlerp = function() {
        var t = nt.create()
          , e = nt.create();
        return function(a, n, r, o, i, s) {
            return nt.slerp(t, n, i, s),
            nt.slerp(e, r, o, s),
            nt.slerp(a, t, e, 2 * s * (1 - s)),
            a
        }
    }(),
    nt.invert = function(t, e) {
        var a = e[0]
          , n = e[1]
          , r = e[2]
          , o = e[3]
          , i = a * a + n * n + r * r + o * o
          , s = i ? 1 / i : 0;
        return t[0] = -a * s,
        t[1] = -n * s,
        t[2] = -r * s,
        t[3] = o * s,
        t
    }
    ,
    nt.conjugate = function(t, e) {
        return t[0] = -e[0],
        t[1] = -e[1],
        t[2] = -e[2],
        t[3] = e[3],
        t
    }
    ,
    nt.length = at.length,
    nt.len = nt.length,
    nt.squaredLength = at.squaredLength,
    nt.sqrLen = nt.squaredLength,
    nt.normalize = at.normalize,
    nt.fromMat3 = function(t, e) {
        var a, n = e[0] + e[4] + e[8];
        if (n > 0)
            a = Math.sqrt(n + 1),
            t[3] = .5 * a,
            a = .5 / a,
            t[0] = (e[5] - e[7]) * a,
            t[1] = (e[6] - e[2]) * a,
            t[2] = (e[1] - e[3]) * a;
        else {
            var r = 0;
            e[4] > e[0] && (r = 1),
            e[8] > e[3 * r + r] && (r = 2);
            var o = (r + 1) % 3
              , i = (r + 2) % 3;
            a = Math.sqrt(e[3 * r + r] - e[3 * o + o] - e[3 * i + i] + 1),
            t[r] = .5 * a,
            a = .5 / a,
            t[3] = (e[3 * o + i] - e[3 * i + o]) * a,
            t[o] = (e[3 * o + r] + e[3 * r + o]) * a,
            t[i] = (e[3 * i + r] + e[3 * r + i]) * a
        }
        return t
    }
    ,
    nt.str = function(t) {
        return "quat(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
    }
    ,
    nt.exactEquals = at.exactEquals,
    nt.equals = at.equals;
    var rt = nt
      , ot = {};
    ot.create = function() {
        var t = new j.ARRAY_TYPE(2);
        return t[0] = 0,
        t[1] = 0,
        t
    }
    ,
    ot.clone = function(t) {
        var e = new j.ARRAY_TYPE(2);
        return e[0] = t[0],
        e[1] = t[1],
        e
    }
    ,
    ot.fromValues = function(t, e) {
        var a = new j.ARRAY_TYPE(2);
        return a[0] = t,
        a[1] = e,
        a
    }
    ,
    ot.copy = function(t, e) {
        return t[0] = e[0],
        t[1] = e[1],
        t
    }
    ,
    ot.set = function(t, e, a) {
        return t[0] = e,
        t[1] = a,
        t
    }
    ,
    ot.add = function(t, e, a) {
        return t[0] = e[0] + a[0],
        t[1] = e[1] + a[1],
        t
    }
    ,
    ot.subtract = function(t, e, a) {
        return t[0] = e[0] - a[0],
        t[1] = e[1] - a[1],
        t
    }
    ,
    ot.sub = ot.subtract,
    ot.multiply = function(t, e, a) {
        return t[0] = e[0] * a[0],
        t[1] = e[1] * a[1],
        t
    }
    ,
    ot.mul = ot.multiply,
    ot.divide = function(t, e, a) {
        return t[0] = e[0] / a[0],
        t[1] = e[1] / a[1],
        t
    }
    ,
    ot.div = ot.divide,
    ot.ceil = function(t, e) {
        return t[0] = Math.ceil(e[0]),
        t[1] = Math.ceil(e[1]),
        t
    }
    ,
    ot.floor = function(t, e) {
        return t[0] = Math.floor(e[0]),
        t[1] = Math.floor(e[1]),
        t
    }
    ,
    ot.min = function(t, e, a) {
        return t[0] = Math.min(e[0], a[0]),
        t[1] = Math.min(e[1], a[1]),
        t
    }
    ,
    ot.max = function(t, e, a) {
        return t[0] = Math.max(e[0], a[0]),
        t[1] = Math.max(e[1], a[1]),
        t
    }
    ,
    ot.round = function(t, e) {
        return t[0] = Math.round(e[0]),
        t[1] = Math.round(e[1]),
        t
    }
    ,
    ot.scale = function(t, e, a) {
        return t[0] = e[0] * a,
        t[1] = e[1] * a,
        t
    }
    ,
    ot.scaleAndAdd = function(t, e, a, n) {
        return t[0] = e[0] + a[0] * n,
        t[1] = e[1] + a[1] * n,
        t
    }
    ,
    ot.distance = function(t, e) {
        var a = e[0] - t[0]
          , n = e[1] - t[1];
        return Math.sqrt(a * a + n * n)
    }
    ,
    ot.dist = ot.distance,
    ot.squaredDistance = function(t, e) {
        var a = e[0] - t[0]
          , n = e[1] - t[1];
        return a * a + n * n
    }
    ,
    ot.sqrDist = ot.squaredDistance,
    ot.length = function(t) {
        var e = t[0]
          , a = t[1];
        return Math.sqrt(e * e + a * a)
    }
    ,
    ot.len = ot.length,
    ot.squaredLength = function(t) {
        var e = t[0]
          , a = t[1];
        return e * e + a * a
    }
    ,
    ot.sqrLen = ot.squaredLength,
    ot.negate = function(t, e) {
        return t[0] = -e[0],
        t[1] = -e[1],
        t
    }
    ,
    ot.inverse = function(t, e) {
        return t[0] = 1 / e[0],
        t[1] = 1 / e[1],
        t
    }
    ,
    ot.normalize = function(t, e) {
        var a = e[0]
          , n = e[1]
          , r = a * a + n * n;
        return r > 0 && (r = 1 / Math.sqrt(r),
        t[0] = e[0] * r,
        t[1] = e[1] * r),
        t
    }
    ,
    ot.dot = function(t, e) {
        return t[0] * e[0] + t[1] * e[1]
    }
    ,
    ot.cross = function(t, e, a) {
        var n = e[0] * a[1] - e[1] * a[0];
        return t[0] = t[1] = 0,
        t[2] = n,
        t
    }
    ,
    ot.lerp = function(t, e, a, n) {
        var r = e[0]
          , o = e[1];
        return t[0] = r + n * (a[0] - r),
        t[1] = o + n * (a[1] - o),
        t
    }
    ,
    ot.random = function(t, e) {
        e = e || 1;
        var a = 2 * j.RANDOM() * Math.PI;
        return t[0] = Math.cos(a) * e,
        t[1] = Math.sin(a) * e,
        t
    }
    ,
    ot.transformMat2 = function(t, e, a) {
        var n = e[0]
          , r = e[1];
        return t[0] = a[0] * n + a[2] * r,
        t[1] = a[1] * n + a[3] * r,
        t
    }
    ,
    ot.transformMat2d = function(t, e, a) {
        var n = e[0]
          , r = e[1];
        return t[0] = a[0] * n + a[2] * r + a[4],
        t[1] = a[1] * n + a[3] * r + a[5],
        t
    }
    ,
    ot.transformMat3 = function(t, e, a) {
        var n = e[0]
          , r = e[1];
        return t[0] = a[0] * n + a[3] * r + a[6],
        t[1] = a[1] * n + a[4] * r + a[7],
        t
    }
    ,
    ot.transformMat4 = function(t, e, a) {
        var n = e[0]
          , r = e[1];
        return t[0] = a[0] * n + a[4] * r + a[12],
        t[1] = a[1] * n + a[5] * r + a[13],
        t
    }
    ,
    ot.forEach = function() {
        var t = ot.create();
        return function(e, a, n, r, o, i) {
            var s, l;
            for (a || (a = 2),
            n || (n = 0),
            l = r ? Math.min(r * a + n, e.length) : e.length,
            s = n; s < l; s += a)
                t[0] = e[s],
                t[1] = e[s + 1],
                o(t, t, i),
                e[s] = t[0],
                e[s + 1] = t[1];
            return e
        }
    }(),
    ot.str = function(t) {
        return "vec2(" + t[0] + ", " + t[1] + ")"
    }
    ,
    ot.exactEquals = function(t, e) {
        return t[0] === e[0] && t[1] === e[1]
    }
    ,
    ot.equals = function(t, e) {
        var a = t[0]
          , n = t[1]
          , r = e[0]
          , o = e[1];
        return Math.abs(a - r) <= j.EPSILON * Math.max(1, Math.abs(a), Math.abs(r)) && Math.abs(n - o) <= j.EPSILON * Math.max(1, Math.abs(n), Math.abs(o))
    }
    ;
    var it = ot
      , st = Q
      , lt = Z
      , ut = rt
      , ct = it
      , dt = tt
      , ft = at;
    l.use_frustum = !0;
    var ht = dt.fromValues(0, 1, 0)
      , _t = dt.create()
      , pt = (dt.create(),
    dt.create(),
    dt.create());
    dt.create();
    l.prototype.update = function(t, e, a) {
        if (a = a || ht,
        this.ortho) {
            var n = this.ortho;
            lt.ortho(this.proj, -n, n, -n, n, -this.far, -this.near)
        } else {
            var r = this.wide * this.viewport[2] / this.viewport[3];
            u(this.proj, this.fov * Y, r, this.near, this.far)
        }
        dt.add(_t, t, e),
        dt.copy(pt, t),
        lt.lookAt(this.view, pt, _t, a);
        var o = this.bill
          , i = this.view;
        o[0] = i[0],
        o[1] = i[4],
        o[2] = i[8],
        o[3] = i[1],
        o[4] = i[5],
        o[5] = i[9],
        o[6] = i[2],
        o[7] = i[6],
        o[8] = i[10],
        lt.multiply(this.mvp, this.proj, this.view),
        lt.invert(this.inv_mvp, this.mvp),
        lt.invert(this.inv_view, this.view),
        lt.invert(this.inv_proj, this.proj),
        dt.transformMat4(this.view_pos, [0, 0, 0], this.inv_view),
        dt.set(this.view_dir, -this.inv_view[8], -this.inv_view[9], -this.inv_view[10])
    }
    ,
    l.prototype.update_quat = function(t, e) {
        var a = this.viewport[2] / this.viewport[3];
        if (this.ortho) {
            var n = this.ortho
              , r = a * n;
            lt.ortho(this.proj, -r, r, -n, n, 1, 1e3)
        } else
            u(this.proj, this.fov * Y, a, this.near, this.far);
        lt.fromRotationTranslation(this.view, e, t),
        lt.invert(this.view, this.view);
        var o = this.bill
          , i = this.view;
        o[0] = i[0],
        o[1] = i[4],
        o[2] = i[8],
        o[3] = i[1],
        o[4] = i[5],
        o[5] = i[9],
        o[6] = i[2],
        o[7] = i[6],
        o[8] = i[10],
        lt.multiply(this.mvp, this.proj, this.view),
        lt.invert(this.inv_mvp, this.mvp),
        lt.invert(this.inv_view, this.view),
        dt.transformMat4(this.view_pos, [0, 0, 0], this.inv_view),
        dt.set(this.view_dir, -this.inv_view[8], -this.inv_view[9], -this.inv_view[10])
    }
    ;
    var vt = ft.create();
    l.prototype.unproject = function(t, e) {
        var a = vt;
        a[0] = e[0] / this.viewport[2] * 2 - 1,
        a[1] = e[1] / this.viewport[3] * 2 - 1,
        a[1] = 1 - a[1],
        a[2] = 0,
        a[3] = 1,
        ft.transformMat4(a, a, this.mvpInv),
        t[0] = a[0] / a[3],
        t[1] = a[1] / a[3]
    }
    ;
    var mt = "medium"
      , gt = {
        enabledMask: 0,
        maxEnabledIndex: -1,
        disableAll: function() {
            for (var t = 0; t <= this.maxEnabledIndex; ++t) {
                1 << t & this.enabledMask && gl.disableVertexAttribArray(t)
            }
            this.enabledMask = 0,
            this.maxEnabledIndex = -1
        },
        enable: function(t) {
            var e = 1 << t;
            e & this.enabledMask || (gl.enableVertexAttribArray(t),
            this.enabledMask |= e,
            this.maxEnabledIndex = Math.max(this.maxEnabledIndex, t))
        },
        disable: function(t) {
            var e = 1 << t;
            e & this.enabledMask && (gl.disableVertexAttribArray(t),
            this.enabledMask &= ~e)
        }
    };
    c.prototype.set_program = function(t) {
        this.program = t;
        for (var e = gl.getProgramParameter(t, gl.ACTIVE_ATTRIBUTES), a = 0; a < e; ++a) {
            var n = gl.getActiveAttrib(t, a);
            this.attribs[n.name] = {
                index: gl.getAttribLocation(t, n.name),
                name: n.name,
                size: n.size,
                type: n.type
            }
        }
        for (var r = 0, o = gl.getProgramParameter(t, gl.ACTIVE_UNIFORMS), a = 0; a < o; ++a) {
            var i = gl.getActiveUniform(t, a);
            this.uniforms[i.name] = {
                location: gl.getUniformLocation(t, i.name),
                name: i.name,
                size: i.size,
                type: i.type,
                texUnit: function(t) {
                    if (t.type == gl.SAMPLER_2D || t.type == gl.SAMPLER_CUBE) {
                        var e = r;
                        return r += t.size,
                        e
                    }
                    return -1
                }(i)
            }
        }
    }
    ,
    c.prototype.use = function() {
        return gl.useProgram(this.program),
        gt.disableAll(),
        this
    }
    ,
    c.prototype.getUniformLocation = function(t) {
        var e = this.uniforms[t];
        return e ? e.location : null
    }
    ,
    c.prototype.getAttribIndex = function(t) {
        var e = this.attribs[t];
        return e ? e.index : -1
    }
    ,
    c.prototype.uniform1i = function(t, e) {
        var a = this.getUniformLocation(t);
        a && gl.uniform1i(a, e)
    }
    ,
    c.prototype.uniform1f = function(t, e) {
        var a = this.getUniformLocation(t);
        a && gl.uniform1f(a, e)
    }
    ,
    c.prototype.uniform2f = function(t, e, a) {
        var n = this.getUniformLocation(t);
        n && gl.uniform2f(n, e, a)
    }
    ,
    c.prototype.uniform3f = function(t, e, a, n) {
        var r = this.getUniformLocation(t);
        r && gl.uniform3f(r, e, a, n)
    }
    ,
    c.prototype.uniform4f = function(t, e, a, n, r) {
        var o = this.getUniformLocation(t);
        o && gl.uniform4f(o, e, a, n, r)
    }
    ,
    c.prototype.uniform1iv = function(t, e) {
        var a = this.getUniformLocation(t);
        a && gl.uniform1iv(a, e)
    }
    ,
    c.prototype.uniform1fv = function(t, e) {
        var a = this.getUniformLocation(t);
        a && gl.uniform1fv(a, e)
    }
    ,
    c.prototype.uniform2fv = function(t, e) {
        var a = this.getUniformLocation(t);
        a && gl.uniform2fv(a, e)
    }
    ,
    c.prototype.uniform3fv = function(t, e) {
        var a = this.getUniformLocation(t);
        a && gl.uniform3fv(a, e)
    }
    ,
    c.prototype.uniform4fv = function(t, e) {
        var a = this.getUniformLocation(t);
        a && gl.uniform4fv(a, e)
    }
    ,
    c.prototype.uniformMatrix3fv = function(t, e, a) {
        var n = this.getUniformLocation(t);
        n && (a = a || !1,
        gl.uniformMatrix3fv(n, a, e))
    }
    ,
    c.prototype.uniformMatrix4fv = function(t, e, a) {
        var n = this.getUniformLocation(t);
        n && (a = a || !1,
        gl.uniformMatrix4fv(n, a, e))
    }
    ,
    c.prototype.uniformSampler = function(t, e, a) {
        var n = this.uniforms[t];
        n && (gl.activeTexture(gl.TEXTURE0 + n.texUnit),
        gl.bindTexture(e, a),
        gl.uniform1i(n.location, n.texUnit))
    }
    ,
    c.prototype.uniformSampler2D = function(t, e) {
        this.uniformSampler(t, gl.TEXTURE_2D, e)
    }
    ,
    c.prototype.uniformSamplerCube = function(t, e) {
        this.uniformSampler(t, gl.TEXTURE_CUBE_MAP, e)
    }
    ,
    c.prototype.enableVertexAttribArray = function(t) {
        var e = this.attribs[t];
        return e ? (gt.enable(e.index),
        e.index) : -1
    }
    ,
    c.prototype.disableVertexAttribArray = function(t) {
        var e = this.attribs[t];
        return e ? (gt.disable(e.index),
        e.index) : -1
    }
    ,
    c.prototype.vertexAttribPointer = function(t, e, a, n, r, o) {
        var i = this.attribs[t];
        i && (gt.enable(i.index),
        gl.vertexAttribPointer(i.index, e, a, n, r, o))
    }
    ;
    var Mt = {}
      , xt = function() {
        function t(t) {
            var e = !!Mt[t];
            return console.assert(e, t + " not found."),
            e
        }
        function e(e, a) {
            if (t(e) && t(e + ".vertex") && t(e + ".fragment")) {
                a = a || {};
                var n = "";
                a.defines && _.each(a.defines, function(t, e) {
                    n += "#define " + e + " " + t + "\n"
                });
                var r = n + (Mt[e] || "")
                  , o = _.reject(r.split("\n"), function(t) {
                    return t.match(/attribute/)
                }).join("\n");
                try {
                    var i = new c(e);
                    return i.set_program(f({
                        name: e,
                        vertexSource: r + Mt[e + ".vertex"],
                        fragmentSource: o + Mt[e + ".fragment"]
                    })),
                    i
                } catch (t) {
                    return null
                }
            }
        }
        function a(t, e) {
            var a = [];
            return e && e.defines && _.each(e.defines, function(t, e) {
                a.push(e + "=" + t)
            }),
            t + " " + a.join(" ")
        }
        return _.memoize(e, a)
    }()
      , bt = {}
      , yt = /([1-4])(f|x|b|ub|s|us)(\*?)/
      , wt = {
        f: {
            type: "float",
            size: 4,
            dataview_get: DataView.prototype.getFloat32,
            dataview_set: DataView.prototype.setFloat32
        },
        x: {
            type: "fixed",
            size: 4,
            dataview_get: DataView.prototype.getUint32,
            dataview_set: DataView.prototype.setUint32
        },
        b: {
            type: "byte",
            size: 1,
            dataview_get: DataView.prototype.getInt8,
            dataview_set: DataView.prototype.setInt8
        },
        ub: {
            type: "unsigned_byte",
            size: 1,
            dataview_get: DataView.prototype.getUint8,
            dataview_set: DataView.prototype.setUint8
        },
        s: {
            type: "short",
            size: 2,
            dataview_get: DataView.prototype.getInt16,
            dataview_set: DataView.prototype.setInt16
        },
        us: {
            type: "unsigned_short",
            size: 2,
            dataview_get: DataView.prototype.getUint16,
            dataview_set: DataView.prototype.setUint16
        }
    }
      // NOTE: could be map loading code??
      , St = function t(e, a) {
        q(this, t),
        this.name = e;
        var n = yt.exec(a);
        console.assert(n, "Bad attribute format"),
        this.format = a,
        this.size = parseInt(n[1]);
        var r = wt[n[2]];
        this.type = gl[r.type.toUpperCase()],
        this.normalized = !!n[3],
        this.byte_size = this.size * r.size,
        this.byte_offset = 0;
        var o = this;
        switch (this.get = function(t, e, a) {
            var n = e + o.byte_offset;
            if (1 === this.size)
                return r.dataview_get(t, n, !0);
            for (var i = 0; i < o.size; ++i)
                a[i] = r.dataview_get.call(t, n, !0),
                n += r.size;
            return a
        }
        ,
        this.set = function(t, e, a) {
            var n = e + o.byte_offset;
            if (1 === this.size)
                r.dataview_set(t, n, a, !0);
            else
                for (var i = 0; i < o.size; ++i)
                    a[i] = r.dataview_set.call(t, n, a[i], !0),
                    n += r.size
        }
        ,
        this.size) {
        case 1:
            this.create = function() {
                return 0
            }
            ;
            break;
        case 2:
            this.create = ct.create;
            break;
        case 3:
            this.create = dt.create;
            break;
        case 4:
            this.create = ft.create
        }
    }
      , It = (function() {
        function t() {
            q(this, t);
            var e = 0
              , a = null;
            _.isNumber(arguments[0]) ? (e = arguments[0],
            a = arguments[1]) : a = arguments[0];
            var n = this;
            this.layout = {};
            var r = 0;
            _.each(a, function(t, e) {
                var a = new St(e,t);
                a.byte_offset = r,
                r += a.byte_size,
                n.layout[e] = a
            }),
            this.byte_stride = r,
            this.length = e || 0,
            this.buffer = new ArrayBuffer(this.byte_stride * (e ? e : 1)),
            this.buffer_view = new DataView(this.buffer)
        }
        C(t, [{
            key: "gl_attrib_pointer",
            value: function(t, e, a) {
                if (!(e < 0)) {
                    var n = this.layout[t];
                    gl.vertexAttribPointer(e, n.size, n.type, n.normalized, this.byte_stride, n.byte_offset),
                    a && webgl.extensions.ANGLE_instanced_arrays.vertexAttribDivisorANGLE(e, 1)
                }
            }
        }, {
            key: "struct",
            value: function(t) {
                var t = {};
                return _.each(this.layout, function(e, a) {
                    t[a] = e.create()
                }),
                t
            }
        }, {
            key: "append",
            value: function(t) {
                var e = this.buffer.byteLength;
                if (e < (this.length + 1) * this.byte_stride) {
                    var a = e << 1
                      , n = new ArrayBuffer(a);
                    new Uint8Array(n).set(new Uint8Array(this.buffer)),
                    this.buffer = n,
                    this.buffer_view = new DataView(this.buffer)
                }
                this.save(t, this.length++)
            }
        }, {
            key: "push",
            value: function(t) {
                return this.append(t)
            }
        }, {
            key: "trim",
            value: function() {
                var t = this.buffer.byteLength
                  , e = this.length * this.byte_stride;
                e < t && (this.buffer = this.buffer.slice(0, e),
                this.buffer_view = new DataView(this.buffer))
            }
        }, {
            key: "save",
            value: function(t, e) {
                var a = this.buffer_view
                  , n = e * this.byte_stride;
                _.each(this.layout, function(e) {
                    e.set(a, n, t[e.name])
                })
            }
        }, {
            key: "load",
            value: function(t, e) {
                var a = this.buffer_view
                  , n = e * this.byte_stride;
                _.each(this.layout, function(e) {
                    t[e.name] = e.get(a, n, t[e.name])
                })
            }
        }, {
            key: "each",
            value: function(t) {
                for (var e = this.struct(), a = 0; a < this.length; ++a)
                    this.load(e, a),
                    t(e, a),
                    this.save(e, a)
            }
        }, {
            key: "each_triangle",
            value: function(t) {
                for (var e = [this.struct(), this.struct(), this.struct()], a = 0; a < this.length; a += 3) {
                    for (var n = 0; n < 3; ++n)
                        this.load(e[n], a + n);
                    t(e, a / 3);
                    for (var n = 0; n < 3; ++n)
                        this.save(e[n], a + n)
                }
            }
        }, {
            key: "each_triangle_indexed",
            value: function(t, e) {
                for (var a = [this.struct(), this.struct(), this.struct()], n = 0; n < t.length; n += 3) {
                    for (var r = 0; r < 3; ++r)
                        this.load(a[r], t[n + r]);
                    e(a, n / 3);
                    for (var r = 0; r < 3; ++r)
                        this.save(a[r], t[n + r])
                }
            }
        }]),
        t
    }(),
    {
        vec3: w(dt),
        vec4: w(ft),
        quat: w(ut),
        mat4: w(lt)
    })
      , Dt = function() {
        function t(e) {
            q(this, t);
            var a = this.el = document.createElement("canvas");
            e = e || {},
            window.gl = x(a, {
                antialias: e.antialias || !1,
                extensions: e.extensions || [],
                shaderSources: e.shaders
            }),
            console.assert(gl),
            gl && (this.draw = function() {}
            ,
            this.redraw_queued = !1,
            this.camera = new l,
            this.camera.near = .1,
            this.camera.far = 100,
            this.orbit = {
                rotate: dt.fromValues(0, -.2, 0),
                translate: dt.fromValues(0, 0, 10)
            },
            this.clear_color = ft.fromValues(0, 0, 0, 1),
            this.mouse = {
                pos: ct.create(),
                delta: ct.create(),
                button: -1
            },
            this.on_camera_moved = function() {}
            )
        }
        return C(t, [{
            key: "update_mouse",
            value: function(t) {
                var e = It.vec3[0];
                r(e, t);
                var a = this.mouse;
                ct.sub(a.delta, e, a.pos),
                ct.copy(a.pos, e)
            }
        }, {
            key: "init_input",
            value: function() {
                function t(t) {
                    t = t || "default",
                    l.style.cursor = t
                }
                function e() {
                    l.addEventListener("mousemove", r),
                    document.addEventListener("mouseup", o),
                    document.addEventListener("mousewheel", i)
                }
                function a() {
                    l.removeEventListener("mousemove", r),
                    document.removeEventListener("mouseup", o),
                    document.removeEventListener("mousewheel", i)
                }
                function n(a) {
                    s.update_mouse(a),
                    s.mouse.button = a.button,
                    t("move"),
                    e(),
                    a.preventDefault()
                }
                function r(t) {
                    s.update_mouse(t);
                    var e = s.mouse
                      , a = s.orbit
                      , n = s.camera
                      , r = 1e-4 * n.far;
                    if (!(e.button < 0)) {
                        if (0 === e.button) {
                            if (t.ctrlKey) {
                                var o = e.delta[0]
                                  , i = e.delta[1]
                                  , l = Math.abs(o) > Math.abs(i) ? o : -i;
                                a.translate[2] += .02 * l
                            } else
                                ct.scaleAndAdd(a.rotate, a.rotate, e.delta, -.0015);
                            s.on_camera_moved()
                        }
                        if (1 === e.button && (a.translate[0] += -r * e.delta[0],
                        a.translate[1] += r * e.delta[1],
                        s.on_camera_moved()),
                        2 === e.button) {
                            var o = e.delta[0]
                              , i = e.delta[1]
                              , l = Math.abs(o) > Math.abs(i) ? -o : i;
                            a.translate[2] += 2 * r * l,
                            s.on_camera_moved()
                        }
                        s.redraw()
                    }
                }
                function o(e) {
                    s.mouse.button >= 0 && (t(),
                    a(),
                    s.mouse.button = -1),
                    s.redraw()
                }
                function i(t) {
                    var e = t.wheelDelta / 120;
                    return s.orbit.translate[2] *= e < 0 ? .9 : 1.1,
                    s.redraw(),
                    s.on_camera_moved(),
                    !1
                }
                var s = this
                  , l = this.el;
                this.mouse;
                l.addEventListener("mousedown", n),
                l.addEventListener("mousewheel", i),
                l.addEventListener("contextmenu", function(t) {
                    t.preventDefault()
                })
            }
        }, {
            key: "redraw",
            value: function() {
                var t = this;
                this.redraw_queued || (this.redraw_queued = !0,
                requestAnimationFrame(function() {
                    t._draw(),
                    t.redraw_queued = !1
                }))
            }
        }, {
            key: "check_resize",
            value: function() {
                var t = this.el
                  , e = this.camera;
                t.width === t.clientWidth && t.height === t.clientHeight || (t.width = t.clientWidth,
                t.height = t.clientHeight,
                gl.viewport(0, 0, t.width, t.height),
                ft.copy(e.viewport, gl.getParameter(gl.VIEWPORT)))
            }
        }, {
            key: "reset_camera",
            value: function() {
                this.redraw()
            }
        }, {
            key: "update_camera",
            value: function() {
                var t = this.orbit
                  , e = (this.camera,
                It.mat4[0]);
                lt.identity(e),
                lt.rotateY(e, e, t.rotate[0]),
                lt.rotateX(e, e, t.rotate[1]);
                var a = It.vec3[0];
                dt.transformMat4(a, t.translate, e);
                var n = It.vec3[1];
                dt.set(n, 0, 0, -1),
                dt.transformMat4(n, n, e),
                this.camera.update(a, n)
            }
        }, {
            key: "_draw",
            value: function() {
                this.check_resize(),
                this.update_camera();
                var t = this.clear_color;
                gl.clearColor(t[0], t[1], t[2], t[3]),
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT),
                this.draw()
            }
        }]),
        t
    }()
      , Ft = function() {
        function t() {
            q(this, t),
            this.pos = dt.create(),
            this.dir = 0,
            this.mat = lt.create(),
            this.geom = null,
            this.pgm = xt("simple"),
            this.level = null,
            this.collide = !0,
            this.area = 0,
            this.mvp = lt.create(),
            this.inverse_mvp = lt.create(),
            this.touch = {
                rotate: 0,
                rotating: !1,
                advance: 0
            }
        }
        return C(t, [{
            key: "move",
            value: function(t, e, a) {
                this.pos[0] += t || 0,
                this.pos[1] += e || 0,
                this.pos[2] += a || 0
            }
        }, {
            key: "rotate",
            value: function(t) {
                this.dir += t
            }
        }, {
            key: "set_area",
            value: function(t) {
                this.area != t && (this.on_leave_area(this.area),
                this.area = t,
                this.on_enter_area(this.area))
            }
        }, {
            key: "on_leave_area",
            value: function(t) {}
        }, {
            key: "on_enter_area",
            value: function(t) {}
        }, {
            key: "advance",
            value: function(t) {
                var e = -.5 * Math.PI * this.dir
                  , a = this.pos[0] + t * Math.cos(e)
                  , n = this.pos[1] + t * Math.sin(e)
                  , r = 0;
                28 <= a && a <= 32 && (r = 1);
                var o = this.pos[2] + r;
                if (this.collide && this.level) {
                    var i = this.level.get_tile(a, n, o)
                      , s = G(i, 2)
                      , l = s[0]
                      , u = s[1];
                    if (!l)
                        return;
                    if (1 == l.area)
                        return;
                    this.set_area(l.area)
                } else
                    var u = 0;
                u = Math.max(u, 0);
                this.pos[0] = a,
                this.pos[1] = n,
                this.pos[2] = u + .5
            }
        }, {
            key: "draw",
            value: function(t) {
                this.geom || this.create_geom(),
                gl.disable(gl.DEPTH_TEST),
                gl.disable(gl.CULL_FACE);
                var e = xt("simple").use()
                  , a = this.mat;
                this.get_matrix(a, .5 / 1024),
                lt.multiply(a, t.camera.mvp, a),
                e.uniformMatrix4fv("mvp", a),
                e.uniform4f("color", 1, 0, 0, 1),
                g(this.geom.buffer),
                e.vertexAttribPointer("position", 3, gl.FLOAT, !1, 0, 0),
                gl.drawArrays(gl.TRIANGLES, 0, this.geom.count)
            }
        }, {
            key: "get_matrix",
            value: function(t, e) {
                var a = this.pos[0]
                  , n = this.pos[1]
                  , r = this.pos[2];
                lt.identity(t),
                lt.translate(t, t, [a, r, -n]),
                lt.scale(t, t, [e, e, e]),
                lt.rotateY(t, t, -.5 * this.dir * Math.PI)
            }
        }, {
            key: "create_geom",
            value: function() {
                function t(t, a) {
                    var n = 2 * Math.PI * t;
                    e.push(a * Math.cos(n), 0, a * Math.sin(n))
                }
                for (var e = [], a = 0; a < 30; ++a) {
                    var n = a / 30
                      , r = (a + 1) / 30;
                    t(n, 500),
                    t(n, 700),
                    t(r, 700),
                    t(n, 500),
                    t(r, 700),
                    t(r, 500)
                }
                t(-.03, 800),
                t(.03, 800),
                t(0, 1024),
                e = new Float32Array(e),
                this.geom = {
                    buffer: v(e),
                    count: e.length / 3
                }
            }
        }, {
            key: "check_keys",
            value: function() {
                var t = .1;
                if (key.shift && (t *= 3),
                key.control && (t *= .1),
                key.isPressed("left") && this.rotate(-(1 / 64)),
                key.isPressed("right") && this.rotate(1 / 64),
                key.isPressed("up") && this.advance(t),
                key.isPressed("down") && this.advance(-t),
                this.rotate(this.touch.rotate),
                Math.abs(this.touch.advance) > .1) {
                    var a = e(this.touch.advance, -t, t);
                    this.advance(a)
                }
            }
        }]),
        t
    }()
      , At = (dt.create(),
    dt.create(),
    dt.create(),
    dt.create())
      , Et = dt.create()
      , Tt = dt.create()
      , Pt = dt.create()
      , Rt = dt.create()
      , kt = 1e-5
      , Lt = -1;
    I.prototype.dot2 = function(t, e) {
        return this.x * t + this.y * e
    }
    ,
    I.prototype.dot3 = function(t, e, a) {
        return this.x * t + this.y * e + this.z * a
    }
    ;
    var zt = [new I(1,1,0), new I(-1,1,0), new I(1,-1,0), new I(-1,-1,0), new I(1,0,1), new I(-1,0,1), new I(1,0,-1), new I(-1,0,-1), new I(0,1,1), new I(0,-1,1), new I(0,1,-1), new I(0,-1,-1)]
      , Ot = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180]
      , Nt = new Array(512)
      , Ut = new Array(512);
    !function(t) {
        t > 0 && t < 1 && (t *= 65536),
        (t = Math.floor(t)) < 256 && (t |= t << 8);
        for (var e = 0; e < 256; e++) {
            var a;
            a = 1 & e ? Ot[e] ^ 255 & t : Ot[e] ^ t >> 8 & 255,
            Nt[e] = Nt[e + 256] = a,
            Ut[e] = Ut[e + 256] = zt[a % 12]
        }
    }(0);
    var Bt = .5 * (Math.sqrt(3) - 1)
      , qt = (3 - Math.sqrt(3)) / 6
      , Ct = new Float32Array(12)
      , Gt = dt.create()
      , Yt = 24
      , Xt = {
        barrel: 0,
        headless_woman: 1,
        dumpster: 2,
        dumpster_body: 3,
        hopskotch_girl: 4,
        corpse: 5,
        boat: 6,
        hanged_woman: 7,
        spaceship: 8,
        pulse: 9,
        kicker: 10,
        ghost: 11,
        gunman: 12,
        victim: 13,
        car: 14,
        sailor: 15,
        boat2: 16,
        plane: 17,
        boat3: 18
    }
      // NOTE: resolves models in lvl5.json
      , Vt = new Uint8Array([0, 8, 16, 25, 33, 41, 49, 58, 66, 74, 82, 90, 99, 107, 115, 123, 132, 140, 148, 156, 165, 173, 181, 189, 197, 206, 214, 222, 230, 239, 247, 255])
      , Ht = lt.create()
      , jt = lt.create()
      , $t = dt.create()
      , Wt = function t(e, a, n, r) {
        q(this, t),
        this.buffer = e,
        this.start = a,
        this.count = n,
        this.matrix = lt.clone(r)
    }
      , Qt = function() {
        function t() {
            q(this, t),
            this.draws = [],
            this.index = 0
        }
        return C(t, [{
            key: "clear",
            value: function() {
                this.index = 0,
                this.created = 0
            }
        }, {
            key: "push",
            value: function(t, e, a, n) {
                var r;
                this.index >= this.draws.length ? (r = new Wt(t,e,a,n),
                ++this.created,
                this.draws.push(r),
                this.index = this.draws.length) : (r = this.draws[this.index++],
                r.buffer = t,
                r.start = e,
                r.count = a,
                lt.copy(r.matrix, n))
            }
        }]),
        t
    }()
      , Kt = {
        0: [0, 0, 0],
        1: [255, 0, 0],
        2: [0, 255, 0],
        3: [0, 0, 255],
        4: [255, 255, 0],
        5: [255, 0, 255],
        6: [0, 255, 255],
        7: [255, 128, 0],
        8: [0, 255, 128],
        9: [255, 255, 192],
        10: [192, 255, 192]
    }
      , Zt = function() {
        function t() {
            var e = this;
            q(this, t),
            this.id = 0,
            this.name = "",
            this.map = null,
            this.tiles = [],
            this.models = [],
            this.buffers = [],
            this.characters = [],
            this.pgm = null,
            this.gl_buffers = [],
            this.bound_buffer_index = -1,
            this.texture = null,
            this.fog_enabled = !0,
            this.ready = !1,
            this.time = 0,
            this.ghost = {
                pos: dt.fromValues(61.39, 32.61, 0),
                dir: 0,
                active: !1
            },
            this.plane_start = 0,
            this.draws = {
                opaque: new Qt,
                translucent: new Qt
            },
            this.quad = null,
            this.loop = null,
            this.areas_texture = null,
            this.areas_lut = null,
            this.save_areas_db = _.debounce(function() {
                return e.save_areas_to_local_storage()
            }, 1e3),
            this.draw_debug = !1,
            this.flicker = !1,
            this.player = null,
            this.frustum_quad = new Float32Array(8),
            this.use_frustum_tiles = !0
        }
        return C(t, [{
            key: "save_areas_to_local_storage",
            value: function() {
                for (var t = this.map.w, e = this.map.h, a = t * e, n = new Uint8Array(a), r = this.tiles, o = 0; o < a; ++o) {
                    var i = this.map.tiles[o]
                      , l = r[i];
                    n[o] = l ? l.area : 0
                }
                var u = s(n);
                localStorage.setItem("level.areas", u),
                console.log("save_areas:", u.length)
            }
        }, {
            key: "load_areas_from_local_storage",
            value: function(t) {
                if (t || (t = localStorage.getItem("level.areas")),
                t) {
                    var e = i(t, Uint8Array);
                    console.log("load_areas:", e.length);
                    for (var a = this.map.w, n = this.map.h, r = a * n, o = this.tiles, s = 0; s < r; ++s) {
                        var l = this.map.tiles[s]
                          , u = o[l];
                        u && (u.area = e[s])
                    }
                    this.update_areas_texture()
                }
            }
        }, {
            key: "toggle_area",
            value: function(t, e, a) {
                var n = Math.floor(t)
                  , r = Math.floor(e);
                if (!(n < 0 || n >= this.map.w || r < 0 || r >= this.map.h)) {
                    var o = r * this.map.w + n
                      , i = this.map.tiles[o]
                      , s = this.tiles[i];
                    s && (s.area = s.area === a ? 0 : a,
                    this.update_areas_texture(),
                    this.save_areas_db())
                }
            }
        }, {
            key: "update_areas_texture",
            value: function() {
                var t = this.map.w
                  , e = this.map.h;
                if (!this.areas_texture) {
                    console.log("level.update_areas_texture: creating debug textures"),
                    this.areas_lut = createAndBindTexture(gl.RGBA, 256, 1);
                    var a = new Uint8Array(1024);
                    _.each(Kt, function(t, e) {
                        var n = 4 * e;
                        a[n + 0] = t[0],
                        a[n + 1] = t[1],
                        a[n + 2] = t[2],
                        a[n + 3] = 255
                    }),
                    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 256, 1, gl.RGBA, gl.UNSIGNED_BYTE, a),
                    this.areas_texture = createAndBindTexture(gl.RGBA, t, e)
                }
                for (var n = new Uint8Array(4 * t * e), r = this.tiles, o = t * e, i = 0, s = 0; s < o; ++s) {
                    var l = this.map.tiles[s]
                      , u = r[l];
                    n[i + 0] = u ? u.area : 0,
                    n[i + 1] = 0,
                    n[i + 2] = 0,
                    n[i + 3] = 0,
                    i += 4
                }
                gl.bindTexture(gl.TEXTURE_2D, this.areas_texture),
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0),
                gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, t, e, gl.RGBA, gl.UNSIGNED_BYTE, n)
            }
        }, {
            key: "load",
            value: function(t) {
                var e = this;
                return Promise.all([o("data/lvl5.mpz").then(function(t) {
                    e.initialize(t)
                }), this.load_texture("d")])
            }
        }, {
            key: "load_texture",
            value: function() {
                var t = this
                  , e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "a";
                return this.texture || (this.texture = createAndBindTexture(gl.RGBA, 2048, 512)),
                o("data/tex5" + e + ".mpz").then(function(e) {
                    function a(t, e, a) {
                        return new Promise(function(r) {
                            var o = new Image;
                            o.src = t,
                            o.onload = function() {
                                gl.bindTexture(gl.TEXTURE_2D, n),
                                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1),
                                gl.texSubImage2D(gl.TEXTURE_2D, 0, e << 7, a << 7, gl.RGBA, gl.UNSIGNED_BYTE, o)
                            }
                        }
                        )
                    }
                    gl.bindTexture(gl.TEXTURE_2D, t.texture),
                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0),
                    e.forEach(function(t) {
                        var e = P(t);
                        gl.texSubImage2D(gl.TEXTURE_2D, 0, t.x, t.y, t.w, t.h, gl.RGBA, gl.UNSIGNED_BYTE, e)
                    });
                    var n = t.texture;
                    a("images/grave2.png", 2, 0),
                    a("images/ground.jpg", 13, 1)
                })
            }
        }, {
            key: "initialize",
            value: function(t) {
                _.assign(this, t),
                this.pgm = xt("tmd"),
                this.gl_buffers = _.map(this.buffers, function(t) {
                    var e = gl.createBuffer();
                    return gl.bindBuffer(gl.ARRAY_BUFFER, e),
                    gl.bufferData(gl.ARRAY_BUFFER, t, gl.STATIC_DRAW),
                    e
                }),
                this.ready = !0;
                var e = this;
                !function() {
                    for (var t = e.map.w, a = (e.map.h,
                    18 * t + 94), n = e.map.tiles[a], r = e.tiles[n]; r.next; )
                        r = e.tiles[r.next];
                    console.log("grave tile:", r);
                    var o = {
                        area: 0,
                        height: 0,
                        model: 0,
                        next: 0,
                        rotate: 3
                    }
                      , i = e.tiles.length;
                    e.tiles.push(o),
                    r.next = i
                }()
            }
        }, {
            key: "bind_buffer",
            value: function(t) {
                if (t !== this.bound_buffer_index) {
                    var e = this.gl_buffers[t];
                    gl.bindBuffer(gl.ARRAY_BUFFER, e);
                    var a = this.pgm;
                    a.vertexAttribPointer("position", 3, gl.SHORT, !1, 24, 0),
                    a.vertexAttribPointer("normal", 3, gl.SHORT, !1, 24, 8),
                    a.vertexAttribPointer("color", 3, gl.UNSIGNED_BYTE, !0, 24, 16),
                    a.vertexAttribPointer("texcoord", 2, gl.UNSIGNED_SHORT, !1, 24, 20),
                    this.bound_buffer_index = t
                }
            }
        }, {
            key: "draw_model",
            value: function(t, e) {
                var a = this.models[t]
                  , n = a.opaque_count;
                n && this.draws.opaque.push(a.buffer, a.start, n, e);
                var r = a.count - n;
                r && this.draws.translucent.push(a.buffer, a.start + n, r, e)
            }
        }, {
            key: "draw_models",
            value: function(t) {
                for (var e = this.pgm, a = t.draws, n = t.index, r = 0; r < n; ++r) {
                    var o = a[r];
                    this.bind_buffer(o.buffer),
                    e.uniformMatrix4fv("m_obj", o.matrix),
                    gl.drawArrays(gl.TRIANGLES, o.start, o.count)
                }
            }
        }, {
            key: "draw_tile",
            value: function(t, e, a, n) {
                var r = this.tiles[t];
                lt.identity(jt),
                lt.translate(jt, jt, [e + .5, n - r.height, -(a + .5)]),
                lt.scale(jt, jt, [.5 / 1024, .5 / 1024, .5 / 1024]),
                lt.rotateY(jt, jt, -.5 * r.rotate * Math.PI),
                this.draw_model(r.model, jt),
                r.next && this.draw_tile(r.next, e, a, n)
            }
        }, {
            key: "draw_character",
            value: function(t, e, a, n, r, o) {
                var i = this
                  , s = arguments.length > 6 && void 0 !== arguments[6] && arguments[6];
                a += 1;
                var l = performance.now();
                if (t == Xt.plane) {
                    if (!this.plane_start)
                        return;
                    if ((l -= this.plane_start) > 4e3)
                        return
                }
                var u = Math.floor(60 * l / 1e3)
                  , c = this.characters[t]
                  , d = c.takes[0];
                r *= .5 / 1024,
                lt.identity(jt),
                lt.translate(jt, jt, [e + .5, n, .5 - a]),
                lt.scale(jt, jt, [r, r, r]),
                lt.rotateY(jt, jt, -.5 * o * Math.PI),
                d.parts.forEach(function(t) {
                    var e = 0;
                    s && (e = Math.floor(u / d.resolution % d.nframes)); // NOTE: animation frame calculation??
                    for (var a = 16 * e, n = 0; n < 16; ++n)
                        Ht[n] = t.mats[a + n];
                    lt.multiply(Ht, jt, Ht),
                    i.draw_model(t.model, Ht)
                })
            }
        }, {
            key: "draw",
            value: function(t) {
                if (this.ready) {
                    this.calc_frustum(),
                    this.time = performance.now() / 1e3,
                    this.bound_buffer_index = -1;
                    var e = this.pgm.use();
                    if (e.uniformMatrix4fv("m_vp", t.camera.mvp),
                    e.uniform3fv("view_pos", t.camera.view_pos),
                    e.uniform3fv("light_pos", t.light_pos),
                    e.uniformSampler2D("s_tix", this.texture),
                    this.fog_enabled) {
                        var a = t.camera.far;
                        e.uniform3f("fog_color", .05, 0, .15),
                        e.uniform2f("fog_range", .5 * a, a)
                    } else
                        e.uniform2f("fog_range", 1e4, 1e4);
                    if (gl.enable(gl.DEPTH_TEST),
                    gl.disable(gl.CULL_FACE),
                    this.draws.opaque.clear(),
                    this.draws.translucent.clear(),
                    this.draw2(t),
                    dt.set($t, .75, .75, .75),
                    this.flicker) {
                        var n = performance.now() / 1e3
                          , r = .85 * (.5 + .5 * D(n, .3123))
                          , o = .5 * (.5 + .5 * D(2 * n, .3123))
                          , i = 1 * (.5 + .5 * D(8 * n, .3123));
                        dt.scaleAndAdd($t, $t, [1, .9, .5], .1 * i),
                        dt.scaleAndAdd($t, $t, [1, .2, .5], .2 * o),
                        dt.scaleAndAdd($t, $t, [1, .1, 0], .7 * r)
                    }
                    e.uniform3fv("ambient", $t),
                    this.draw_models(this.draws.opaque),
                    gl.enable(gl.BLEND),
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE),
                    gl.depthMask(!1),
                    this.draw_models(this.draws.translucent),
                    this.draw_debug && (this.draw_tiles_debug(t),
                    this.draw_frustum(t)),
                    gl.depthMask(!0),
                    gl.disable(gl.BLEND)
                }
            }
        }, {
            key: "calc_frustum",
            value: function() {
                if (this.player) {
                    var t = this.player.inverse_mvp
                      , e = this.frustum_quad;
                    E(e, 0, t, -1, -1),
                    E(e, 2, t, 1, -1),
                    E(e, 4, t, 1, 1),
                    E(e, 6, t, -1, 1)
                }
            }
        }, {
            key: "draw_frustum",
            value: function(t) {
                if (this.loop || (this.loop = v(new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]))),
                this.player) {
                    lt.identity(jt),
                    lt.rotateX(jt, jt, -.5 * Math.PI),
                    lt.multiply(jt, t.camera.mvp, jt);
                    var e = xt("simple").use();
                    e.uniformMatrix4fv("mvp", jt),
                    e.uniform4f("color", 1, 1, 0, 1),
                    g(this.loop),
                    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.frustum_quad),
                    e.vertexAttribPointer("position", 2, gl.FLOAT, !1, 0, 0),
                    gl.disable(gl.DEPTH_TEST),
                    gl.drawArrays(gl.LINE_LOOP, 0, 4),
                    e.uniform4f("color", 0, 1, 1, .25),
                    g(this.quad),
                    e.vertexAttribPointer("position", 2, gl.FLOAT, !1, 0, 0),
                    A(this.frustum_quad, function(a, n) {
                        lt.identity(jt),
                        lt.translate(jt, jt, [a, 0, -n]),
                        lt.rotateX(jt, jt, -.5 * Math.PI),
                        lt.multiply(jt, t.camera.mvp, jt),
                        e.uniformMatrix4fv("mvp", jt),
                        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
                    })
                }
            }
        }, {
            key: "draw_tiles_debug",
            value: function(t) {
                this.areas_texture || this.update_areas_texture();
                var e = xt("tiles").use();
                e.uniformMatrix4fv("m_vp", t.camera.mvp),
                e.uniform2f("size", this.map.w, this.map.h),
                e.uniform4f("color", 1, 1, 1, .1),
                e.uniformSampler2D("s_map", this.areas_texture),
                e.uniformSampler2D("s_lut", this.areas_lut),
                this.quad || (this.quad = v(new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]))),
                g(this.quad),
                e.vertexAttribPointer("coord", 2, gl.FLOAT, !1, 0, 0),
                gl.disable(gl.DEPTH_TEST),
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
            }
        }, {
            key: "draw2",
            value: function(t) {
                var e = this
                  , a = (this.pgm,
                this.map.w)
                  , n = this.map.h
                  , r = this.map.tiles
                  , o = (this.tiles,
                !0);
                if (this.draw_debug && (o = !1),
                o)
                    A(this.frustum_quad, function(t, o) {
                        if (!(t < 0 || t >= a || o < 0 || o >= n)) {
                            var i = o * a + t
                              , s = r[i];
                            0 !== s && e.draw_tile(s, t, o, 0)
                        }
                    });
                else
                    for (var i = 0, s = 0; s < n; ++s)
                        for (var l = 0; l < a; ++l) {
                            var u = r[i++];
                            0 !== u && this.draw_tile(u, l, s, 0)
                        }
                this.draw_character(Xt.corpse, 59.93, 38, 0, 1.5, 3),
                this.draw_character(Xt.hopskotch_girl, 44, 25, .05, 1, 0, !0),
                this.draw_character(Xt.sailor, 77.3, 97.25, -.015, 1, 0),
                this.draw_character(Xt.headless_woman, 62.9, 8.9, 0, 1, 2),
                this.draw_character(Xt.kicker, 91.1, 13.39, 0, 1, 1.2, !0),
                this.draw_character(Xt.corpse, 91.54, 9.33, 0, 1, -.5),
                this.draw_character(Xt.dumpster, 92, 10, 0, 1, .5),
                this.draw_character(Xt.plane, 77.3, 97.25, 0, 1, 0, !0),
                this.draw_character(Xt.car, 60, 85, 0, 1, 0),
                this.draw_character(Xt.gunman, 93, 70, 0, 1, 0),
                this.draw_character(Xt.victim, 93, 66.25, 0, 1, 2);
                var l = .025 * this.time;
                this.draw_character(Xt.boat, 13.5, 64.85 - l, 0, 1, 0, !0),
                this.draw_character(Xt.dumpster_body, 54.3, 28.71, 0, 1, 0);
                var c = this.ghost.pos
                  , d = this.ghost.dir;
                this.draw_character(Xt.ghost, c[0], c[1], c[2], 1, d, !0)
            }
        }, {
            key: "get_tile",
            value: function(t, e, a) {
                var n = Math.floor(t)
                  , r = Math.floor(e)
                  , o = this.map.w
                  , i = this.map.h;
                if (n < 0 || n >= o || r < 0 || r >= i)
                    return [null, 0, 0];
                var s = r * o + n
                  , l = this.map.tiles[s];
                if (0 === l)
                    return [null, 0, 0];
                var u = this.tiles[l];
                return console.assert(u),
                [u, k(this, u, t - n, e - r, a)]
            }
        }]),
        t
    }()
      , Jt = dt.create()
      , te = dt.create()
      , ee = dt.create()
      , ae = dt.create()
      , ne = dt.create()
      , re = lt.create()
      , oe = ft.create()
      , ie = function() {
        function t(e) {
            q(this, t),
            this.camera = e,
            this.origin = dt.create(),
            this.direction = dt.create()
        }
        return C(t, [{
            key: "unproject",
            value: function(t, e) {
                var a = this.camera.viewport
                  , n = oe;
                return n[0] = 2 * (e[0] - a[0]) / a[2] - 1,
                n[1] = 2 * (e[1] - a[1]) / a[3] - 1,
                n[2] = 2 * e[2] - 1,
                n[3] = 1,
                ft.transformMat4(n, n, this.camera.inv_mvp),
                0 !== n[3] && (t[0] = n[0] / n[3],
                t[1] = n[1] / n[3],
                t[2] = n[2] / n[3],
                !0)
            }
        }, {
            key: "fromWindowCoords",
            value: function(t, e) {
                var a = this.origin
                  , n = this.direction;
                a[0] = n[0] = t,
                a[1] = n[1] = e,
                a[2] = 0,
                n[2] = 1,
                this.unproject(a, a),
                this.unproject(n, n),
                dt.subtract(n, n, a),
                dt.normalize(n, n)
            }
        }]),
        t
    }()
      , se = function() {
        var t = document.getSelection();
        if (!t.rangeCount)
            return function() {}
            ;
        for (var e = document.activeElement, a = [], n = 0; n < t.rangeCount; n++)
            a.push(t.getRangeAt(n));
        switch (e.tagName.toUpperCase()) {
        case "INPUT":
        case "TEXTAREA":
            e.blur();
            break;
        default:
            e = null
        }
        return t.removeAllRanges(),
        function() {
            "Caret" === t.type && t.removeAllRanges(),
            t.rangeCount || a.forEach(function(e) {
                t.addRange(e)
            }),
            e && e.focus()
        }
    }
      , le = "Copy to clipboard: #{key}, Enter"
      , ue = z
      , ce = function(t, e) {
        return e = {
            exports: {}
        },
        t(e, e.exports),
        e.exports
    }(function(t, e) {
        !function() {
            var t = function() {
                this.init()
            };
            t.prototype = {
                init: function() {
                    var t = this || a;
                    return t._counter = 0,
                    t._codecs = {},
                    t._howls = [],
                    t._muted = !1,
                    t._volume = 1,
                    t._canPlayEvent = "canplaythrough",
                    t._navigator = "undefined" != typeof window && window.navigator ? window.navigator : null,
                    t.masterGain = null,
                    t.noAudio = !1,
                    t.usingWebAudio = !0,
                    t.autoSuspend = !0,
                    t.ctx = null,
                    t.mobileAutoEnable = !0,
                    t._setup(),
                    t
                },
                volume: function(t) {
                    var e = this || a;
                    if (t = parseFloat(t),
                    e.ctx || c(),
                    void 0 !== t && t >= 0 && t <= 1) {
                        if (e._volume = t,
                        e._muted)
                            return e;
                        e.usingWebAudio && (e.masterGain.gain.value = t);
                        for (var n = 0; n < e._howls.length; n++)
                            if (!e._howls[n]._webAudio)
                                for (var r = e._howls[n]._getSoundIds(), o = 0; o < r.length; o++) {
                                    var i = e._howls[n]._soundById(r[o]);
                                    i && i._node && (i._node.volume = i._volume * t)
                                }
                        return e
                    }
                    return e._volume
                },
                mute: function(t) {
                    var e = this || a;
                    e.ctx || c(),
                    e._muted = t,
                    e.usingWebAudio && (e.masterGain.gain.value = t ? 0 : e._volume);
                    for (var n = 0; n < e._howls.length; n++)
                        if (!e._howls[n]._webAudio)
                            for (var r = e._howls[n]._getSoundIds(), o = 0; o < r.length; o++) {
                                var i = e._howls[n]._soundById(r[o]);
                                i && i._node && (i._node.muted = !!t || i._muted)
                            }
                    return e
                },
                unload: function() {
                    for (var t = this || a, e = t._howls.length - 1; e >= 0; e--)
                        t._howls[e].unload();
                    return t.usingWebAudio && t.ctx && void 0 !== t.ctx.close && (t.ctx.close(),
                    t.ctx = null,
                    c()),
                    t
                },
                codecs: function(t) {
                    return (this || a)._codecs[t.replace(/^x-/, "")]
                },
                _setup: function() {
                    var t = this || a;
                    if (t.state = t.ctx ? t.ctx.state || "running" : "running",
                    t._autoSuspend(),
                    !t.usingWebAudio)
                        if ("undefined" != typeof Audio)
                            try {
                                var e = new Audio;
                                void 0 === e.oncanplaythrough && (t._canPlayEvent = "canplay")
                            } catch (e) {
                                t.noAudio = !0
                            }
                        else
                            t.noAudio = !0;
                    try {
                        var e = new Audio;
                        e.muted && (t.noAudio = !0)
                    } catch (t) {}
                    return t.noAudio || t._setupCodecs(),
                    t
                },
                _setupCodecs: function() {
                    var t = this || a
                      , e = null;
                    try {
                        e = "undefined" != typeof Audio ? new Audio : null
                    } catch (e) {
                        return t
                    }
                    if (!e || "function" != typeof e.canPlayType)
                        return t;
                    var n = e.canPlayType("audio/mpeg;").replace(/^no$/, "")
                      , r = t._navigator && t._navigator.userAgent.match(/OPR\/([0-6].)/g)
                      , o = r && parseInt(r[0].split("/")[1], 10) < 33;
                    return t._codecs = {
                        mp3: !(o || !n && !e.canPlayType("audio/mp3;").replace(/^no$/, "")),
                        mpeg: !!n,
                        opus: !!e.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
                        ogg: !!e.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                        oga: !!e.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                        wav: !!e.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""),
                        aac: !!e.canPlayType("audio/aac;").replace(/^no$/, ""),
                        caf: !!e.canPlayType("audio/x-caf;").replace(/^no$/, ""),
                        m4a: !!(e.canPlayType("audio/x-m4a;") || e.canPlayType("audio/m4a;") || e.canPlayType("audio/aac;")).replace(/^no$/, ""),
                        mp4: !!(e.canPlayType("audio/x-mp4;") || e.canPlayType("audio/mp4;") || e.canPlayType("audio/aac;")).replace(/^no$/, ""),
                        weba: !!e.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
                        webm: !!e.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
                        dolby: !!e.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
                        flac: !!(e.canPlayType("audio/x-flac;") || e.canPlayType("audio/flac;")).replace(/^no$/, "")
                    },
                    t
                },
                _enableMobileAudio: function() {
                    var t = this || a
                      , e = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(t._navigator && t._navigator.userAgent)
                      , n = !!("ontouchend"in window || t._navigator && t._navigator.maxTouchPoints > 0 || t._navigator && t._navigator.msMaxTouchPoints > 0);
                    if (!t._mobileEnabled && t.ctx && (e || n)) {
                        t._mobileEnabled = !1,
                        t._mobileUnloaded || 44100 === t.ctx.sampleRate || (t._mobileUnloaded = !0,
                        t.unload()),
                        t._scratchBuffer = t.ctx.createBuffer(1, 1, 22050);
                        var r = function() {
                            var e = t.ctx.createBufferSource();
                            e.buffer = t._scratchBuffer,
                            e.connect(t.ctx.destination),
                            void 0 === e.start ? e.noteOn(0) : e.start(0),
                            e.onended = function() {
                                e.disconnect(0),
                                t._mobileEnabled = !0,
                                t.mobileAutoEnable = !1,
                                document.removeEventListener("touchend", r, !0)
                            }
                        };
                        return document.addEventListener("touchend", r, !0),
                        t
                    }
                },
                _autoSuspend: function() {
                    var t = this;
                    if (t.autoSuspend && t.ctx && void 0 !== t.ctx.suspend && a.usingWebAudio) {
                        for (var e = 0; e < t._howls.length; e++)
                            if (t._howls[e]._webAudio)
                                for (var n = 0; n < t._howls[e]._sounds.length; n++)
                                    if (!t._howls[e]._sounds[n]._paused)
                                        return t;
                        return t._suspendTimer && clearTimeout(t._suspendTimer),
                        t._suspendTimer = setTimeout(function() {
                            t.autoSuspend && (t._suspendTimer = null,
                            t.state = "suspending",
                            t.ctx.suspend().then(function() {
                                t.state = "suspended",
                                t._resumeAfterSuspend && (delete t._resumeAfterSuspend,
                                t._autoResume())
                            }))
                        }, 3e4),
                        t
                    }
                },
                _autoResume: function() {
                    var t = this;
                    if (t.ctx && void 0 !== t.ctx.resume && a.usingWebAudio)
                        return "running" === t.state && t._suspendTimer ? (clearTimeout(t._suspendTimer),
                        t._suspendTimer = null) : "suspended" === t.state ? (t.state = "resuming",
                        t.ctx.resume().then(function() {
                            t.state = "running";
                            for (var e = 0; e < t._howls.length; e++)
                                t._howls[e]._emit("resume")
                        }),
                        t._suspendTimer && (clearTimeout(t._suspendTimer),
                        t._suspendTimer = null)) : "suspending" === t.state && (t._resumeAfterSuspend = !0),
                        t
                }
            };
            var a = new t
              , n = function(t) {
                var e = this;
                if (!t.src || 0 === t.src.length)
                    return void console.error("An array of source files must be passed with any new Howl.");
                e.init(t)
            };
            n.prototype = {
                init: function(t) {
                    var e = this;
                    return a.ctx || c(),
                    e._autoplay = t.autoplay || !1,
                    e._format = "string" != typeof t.format ? t.format : [t.format],
                    e._html5 = t.html5 || !1,
                    e._muted = t.mute || !1,
                    e._loop = t.loop || !1,
                    e._pool = t.pool || 5,
                    e._preload = "boolean" != typeof t.preload || t.preload,
                    e._rate = t.rate || 1,
                    e._sprite = t.sprite || {},
                    e._src = "string" != typeof t.src ? t.src : [t.src],
                    e._volume = void 0 !== t.volume ? t.volume : 1,
                    e._duration = 0,
                    e._state = "unloaded",
                    e._sounds = [],
                    e._endTimers = {},
                    e._queue = [],
                    e._onend = t.onend ? [{
                        fn: t.onend
                    }] : [],
                    e._onfade = t.onfade ? [{
                        fn: t.onfade
                    }] : [],
                    e._onload = t.onload ? [{
                        fn: t.onload
                    }] : [],
                    e._onloaderror = t.onloaderror ? [{
                        fn: t.onloaderror
                    }] : [],
                    e._onpause = t.onpause ? [{
                        fn: t.onpause
                    }] : [],
                    e._onplay = t.onplay ? [{
                        fn: t.onplay
                    }] : [],
                    e._onstop = t.onstop ? [{
                        fn: t.onstop
                    }] : [],
                    e._onmute = t.onmute ? [{
                        fn: t.onmute
                    }] : [],
                    e._onvolume = t.onvolume ? [{
                        fn: t.onvolume
                    }] : [],
                    e._onrate = t.onrate ? [{
                        fn: t.onrate
                    }] : [],
                    e._onseek = t.onseek ? [{
                        fn: t.onseek
                    }] : [],
                    e._onresume = [],
                    e._webAudio = a.usingWebAudio && !e._html5,
                    void 0 !== a.ctx && a.ctx && a.mobileAutoEnable && a._enableMobileAudio(),
                    a._howls.push(e),
                    e._autoplay && e._queue.push({
                        event: "play",
                        action: function() {
                            e.play()
                        }
                    }),
                    e._preload && e.load(),
                    e
                },
                load: function() {
                    var t = this
                      , e = null;
                    if (a.noAudio)
                        return void t._emit("loaderror", null, "No audio support.");
                    "string" == typeof t._src && (t._src = [t._src]);
                    for (var n = 0; n < t._src.length; n++) {
                        var o, s;
                        if (t._format && t._format[n])
                            o = t._format[n];
                        else {
                            if ("string" != typeof (s = t._src[n])) {
                                t._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                                continue
                            }
                            o = /^data:audio\/([^;,]+);/i.exec(s),
                            o || (o = /\.([^.]+)$/.exec(s.split("?", 1)[0])),
                            o && (o = o[1].toLowerCase())
                        }
                        if (o || console.warn('No file extension was found. Consider using the "format" property or specify an extension.'),
                        o && a.codecs(o)) {
                            e = t._src[n];
                            break
                        }
                    }
                    return e ? (t._src = e,
                    t._state = "loading",
                    "https:" === window.location.protocol && "http:" === e.slice(0, 5) && (t._html5 = !0,
                    t._webAudio = !1),
                    new r(t),
                    t._webAudio && i(t),
                    t) : void t._emit("loaderror", null, "No codec support for selected audio sources.")
                },
                play: function(t, e) {
                    var n = this
                      , r = null;
                    if ("number" == typeof t)
                        r = t,
                        t = null;
                    else {
                        if ("string" == typeof t && "loaded" === n._state && !n._sprite[t])
                            return null;
                        if (void 0 === t) {
                            t = "__default";
                            for (var o = 0, i = 0; i < n._sounds.length; i++)
                                n._sounds[i]._paused && !n._sounds[i]._ended && (o++,
                                r = n._sounds[i]._id);
                            1 === o ? t = null : r = null
                        }
                    }
                    var s = r ? n._soundById(r) : n._inactiveSound();
                    if (!s)
                        return null;
                    if (r && !t && (t = s._sprite || "__default"),
                    "loaded" !== n._state && !n._sprite[t])
                        return n._queue.push({
                            event: "play",
                            action: function() {
                                n.play(n._soundById(s._id) ? s._id : void 0)
                            }
                        }),
                        s._id;
                    if (r && !s._paused)
                        return e || setTimeout(function() {
                            n._emit("play", s._id)
                        }, 0),
                        s._id;
                    n._webAudio && a._autoResume();
                    var l = Math.max(0, s._seek > 0 ? s._seek : n._sprite[t][0] / 1e3)
                      , u = Math.max(0, (n._sprite[t][0] + n._sprite[t][1]) / 1e3 - l)
                      , c = 1e3 * u / Math.abs(s._rate);
                    s._paused = !1,
                    s._ended = !1,
                    s._sprite = t,
                    s._seek = l,
                    s._start = n._sprite[t][0] / 1e3,
                    s._stop = (n._sprite[t][0] + n._sprite[t][1]) / 1e3,
                    s._loop = !(!s._loop && !n._sprite[t][2]);
                    var d = s._node;
                    if (n._webAudio) {
                        var f = function() {
                            n._refreshBuffer(s);
                            var t = s._muted || n._muted ? 0 : s._volume;
                            d.gain.setValueAtTime(t, a.ctx.currentTime),
                            s._playStart = a.ctx.currentTime,
                            void 0 === d.bufferSource.start ? s._loop ? d.bufferSource.noteGrainOn(0, l, 86400) : d.bufferSource.noteGrainOn(0, l, u) : s._loop ? d.bufferSource.start(0, l, 86400) : d.bufferSource.start(0, l, u),
                            c !== 1 / 0 && (n._endTimers[s._id] = setTimeout(n._ended.bind(n, s), c)),
                            e || setTimeout(function() {
                                n._emit("play", s._id)
                            }, 0)
                        }
                          , h = "running" === a.state;
                        if ("loaded" === n._state && h)
                            f();
                        else {
                            var _ = h || "loaded" !== n._state ? "load" : "resume";
                            n.once(_, f, h ? s._id : null),
                            n._clearTimer(s._id)
                        }
                    } else {
                        var p = function() {
                            d.currentTime = l,
                            d.muted = s._muted || n._muted || a._muted || d.muted,
                            d.volume = s._volume * a.volume(),
                            d.playbackRate = s._rate,
                            d.play(),
                            c !== 1 / 0 && (n._endTimers[s._id] = setTimeout(n._ended.bind(n, s), c)),
                            e || n._emit("play", s._id)
                        }
                          , v = "loaded" === n._state && (window && window.ejecta || !d.readyState && a._navigator.isCocoonJS);
                        if (4 === d.readyState || v)
                            p();
                        else {
                            var m = function() {
                                p(),
                                d.removeEventListener(a._canPlayEvent, m, !1)
                            };
                            d.addEventListener(a._canPlayEvent, m, !1),
                            n._clearTimer(s._id)
                        }
                    }
                    return s._id
                },
                pause: function(t) {
                    var e = this;
                    if ("loaded" !== e._state)
                        return e._queue.push({
                            event: "pause",
                            action: function() {
                                e.pause(t)
                            }
                        }),
                        e;
                    for (var a = e._getSoundIds(t), n = 0; n < a.length; n++) {
                        e._clearTimer(a[n]);
                        var r = e._soundById(a[n]);
                        if (r && !r._paused && (r._seek = e.seek(a[n]),
                        r._rateSeek = 0,
                        r._paused = !0,
                        e._stopFade(a[n]),
                        r._node))
                            if (e._webAudio) {
                                if (!r._node.bufferSource)
                                    return e;
                                void 0 === r._node.bufferSource.stop ? r._node.bufferSource.noteOff(0) : r._node.bufferSource.stop(0),
                                e._cleanBuffer(r._node)
                            } else
                                isNaN(r._node.duration) && r._node.duration !== 1 / 0 || r._node.pause();
                        arguments[1] || e._emit("pause", r ? r._id : null)
                    }
                    return e
                },
                stop: function(t, e) {
                    var a = this;
                    if ("loaded" !== a._state)
                        return a._queue.push({
                            event: "stop",
                            action: function() {
                                a.stop(t)
                            }
                        }),
                        a;
                    for (var n = a._getSoundIds(t), r = 0; r < n.length; r++) {
                        a._clearTimer(n[r]);
                        var o = a._soundById(n[r]);
                        if (o && (o._seek = o._start || 0,
                        o._rateSeek = 0,
                        o._paused = !0,
                        o._ended = !0,
                        a._stopFade(n[r]),
                        o._node))
                            if (a._webAudio) {
                                if (!o._node.bufferSource)
                                    return e || a._emit("stop", o._id),
                                    a;
                                void 0 === o._node.bufferSource.stop ? o._node.bufferSource.noteOff(0) : o._node.bufferSource.stop(0),
                                a._cleanBuffer(o._node)
                            } else
                                isNaN(o._node.duration) && o._node.duration !== 1 / 0 || (o._node.currentTime = o._start || 0,
                                o._node.pause());
                        o && !e && a._emit("stop", o._id)
                    }
                    return a
                },
                mute: function(t, e) {
                    var n = this;
                    if ("loaded" !== n._state)
                        return n._queue.push({
                            event: "mute",
                            action: function() {
                                n.mute(t, e)
                            }
                        }),
                        n;
                    if (void 0 === e) {
                        if ("boolean" != typeof t)
                            return n._muted;
                        n._muted = t
                    }
                    for (var r = n._getSoundIds(e), o = 0; o < r.length; o++) {
                        var i = n._soundById(r[o]);
                        i && (i._muted = t,
                        n._webAudio && i._node ? i._node.gain.setValueAtTime(t ? 0 : i._volume, a.ctx.currentTime) : i._node && (i._node.muted = !!a._muted || t),
                        n._emit("mute", i._id))
                    }
                    return n
                },
                volume: function() {
                    var t, e, n = this, r = arguments;
                    if (0 === r.length)
                        return n._volume;
                    if (1 === r.length || 2 === r.length && void 0 === r[1]) {
                        n._getSoundIds().indexOf(r[0]) >= 0 ? e = parseInt(r[0], 10) : t = parseFloat(r[0])
                    } else
                        r.length >= 2 && (t = parseFloat(r[0]),
                        e = parseInt(r[1], 10));
                    var o;
                    if (!(void 0 !== t && t >= 0 && t <= 1))
                        return o = e ? n._soundById(e) : n._sounds[0],
                        o ? o._volume : 0;
                    if ("loaded" !== n._state)
                        return n._queue.push({
                            event: "volume",
                            action: function() {
                                n.volume.apply(n, r)
                            }
                        }),
                        n;
                    void 0 === e && (n._volume = t),
                    e = n._getSoundIds(e);
                    for (var i = 0; i < e.length; i++)
                        (o = n._soundById(e[i])) && (o._volume = t,
                        r[2] || n._stopFade(e[i]),
                        n._webAudio && o._node && !o._muted ? o._node.gain.setValueAtTime(t, a.ctx.currentTime) : o._node && !o._muted && (o._node.volume = t * a.volume()),
                        n._emit("volume", o._id));
                    return n
                },
                fade: function(t, e, n, r) {
                    var o = this
                      , i = Math.abs(t - e)
                      , s = t > e ? "out" : "in"
                      , l = i / .01
                      , u = l > 0 ? n / l : n;
                    if (u < 4 && (l = Math.ceil(l / (4 / u)),
                    u = 4),
                    "loaded" !== o._state)
                        return o._queue.push({
                            event: "fade",
                            action: function() {
                                o.fade(t, e, n, r)
                            }
                        }),
                        o;
                    o.volume(t, r);
                    for (var c = o._getSoundIds(r), d = 0; d < c.length; d++) {
                        var f = o._soundById(c[d]);
                        if (f) {
                            if (r || o._stopFade(c[d]),
                            o._webAudio && !f._muted) {
                                var h = a.ctx.currentTime
                                  , _ = h + n / 1e3;
                                f._volume = t,
                                f._node.gain.setValueAtTime(t, h),
                                f._node.gain.linearRampToValueAtTime(e, _)
                            }
                            var p = t;
                            f._interval = setInterval(function(a, n) {
                                l > 0 && (p += "in" === s ? .01 : -.01),
                                p = Math.max(0, p),
                                p = Math.min(1, p),
                                p = Math.round(100 * p) / 100,
                                o._webAudio ? (void 0 === r && (o._volume = p),
                                n._volume = p) : o.volume(p, a, !0),
                                (e < t && p <= e || e > t && p >= e) && (clearInterval(n._interval),
                                n._interval = null,
                                o.volume(e, a),
                                o._emit("fade", a))
                            }
                            .bind(o, c[d], f), u)
                        }
                    }
                    return o
                },
                _stopFade: function(t) {
                    var e = this
                      , n = e._soundById(t);
                    return n && n._interval && (e._webAudio && n._node.gain.cancelScheduledValues(a.ctx.currentTime),
                    clearInterval(n._interval),
                    n._interval = null,
                    e._emit("fade", t)),
                    e
                },
                loop: function() {
                    var t, e, a, n = this, r = arguments;
                    if (0 === r.length)
                        return n._loop;
                    if (1 === r.length) {
                        if ("boolean" != typeof r[0])
                            return !!(a = n._soundById(parseInt(r[0], 10))) && a._loop;
                        t = r[0],
                        n._loop = t
                    } else
                        2 === r.length && (t = r[0],
                        e = parseInt(r[1], 10));
                    for (var o = n._getSoundIds(e), i = 0; i < o.length; i++)
                        (a = n._soundById(o[i])) && (a._loop = t,
                        n._webAudio && a._node && a._node.bufferSource && (a._node.bufferSource.loop = t,
                        t && (a._node.bufferSource.loopStart = a._start || 0,
                        a._node.bufferSource.loopEnd = a._stop)));
                    return n
                },
                rate: function() {
                    var t, e, n = this, r = arguments;
                    if (0 === r.length)
                        e = n._sounds[0]._id;
                    else if (1 === r.length) {
                        var o = n._getSoundIds()
                          , i = o.indexOf(r[0]);
                        i >= 0 ? e = parseInt(r[0], 10) : t = parseFloat(r[0])
                    } else
                        2 === r.length && (t = parseFloat(r[0]),
                        e = parseInt(r[1], 10));
                    var s;
                    if ("number" != typeof t)
                        return s = n._soundById(e),
                        s ? s._rate : n._rate;
                    if ("loaded" !== n._state)
                        return n._queue.push({
                            event: "rate",
                            action: function() {
                                n.rate.apply(n, r)
                            }
                        }),
                        n;
                    void 0 === e && (n._rate = t),
                    e = n._getSoundIds(e);
                    for (var l = 0; l < e.length; l++)
                        if (s = n._soundById(e[l])) {
                            s._rateSeek = n.seek(e[l]),
                            s._playStart = n._webAudio ? a.ctx.currentTime : s._playStart,
                            s._rate = t,
                            n._webAudio && s._node && s._node.bufferSource ? s._node.bufferSource.playbackRate.value = t : s._node && (s._node.playbackRate = t);
                            var u = n.seek(e[l])
                              , c = (n._sprite[s._sprite][0] + n._sprite[s._sprite][1]) / 1e3 - u
                              , d = 1e3 * c / Math.abs(s._rate);
                            !n._endTimers[e[l]] && s._paused || (n._clearTimer(e[l]),
                            n._endTimers[e[l]] = setTimeout(n._ended.bind(n, s), d)),
                            n._emit("rate", s._id)
                        }
                    return n
                },
                seek: function() {
                    var t, e, n = this, r = arguments;
                    if (0 === r.length)
                        e = n._sounds[0]._id;
                    else if (1 === r.length) {
                        var o = n._getSoundIds()
                          , i = o.indexOf(r[0]);
                        i >= 0 ? e = parseInt(r[0], 10) : (e = n._sounds[0]._id,
                        t = parseFloat(r[0]))
                    } else
                        2 === r.length && (t = parseFloat(r[0]),
                        e = parseInt(r[1], 10));
                    if (void 0 === e)
                        return n;
                    if ("loaded" !== n._state)
                        return n._queue.push({
                            event: "seek",
                            action: function() {
                                n.seek.apply(n, r)
                            }
                        }),
                        n;
                    var s = n._soundById(e);
                    if (s) {
                        if (!("number" == typeof t && t >= 0)) {
                            if (n._webAudio) {
                                var l = n.playing(e) ? a.ctx.currentTime - s._playStart : 0
                                  , u = s._rateSeek ? s._rateSeek - s._seek : 0;
                                return s._seek + (u + l * Math.abs(s._rate))
                            }
                            return s._node.currentTime
                        }
                        var c = n.playing(e);
                        c && n.pause(e, !0),
                        s._seek = t,
                        s._ended = !1,
                        n._clearTimer(e),
                        c && n.play(e, !0),
                        !n._webAudio && s._node && (s._node.currentTime = t),
                        n._emit("seek", e)
                    }
                    return n
                },
                playing: function(t) {
                    var e = this;
                    if ("number" == typeof t) {
                        var a = e._soundById(t);
                        return !!a && !a._paused
                    }
                    for (var n = 0; n < e._sounds.length; n++)
                        if (!e._sounds[n]._paused)
                            return !0;
                    return !1
                },
                duration: function(t) {
                    var e = this
                      , a = e._duration
                      , n = e._soundById(t);
                    return n && (a = e._sprite[n._sprite][1] / 1e3),
                    a
                },
                state: function() {
                    return this._state
                },
                unload: function() {
                    for (var t = this, e = t._sounds, n = 0; n < e.length; n++) {
                        e[n]._paused || t.stop(e[n]._id),
                        t._webAudio || (e[n]._node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA",
                        e[n]._node.removeEventListener("error", e[n]._errorFn, !1),
                        e[n]._node.removeEventListener(a._canPlayEvent, e[n]._loadFn, !1)),
                        delete e[n]._node,
                        t._clearTimer(e[n]._id);
                        var r = a._howls.indexOf(t);
                        r >= 0 && a._howls.splice(r, 1)
                    }
                    var i = !0;
                    for (n = 0; n < a._howls.length; n++)
                        if (a._howls[n]._src === t._src) {
                            i = !1;
                            break
                        }
                    return o && i && delete o[t._src],
                    a.noAudio = !1,
                    t._state = "unloaded",
                    t._sounds = [],
                    t = null,
                    null
                },
                on: function(t, e, a, n) {
                    var r = this
                      , o = r["_on" + t];
                    return "function" == typeof e && o.push(n ? {
                        id: a,
                        fn: e,
                        once: n
                    } : {
                        id: a,
                        fn: e
                    }),
                    r
                },
                off: function(t, e, a) {
                    var n = this
                      , r = n["_on" + t]
                      , o = 0;
                    if (e) {
                        for (o = 0; o < r.length; o++)
                            if (e === r[o].fn && a === r[o].id) {
                                r.splice(o, 1);
                                break
                            }
                    } else if (t)
                        n["_on" + t] = [];
                    else {
                        var i = Object.keys(n);
                        for (o = 0; o < i.length; o++)
                            0 === i[o].indexOf("_on") && Array.isArray(n[i[o]]) && (n[i[o]] = [])
                    }
                    return n
                },
                once: function(t, e, a) {
                    var n = this;
                    return n.on(t, e, a, 1),
                    n
                },
                _emit: function(t, e, a) {
                    for (var n = this, r = n["_on" + t], o = r.length - 1; o >= 0; o--)
                        r[o].id && r[o].id !== e && "load" !== t || (setTimeout(function(t) {
                            t.call(this, e, a)
                        }
                        .bind(n, r[o].fn), 0),
                        r[o].once && n.off(t, r[o].fn, r[o].id));
                    return n
                },
                _loadQueue: function() {
                    var t = this;
                    if (t._queue.length > 0) {
                        var e = t._queue[0];
                        t.once(e.event, function() {
                            t._queue.shift(),
                            t._loadQueue()
                        }),
                        e.action()
                    }
                    return t
                },
                _ended: function(t) {
                    var e = this
                      , n = t._sprite
                      , r = !(!t._loop && !e._sprite[n][2]);
                    if (e._emit("end", t._id),
                    !e._webAudio && r && e.stop(t._id, !0).play(t._id),
                    e._webAudio && r) {
                        e._emit("play", t._id),
                        t._seek = t._start || 0,
                        t._rateSeek = 0,
                        t._playStart = a.ctx.currentTime;
                        var o = 1e3 * (t._stop - t._start) / Math.abs(t._rate);
                        e._endTimers[t._id] = setTimeout(e._ended.bind(e, t), o)
                    }
                    return e._webAudio && !r && (t._paused = !0,
                    t._ended = !0,
                    t._seek = t._start || 0,
                    t._rateSeek = 0,
                    e._clearTimer(t._id),
                    e._cleanBuffer(t._node),
                    a._autoSuspend()),
                    e._webAudio || r || e.stop(t._id),
                    e
                },
                _clearTimer: function(t) {
                    var e = this;
                    return e._endTimers[t] && (clearTimeout(e._endTimers[t]),
                    delete e._endTimers[t]),
                    e
                },
                _soundById: function(t) {
                    for (var e = this, a = 0; a < e._sounds.length; a++)
                        if (t === e._sounds[a]._id)
                            return e._sounds[a];
                    return null
                },
                _inactiveSound: function() {
                    var t = this;
                    t._drain();
                    for (var e = 0; e < t._sounds.length; e++)
                        if (t._sounds[e]._ended)
                            return t._sounds[e].reset();
                    return new r(t)
                },
                _drain: function() {
                    var t = this
                      , e = t._pool
                      , a = 0
                      , n = 0;
                    if (!(t._sounds.length < e)) {
                        for (n = 0; n < t._sounds.length; n++)
                            t._sounds[n]._ended && a++;
                        for (n = t._sounds.length - 1; n >= 0; n--) {
                            if (a <= e)
                                return;
                            t._sounds[n]._ended && (t._webAudio && t._sounds[n]._node && t._sounds[n]._node.disconnect(0),
                            t._sounds.splice(n, 1),
                            a--)
                        }
                    }
                },
                _getSoundIds: function(t) {
                    var e = this;
                    if (void 0 === t) {
                        for (var a = [], n = 0; n < e._sounds.length; n++)
                            a.push(e._sounds[n]._id);
                        return a
                    }
                    return [t]
                },
                _refreshBuffer: function(t) {
                    var e = this;
                    return t._node.bufferSource = a.ctx.createBufferSource(),
                    t._node.bufferSource.buffer = o[e._src],
                    t._panner ? t._node.bufferSource.connect(t._panner) : t._node.bufferSource.connect(t._node),
                    t._node.bufferSource.loop = t._loop,
                    t._loop && (t._node.bufferSource.loopStart = t._start || 0,
                    t._node.bufferSource.loopEnd = t._stop),
                    t._node.bufferSource.playbackRate.value = t._rate,
                    e
                },
                _cleanBuffer: function(t) {
                    var e = this;
                    if (e._scratchBuffer) {
                        t.bufferSource.onended = null,
                        t.bufferSource.disconnect(0);
                        try {
                            t.bufferSource.buffer = e._scratchBuffer
                        } catch (t) {}
                    }
                    return t.bufferSource = null,
                    e
                }
            };
            var r = function(t) {
                this._parent = t,
                this.init()
            };
            r.prototype = {
                init: function() {
                    var t = this
                      , e = t._parent;
                    return t._muted = e._muted,
                    t._loop = e._loop,
                    t._volume = e._volume,
                    t._muted = e._muted,
                    t._rate = e._rate,
                    t._seek = 0,
                    t._paused = !0,
                    t._ended = !0,
                    t._sprite = "__default",
                    t._id = ++a._counter,
                    e._sounds.push(t),
                    t.create(),
                    t
                },
                create: function() {
                    var t = this
                      , e = t._parent
                      , n = a._muted || t._muted || t._parent._muted ? 0 : t._volume;
                    return e._webAudio ? (t._node = void 0 === a.ctx.createGain ? a.ctx.createGainNode() : a.ctx.createGain(),
                    t._node.gain.setValueAtTime(n, a.ctx.currentTime),
                    t._node.paused = !0,
                    t._node.connect(a.masterGain)) : (t._node = new Audio,
                    t._errorFn = t._errorListener.bind(t),
                    t._node.addEventListener("error", t._errorFn, !1),
                    t._loadFn = t._loadListener.bind(t),
                    t._node.addEventListener(a._canPlayEvent, t._loadFn, !1),
                    t._node.src = e._src,
                    t._node.preload = "auto",
                    t._node.volume = n * a.volume(),
                    t._node.load()),
                    t
                },
                reset: function() {
                    var t = this
                      , e = t._parent;
                    return t._muted = e._muted,
                    t._loop = e._loop,
                    t._volume = e._volume,
                    t._muted = e._muted,
                    t._rate = e._rate,
                    t._seek = 0,
                    t._rateSeek = 0,
                    t._paused = !0,
                    t._ended = !0,
                    t._sprite = "__default",
                    t._id = ++a._counter,
                    t
                },
                _errorListener: function() {
                    var t = this;
                    t._parent._emit("loaderror", t._id, t._node.error ? t._node.error.code : 0),
                    t._node.removeEventListener("error", t._errorListener, !1)
                },
                _loadListener: function() {
                    var t = this
                      , e = t._parent;
                    e._duration = Math.ceil(10 * t._node.duration) / 10,
                    0 === Object.keys(e._sprite).length && (e._sprite = {
                        __default: [0, 1e3 * e._duration]
                    }),
                    "loaded" !== e._state && (e._state = "loaded",
                    e._emit("load"),
                    e._loadQueue()),
                    t._node.removeEventListener(a._canPlayEvent, t._loadFn, !1)
                }
            };
            var o = {}
              , i = function(t) {
                var e = t._src;
                if (o[e])
                    return t._duration = o[e].duration,
                    void u(t);
                if (/^data:[^;]+;base64,/.test(e)) {
                    for (var a = atob(e.split(",")[1]), n = new Uint8Array(a.length), r = 0; r < a.length; ++r)
                        n[r] = a.charCodeAt(r);
                    l(n.buffer, t)
                } else {
                    var i = new XMLHttpRequest;
                    i.open("GET", e, !0),
                    i.responseType = "arraybuffer",
                    i.onload = function() {
                        var e = (i.status + "")[0];
                        if ("0" !== e && "2" !== e && "3" !== e)
                            return void t._emit("loaderror", null, "Failed loading audio file with status: " + i.status + ".");
                        l(i.response, t)
                    }
                    ,
                    i.onerror = function() {
                        t._webAudio && (t._html5 = !0,
                        t._webAudio = !1,
                        t._sounds = [],
                        delete o[e],
                        t.load())
                    }
                    ,
                    s(i)
                }
            }
              , s = function(t) {
                try {
                    t.send()
                } catch (e) {
                    t.onerror()
                }
            }
              , l = function(t, e) {
                a.ctx.decodeAudioData(t, function(t) {
                    t && e._sounds.length > 0 && (o[e._src] = t,
                    u(e, t))
                }, function() {
                    e._emit("loaderror", null, "Decoding audio data failed.")
                })
            }
              , u = function(t, e) {
                e && !t._duration && (t._duration = e.duration),
                0 === Object.keys(t._sprite).length && (t._sprite = {
                    __default: [0, 1e3 * t._duration]
                }),
                "loaded" !== t._state && (t._state = "loaded",
                t._emit("load"),
                t._loadQueue())
            }
              , c = function() {
                try {
                    "undefined" != typeof AudioContext ? a.ctx = new AudioContext : "undefined" != typeof webkitAudioContext ? a.ctx = new webkitAudioContext : a.usingWebAudio = !1
                } catch (t) {
                    a.usingWebAudio = !1
                }
                var t = /iP(hone|od|ad)/.test(a._navigator && a._navigator.platform)
                  , e = a._navigator && a._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
                  , n = e ? parseInt(e[1], 10) : null;
                if (t && n && n < 9) {
                    var r = /safari/.test(a._navigator && a._navigator.userAgent.toLowerCase());
                    (a._navigator && a._navigator.standalone && !r || a._navigator && !a._navigator.standalone && !r) && (a.usingWebAudio = !1)
                }
                a.usingWebAudio && (a.masterGain = void 0 === a.ctx.createGain ? a.ctx.createGainNode() : a.ctx.createGain(),
                a.masterGain.gain.value = 1,
                a.masterGain.connect(a.ctx.destination)),
                a._setup()
            };
            e.Howler = a,
            e.Howl = n,
            "undefined" != typeof window ? (window.HowlerGlobal = t,
            window.Howler = a,
            window.Howl = n,
            window.Sound = r) : void 0 !== X && (X.HowlerGlobal = t,
            X.Howler = a,
            X.Howl = n,
            X.Sound = r)
        }(),
        function() {
            HowlerGlobal.prototype._pos = [0, 0, 0],
            HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0],
            HowlerGlobal.prototype.stereo = function(t) {
                var e = this;
                if (!e.ctx || !e.ctx.listener)
                    return e;
                for (var a = e._howls.length - 1; a >= 0; a--)
                    e._howls[a].stereo(t);
                return e
            }
            ,
            HowlerGlobal.prototype.pos = function(t, e, a) {
                var n = this;
                return n.ctx && n.ctx.listener ? (e = "number" != typeof e ? n._pos[1] : e,
                a = "number" != typeof a ? n._pos[2] : a,
                "number" != typeof t ? n._pos : (n._pos = [t, e, a],
                n.ctx.listener.setPosition(n._pos[0], n._pos[1], n._pos[2]),
                n)) : n
            }
            ,
            HowlerGlobal.prototype.orientation = function(t, e, a, n, r, o) {
                var i = this;
                if (!i.ctx || !i.ctx.listener)
                    return i;
                var s = i._orientation;
                return e = "number" != typeof e ? s[1] : e,
                a = "number" != typeof a ? s[2] : a,
                n = "number" != typeof n ? s[3] : n,
                r = "number" != typeof r ? s[4] : r,
                o = "number" != typeof o ? s[5] : o,
                "number" != typeof t ? s : (i._orientation = [t, e, a, n, r, o],
                i.ctx.listener.setOrientation(t, e, a, n, r, o),
                i)
            }
            ,
            Howl.prototype.init = function(t) {
                return function(e) {
                    var a = this;
                    return a._orientation = e.orientation || [1, 0, 0],
                    a._stereo = e.stereo || null,
                    a._pos = e.pos || null,
                    a._pannerAttr = {
                        coneInnerAngle: void 0 !== e.coneInnerAngle ? e.coneInnerAngle : 360,
                        coneOuterAngle: void 0 !== e.coneOuterAngle ? e.coneOuterAngle : 360,
                        coneOuterGain: void 0 !== e.coneOuterGain ? e.coneOuterGain : 0,
                        distanceModel: void 0 !== e.distanceModel ? e.distanceModel : "inverse",
                        maxDistance: void 0 !== e.maxDistance ? e.maxDistance : 1e4,
                        panningModel: void 0 !== e.panningModel ? e.panningModel : "HRTF",
                        refDistance: void 0 !== e.refDistance ? e.refDistance : 1,
                        rolloffFactor: void 0 !== e.rolloffFactor ? e.rolloffFactor : 1
                    },
                    a._onstereo = e.onstereo ? [{
                        fn: e.onstereo
                    }] : [],
                    a._onpos = e.onpos ? [{
                        fn: e.onpos
                    }] : [],
                    a._onorientation = e.onorientation ? [{
                        fn: e.onorientation
                    }] : [],
                    t.call(this, e)
                }
            }(Howl.prototype.init),
            Howl.prototype.stereo = function(e, a) {
                var n = this;
                if (!n._webAudio)
                    return n;
                if ("loaded" !== n._state)
                    return n._queue.push({
                        event: "stereo",
                        action: function() {
                            n.stereo(e, a)
                        }
                    }),
                    n;
                var r = void 0 === Howler.ctx.createStereoPanner ? "spatial" : "stereo";
                if (void 0 === a) {
                    if ("number" != typeof e)
                        return n._stereo;
                    n._stereo = e,
                    n._pos = [e, 0, 0]
                }
                for (var o = n._getSoundIds(a), i = 0; i < o.length; i++) {
                    var s = n._soundById(o[i]);
                    if (s) {
                        if ("number" != typeof e)
                            return s._stereo;
                        s._stereo = e,
                        s._pos = [e, 0, 0],
                        s._node && (s._pannerAttr.panningModel = "equalpower",
                        s._panner && s._panner.pan || t(s, r),
                        "spatial" === r ? s._panner.setPosition(e, 0, 0) : s._panner.pan.value = e),
                        n._emit("stereo", s._id)
                    }
                }
                return n
            }
            ,
            Howl.prototype.pos = function(e, a, n, r) {
                var o = this;
                if (!o._webAudio)
                    return o;
                if ("loaded" !== o._state)
                    return o._queue.push({
                        event: "pos",
                        action: function() {
                            o.pos(e, a, n, r)
                        }
                    }),
                    o;
                if (a = "number" != typeof a ? 0 : a,
                n = "number" != typeof n ? -.5 : n,
                void 0 === r) {
                    if ("number" != typeof e)
                        return o._pos;
                    o._pos = [e, a, n]
                }
                for (var i = o._getSoundIds(r), s = 0; s < i.length; s++) {
                    var l = o._soundById(i[s]);
                    if (l) {
                        if ("number" != typeof e)
                            return l._pos;
                        l._pos = [e, a, n],
                        l._node && (l._panner && !l._panner.pan || t(l, "spatial"),
                        l._panner.setPosition(e, a, n)),
                        o._emit("pos", l._id)
                    }
                }
                return o
            }
            ,
            Howl.prototype.orientation = function(e, a, n, r) {
                var o = this;
                if (!o._webAudio)
                    return o;
                if ("loaded" !== o._state)
                    return o._queue.push({
                        event: "orientation",
                        action: function() {
                            o.orientation(e, a, n, r)
                        }
                    }),
                    o;
                if (a = "number" != typeof a ? o._orientation[1] : a,
                n = "number" != typeof n ? o._orientation[2] : n,
                void 0 === r) {
                    if ("number" != typeof e)
                        return o._orientation;
                    o._orientation = [e, a, n]
                }
                for (var i = o._getSoundIds(r), s = 0; s < i.length; s++) {
                    var l = o._soundById(i[s]);
                    if (l) {
                        if ("number" != typeof e)
                            return l._orientation;
                        l._orientation = [e, a, n],
                        l._node && (l._panner || (l._pos || (l._pos = o._pos || [0, 0, -.5]),
                        t(l, "spatial")),
                        l._panner.setOrientation(e, a, n)),
                        o._emit("orientation", l._id)
                    }
                }
                return o
            }
            ,
            Howl.prototype.pannerAttr = function() {
                var e, a, n, r = this, o = arguments;
                if (!r._webAudio)
                    return r;
                if (0 === o.length)
                    return r._pannerAttr;
                if (1 === o.length) {
                    if ("object" != typeof o[0])
                        return n = r._soundById(parseInt(o[0], 10)),
                        n ? n._pannerAttr : r._pannerAttr;
                    e = o[0],
                    void 0 === a && (r._pannerAttr = {
                        coneInnerAngle: void 0 !== e.coneInnerAngle ? e.coneInnerAngle : r._coneInnerAngle,
                        coneOuterAngle: void 0 !== e.coneOuterAngle ? e.coneOuterAngle : r._coneOuterAngle,
                        coneOuterGain: void 0 !== e.coneOuterGain ? e.coneOuterGain : r._coneOuterGain,
                        distanceModel: void 0 !== e.distanceModel ? e.distanceModel : r._distanceModel,
                        maxDistance: void 0 !== e.maxDistance ? e.maxDistance : r._maxDistance,
                        panningModel: void 0 !== e.panningModel ? e.panningModel : r._panningModel,
                        refDistance: void 0 !== e.refDistance ? e.refDistance : r._refDistance,
                        rolloffFactor: void 0 !== e.rolloffFactor ? e.rolloffFactor : r._rolloffFactor
                    })
                } else
                    2 === o.length && (e = o[0],
                    a = parseInt(o[1], 10));
                for (var i = r._getSoundIds(a), s = 0; s < i.length; s++)
                    if (n = r._soundById(i[s])) {
                        var l = n._pannerAttr;
                        l = {
                            coneInnerAngle: void 0 !== e.coneInnerAngle ? e.coneInnerAngle : l.coneInnerAngle,
                            coneOuterAngle: void 0 !== e.coneOuterAngle ? e.coneOuterAngle : l.coneOuterAngle,
                            coneOuterGain: void 0 !== e.coneOuterGain ? e.coneOuterGain : l.coneOuterGain,
                            distanceModel: void 0 !== e.distanceModel ? e.distanceModel : l.distanceModel,
                            maxDistance: void 0 !== e.maxDistance ? e.maxDistance : l.maxDistance,
                            panningModel: void 0 !== e.panningModel ? e.panningModel : l.panningModel,
                            refDistance: void 0 !== e.refDistance ? e.refDistance : l.refDistance,
                            rolloffFactor: void 0 !== e.rolloffFactor ? e.rolloffFactor : l.rolloffFactor
                        };
                        var u = n._panner;
                        u ? (u.coneInnerAngle = l.coneInnerAngle,
                        u.coneOuterAngle = l.coneOuterAngle,
                        u.coneOuterGain = l.coneOuterGain,
                        u.distanceModel = l.distanceModel,
                        u.maxDistance = l.maxDistance,
                        u.panningModel = l.panningModel,
                        u.refDistance = l.refDistance,
                        u.rolloffFactor = l.rolloffFactor) : (n._pos || (n._pos = r._pos || [0, 0, -.5]),
                        t(n, "spatial"))
                    }
                return r
            }
            ,
            Sound.prototype.init = function(t) {
                return function() {
                    var e = this
                      , a = e._parent;
                    e._orientation = a._orientation,
                    e._stereo = a._stereo,
                    e._pos = a._pos,
                    e._pannerAttr = a._pannerAttr,
                    t.call(this),
                    e._stereo ? a.stereo(e._stereo) : e._pos && a.pos(e._pos[0], e._pos[1], e._pos[2], e._id)
                }
            }(Sound.prototype.init),
            Sound.prototype.reset = function(t) {
                return function() {
                    var e = this
                      , a = e._parent;
                    return e._orientation = a._orientation,
                    e._pos = a._pos,
                    e._pannerAttr = a._pannerAttr,
                    t.call(this)
                }
            }(Sound.prototype.reset);
            var t = function(t, e) {
                e = e || "spatial",
                "spatial" === e ? (t._panner = Howler.ctx.createPanner(),
                t._panner.coneInnerAngle = t._pannerAttr.coneInnerAngle,
                t._panner.coneOuterAngle = t._pannerAttr.coneOuterAngle,
                t._panner.coneOuterGain = t._pannerAttr.coneOuterGain,
                t._panner.distanceModel = t._pannerAttr.distanceModel,
                t._panner.maxDistance = t._pannerAttr.maxDistance,
                t._panner.panningModel = t._pannerAttr.panningModel,
                t._panner.refDistance = t._pannerAttr.refDistance,
                t._panner.rolloffFactor = t._pannerAttr.rolloffFactor,
                t._panner.setPosition(t._pos[0], t._pos[1], t._pos[2]),
                t._panner.setOrientation(t._orientation[0], t._orientation[1], t._orientation[2])) : (t._panner = Howler.ctx.createStereoPanner(),
                t._panner.pan.value = t._stereo),
                t._panner.connect(t._node),
                t._paused || t._parent.pause(t._id, !0).play(t._id)
            }
        }()
    })
      , de = ce.Howl
      , fe = ft.create()
      , he = function() {
        function t(e) {
            q(this, t),
            this.buffers = {
                v: null,
                e: null
            },
            this.elem_count = 0,
            this.start_time = 0,
            this.mat = lt.create(),
            this.color = ft.create(),
            this.color2 = ft.create(),
            this.fade_time = 0,
            this.speed = .02,
            this.distort = .015,
            this.delay = 0,
            this.setup(e)
        }
        return C(t, [{
            key: "setup",
            value: function(t) {
                var e = this
                  , a = this.mat;
                lt.identity(a),
                lt.translate(a, a, t.pos),
                lt.scale(a, a, [t.scale, t.scale, t.scale]),
                lt.rotateY(a, a, t.rotate),
                ft.copy(this.color, t.color),
                ft.copy(this.color2, t.color2),
                this.speed = t.speed,
                "distort"in t && (this.distort = t.distort),
                "delay"in t && (this.delay = t.delay),
                o("data/" + t.id + ".mpz").then(function(t) {
                    return e.init(t)
                })
            }
        }, {
            key: "start",
            value: function() {
                this.start_time = performance.now() + 1e3 * this.delay,
                this.fade_time = 0
            }
        }, {
            key: "fade",
            value: function() {
                this.fade_time = performance.now()
            }
        }, {
            key: "init",
            value: function(t) {
                var e = []
                  , a = []
                  , n = 0;
                t.forEach(function(t) {
                    for (var r = 0; r < t.length; r += 2) {
                        var o = t[r + 0]
                          , i = -t[r + 1];
                        r && a.push(n - 1, n),
                        e.push(o, i),
                        ++n
                    }
                }),
                console.assert(n < 65536),
                this.buffers.e = m(new Uint16Array(a)),
                this.buffers.v = v(new Float32Array(e)),
                this.elem_count = a.length
            }
        }, {
            key: "draw",
            value: function(t) {
                if (this.elem_count && this.start_time) {
                    var a = (performance.now() - this.start_time) / 1e3;
                    if (ft.copy(fe, this.color),
                    this.fade_time) {
                        var n = (performance.now() - this.fade_time) / 3e3;
                        if (0 == (n = e(1 - n, 0, 1)))
                            return;
                        fe[3] *= n * n
                    }
                    var r = 1 * a;
                    gl.enable(gl.DEPTH_TEST),
                    gl.enable(gl.BLEND),
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                    var o = xt("lyric").use();
                    o.uniformMatrix4fv("m_vp", t.camera.mvp),
                    o.uniformMatrix4fv("m_obj", this.mat),
                    o.uniform4fv("color", fe),
                    o.uniform1f("time", r),
                    o.uniform1f("distort_scale", this.distort),
                    g(this.buffers.v),
                    o.vertexAttribPointer("coord", 2, gl.FLOAT, !1, 0, 0),
                    M(this.buffers.e);
                    var i = this.speed * a
                      , s = Math.min(this.elem_count, Math.floor(i * this.elem_count));
                    gl.drawElements(gl.LINES, s, gl.UNSIGNED_SHORT, 0),
                    gl.disable(gl.BLEND)
                }
            }
        }]),
        t
    }()
      , _e = (ft.create(),
    new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]))
      , pe = null
      , ve = null
      , me = null
      , ge = function() {
        function t(e) {
            q(this, t),
            O(),
            this.mat = lt.create(),
            this.texpos = 0,
            e && this.setup(e)
        }
        return C(t, [{
            key: "setup",
            value: function(t) {
                var e = this.mat;
                lt.identity(e),
                lt.translate(e, e, t.pos),
                lt.scale(e, e, [t.scale, t.scale, t.scale]),
                lt.rotateY(e, e, t.rotate),
                this.texpos = t.texpos
            }
        }, {
            key: "draw",
            value: function(t) {
                pe && (gl.enable(gl.DEPTH_TEST),
                gl.depthMask(!0),
                me.use(),
                me.uniformMatrix4fv("m_vp", t.camera.mvp),
                me.uniform3fv("view_pos", t.camera.view_pos),
                me.uniformMatrix4fv("m_obj", this.mat),
                me.uniformSampler2D("s_image", ve),
                me.uniform1f("texpos", this.texpos),
                me.uniform3f("fog_color", .05, 0, .15),
                me.uniform2f("fog_range", 10, 20),
                g(pe),
                me.vertexAttribPointer("coord", 2, gl.FLOAT, !1, 0, 0),
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4))
            }
        }]),
        t
    }();
    window.main = function() {
        function e(t) {
            I.intro.play(),
            s(),
            t && (w(),
            R = !0),
            U() && b()
        }
        function a() {
            P = !0,
            I.intro.fade(1, 0, 500)
        }
        function o() {
            gl.clearColor(0, 0, 0, 1),
            gl.clear(gl.COLOR_BUFFER_BIT)
        }
        function i() {
            P && (P = !1,
            0 == A.area && I.intro.fade(0, 1, 500),
            s())
        }
        function s() {
            P || requestAnimationFrame(s),
            A.check_keys(),
            f(),
            p(),
            M(),
            D._draw()
        }
        function l() {
            if ((q = t(q, C, .0075)) < .01)
                return void (q = 0);
            gl.disable(gl.DEPTH_TEST),
            gl.enable(gl.BLEND),
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            var e = Y.use();
            e.uniformMatrix4fv("mvp", X),
            O[3] = q,
            e.uniform4fv("color", O),
            g(G),
            e.vertexAttribPointer("position", 2, gl.FLOAT, !1, 0, 0),
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4),
            gl.disable(gl.BLEND)
        }
        function u() {
            var t = {
                pos: Array.from(A.pos),
                dir: A.dir
            };
            t = JSON.stringify(t),
            localStorage.setItem("player.state", t)
        }
        function c() {
            dt.set(A.pos, 60.5, 41, .5),
            A.dir = 1
        }
        function d() {
            c()
        }
        function f() {
            var e = F.ghost
              , a = e.pos[0] - (A.pos[0] - .5)
              , n = e.pos[1] - (A.pos[1] + .5)
              , r = -Math.atan2(n, a)
              , o = 2 * r / Math.PI + 1;
            if (e.dir = t(e.dir, o, .05),
            e.active) {
                var i = -.5 * Math.PI * (e.dir + 1)
                  , s = .005
                  , l = e.pos[0] + s * Math.cos(i)
                  , u = e.pos[1] + s * Math.sin(i);
                e.pos[0] = l,
                e.pos[1] = u;
                var s = ct.dist(e.pos, A.pos);
                s < 2 && (e.active = !1,
                I.screech.play())
            }
        }
        function h() {
            I.plane_splash.play(),
            F.plane_start = performance.now()
        }
        function p() {
            if (!F.plane_start) {
                var t = ~~A.pos[0]
                  , e = ~~A.pos[1]
                  , a = 3 & Math.round(A.dir);
                79 == t && 86 == e && 3 == a && h()
            }
        }
        function m(t) {
            var e = $("<iframe>").attr({
                src: t.url,
                frameborder: 0,
                allowfullscreen: 1
            });
            $(".linkbox").html(e),
            e.on("load", function(t) {
                $(".linkbox").css({
                    display: "block",
                    opacity: 1
                }),
                $(".close").show()
            }),
            a(),
            requestAnimationFrame(o),
            I.door_open.play()
        }
        function M() {
            S.forEach(function(t) {
                if (!t.visited) {
                    ct.dist(A.pos, t.pos) > 1 || (R || (m(t),
                    I.siren.stop()),
                    t.visited = !0,
                    setTimeout(function() {
                        A.pos[0] = t.respawn[0],
                        A.pos[1] = t.respawn[1],
                        A.dir = t.respawn[2],
                        t.visited = !1
                    }, 500))
                }
            })
        }
        function x(t, e) {
            switch (t) {
            case "u":
                A.touch.advance = e ? 1 : 0;
                break;
            case "r":
                A.touch.rotate = e ? .01 : 0;
                break;
            case "d":
                A.touch.advance = e ? -1 : 0;
                break;
            case "l":
                A.touch.rotate = e ? -.01 : 0
            }
            A.touch.rotating = !!e
        }
        function b() {
            $(".arrow-controls").show(),
            $(".arrow-controls-dir").on("mousedown touchstart", function(t) {
                t.preventDefault(),
                x(this.dataset.dir, 1),
                $(this).addClass("arrow-controls-dir-active")
            }),
            $(".arrow-controls-dir").on("mouseup touchend", function(t) {
                t.preventDefault(),
                x(this.dataset.dir, 0),
                $(this).removeClass("arrow-controls-dir-active")
            }),
            D.el.addEventListener("touchstart", function(t) {
                t.preventDefault()
            })
        }
        function y(t) {
            return void 0 === t && (t = !Howler._muted),
            Howler.mute(t),
            t
        }
        function w() {
            key("p", function() {
                var t = A.pos[0].toFixed(1)
                  , e = A.pos[1].toFixed(1)
                  , a = A.dir;
                $("#debug").text(t + "," + e + "," + a)
            }),
            key("a", function() {
                k.aerial = !k.aerial,
                k.aerial_pos[0] = A.pos[0],
                k.aerial_pos[2] = -A.pos[1],
                F.fog_enabled = !k.aerial,
                F.draw_debug = k.aerial
            }),
            key("o", function() {
                k.ortho = !k.ortho
            }),
            key("c", function() {
                A.collide = !A.collide
            });
            for (var t = 0; t <= 8; ++t)
                !function(t) {
                    var e = String.fromCharCode(48 + t);
                    key(e, function() {
                        z = z == t ? 0 : t,
                        $("#debug").text("area: " + z)
                    })
                }(t);
            key("r", function() {
                c()
            }),
            key("d", function() {
                n(localStorage.getItem("level.areas"), "level.areas.txt", "text/plain")
            }),
            key("x", h),
            key("l", function() {
                F.load_areas_from_local_storage()
            }),
            key("s", u)
        }
        var S = [{
            name: "relaxer",
            url: B("altj", "RelaxerPR"),
            visited: !1,
            pos: [59, .5],
            respawn: [59.6, 4.6, 3]
        }, {
            name: "crane",
            url: B("yt", "pleader"),
            visited: !1,
            pos: [88, 98],
            respawn: [87.8, 94.2, 3.1]
        }, {
            name: "jetty1",
            url: B("yt", "house_of_the_rising_sun"),
            visited: !1,
            pos: [69, 104],
            respawn: [68.1, 97.3, 3.1]
        }, {
            name: "eye1",
            url: B("yt", "deadcrush"),
            visited: !1,
            pos: [37, 62],
            respawn: [35.4, 57.6, 3.21]
        }, {
            name: "hopscotch",
            url: B("yt", "kimmel_3ww"),
            visited: !1,
            pos: [44, 25],
            respawn: [40.7, 27.2, .3]
        }, {
            name: "gunman",
            url: B("pic", "0218"),
            visited: !1,
            pos: [93, 70],
            respawn: [92.3, 73.3, .8]
        }, {
            name: "eye2",
            url: B("pic", "0305"),
            visited: !1,
            pos: [37, 70],
            respawn: [38.5, 67.4, 2.8]
        }, {
            name: "sailor",
            url: B("yt", "holland_in_cold_blood"),
            visited: !1,
            pos: [77, 97],
            respawn: [80, 95.1, 2.5]
        }, {
            name: "tree2",
            url: B("yt", "_3ww"),
            visited: !1,
            pos: [94, 88],
            respawn: [96.6, 84.1, 2.7]
        }, {
            name: "tree1",
            url: B("yt", "last_year"),
            visited: !1,
            pos: [95, 42],
            respawn: [92.8, 46.5, .6]
        }, {
            name: "lamp",
            url: B("yt", "hit_me_like_that_snare"),
            visited: !1,
            pos: [38, 8],
            respawn: [36.3, 14.1, .7]
        }, {
            name: "woman",
            url: B("yt", "adeline"),
            visited: !1,
            pos: [63, 9],
            respawn: [62.1, 12.4, .7]
        }, {
            name: "hole",
            url: B("yt", "in_cold_blood", "t=5s"),
            visited: !1,
            pos: [32, 74],
            respawn: [34.8, 77.4, 1.3]
        }, {
            name: "grave",
            url: B("pic", "boleyn"),
            visited: !1,
            pos: [94, 18],
            respawn: [92.3, 21.7, .625]
        }]
          , I = {
            intro: N("3ww_intro", !0)
        }
          , D = new Dt({
            antialias: !1,
            extensions: ["OES_standard_derivatives"],
            shaders: ["// simple //\nattribute vec3 position;\n\n// simple.vertex //\nuniform mat4 mvp;\n\nvoid main() {\n    gl_Position = mvp * vec4(position, 1.0);\n}\n\n// simple.fragment //\nuniform vec4 color;\nvoid main() {\n    gl_FragColor = color;\n}\n\n\n\n// lyric //\nattribute vec2 coord;\n\n// lyric.vertex //\nuniform mat4 m_vp;\nuniform mat4 m_obj;\nuniform float time;\nuniform float distort_scale;\n\nfloat rand(vec2 co){\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\n\nvec2 distort(vec2 co, float time) {\n    vec2 o;\n    float scale = 0.015;\n    o.x = co.x + distort_scale * (rand(vec2(time + co.x, co.y)) - 0.5);\n    o.y = co.y + distort_scale * (rand(vec2(time + co.x + 4.2323, co.y + 83.2392)) - 0.5);\n    return o;\n}\n\nvoid main() {\n    vec3 P = vec3(coord.x, coord.y, 0.0);\n    P.xy = distort(P.xy, 0.000002*time);\n    gl_Position = m_vp * m_obj * vec4(P, 1.0);\n}\n\n// lyric.fragment //\nuniform vec4 color;\nvoid main() {\n    gl_FragColor = color;\n}\n\n\n\n// placard //\nattribute vec2 coord;\nvarying vec2 v_texcoord;\nvarying vec3 v_view;\n\n// placard.vertex //\nuniform mat4 m_vp;\nuniform mat4 m_obj;\nuniform vec3 view_pos;\nuniform float texpos;\n\nvoid main() {\n    vec3 P = vec3(coord.x - 0.5, coord.y, 0.0);\n    P = (m_obj * vec4(P, 1.0)).xyz;\n    v_view = (view_pos - P);\n    gl_Position = m_vp * vec4(P, 1.0);\n    v_texcoord = vec2(0.5*(coord.x + texpos), coord.y);\n}\n\n// placard.fragment //\nuniform sampler2D s_image;\nuniform vec2 fog_range;\nuniform vec3 fog_color;\n\nvoid main() {\n    // FIXME normals?? fog??\n    vec4 Ct = texture2D(s_image, v_texcoord.xy);\n    gl_FragColor = Ct;\n\n    {\n        float fog_start = fog_range[0];\n        float fog_end = fog_range[1];\n        float d = length(v_view);\n        float fog_factor = (fog_end - d) / (fog_end - fog_start);\n        fog_factor = clamp(fog_factor, 0.0, 1.0);\n        gl_FragColor.rgb = mix(fog_color, gl_FragColor.rgb, fog_factor);\n    }\n}\n\n\n\n// tiles //\nattribute vec2 coord;\nvarying vec2 v_coord;\nvarying vec2 v_coord_grid;\n\n// tiles.vertex //\nuniform vec2 size;\nuniform mat4 m_vp;\n\nvoid main() {\n    vec2 C = size * coord;\n    vec3 P = vec3(C.x, 0.0, -C.y);\n    gl_Position = m_vp * vec4(P, 1.0);\n    v_coord = coord;\n    v_coord_grid = C;\n}\n\n// tiles.fragment //\n#extension GL_OES_standard_derivatives : enable\n\nuniform vec4 color;\nuniform sampler2D s_map;\nuniform sampler2D s_lut;\n\nfloat grid(vec2 co) {\n    float divisions = 1.0;\n    float thickness = 0.025;\n    float delta = 0.05 / 2.0;\n\n    float x = fract(co.x * divisions);\n    x = min(x, 1.0 - x);\n\n    float xdelta = fwidth(x);\n    x = smoothstep(x - xdelta, x + xdelta, thickness);\n\n    float y = fract(co.y * divisions);\n    y = min(y, 1.0 - y);\n\n    float ydelta = fwidth(y);\n    y = smoothstep(y - ydelta, y + ydelta, thickness);\n\n    float c = clamp(x + y, 0.0, 1.0);\n\n    return c;\n}\n\nvoid main() {\n    gl_FragColor.rgb = vec3(0.0);\n\n    float v = texture2D(s_map, v_coord).r;\n    vec3 vcol = texture2D(s_lut, vec2(v, 0.0)).rgb;\n    gl_FragColor.rgb += 0.5 * vcol;\n\n    float cc = grid(v_coord_grid);\n    gl_FragColor.rgb += cc * (color.rgb * color.a);\n\n    gl_FragColor.a = 1.0;\n}\n\n\n\n// tmd //\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec3 color;\nattribute vec3 texcoord;\n\nvarying vec3 v_color;\nvarying vec3 v_light;\nvarying vec3 v_view;\nvarying vec3 v_position;\nvarying vec3 v_normal;\nvarying vec2 v_texcoord;\n\n// tmd.vertex //\nuniform mat4 m_vp;\nuniform mat4 m_obj;\n\nuniform vec3 view_pos;\nuniform vec3 light_pos;\n\nvoid main() {\n    vec3 P = position;\n    P.y = -P.y;\n    P.z = -P.z;\n\n    vec3 N = normal / 4096.0;\n    N.y = -N.y;\n    N.z = -N.z;\n\n    P = (m_obj * vec4(P, 1.0)).xyz;\n    N = (m_obj * vec4(N, 0.0)).xyz;\n\n    v_view = (view_pos - P);\n    v_light = (light_pos - P);\n    v_position = P;\n    v_color = color;\n    v_normal = normalize(N);\n    v_texcoord = vec2(texcoord.x / 2048.0, texcoord.y / 512.0);\n\n    gl_Position = m_vp * vec4(P, 1.0);\n}\n\n// tmd.fragment //\nuniform sampler2D s_tix;\nuniform vec3 ambient;\nuniform vec2 fog_range;\nuniform vec3 fog_color;\n\n// FIXME lighting calc should be in vertex shader ??\nvoid main() {\n    vec3 N = normalize(v_normal);\n    vec3 V = normalize(v_view);\n    vec3 L = normalize(v_light);\n    vec3 H = normalize(L + V);\n\n    float NdotL = max(0.0, dot(N, L));\n    vec3 Kd = ambient + vec3(2.0 * NdotL);\n    vec3 Cd = v_color;\n    vec3 C = Kd * Cd;\n\n    if (v_texcoord.x > 0.0) {\n        vec4 Ct = texture2D(s_tix, v_texcoord.xy);\n        if (Ct.a < 0.5) discard;\n        gl_FragColor.rgb = C * Ct.rgb;\n    } else {\n        gl_FragColor.rgb = C;\n    }\n\n    gl_FragColor.a = 1.0;\n\n    // fog:\n    {\n        float fog_start = fog_range[0];\n        float fog_end = fog_range[1];\n        float d = length(v_view);\n        float fog_factor = (fog_end - d) / (fog_end - fog_start);\n        fog_factor = clamp(fog_factor, 0.0, 1.0);\n        gl_FragColor.rgb = mix(fog_color, gl_FragColor.rgb, fog_factor);\n    }\n}\n"]
        });
        if (!gl)
            return void $(".info").html('Sorry, your device doesn\'t support WebGL :(             <br><br/>\n            <a style="display: inline-block; border: 1px solid white; padding: 10px; width: 200px;" href="http://altjband.com/">Home</a>');
        D.light_pos = dt.fromValues(100, 100, 100),
        D.light_pos_v = dt.create(),
        $(D.el).addClass("webgl"),
        $("#main").prepend(D.el);
        var F = new Zt;
        F.load(5).then(function() {
            A.level = F,
            F.player = A,
            d()
        });
        var A = new Ft;
        dt.set(A.pos, 60.5, 40, .5),
        A.dir = 1,
        A.collide = !0,
        A.on_leave_area = function(t) {
            0 == t && I.intro.fade(1, 0, 500),
            5 == t && (E[1].fade(),
            I.campfire.stop(),
            F.ghost.active = !0),
            3 == t && (I.brass2.stop(),
            E[2].fade()),
            6 == t && (I.pool1.stop(),
            E[0].fade()),
            8 == t && I.siren.stop(),
            9 == t && (I.choir.stop(),
            E[3].fade()),
            10 == t && (I.breathing.stop(),
            E[4].fade())
        }
        ,
        A.on_enter_area = function(t) {
            if (0 == t && I.intro.fade(0, 1, 1e3),
            3 == t && (I.brass2.play(),
            E[2].start()),
            5 == t) {
                var e = I.campfire;
                e.play(),
                E[1].start()
            }
            if (6 == t) {
                var e = I.pool1;
                e.play(),
                E[0].start()
            }
            if (4 == t) {
                var e = _.sample([I.howl1, I.howl2]);
                e.play()
            }
            8 == t && I.siren.play(),
            9 == t && (I.choir.play(),
            E[3].start()),
            10 == t && (I.breathing.play(),
            E[4].start())
        }
        ;
        var E = [new he({
            id: "lyr2",
            pos: [37, 1.5, -2.5],
            scale: 4.5,
            rotate: Math.PI,
            color: [0, .4, .9, .85],
            color2: [.8, 0, .7, .65],
            speed: .067
        }), new he({
            id: "lyr1",
            pos: [77.5, 1.5, -66.001],
            scale: 2,
            rotate: Math.PI,
            color: [1, .8, .1, .85],
            color2: [1, .3, 0, .65],
            speed: .02
        }), new he({
            id: "lyr4",
            pos: [91.005, .5, -12.5],
            scale: 3,
            rotate: .5 * Math.PI,
            color: [.8, .1, 0, .55],
            color2: [1, .3, 0, .65],
            speed: .2,
            distort: .0015,
            delay: 5
        }), new he({
            id: "lyr5",
            pos: [93.5, 1.7, -65.9],
            scale: 2,
            rotate: 0,
            color: [.2, .8, .1, .55],
            color2: [1, .3, 0, .65],
            speed: .2
        }), new he({
            id: "lyr6",
            pos: [45.5, 1.4, -38.1],
            scale: 1.8,
            rotate: 1 * Math.PI,
            color: [.3, .8, .9, .55],
            color2: [1, 0, 0, .95],
            speed: .15
        })]
          , T = [new ge({
            pos: [59, 0, -.01],
            scale: 1,
            rotate: Math.PI,
            texpos: 0
        })]
          , P = !1
          , R = !1
          , k = {
            enabled: !0,
            aerial: !1,
            ortho: !0,
            pos: dt.create(),
            dir: ut.create(),
            aerial_pos: dt.create(),
            aerial_dir: ut.create(),
            aerial_height: 50,
            update: function() {
                this.pos[0] = A.pos[0],
                this.pos[1] = A.pos[2],
                this.pos[2] = -A.pos[1],
                ut.identity(this.dir),
                ut.rotateY(this.dir, this.dir, -.5 * (A.dir + 1) * Math.PI),
                this.aerial_pos[1] = this.aerial_height,
                ut.identity(this.aerial_dir),
                ut.rotateX(this.aerial_dir, this.aerial_dir, -.5 * Math.PI)
            }
        }
          , L = {
            pos: ct.create(),
            last: ct.create(),
            first: ct.create(),
            delta: ct.create(),
            button: -1,
            update: function(t) {
                ct.copy(this.last, this.pos),
                r(this.pos, t),
                ct.sub(this.delta, this.pos, this.last)
            },
            pick_ray: new ie(D.camera)
        };
        document.addEventListener("mousewheel", function(t) {
            if (k.aerial) {
                var e = t.wheelDelta / 120;
                k.aerial_height += 5 * e,
                k.aerial_height = Math.max(10, k.aerial_height)
            }
        }),
        D.el.addEventListener("mousedown", function(t) {
            k.aerial && (L.update(t),
            ct.copy(L.first, L.pos),
            L.button = t.button,
            t.preventDefault())
        }),
        document.addEventListener("mousemove", function(t) {
            if (k.aerial && (L.update(t),
            0 == L.button)) {
                k.aerial_pos[0] -= .01 * L.delta[0],
                k.aerial_pos[2] -= .01 * L.delta[1]
            }
        }),
        document.addEventListener("mouseup", function(t) {
            if (k.aerial) {
                if (ct.dist(L.first, L.pos) < .1) {
                    L.pick_ray.fromWindowCoords(L.pos[0], window.innerHeight - L.pos[1]);
                    var e = dt.create();
                    dt.copy(e, L.pick_ray.origin);
                    var a = -L.pick_ray.origin[1] / L.pick_ray.direction[1];
                    if (dt.scaleAndAdd(e, e, L.pick_ray.direction, a),
                    t.ctrlKey)
                        A.pos[0] = e[0],
                        A.pos[1] = -e[2],
                        ue(dt.str(A.pos)),
                        $("#debug").text(dt.str(A.pos));
                    else {
                        var n = e[0]
                          , r = -e[2];
                        F.toggle_area(n, r, z)
                    }
                }
                L.update(t),
                L.button = -1
            }
        });
        var z = 0
          , O = ft.fromValues(0, 0, 0, 1)
          , q = 1
          , C = 0
          , G = v(new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]))
          , Y = xt("simple")
          , X = lt.create();
        return lt.identity(X),
        lt.translate(X, X, [-1, -1, 0]),
        lt.scale(X, X, [2, 2, 2]),
        D._draw = function() {
            var t = this;
            this.check_resize(),
            this.update_camera(),
            gl.clearColor(.05, 0, .15, 1),
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT),
            k.enabled ? (k.update(),
            this.camera.near = .01,
            this.camera.far = 20,
            this.camera.fov = 30,
            this.camera.ortho = !1,
            this.camera.update_quat(k.pos, k.dir),
            lt.copy(A.mvp, this.camera.mvp),
            lt.copy(A.inverse_mvp, this.camera.inv_mvp),
            k.aerial ? (this.camera.far = 1e3,
            this.camera.near = .01,
            this.camera.ortho = k.ortho ? .5 * k.aerial_pos[1] - 10 : 0,
            this.camera.update_quat(k.aerial_pos, k.aerial_dir)) : this.camera.ortho = 0) : this.camera.ortho = 0,
            T.forEach(function(e) {
                return e.draw(t)
            }),
            F.flicker = 5 == A.area,
            F.draw(this),
            k.aerial && A.draw(this),
            E.forEach(function(e) {
                return e.draw(t)
            }),
            l()
        }
        ,
        dt.set(F.ghost.pos, 78.52, 66.41, 0),
        $("button.close").on("click", function() {
            i(),
            $(".linkbox iframe").remove(),
            $(".linkbox").css({
                display: "none",
                opacity: 0
            }),
            $(".close").hide()
        }),
        $("button.enter").on("click", function() {
            $(".infobox").hide(),
            e()
        }),
        function() {
            _.assign(I, {
                howl1: N("howl1", !1),
                howl2: N("howl2", !1),
                brass1: N("brass1", !1),
                brass2: N("brass2", !1),
                pool1: N("pool1", !0),
                campfire: N("campfire_c", !0),
                screech: N("screech_and_bump", !1),
                siren: N("siren", !0),
                plane_splash: N("plane_splash", !1),
                door_open: N("door_open", !1),
                breathing: N("breathing", !0),
                choir: N("choir", !1)
            })
        }(),
        key("m", function() {
            return y()
        }),
        {
            start: e,
            mute: y
        }
    }
}();

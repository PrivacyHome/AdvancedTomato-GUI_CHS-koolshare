function AdvancedTomato() {
    if (window.location.hash.match(/#/)) {
        loadPage(window.location.hash)
    } else {
        loadPage("#status-home.asp")
    }
    $(window).bind("hashchange",
    function() { ((location.hash.replace("#", "") != "") ? loadPage(location.hash.replace("#", ""), true) : "");
        return false
    });
    navi();
    $("#wrapper").prepend('<div id="nprogress"></div>');
    $(".navigation > ul > li").each(function(c) {
        if ($(this).hasClass("active")) {
            $(this).find("ul").slideDown(250, "easeOutCirc")
        } else {
            $(this).find("ul").slideUp(250, "easeOutCirc")
        }
    });
    $(".navigation > ul > li > a").on(gui.nav_action,
    function() {
        var d = $(this);
        function c() {
            if ($(".navigation").hasClass("collapsed")) {
                return
            }
            if ($(d).parent("li").hasClass("active")) {
                return false
            }
            $(".navigation > ul > li").removeClass("active").find("ul").slideUp("100");
            $(d).parent("li").addClass("active");
            $(d).closest("li").find("ul").slideDown("100");
            return false
        }
        if (gui.nav_action == "mouseover") {
            clearTimeout(gui.nav_delay);
            gui.nav_delay = setTimeout(c, 100)
        } else {
            c()
        }
    });
    $(".ajaxwrap").on("click", ".alert .close",
    function() {
        if ($(this).attr("data-update")) {
            cookie.set("latest-update", $(this).attr("data-update"))
        }
        $(this).parent(".alert").slideUp();
        return false
    });
    $('.navigation li ul a, .header .links a[href!="#system"]').on("click",
    function(c) {
        if ($(this).attr("target") != "_blank") {
            loadPage($(this).attr("href"));
            return false
        }
    });
    $(".toggle-nav").on("click",
    function() {
        if (!$(".navigation").hasClass("collapsed")) {
            $("#wrapper").find(".container, .top-header, .navigation").addClass("collapsed");
            $("#wrapper").find(".nav-collapse-hide").hide()
        } else {
            $("#wrapper").find(".container, .top-header, .navigation").removeClass("collapsed");
            setTimeout(function() {
                $("#wrapper").find(".nav-collapse-hide").show()
            },
            300)
        }
    });
    $(".ajaxwrap").on("click", ".ajaxload",
    function(c) {
        loadPage($(this).attr("href"));
        return false
    });
    $("#system-ui").on("click",
    function() {
        if ($(this).hasClass("active")) {
            $("#system-ui").removeClass("active");
            $(".system-ui").fadeOut(250);
            clearInterval(gui.refresh_timer)
        } else {
            $(this).addClass("active");
            $(".system-ui").fadeIn(250);
            $(".system-ui .datasystem").html('<div class="inner-container row"><div style="margin: 45px auto 35px; width: 26px; height:26px;" class="spinner"></div></div>').addClass("align center");
            gui.refresh_timer = setInterval(systemUI, 1600);
            systemUI();
            $(document).click(function() {
                $("#system-ui").removeClass("active");
                $(".system-ui").fadeOut(250);
                clearInterval(gui.refresh_timer);
                $(document).unbind("click")
            })
        }
        return false
    });
    if (typeof nvram == "undefined") {
        return false
    }
    if (typeof nvram.at_update !== "undefined" && nvram.at_update != "") {
        var b = cookie.get("latest-update");
        var a = nvram.at_update.replace(".", "");
        if (b < a || b == null) {
            $updateNotification = $('<div class="alert alert-info icon"><a href="#" class="close" data-update="' + nvram.at_update.replace(".", "") + '"><i class="icon-cancel"></i></a><h5>更新可用!</h5>Advanced Tomato 版本 <b>' + nvram.at_update + '</b> 已发布，可供下载.	&nbsp; <a target="_blank" href="https://advancedtomato.com/">请点击这里了解更多</a>.</div>');
            $($updateNotification).find(".close").on("click",
            function() {
                if ($(this).attr("data-update")) {
                    cookie.set("latest-update", $(this).attr("data-update"))
                }
                $(this).parent(".alert").slideUp();
                return false
            });
            $(".container").prepend($updateNotification)
        }
    }
    if (typeof nvram.tomatoanon_answer !== "undefined") {
        if (nvram.tomatoanon_answer != "1") {
            $(".container").prepend('<div class="alert alert-warning icon"><h5>注意</h5> 你还没有设置 <b>番茄统计计划</b> .请到 <a onclick="loadPage(\'admin-tomatoanon.asp\')" href="#">番茄统计设置页面</a> 去做抉择吧.</div>')
        }
    }
    if (typeof nvram.at_nav_state !== "undefined") {
        if (nvram.at_nav_state == "collapsed" || $(window).width() <= 768) {
            $("#wrapper").find(".container, .top-header, .navigation").addClass("collapsed");
            $("#wrapper").find(".nav-collapse-hide").hide()
        }
    }
}
function systemUI() {
    $.ajax({
        url: "js/status-data.jsx",
        method: "POST",
        data: {
            _http_id: escapeCGI(nvram.http_id)
        }
    }).done(function(data) {
        stats = {};
        try {
            eval(data)
        } catch(ex) {
            stats = {}
        }
        var wanstatus = '<a title="跳转转到状态概述" href="#" onclick="loadPage(\'#status-home.asp\');">' + ((stats.wanstatus[0] == "Connected") ? '<span style="color: green;">已连接</span>': "未连接") + "</a>";
        $(".system-ui .datasystem").html('<div class="router-name">' + nvram.t_model_name + ' <small class="pull-right">(' + stats.uptime + ')</small></div><div class="inner-container row"><div class="desc">CPU负载:</div><div class="value">' + stats.cpuload + '</div><div class="desc">内存占用:</div><div class="value">' + stats.memory + '<div class="progress small"><div class="bar" style="width: ' + stats.memoryperc + '"></div></div></div>' + ((nvram.swap != null) ? '<div class="desc">交换占用:</div><div class="value">' + stats.swap + '<div class="progress small"><div class="bar" style="width: ' + stats.swapperc + '"></div></div></div>': "") + '<div class="desc" style="margin-bottom:2px;">连接状态:</div><div class="value">' + wanstatus + " (" + stats.wanuptime[0] + ")</div></div>").removeClass("align center")
    }).fail(function() {
        clearInterval(gui.refresh_timer)
    })
}
function data_boxes() {
    $("[data-box]").each(function() {
        var d = $(this).attr("data-box");
        var c = $(this);
        var a = (((hs_cook = cookie.get(d + "_visibility")) != null && (hs_cook != "1")) && $(this).is(":visible")) ? false: true;
        var b = $('<a class="pull-right" href="#" data-toggle="tooltip" title="隐藏/显示"><i class="icon-chevron-' + ((a) ? "down": "up") + '"></i></a>');
        if (a) {
            $(this).find(".content").show()
        } else {
            $(this).find(".content").hide()
        }
        $(b).on("click",
        function() {
            if (a) {
                $(c).find(".content").stop(true, true).slideUp(700, "easeOutBounce");
                $(b).find("i").removeClass("icon-chevron-down").addClass("icon-chevron-up");
                cookie.set(d + "_visibility", 0);
                a = false
            } else {
                $(c).find(".content").stop(true, true).slideDown(350, "easeInQuad");
                $(b).find("i").removeClass("icon-chevron-up").addClass("icon-chevron-down");
                cookie.set(d + "_visibility", 1);
                a = true
            }
            return false
        });
        $(c).find(".heading").prepend(b)
    })
}
var ajax_retries = 1;
function loadPage(b, a) {
    b = b.replace("#", "");
    if (b == "status-home.asp" || b == "/" || b == null) {
        b = "status-home.asp"
    }
    if (window.ajaxLoadingState) {
        return false
    } else {
        window.ajaxLoadingState = true
    }
    if (typeof(ref) != "undefined") {
        ref.destroy();
        ref = undefined;
        delete ref
    }
    if (typeof(wdog) != "undefined") {
        clearTimeout(wdog)
    }
    $("#nprogress").append('<div class="bar"></div>');
    $(".container .ajaxwrap").removeClass("ajax-animation");
    $.ajax({
        url: b,
        async: true,
        cache: false,
        timeout: 2950
    }).done(function(g) {
        var f = $(g);
        var e = f.filter("title").text();
        var c = f.filter("content").html();
        if (e == null || c == null) {
            window.parent.location.href = b;
            return false
        }
        $("title").text(window.routerName + e);
        $("h2.currentpage").text(e);
        $(".container .ajaxwrap").html(c).addClass("ajax-animation");
        if (history.pushState && a !== true) {
            history.pushState({
                html: c,
                pageTitle: window.routerName + e
            },
            window.routerName + e, "#" + b)
        }
        $(".container").scrollTop(0);
        $(".navigation li ul li").removeClass("active");
        var d = $(".navigation a[href='#" + b + "']");
        $(d).parent("li").addClass("active");
        $('[data-toggle="tooltip"]').tooltip({
            placement: "top auto",
            container: "body"
        });
        $("input[type='file']").each(function() {
            $(this).customFileInput()
        });
        data_boxes();
        $("#nprogress").find(".bar").css({
            animation: "none"
        }).width("100%");
        setTimeout(function() {
            $("#nprogress .bar").remove()
        },
        250);
        window.ajaxLoadingState = false;
        if (ajax_retries != 1) {
            $(".body-overwrite").remove()
        }
        ajax_retries = 1
    }).fail(function(c, e, d) {
        console.log(c, d);
        if (ajax_retries <= 8) {
            if ($("body .body-overwrite").length == 0) {
                $("body").append('<div class="body-overwrite"><div class="body-overwrite-text text-center"><div class="spinner spinner-large"></div><br><br><b>连接丢失!</b><br>正在尝试重新连接...</div></div>')
            }
            setTimeout(function() {
                ajax_retries++;
                window.ajaxLoadingState = false;
                loadPage(b, a)
            },
            3000);
            return
        }
        if (c.status == 0) {
            c.status = 504
        }
        $("h2.currentpage").text(c.status + " 错误");
        $(".container .ajaxwrap").html('<div class="box"><div class="heading">错误 - ' + c.status + '</div><div class="content"><p>UI 无法与路由器通信!<br>这些问题通常发生在文件丢失,Web处理程序正忙或连接到路由器不可用时.</p><a href="/">刷新</a> 浏览器窗口可能会有帮助.</div></div>').addClass("ajax-animation");
        window.ajaxLoadingState = false;
        if (ajax_retries != 1) {
            $(".body-overwrite").remove()
        }
        $("#nprogress").find(".bar").css({
            animation: "none"
        }).width("100%");
        setTimeout(function() {
            $("#nprogress .bar").remove()
        },
        250)
    })
} (function(a) {
    a.fn.customFileInput = function() {
        var c = a(this).addClass("customfile-input").mouseover(function() {
            e.addClass("customfile-hover")
        }).mouseout(function() {
            e.removeClass("customfile-hover")
        }).focus(function() {
            e.addClass("customfile-focus");
            c.data("val", c.val())
        }).blur(function() {
            e.removeClass("customfile-focus");
            a(this).trigger("checkChange")
        }).bind("disable",
        function() {
            c.attr("disabled", true);
            e.addClass("customfile-disabled")
        }).bind("enable",
        function() {
            c.removeAttr("disabled");
            e.removeClass("customfile-disabled")
        }).bind("checkChange",
        function() {
            if (c.val() && c.val() != c.data("val")) {
                c.trigger("change")
            }
        }).bind("change",
        function() {
            var f = a(this).val().split(/\\/).pop();
            var g = "customfile-ext-" + f.split(".").pop().toLowerCase();
            b.html('<i class="icon-file"></i> ' + f).removeClass(b.data("fileExt") || "").addClass(g).data("fileExt", g);
            d.text("改变")
        }).click(function() {
            c.data("val", c.val());
            setTimeout(function() {
                c.trigger("checkChange")
            },
            100)
        });
        var e = a('<div class="customfile"></div>');
        var b = a('<span class="customfile-text" aria-hidden="true">未选择文件...</span>').appendTo(e);
        var d = a('<a class="btn btn-primary browse" href="#">浏览</a>').appendTo(e);
        if (c.is("[disabled]")) {
            c.trigger("disable")
        }
        e.mousemove(function(f) {
            c.css({
                left: f.pageX - e.offset().left - c.outerWidth() + 20,
                top: f.pageY - e.offset().top - 15
            })
        }).insertAfter(c);
        c.appendTo(e);
        return a(this)
    }
})(jQuery);
if ("undefined" == typeof jQuery) {
    throw new Error("Bootstrap的JavaScript需要jQuery")
} +
function(b) {
    function c(f) {
        return this.each(function() {
            var e = b(this),
            g = e.data("bs.tooltip"),
            h = "object" == typeof f && f; (g || "destroy" != f) && (g || e.data("bs.tooltip", g = new d(this, h)), "string" == typeof f && g[f]())
        })
    }
    var d = function(f, g) {
        this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null,
        this.init("tooltip", f, g)
    };
    d.VERSION = "3.2.0",
    d.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1,
        viewport: {
            selector: "body",
            padding: 0
        }
    },
    d.prototype.init = function(m, p, h) {
        this.enabled = !0,
        this.type = m,
        this.$element = b(p),
        this.options = this.getOptions(h),
        this.$viewport = this.options.viewport && b(this.options.viewport.selector || this.options.viewport);
        for (var j = this.options.trigger.split(" "), q = j.length; q--;) {
            var k = j[q];
            if ("click" == k) {
                this.$element.on("click." + this.type, this.options.selector, b.proxy(this.toggle, this))
            } else {
                if ("manual" != k) {
                    var g = "hover" == k ? "mouseenter": "focusin",
                    f = "hover" == k ? "mouseleave": "focusout";
                    this.$element.on(g + "." + this.type, this.options.selector, b.proxy(this.enter, this)),
                    this.$element.on(f + "." + this.type, this.options.selector, b.proxy(this.leave, this))
                }
            }
        }
        this.options.selector ? this._options = b.extend({},
        this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle()
    },
    d.prototype.getDefaults = function() {
        return d.DEFAULTS
    },
    d.prototype.getOptions = function(f) {
        return f = b.extend({},
        this.getDefaults(), this.$element.data(), f),
        f.delay && "number" == typeof f.delay && (f.delay = {
            show: f.delay,
            hide: f.delay
        }),
        f
    },
    d.prototype.getDelegateOptions = function() {
        var f = {},
        g = this.getDefaults();
        return this._options && b.each(this._options,
        function(h, e) {
            g[h] != e && (f[h] = e)
        }),
        f
    },
    d.prototype.enter = function(f) {
        var g = f instanceof this.constructor ? f: b(f.currentTarget).data("bs." + this.type);
        return g || (g = new this.constructor(f.currentTarget, this.getDelegateOptions()), b(f.currentTarget).data("bs." + this.type, g)),
        clearTimeout(g.timeout),
        g.hoverState = "in",
        g.options.delay && g.options.delay.show ? void(g.timeout = setTimeout(function() {
            "in" == g.hoverState && g.show()
        },
        g.options.delay.show)) : g.show()
    },
    d.prototype.leave = function(f) {
        var g = f instanceof this.constructor ? f: b(f.currentTarget).data("bs." + this.type);
        return g || (g = new this.constructor(f.currentTarget, this.getDelegateOptions()), b(f.currentTarget).data("bs." + this.type, g)),
        clearTimeout(g.timeout),
        g.hoverState = "out",
        g.options.delay && g.options.delay.hide ? void(g.timeout = setTimeout(function() {
            "out" == g.hoverState && g.hide()
        },
        g.options.delay.hide)) : g.hide()
    },
    d.prototype.show = function() {
        var A = b.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(A);
            var m = b.contains(document.documentElement, this.$element[0]);
            if (A.isDefaultPrevented() || !m) {
                return
            }
            var v = this,
            G = this.tip(),
            q = this.getUID(this.type);
            this.setContent(),
            G.attr("id", q),
            this.$element.attr("aria-describedby", q),
            this.options.animation && G.addClass("fade");
            var j = "function" == typeof this.options.placement ? this.options.placement.call(this, G[0], this.$element[0]) : this.options.placement,
            E = /\s?auto?\s?/i,
            t = E.test(j);
            t && (j = j.replace(E, "") || "top"),
            G.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(j).data("bs." + this.type, this),
            this.options.container ? G.appendTo(this.options.container) : G.insertAfter(this.$element);
            var k = this.getPosition(),
            w = G[0].offsetWidth,
            z = G[0].offsetHeight;
            if (t) {
                var F = j,
                B = this.$element.parent(),
                C = this.getPosition(B);
                j = "bottom" == j && k.top + k.height + z - C.scroll > C.height ? "top": "top" == j && k.top - C.scroll - z < 0 ? "bottom": "right" == j && k.right + w > C.width ? "left": "left" == j && k.left - w < C.left ? "right": j,
                G.removeClass(F).addClass(j)
            }
            var x = this.getCalculatedOffset(j, k, w, z);
            this.applyPlacement(x, j);
            var D = function() {
                v.$element.trigger("shown.bs." + v.type),
                v.hoverState = null
            };
            b.support.transition && this.$tip.hasClass("fade") ? G.one("bsTransitionEnd", D).emulateTransitionEnd(150) : D()
        }
    },
    d.prototype.applyPlacement = function(x, k) {
        var t = this.tip(),
        B = t[0].offsetWidth,
        m = t[0].offsetHeight,
        g = parseInt(t.css("margin-top"), 10),
        z = parseInt(t.css("margin-left"), 10);
        isNaN(g) && (g = 0),
        isNaN(z) && (z = 0),
        x.top = x.top + g,
        x.left = x.left + z,
        b.offset.setOffset(t[0], b.extend({
            using: function(e) {
                t.css({
                    top: Math.round(e.top),
                    left: Math.round(e.left)
                })
            }
        },
        x), 0),
        t.addClass("in");
        var q = t[0].offsetWidth,
        j = t[0].offsetHeight;
        "top" == k && j != m && (x.top = x.top + m - j);
        var v = this.getViewportAdjustedDelta(k, x, q, j);
        v.left ? x.left += v.left: x.top += v.top;
        var w = v.left ? 2 * v.left - B + q: 2 * v.top - m + j,
        A = v.left ? "left": "top",
        y = v.left ? "offsetWidth": "offsetHeight";
        t.offset(x),
        this.replaceArrow(w, t[0][y], A)
    },
    d.prototype.replaceArrow = function(f, g, h) {
        this.arrow().css(h, f ? 50 * (1 - f / g) + "%": "")
    },
    d.prototype.setContent = function() {
        var f = this.tip(),
        g = this.getTitle();
        f.find(".tooltip-inner")[this.options.html ? "html": "text"](g),
        f.removeClass("fade in top bottom left right")
    },
    d.prototype.hide = function() {
        function h() {
            "in" != j.hoverState && f.detach(),
            j.$element.trigger("hidden.bs." + j.type)
        }
        var j = this,
        f = this.tip(),
        g = b.Event("hide.bs." + this.type);
        return this.$element.removeAttr("aria-describedby"),
        this.$element.trigger(g),
        g.isDefaultPrevented() ? void 0 : (f.removeClass("in"), b.support.transition && this.$tip.hasClass("fade") ? f.one("bsTransitionEnd", h).emulateTransitionEnd(150) : h(), this.hoverState = null, this)
    },
    d.prototype.fixTitle = function() {
        var e = this.$element; (e.attr("title") || "string" != typeof e.attr("data-original-title")) && e.attr("data-original-title", e.attr("title") || "").attr("title", "")
    },
    d.prototype.hasContent = function() {
        return this.getTitle()
    },
    d.prototype.getPosition = function(g) {
        g = g || this.$element;
        var h = g[0],
        f = "BODY" == h.tagName;
        return b.extend({},
        "function" == typeof h.getBoundingClientRect ? h.getBoundingClientRect() : null, {
            scroll: f ? document.documentElement.scrollTop || document.body.scrollTop: g.scrollTop(),
            width: f ? b(window).width() : g.outerWidth(),
            height: f ? b(window).height() : g.outerHeight()
        },
        f ? {
            top: 0,
            left: 0
        }: g.offset())
    },
    d.prototype.getCalculatedOffset = function(g, h, j, f) {
        return "bottom" == g ? {
            top: h.top + h.height,
            left: h.left + h.width / 2 - j / 2
        }: "top" == g ? {
            top: h.top - f,
            left: h.left + h.width / 2 - j / 2
        }: "left" == g ? {
            top: h.top + h.height / 2 - f / 2,
            left: h.left - j
        }: {
            top: h.top + h.height / 2 - f / 2,
            left: h.left + h.width
        }
    },
    d.prototype.getViewportAdjustedDelta = function(x, v, j, q) {
        var y = {
            top: 0,
            left: 0
        };
        if (!this.$viewport) {
            return y
        }
        var k = this.options.viewport && this.options.viewport.padding || 0,
        f = this.getPosition(this.$viewport);
        if (/right|left/.test(x)) {
            var w = v.top - k - f.scroll,
            m = v.top + k - f.scroll + q;
            w < f.top ? y.top = f.top - w: m > f.top + f.height && (y.top = f.top + f.height - m)
        } else {
            var g = v.left - k,
            u = v.left + k + j;
            g < f.left ? y.left = f.left - g: u > f.width && (y.left = f.left + f.width - u)
        }
        return y
    },
    d.prototype.getTitle = function() {
        var f, g = this.$element,
        h = this.options;
        return f = g.attr("data-original-title") || ("function" == typeof h.title ? h.title.call(g[0]) : h.title)
    },
    d.prototype.getUID = function(e) {
        do {
            e += ~~ (1000000 * Math.random())
        } while ( document . getElementById ( e ));
        return e
    },
    d.prototype.tip = function() {
        return this.$tip = this.$tip || b(this.options.template)
    },
    d.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    },
    d.prototype.validate = function() {
        this.$element[0].parentNode || (this.hide(), this.$element = null, this.options = null)
    },
    d.prototype.enable = function() {
        this.enabled = !0
    },
    d.prototype.disable = function() {
        this.enabled = !1
    },
    d.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled
    },
    d.prototype.toggle = function(f) {
        var g = this;
        f && (g = b(f.currentTarget).data("bs." + this.type), g || (g = new this.constructor(f.currentTarget, this.getDelegateOptions()), b(f.currentTarget).data("bs." + this.type, g))),
        g.tip().hasClass("in") ? g.leave(g) : g.enter(g)
    },
    d.prototype.destroy = function() {
        clearTimeout(this.timeout),
        this.hide().$element.off("." + this.type).removeData("bs." + this.type)
    };
    var a = b.fn.tooltip;
    b.fn.tooltip = c,
    b.fn.tooltip.Constructor = d,
    b.fn.tooltip.noConflict = function() {
        return b.fn.tooltip = a,
        this
    }
} (jQuery);
jQuery.easing.jswing = jQuery.easing.swing;
jQuery.extend(jQuery.easing, {
    def: "easeOutQuad",
    swing: function(d, b, f, c, a) {
        return jQuery.easing[jQuery.easing.def](d, b, f, c, a)
    },
    easeInQuad: function(d, b, f, c, a) {
        return c * (b /= a) * b + f
    },
    easeOutQuad: function(d, b, f, c, a) {
        return - c * (b /= a) * (b - 2) + f
    },
    easeInOutQuad: function(d, b, f, c, a) {
        if ((b /= a / 2) < 1) {
            return c / 2 * b * b + f
        }
        return - c / 2 * (--b * (b - 2) - 1) + f
    },
    easeInCubic: function(d, b, f, c, a) {
        return c * (b /= a) * b * b + f
    },
    easeOutCubic: function(d, b, f, c, a) {
        return c * ((b = b / a - 1) * b * b + 1) + f
    },
    easeInOutCubic: function(d, b, f, c, a) {
        if ((b /= a / 2) < 1) {
            return c / 2 * b * b * b + f
        }
        return c / 2 * ((b -= 2) * b * b + 2) + f
    },
    easeInQuart: function(d, b, f, c, a) {
        return c * (b /= a) * b * b * b + f
    },
    easeOutQuart: function(d, b, f, c, a) {
        return - c * ((b = b / a - 1) * b * b * b - 1) + f
    },
    easeInOutQuart: function(d, b, f, c, a) {
        if ((b /= a / 2) < 1) {
            return c / 2 * b * b * b * b + f
        }
        return - c / 2 * ((b -= 2) * b * b * b - 2) + f
    },
    easeInQuint: function(d, b, f, c, a) {
        return c * (b /= a) * b * b * b * b + f
    },
    easeOutQuint: function(d, b, f, c, a) {
        return c * ((b = b / a - 1) * b * b * b * b + 1) + f
    },
    easeInOutQuint: function(d, b, f, c, a) {
        if ((b /= a / 2) < 1) {
            return c / 2 * b * b * b * b * b + f
        }
        return c / 2 * ((b -= 2) * b * b * b * b + 2) + f
    },
    easeInSine: function(d, b, f, c, a) {
        return - c * Math.cos(b / a * (Math.PI / 2)) + c + f
    },
    easeOutSine: function(d, b, f, c, a) {
        return c * Math.sin(b / a * (Math.PI / 2)) + f
    },
    easeInOutSine: function(d, b, f, c, a) {
        return - c / 2 * (Math.cos(Math.PI * b / a) - 1) + f
    },
    easeInExpo: function(d, b, f, c, a) {
        return b == 0 ? f: c * Math.pow(2, 10 * (b / a - 1)) + f
    },
    easeOutExpo: function(d, b, f, c, a) {
        return b == a ? f + c: c * ( - Math.pow(2, -10 * b / a) + 1) + f
    },
    easeInOutExpo: function(d, b, f, c, a) {
        if (b == 0) {
            return f
        }
        if (b == a) {
            return f + c
        }
        if ((b /= a / 2) < 1) {
            return c / 2 * Math.pow(2, 10 * (b - 1)) + f
        }
        return c / 2 * ( - Math.pow(2, -10 * --b) + 2) + f
    },
    easeInCirc: function(d, b, f, c, a) {
        return - c * (Math.sqrt(1 - (b /= a) * b) - 1) + f
    },
    easeOutCirc: function(d, b, f, c, a) {
        return c * Math.sqrt(1 - (b = b / a - 1) * b) + f
    },
    easeInOutCirc: function(d, b, f, c, a) {
        if ((b /= a / 2) < 1) {
            return - c / 2 * (Math.sqrt(1 - b * b) - 1) + f
        }
        return c / 2 * (Math.sqrt(1 - (b -= 2) * b) + 1) + f
    },
    easeInElastic: function(g, c, j, f, b) {
        var d = 1.70158;
        var h = 0;
        var a = f;
        if (c == 0) {
            return j
        }
        if ((c /= b) == 1) {
            return j + f
        }
        if (!h) {
            h = b * 0.3
        }
        if (a < Math.abs(f)) {
            a = f;
            var d = h / 4
        } else {
            var d = h / (2 * Math.PI) * Math.asin(f / a)
        }
        return - (a * Math.pow(2, 10 * (c -= 1)) * Math.sin((c * b - d) * 2 * Math.PI / h)) + j
    },
    easeOutElastic: function(g, c, j, f, b) {
        var d = 1.70158;
        var h = 0;
        var a = f;
        if (c == 0) {
            return j
        }
        if ((c /= b) == 1) {
            return j + f
        }
        if (!h) {
            h = b * 0.3
        }
        if (a < Math.abs(f)) {
            a = f;
            var d = h / 4
        } else {
            var d = h / (2 * Math.PI) * Math.asin(f / a)
        }
        return a * Math.pow(2, -10 * c) * Math.sin((c * b - d) * 2 * Math.PI / h) + f + j
    },
    easeInOutElastic: function(g, c, j, f, b) {
        var d = 1.70158;
        var h = 0;
        var a = f;
        if (c == 0) {
            return j
        }
        if ((c /= b / 2) == 2) {
            return j + f
        }
        if (!h) {
            h = b * 0.3 * 1.5
        }
        if (a < Math.abs(f)) {
            a = f;
            var d = h / 4
        } else {
            var d = h / (2 * Math.PI) * Math.asin(f / a)
        }
        if (c < 1) {
            return - 0.5 * a * Math.pow(2, 10 * (c -= 1)) * Math.sin((c * b - d) * 2 * Math.PI / h) + j
        }
        return a * Math.pow(2, -10 * (c -= 1)) * Math.sin((c * b - d) * 2 * Math.PI / h) * 0.5 + f + j
    },
    easeInBack: function(f, b, g, d, a, c) {
        if (c == undefined) {
            c = 1.70158
        }
        return d * (b /= a) * b * ((c + 1) * b - c) + g
    },
    easeOutBack: function(f, b, g, d, a, c) {
        if (c == undefined) {
            c = 1.70158
        }
        return d * ((b = b / a - 1) * b * ((c + 1) * b + c) + 1) + g
    },
    easeInOutBack: function(f, b, g, d, a, c) {
        if (c == undefined) {
            c = 1.70158
        }
        if ((b /= a / 2) < 1) {
            return d / 2 * b * b * (((c *= 1.525) + 1) * b - c) + g
        }
        return d / 2 * ((b -= 2) * b * (((c *= 1.525) + 1) * b + c) + 2) + g
    },
    easeInBounce: function(d, b, f, c, a) {
        return c - jQuery.easing.easeOutBounce(d, a - b, 0, c, a) + f
    },
    easeOutBounce: function(d, b, f, c, a) {
        if ((b /= a) < 1 / 2.75) {
            return c * 7.5625 * b * b + f
        } else {
            if (b < 2 / 2.75) {
                return c * (7.5625 * (b -= 1.5 / 2.75) * b + 0.75) + f
            } else {
                if (b < 2.5 / 2.75) {
                    return c * (7.5625 * (b -= 2.25 / 2.75) * b + 0.9375) + f
                } else {
                    return c * (7.5625 * (b -= 2.625 / 2.75) * b + 0.984375) + f
                }
            }
        }
    },
    easeInOutBounce: function(d, b, f, c, a) {
        if (b < a / 2) {
            return jQuery.easing.easeInBounce(d, b * 2, 0, c, a) * 0.5 + f
        }
        return jQuery.easing.easeOutBounce(d, b * 2 - a, 0, c, a) * 0.5 + c * 0.5 + f
    }
});

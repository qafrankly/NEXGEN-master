var eqItems = [],
  map, testvar, dataArray = [],
  dataObject = {},
  cache = {},
  locationMarker, currentZoom = 7,
  firstRun = !0,
  CustomIcon = L.Icon.extend({
    options: {
      shadowUrl: "http://ftpcontent.worldnow.com/kotv/custom/earthquake/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    }
  }),
  currentIcon = new CustomIcon({
    iconUrl: "http://ftpcontent.worldnow.com/kotv/custom/earthquake/images/markerCurrent.png"
  }),
  pastIcon = new CustomIcon({
    iconUrl: "http://ftpcontent.worldnow.com/kotv/custom/earthquake/images/markerPast.png"
  }),
  dayAmt = 7,
  timerObj = 59,
  starttime = new Date,
  endtime = new Date,
  dayOfWeekLong = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
  dayOfWeek = "Sun Mon Tue Wed Thu Fri Sat".split(" "),
  fullWidth, pxPerHr, startTime, endTime, currentRange, startlabel, endlabel, isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  eventNames = {
    down: isMobile ? "touchstart" : "mousedown",
    up: isMobile ? "touchend" : "mouseup",
    move: isMobile ? "touchmove" : "mousemove"
  },
  starttime = new Date(starttime.setDate(starttime.getDate() -
    7));
currentRange = [starttime, endtime];
$(function() {
  var b = "newson6" === window.location.hostname.split(".")[1] ? "News On 6" : "News 9";
  $("#station").html(b);
  var b = $("#WNCol23"),
    g = $("#WNCol4"),
    a = $("#WNDS11"),
    h = $("#WNAd52"),
    d = $("#tempContainer"),
    c = $("#twitter-widget-0");
  d.parent().css("display", "none");
  d.insertAfter(g);
  d.css("clear", "both");
  c.hide();
  b.attr("style", b.attr("style") + "margin-bottom:0px !important;padding-bottom:0px !important;");
  g.attr("style", g.attr("style") + "margin-bottom:0px !important");
  a.insertAfter($("#tempContainer"));
  a.css("marginTop",
    "15px");
  a.children(".wnDSItems-feature").css({
    "float": "left",
    width: "664px"
  });
  a.find("h2").css("width", "640px");
  h.appendTo(a);
  h.css({
    "float": "right",
    "margin-top": "24px"
  });
  startTime = $("#startTime");
  endTime = $("#endTime");
  fullWidth = $("#rangeSlider").width();
  pxPerHr = fullWidth / (24 * dayAmt);
  startlabel = $("#rangeSlider .left label");
  endlabel = $("#rangeSlider .right label");
  new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
  b = new L.Google("ROADMAP");
  g = new L.Google("SATELLITE");
  a = new L.Google("HYBRID");
  h = new L.Google("TERRAIN");
  map = L.map("map", {
    layers: h,
    center: [35.47, -97.513],
    zoom: currentZoom,
    minZoom: 6,
    maxZoom: 16
  });
  L.control.layers({
    Roadmap: b,
    Satellite: g,
    Hybrid: a,
    Terrain: h
  }).addTo(map);
  map.on("popupopen", function(a) {
    var b = map.project(a.popup._latlng);
    b.y -= a.popup._container.clientHeight / 2;
    map.panTo(map.unproject(b), {
      animate: !0
    })
  });
  map.on("zoomend", function() {});
  map.on("moveend", function() {});
  setupPoints();
  rangeSlider("rangeSlider")
});

function startTimer() {
  var b = $("#timeNum");
  window.setInterval(function() {
    0 === timerObj ? timerObj = 59 : timerObj--;
    b.html(10 > timerObj ? "0" + timerObj : timerObj)
  }, 1E3)
}

function setupPoints() {
  var b = dateMethods("getStartTime");
  runFeed("http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&callback=eqfeed_callback&minmagnitude=2.5&minlongitude=-103&maxlongitude=-94&maxlatitude=37&minlatitude=33&starttime=" + b)
}

function runFeed(b) {
  $.ajax({
    url: b,
    dataType: "jsonp",
    cache: !0,
    jsonpCallback: "eqfeed_callback",
    jsonp: !1
  }).done(function(b) {
    buildMap(b)
  })
}

function cleanString(b) {
  return escape(b)
}

function buildMap(b) {
  if ("undefined" != typeof b) {
    $(".map_loader").hide();
    b = b.features;
    for (var g = $("#recentEQs"), a = $("<ul />"), h = "", d = 0; d < b.length; d++) {
      var c = b[d].geometry.coordinates,
        f = b[d].properties,
        e = dateMethods("formatDate", f.time),
        p = 0 == f.mag % 1 ? f.mag + ".0" : f.mag,
        q = 1 == f.felt ? "1 person" : f.felt + " people",
        l = d,
        m = {
          eq: b[d],
          id: l,
          enabled: !0,
          marker: L.circleMarker([c[1], c[0]], {
            color: "#be0000",
            opacity: 0,
            fillColor: "#be0000",
            fillOpacity: .2,
            radius: 3.33 * f.mag
          }).bindPopup(f.title).addTo(map)
        };
      eqItems.push(m);
      0 ===
        d && L.marker([c[1], c[0]], {
          icon: currentIcon
        }).bindPopup(f.title).addTo(map);
      h += '<li data-eq-id="' + l + '"><div class="eq"><div class="left"><i class="fa fa-bullseye" aria-hidden="true"></i></div><div class="right"><div class="mag">' + p + ' magnitude</div><div class="loc">' + f.place + '</div><div class="reported">' + q + ' reported this quake</div><div class="timestamp">' + e + "</div></div></div></li>"
    }
    a.append(h);
    g.append(a);
    $("#recentEQs").on("click", "li", function(a) {
      a = $(a.currentTarget);
      a = parseInt(a.attr("data-eq-id"));
      eqItems[a].marker.openPopup()
    })
  }
}

function dateMethods(b, g) {
  return {
    formatDate: function(a) {
      a = new Date(a);
      var b = dayOfWeek[a.getDay()],
        d = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ")[a.getMonth()],
        c = a.getHours(),
        f = 12 < c ? "pm" : "am",
        c = 12 < c ? c % 12 : c,
        c = 0 == c ? 12 : c,
        e = a.getMinutes(),
        e = 10 > e ? "0" + e : e;
      return b + " " + d + " " + a.getDate() + ", at " + c + ":" + e + f
    },
    getStartTime: function() {
      var a = new Date,
        a = new Date(a.setDate(a.getDate() - 7)),
        b = a.getFullYear(),
        d = a.getMonth() + 1,
        a = a.getDate();
      return b + "-" + (10 > d ? "0" + d : d) + "-" + (10 > a ? "0" + a : a)
    },
    sliderFormat: function(a) {
      var b =
        dayOfWeekLong[a.getDay()],
        d = "January February March April May June July August September October November December".split(" ")[a.getMonth()],
        c = a.getDate(),
        f = a.getFullYear(),
        e = a.getHours(),
        g = 12 < e ? "pm" : "am",
        e = 12 < e ? e % 12 : e,
        e = 0 == e ? 12 : e;
      a = a.getMinutes();
      return b + " " + d + " " + c + ", " + f + " at " + e + ":" + (10 > a ? "0" + a : a) + g
    }
  }[b](g)
}
window.currentSlider = "left";
var draggerWidth = 10,
  currentRight = 0,
  currentLeft = 0;

function rangeSlider(b) {
  function g(a) {
    a.preventDefault();
    h(a)
  }

  function a() {
    l = !1;
    e();
    setTimeout(function() {
      window.removeEventListener(eventNames.move, g, !1);
      window.removeEventListener(eventNames.up, a, !1)
    }, 0)
  }

  function h(a) {
    "left" === window.currentSlider ? l && a.pageX >= k && a.pageX <= k + m && a.pageX < k + m - (currentRight + 20) ? (currentLeft = a = a.pageX - k, p.style.left = a + "px", d(), c("start", a)) : l && a.pageX < k && (currentLeft = 0, p.style.left = "0px", d(), c("start", 0)) : "right" === window.currentSlider && (window.testingObj = a, l && a.pageX <=
      n && a.pageX >= k && a.pageX > k + (currentLeft + 20) ? (currentRight = a = n - a.pageX, q.style.right = a + "px", d(), c("end", a)) : l && a.pageX > n && (currentRight = 0, q.style.right = "0px", d(), c("end", 0)));
    return !1
  }

  function d() {
    var a = document.getElementsByClassName("redfilled")[0],
      b;
    b = "" + ("left:" + currentLeft + "px;width:" + (m - (currentLeft + currentRight)) + "px");
    a.setAttribute("style", b)
  }

  function c(a, b) {
    var d, c;
    "start" === a ? (d = b / pxPerHr, d = Math.round(d), c = new Date(starttime), c.setTime(c.getTime() + 36E5 * d), startTime.html(dateMethods("sliderFormat",
      c)), currentRange[0] = c, f("start", c)) : "end" === a && (d = b / pxPerHr, d = Math.round(d), c = new Date(endtime), c.setTime(c.getTime() - 36E5 * d), endTime.html(dateMethods("sliderFormat", c)), currentRange[1] = c, f("end", c))
  }

  function f(a, b) {
    "start" === a ? startlabel.html(dayOfWeekLong[b.getDay()]) : "end" === a && endlabel.html(dayOfWeekLong[b.getDay()]);
    var c = -1 * (startlabel.outerWidth() / 2 - .5) + "px",
      d = -1 * (endlabel.outerWidth() / 2 - 18.5) + "px";
    startlabel.css("left", c);
    endlabel.css("left", d)
  }

  function e() {
    for (var a = 0; a < eqItems.length; a++) {
      var b =
        eqItems[a],
        c = b.eq.properties.time;
      (c < currentRange[0].getTime() || c > currentRange[1].getTime()) && b.enabled ? (map.removeLayer(b.marker), b.enabled = !1, $("#recentEQs li[data-eq-id=" + b.id + "]").hide()) : c > currentRange[0].getTime() && c < currentRange[1].getTime() && !b.enabled && (map.addLayer(b.marker), b.enabled = !0, $("#recentEQs li[data-eq-id=" + b.id + "]").show())
    }
  }
  b = document.getElementById(b);
  var p = b.children[0],
    q = b.children[1],
    l = !1,
    m, k, n;
  console.log(startTime);
  startTime.html(dateMethods("sliderFormat", starttime));
  endTime.html(dateMethods("sliderFormat", endtime));
  startlabel.html(dayOfWeekLong[starttime.getDay()]);
  endlabel.html(dayOfWeekLong[starttime.getDay()]);
  f();
  b.addEventListener(eventNames.down, function(b) {
    window.testEvent = b;
    window.testThis = this;
    var c = b.target;
    if ("I" === c.nodeName || "LABEL" === c.nodeName) c = c.parentNode;
    if (-1 < c.className.indexOf("left")) return window.addEventListener(eventNames.move, g, !1), window.addEventListener(eventNames.up, a, !1), m = this.offsetWidth, k = this.offsetLeft, n = k + m, l = !0, window.currentSlider =
      "left", h(b), !1;
    if (-1 < c.className.indexOf("right")) return window.addEventListener(eventNames.move, g, !1), window.addEventListener(eventNames.up, a, !1), m = this.offsetWidth, k = this.offsetLeft, n = k + m, l = !0, window.currentSlider = "right", h(b), !1
  })
};

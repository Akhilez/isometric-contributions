// Generated by CoffeeScript 1.10.0
var Iso;

Iso = (function() {
  var COLORS;

  COLORS = [new obelisk.CubeColor().getByHorizontalColor(0xeeeeee), new obelisk.CubeColor().getByHorizontalColor(0xd6e685), new obelisk.CubeColor().getByHorizontalColor(0x8cc665), new obelisk.CubeColor().getByHorizontalColor(0x44a340), new obelisk.CubeColor().getByHorizontalColor(0x1e6823)];

  function Iso(target) {
    var bestDay, days, maxCount;
    if (target) {
      days = $('.js-calendar-graph rect.day');
      bestDay = null;
      maxCount = null;
      days.each(function() {
        if ($(this).data('count') > maxCount) {
          bestDay = ($(this)).data('date');
          return maxCount = ($(this)).data('count');
        }
      });
      target.setAttribute('data-max-contributions', maxCount);
      target.setAttribute('data-best-day', bestDay);
      this.getSettings((function(_this) {
        return function() {
          _this.renderIsometricChart();
          return _this.initUI();
        };
      })(this));
    }
  }

  Iso.prototype.getSettings = function(callback) {
    var ref;
    if (chrome.storage != null) {
      return chrome.storage.local.get(['toggleSetting'], (function(_this) {
        return function(arg) {
          var ref, toggleSetting;
          toggleSetting = (ref = arg.toggleSetting) != null ? ref : 'cubes';
          _this.toggleSetting = toggleSetting;
          return callback();
        };
      })(this));
    } else {
      this.toggleSetting = (ref = localStorage.toggleSetting) != null ? ref : 'cubes';
      return callback();
    }
  };

  Iso.prototype.renderIsometricChart = function() {
    var GH_OFFSET, MAX_HEIGHT, SIZE, canvas, contribCount, maxContributions, pixelView, point, self;
    ($('<div class="ic-contributions-wrapper"></div>')).insertBefore('#contributions-calendar');
    ($('<canvas id="isometric-contributions" width="728" height="470"></canvas>')).appendTo('.ic-contributions-wrapper');
    SIZE = 12;
    GH_OFFSET = 13;
    MAX_HEIGHT = 100;
    canvas = document.getElementById('isometric-contributions');
    point = new obelisk.Point(87, 100);
    pixelView = new obelisk.PixelView(canvas, point);
    maxContributions = ($('.js-calendar-graph')).data('max-contributions');
    contribCount = null;
    self = this;
    return ($('.js-calendar-graph g > g')).each(function(g) {
      var x;
      x = parseInt(((($(this)).attr('transform')).match(/(\d+)/))[0] / GH_OFFSET);
      return (($(this)).find('rect')).each(function(r) {
        var color, cube, cubeHeight, dimension, fill, p3d, y;
        r = ($(this)).get(0);
        y = parseInt((($(this)).attr('y')) / GH_OFFSET);
        fill = ($(this)).attr('fill');
        contribCount = parseInt(($(this)).data('count'));
        cubeHeight = 3;
        if (maxContributions > 0) {
          cubeHeight += parseInt(MAX_HEIGHT / maxContributions * contribCount);
        }
        dimension = new obelisk.CubeDimension(SIZE, SIZE, cubeHeight);
        color = self.getSquareColor(fill);
        cube = new obelisk.Cube(dimension, color, false);
        p3d = new obelisk.Point3D(SIZE * x, SIZE * y, 0);
        return pixelView.renderObject(cube, p3d);
      });
    });
  };

  Iso.prototype.initUI = function() {
    var contributionsBox, html, insertLocation, toggleClass;
    contributionsBox = ($('#contributions-calendar')).closest('.boxed-group');
    insertLocation = (($('#contributions-calendar')).closest('.boxed-group')).find('h3');
    toggleClass = '';
    if (((contributionsBox.closest('.box')).find('.box-header .octicon-lock')).length) {
      toggleClass = 'ic-with-lock';
    }
    html = "<span class=\"ic-toggle " + toggleClass + "\">\n  <a href=\"#\" class=\"ic-toggle-option tooltipped tooltipped-nw squares\" data-ic-option=\"squares\" aria-label=\"Normal chart view\"></a>\n  <a href=\"#\" class=\"ic-toggle-option tooltipped tooltipped-nw cubes\" data-ic-option=\"cubes\" aria-label=\"Isometric chart view\"></a>\n</span>";
    ($(html)).insertBefore(insertLocation);
    ($('.ic-toggle-option')).click(function(e) {
      var option;
      e.preventDefault();
      option = $(this).data('ic-option');
      if (option === 'squares') {
        (contributionsBox.removeClass('ic-cubes')).addClass('ic-squares');
      } else {
        (contributionsBox.removeClass('ic-squares')).addClass('ic-cubes');
      }
      ($('.ic-toggle-option')).removeClass('active');
      ($(this)).addClass('active');
      if (chrome.storage != null) {
        return chrome.storage.local.set({
          toggleSetting: option
        });
      }
    });
    ($(".ic-toggle-option." + this.toggleSetting)).addClass('active');
    contributionsBox.addClass("ic-" + this.toggleSetting);
    html = "<span class=\"ic-footer\">\n  <a href=\"#\" class=\"ic-2d-toggle\">Show normal chart below ▾</a>\n</span>";
    ($(html)).appendTo($('.ic-contributions-wrapper'));
    ($('.ic-2d-toggle')).click(function(e) {
      e.preventDefault();
      if (contributionsBox.hasClass('show-2d')) {
        ($(this)).text('Show normal chart below ▾');
        return contributionsBox.removeClass('show-2d');
      } else {
        ($(this)).text('Hide normal chart below ▴');
        return contributionsBox.addClass('show-2d');
      }
    });
    return this.loadStats();
  };

  Iso.prototype.loadStats = function() {
    var contribColumns, countBest, countCurrent, countLongest, countTotal, date, dateBest, dateParts, datesCurrent, datesLongest, datesTotal, html, options, str;
    contribColumns = $('.contrib-column');
    str = $(contribColumns[0]).find('.contrib-number').html();
    countTotal = (str.match(/(((\d{1,})(,\d{})*)|(\d+))(.\d+)?/))[0];
    datesTotal = $(contribColumns[0]).find('span:last-child').html();
    countBest = ($('.js-calendar-graph')).data('max-contributions');
    dateParts = (($('.js-calendar-graph')).data('best-day')).split('-');
    dateBest = 'Not so busy after all.';
    if (dateParts[0] != null) {
      options = {
        month: "long",
        day: "numeric"
      };
      date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 0, 0, 0);
      dateBest = date.toLocaleDateString('en-US', options);
    }
    html = "<div class=\"ic-stats-block ic-stats-top\">\n  <span class=\"ic-stats-table\">\n    <span class=\"ic-stats-row\">\n      <span class=\"ic-stats-label\">1 year total\n        <span class=\"ic-stats-count\">" + countTotal + "</span>\n      </span>\n      <span class=\"ic-stats-meta\">\n        <span class=\"ic-stats-unit\">contributions</span>\n        <span class=\"ic-stats-date\">" + datesTotal + "</span>\n      </span>\n    </span>\n    <span class=\"ic-stats-row\">\n      <span class=\"ic-stats-label\">Busiest day\n        <span class=\"ic-stats-count\">" + countBest + "</span>\n      </span>\n      <span class=\"ic-stats-meta\">\n        <span class=\"ic-stats-unit\">contributions</span>\n          <span class=\"ic-stats-date\">" + dateBest + "</span>\n        </span>\n      </span>\n    </span>\n  </span>\n</div>";
    ($(html)).appendTo($('.ic-contributions-wrapper'));
    str = $(contribColumns[1]).find('.contrib-number').html();
    countLongest = (str.match(/(((\d{1,})(,\d{})*)|(\d+))(.\d+)?/))[0];
    datesLongest = $(contribColumns[1]).find('span:last-child').html();
    str = $(contribColumns[2]).find('.contrib-number').html();
    countCurrent = (str.match(/(((\d{1,})(,\d{})*)|(\d+))(.\d+)?/))[0];
    datesCurrent = $(contribColumns[2]).find('span:last-child').html();
    html = "<div class=\"ic-stats-block ic-stats-bottom\">\n  <span class=\"ic-stats-table\">\n    <span class=\"ic-stats-row\">\n      <span class=\"ic-stats-label\">Longest streak\n        <span class=\"ic-stats-count\">" + countLongest + "</span>\n      </span>\n      <span class=\"ic-stats-meta\">\n        <span class=\"ic-stats-unit\">days</span>\n        <span class=\"ic-stats-date\">" + datesLongest + "</span>\n      </span>\n    </span>\n    <span class=\"ic-stats-row\">\n      <span class=\"ic-stats-label\">Current streak\n        <span class=\"ic-stats-count\">" + countCurrent + "</span>\n      </span>\n      <span class=\"ic-stats-meta\">\n        <span class=\"ic-stats-unit\">days</span>\n        <span class=\"ic-stats-date\">" + datesCurrent + "</span>\n      </span>\n    </span>\n  </span>\n</div>";
    return ($(html)).appendTo($('.ic-contributions-wrapper'));
  };

  Iso.prototype.getSquareColor = function(fill) {
    var color;
    return color = (function() {
      switch (fill) {
        case 'rgb(238, 238, 238)':
        case '#eeeeee':
          return COLORS[0];
        case 'rgb(214, 230, 133)':
        case '#d6e685':
          return COLORS[1];
        case 'rgb(140, 198, 101)':
        case '#8cc665':
          return COLORS[2];
        case 'rgb(68, 163, 64)':
        case '#44a340':
          return COLORS[3];
        case 'rgb(30, 104, 35)':
        case '#1e6823':
          return COLORS[4];
      }
    })();
  };

  return Iso;

})();

$(window).load(function() {
  var iso, target;
  target = document.querySelector('.js-calendar-graph');
  return iso = new Iso(target);
});

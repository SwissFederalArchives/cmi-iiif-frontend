/* ==========================================================
 * autocomplete.js
 * Deal with the Typeahead.js/Bloodhound library to build the search field autocomplete
 *
 * Author: Yann, yann@antistatique.net
 * Date:   2014-05-01 14:23:18
 *
 * Copyright 2014 Federal Chancellery of Switzerland
 * Licensed under MIT
 ========================================================== */

(function($, data) {
  'use strict';

  var $searchFields = $('.form-search .search-field');
  if (data) {
    // Init the Bloodhound suggestion engine
    var bloodhound = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: $.map(data, function(state) { return { value: state }; })
    });
    bloodhound.initialize();

    // Init Typeahead on search-fields
    $searchFields.typeahead({
      hint: false,
      highlight: true,
      minLength: 1
    },
    {
      name: 'search',
      displayKey: 'value',
      source: bloodhound.ttAdapter()
    });
  }

}) (jQuery, (typeof searchData === 'undefined' ? false : searchData));

/* ==========================================================
 * carousel.js
 * Carousel helper
 *
 * Author: Yann, yann@antistatique.net
 * Date:   2014-05-15 13:55:53
 *
 * Copyright 2014 Federal Chancellery of Switzerland
 * Licensed under MIT
 ========================================================== */

(function($) {
  'use strict';

  $(window).load(function () {
    carouselInit(jQuery);
  });

  $(window).resize(function () {
    carouselInit(jQuery);
  });

  // slideshow counter
  var slideshow_total = $('.carousel-slideshow .item').length;
  $('#carousel-total').text(slideshow_total);

  $('.carousel-slideshow').on('slid.bs.carousel', function () {
    var carouselData = $(this).data('bs.carousel');
    var currentIndex = carouselData.getItemIndex(carouselData.$element.find('.item.active'));
    var total = carouselData.$items.length;

    var text = (currentIndex + 1);

    $('#carousel-index').text(text);
    $('#carousel-total').text(total);
  });

}) (jQuery);

function carouselInit($) {
  'use strict';

  var $carousel = $('.carousel:not(.carousel-slideshow)');

  $('.carousel .item:first-child').addClass('first');
  $('.carousel .item:last-child').addClass('last');

  $('.carousel').each(function() {
    disableControl($(this));
  });
  $('.carousel').on('slid.bs.carousel', function () {
    disableControl($(this));
  });

  if($carousel) {
    $carousel.each(function () {
      var biggestHeight = 0,
          titleHeight = $(this).find('.item.active h3:first-child').height(),
          imgHeight = $(this).find('.item.active .carousel-img').height();

      $(this).find('.carousel-indicators, .carousel-control').css('top', titleHeight + imgHeight + 50);

      $(this).find('.item').each(function () {
        if ($(this).height() >= biggestHeight) {
          biggestHeight = $(this).height();
        }
      });
      $(this).find('.item').height(biggestHeight);
    });
  }
}

function disableControl(element) {
  'use strict';

  if (element.find('.first').hasClass('active')) {
    element.find('.left').addClass('disabled').attr('aria-disabled', 'true');
  } else {
    element.find('.left').removeClass('disabled').attr('aria-disabled', 'false');
  }
  if (element.find('.last').hasClass('active')) {
    element.find('.right').addClass('disabled').attr('aria-disabled', 'true');
  } else {
    element.find('.right').removeClass('disabled').attr('aria-disabled', 'false');
  }
}

/* ==========================================================
 * collapse.js
 * Add class when nav collapse is open
 *
 * Author: Yann, yann@antistatique.net
 * Date:   2014-05-06
 *
 * Copyright 2014 Federal Chancellery of Switzerland
 * Licensed under MIT
 ========================================================== */

(function($) {
  'use strict';

  // Normal Collapse
  $('.collapse:not(tbody)').on('show.bs.collapse', function () {
    $(this)
      .prev()
      .addClass('active icon--root')
      .removeClass('icon--greater')
      .attr({
        'aria-selected': 'true',
        'aria-expanded': 'true'
      });
  });
  $('.collapse:not(tbody)').on('hide.bs.collapse', function () {
    $(this)
      .prev()
      .removeClass('active icon--root')
      .addClass('icon--greater')
      .attr( {
        'aria-selected': 'false',
        'aria-expanded': 'false'
      });
  });

  // Table Collapse

  $('tbody.collapse').on('show.bs.collapse', function () {
    $(this)
      .prev().find('[data-toggle=collapse]')
      .addClass('active')
      .attr({
        'aria-selected': 'true',
        'aria-expanded': 'true'
      });
  });
  $('tbody.collapse').on('hide.bs.collapse', function () {
    $(this)
      .prev().find('[data-toggle=collapse]')
      .removeClass('active')
      .attr({
        'aria-selected': 'false',
        'aria-expanded': 'false'
      });
  });

  // Ensure every first collapse toggle for accordions is accessible
  // (cf. https://github.com/paypal/bootstrap-accessibility-plugin/issues/98):
  $('[aria-multiselectable="true"]').each(function() {
    $(this).find('[data-toggle="collapse"][data-parent]').first().attr({tabindex: 0});
  });

}) (jQuery);

/* ==========================================================
 * drilldown.js
 * Drilldown plugin scripts. For page-list-nav element
 *
 * Author: Toni Fisler, toni@antistatique.net
 * Date:   2014-05-30 09:02:09
 *
 * Copyright 2014 Federal Chancellery of Switzerland
 * Licensed under MIT
 ========================================================== */

(function($) {
  'use strict';

var options = {
  event: 'click', // * View note below
  selector: 'a',  // * View note below
  speed: 100,
  cssClass: {
    container: 'drilldown-container',
    root: 'nav-page-list',
    sub: 'drilldown-sub',
    back: 'drilldown-back'
  }
};

$('.drilldown').drilldown(options);

}) (jQuery);

/* ==========================================================
 * global-nav.js
 * Global Navigation syripts
 *
 * Author: Toni Fisler, toni@antistatique.net
 * Date:   2014-05-27 16:36:15
 *
 * Copyright 2014 Federal Chancellery of Switzerland
 * Licensed under MIT
 ========================================================== */

(function($) {
    'use strict';

// Handle scroll to position nav as fixed

var top = 36;

$(window).scroll(function () {

  var y = $(this).scrollTop();

  if (y >= top) {
    if (!$('.nav-mobile').hasClass('fixed')) {
      $('.nav-mobile').addClass('fixed')
        .after('<div class="nav-mobile-spacer" id="spacer" style="height:36px;"></div>');
    }
  }
  else {
    if ($('.nav-mobile').hasClass('fixed')) {
      $('.nav-mobile').removeClass('fixed');
      $('#spacer').remove();
    }
  }

});
}) (jQuery);

// OUTLINE.JS
// https://github.com/lindsayevans/outline.js
//
// Based on http://www.paciellogroup.com/blog/2012/04/how-to-remove-css-outlines-in-an-accessible-manner/
//
// Hide outline on mouse interactions
// Show it on keyboard interactions
(function(doc){

  'use strict';

  var styleElement = doc.createElement('STYLE'),
      domEvents = 'addEventListener' in doc,
      addListener = function(type, callback){
        // Basic cross-browser event handling
        if (domEvents) {
          doc.addEventListener(type, callback);
        } else {
          doc.attachEvent('on' + type, callback);
        }
      },
      setCSS = function(cssText){
        !!styleElement.styleSheet ? styleElement.styleSheet.cssText = cssText : styleElement.innerHTML = cssText;
      };

  doc.getElementsByTagName('HEAD')[0].appendChild(styleElement);

  // Using mousedown instead of mouseover, so that previously focused elements don't lose focus ring on mouse move
  addListener('mousedown', function(){
    setCSS(':focus{outline:0}::-moz-focus-inner{border:0}');
  });

  addListener('keydown', function(){
    setCSS('');
  });

})(document);

/* ==========================================================
 * print.js
 * Add print preview windows
 *
 * Author: Yann, yann@antistatique.net
 * Date: 2015-02-02
 *
 * Copyright 2014 Federal Chancellery of Switzerland
 * Licensed under MIT
 ========================================================== */

(function($) {
  'use strict';

// Initialization
$.fn.printPreview = function() {
  return this;
};

$.printPreview = {

  printPreview: function(element) {
    var $body = $('body'),
        $container = $('.container-main'),
        footnoteLinks = "",
        linksIndex = 0;

    $body.find('.nav-mobile, .drilldown, .nav-main, .header-separator, .nav-service, .nav-lang, .form-search, .yamm--select, footer, .alert, .icon--print, .social-sharing, form, .nav-process, .carousel-indicators, .carousel-control, .breadcrumb, .pagination-container').remove();

    // if an element is passed, we want it to be the only thing to print out
    if (element) {
      element = $('[data-print=' + element + ']').clone(); // clone to fix issue with IE render
      var header = $('header').clone(), // clone to fix issue with IE render
          title = element.attr('data-title') ? '<h1>' + element.attr('data-title') + '</h1>' : '';
      $container.addClass('print-element').html('').append(header, title, element);
    }

    $body.addClass('print-preview');

    $container.prepend('<div class="row" id="print-settings">'+
      '<div class="col-sm-12">'+
        '<nav class="pagination-container clearfix">'+
          '<span class="pull-left">'+
            '<input type="checkbox" id="footnote-links">&nbsp;&nbsp;'+
            '<label for="footnote-links">Links as footnotes</label>'+
          '</span>'+
          '<ul class="pull-right">'+
            '<li>'+
              '<button id="print-button" title="print" class="btn"><span class="icon icon--print"></span></button>'+
              '&nbsp;&nbsp;'+
              '<button id="close-button" title="close" class="btn btn-secondary"><span class="icon icon--close"></span></button>'+
            '</li>'+
          '</ul>'+
        '</nav>'+
      '</div>'+
    '</div>');

    $('#print-button').click(function () {
      $.printPreview.printProcess();
    });

    $('#close-button').click(function () {
      $.printPreview.printClose();
    });


    $('a').not('.access-keys a').each(function () {
      var target = $(this).attr('href');
      target = String(target);

      if (target !== "undefined" && target.indexOf("http") === 0) {
        linksIndex ++;
        footnoteLinks += '<li>'+target+'</li>';
        $('<sup class="link-ref">('+linksIndex+')</sup>').insertAfter(this);
      }
    });


    $('#footnote-links').change(function(){
      if (this.checked) {
        $container.append('<div id="footnote-links-wrapper" class="row footnote-links-wrapper">'+
          '<div class="col-sm-12">'+
          '<h3>Page Links</h3><hr>'+
          '<ol>'+
            footnoteLinks+
          '</ol>'+
          '</div>'+
        '</div>');
        $body.addClass('print-footnotes');
      } else {
        $('#footnote-links-wrapper').remove();
        $body.removeClass('print-footnotes');
      }
    });
  },

  printProcess: function() {
    window.print();
  },

  printClose: function() {
    window.location.reload();
  }

};

}) (jQuery);

/* ==========================================================
 * rich-menu.js
 * Add overlay when openning a rich yamm menu and define open/close events
 *
 * Author: Yann Gouffon, yann@antistatique.net
 * Date:   2014-04-30 11:48:48
 *
 * Copyright 2014 Federal Chancellery of Switzerland
 * Licensed under MIT
 =========================================================== */

(function($) {
  'use strict';

  // Keep jQuery object in variables
  var $yamm = $('.yamm'),
      $yammClose = $('.yamm-close, .yamm-close-bottom'),
      $dropdown = $('.yamm .dropdown'),
      $dropdownToggle = $('.yamm .dropdown-toggle');

  // Toggle dropdown and fix z-index errors
  $yamm.each(function () {
    var $that = $(this);
    $that.on('click', '.dropdown-toggle', function () {
      if (!$(this).parent().hasClass('open')){
        var dropdownHeight = $(window).height() - 49;
        $that.find('.drilldown-container').height( dropdownHeight );
      }
    });
  });

  // "tabindex = -1" is added by bootstrap-accessibility-plugin to dropdown's elements.
  // The yamm menu uses the dropdown class, but is not a conventional dropdown, hence, the tabindex must not
  // be present.
  $dropdown.find('li a').removeAttr('tabindex');

  $dropdownToggle.on('click', function() {
    $(this).parents($dropdown).trigger('get.hidden');
  });

  $dropdown.on({
      "shown.bs.dropdown": function() { this.closable = false; },
      "get.hidden":        function() { this.closable = true; }
  });

  $('.dropdown').on('show.bs.dropdown', function () {
    $dropdown.removeClass('open');
    $yamm.removeClass('nav-open');
    $(this).parents($yamm).addClass('nav-open');
  });

  $dropdown.on('hide.bs.dropdown', function () {
    // only remove the nav-open class if effectively closing dropdown
    if (this.closable) {
      $yamm.removeClass('nav-open');
    }
    return this.closable;
  });

  $(document).on('click', function(e) {
    // hide dropdown if dropdown is open and target is not in dropdown
    if ($('.dropdown.open').length > 0 && $(e.target).parents('.dropdown').length === 0) {
        $('.dropdown.open .dropdown-toggle').trigger('click');
    }
  });

  // Trigger close yamm menu
  $dropdown.each(function () {
    var $that = $(this);
    $that.find($yammClose).click( function (e) {
      e.preventDefault();
      $that.find($dropdownToggle).trigger("click");
    });
  });

}) (jQuery);

(function($) {
  'use strict';

  var datasets = [];
  $('.dropdown.yamm-fw').each(function() {
    var title = $('.dropdown-toggle', $(this)).html();
    var links = $('.dropdown-menu li a', $(this));
    var suggestions = [];
    links.each(function() {
      suggestions.push({
        title: $(this).html(),
        link: $(this).attr('href')
      });
    });
    if (!suggestions.length) {
      return;
    }
    var engine = new Bloodhound({
      initialize: true,
      local: suggestions,
      identify: function(obj) {
        return obj.link;
      },
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('title'),
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });
    datasets.push({
      display: 'title',
      source: engine,
      templates: {
        empty: function() {
          return [
            '<li class="search-result-header">',
              title,
            '</li>',
            '<li>',
              window.translations['global-search']['nothing-found'],
            '</li>'
          ].join('');
        },
        header: function() {
          return [
            '<li class="search-result-header">',
              title,
            '</li>'
          ].join('');
        },
        dataset: '<ul><ul>',
        suggestion: function (data) {
          return '<li><a href="' + data.link + '">' + data.title + '</a></li>';
        }
      }
    });
  });

  function initTypeahead(element) {
    $('.search-input', element).typeahead({
      hint: false,
      highlight: true,
      menu: $('.search-results .search-results-list', element),
      classNames: {
        suggestion: '',
        cursor: 'active'
      }
    }, datasets)
    .on('typeahead:selected', function (event, selection) {
      event.preventDefault();
      window.location.replace(selection.link);
    })
    .on('typeahead:open', function() {
      $(this).closest('.global-search').addClass('focused');
    })
    .on('typeahead:close', function() {
      $(this).closest('.global-search').removeClass('focused');
      //$(this).closest('form').trigger('reset');
    })
    .on('keyup', function (event) {
      if (event.keyCode === 27) { // ESC
        $(this).closest('form').trigger('reset');
      } else if ($(this).typeahead('val')) {
        $(this).closest('.global-search').addClass('has-input');
      } else {
        $(this).closest('.global-search').removeClass('has-input');
      }
    });

    $('form', element)
      .on('submit', function() {
        return false;
      })
      .on('reset', function() {
        $('.search-input', this).typeahead('val', '');
        $(this).closest('.global-search').removeClass('has-input');
      });

    $('.search-reset', element).on('click', function() {
      $(this).closest('form').trigger('reset');
      $('.search-input', element).focus();
    });
  }

  initTypeahead($('.global-search-standard'));
  initTypeahead($('.global-search-mobile'));

  // Mobile improvements:
  $('.nav-mobile .nav-mobile-menu').parent().on('show.bs.dropdown', function () {
    setTimeout(function () {
      $('.nav-mobile .search-input.tt-input').val(null).focus();
    }, 100);
  });

})(jQuery);

/* ==========================================================
 * select.js
 * Scripts handling `select` elements
 *
 * Author: Toni Fisler, toni@antistatique.net
 * Date:   2014-04-30 10:20:33
 *
 * Copyright 2014 Federal Chancellery of Switzerland
 * Licensed under MIT
 ========================================================== */

(function($) {
  'use strict';

  $(document).ready(function(){
    $('select').chosen({
      disable_search_threshold: 10,
      width: 'auto'
    });
  });

}) (jQuery);

/* ==========================================================
 * shame.js
 * DOM rewritting on mobile, issue #160
 *
 * Author: Yann, yann@antistatique.net
 * Date:   2014-06-18 15:57:23
 *
 * Copyright 2014 Federal Chancellery of Switzerland
 * Licensed under MIT
 ========================================================== */

(function($) {
  'use strict';

  $(document).ready(function () {
    var id;
    var isCarouselified = false;
    var isCollapsified = false;
    carouselify();
    collapsify();

    $(window).resize(function() {
      clearTimeout(id);
      id = setTimeout(resizeLauncher, 500);
    });

    function resizeLauncher() {
      carouselify();
      collapsify();
    }

    function carouselify() {
      var $tabFocus = $('.tab-focus'),
          focusIndex = 0;

      if($tabFocus && $(window).width() <= 767 && !isCarouselified ) {
        isCarouselified = true;

        $tabFocus.each(function () {
          var $that = $(this),
              itemIndex = -1;

          focusIndex += 1;

          $that.attr('id', 'tab-focus-'+focusIndex);
          $that.next('.nav-tabs').hide();
          // Prevent those mobile-only carousels from riding automatically by setting interval to 0
          $that.addClass('carousel slide').removeClass('tab-content tab-border').attr('data-interval', 0);
          $that.wrapInner('<div class="carousel-inner"></div>');
          $that.prepend('<ol class="carousel-indicators"></ol>');

          $that.find('.tab-pane').each(function () {
            itemIndex += 1;
            $(this).removeClass('tab-pane in active').addClass('item');
            $that.find('.carousel-indicators').append('<li data-target="#tab-focus-' + focusIndex + '" data-slide-to="' + itemIndex + '"></li>');
          });
          $that.find('.item:first').addClass('active');
          $that.find('.carousel-indicators li:first-child').addClass('active');

          $that.append('<a class="left carousel-control icon icon--before icon--less" href="#tab-focus-' + focusIndex + '" data-slide="prev" aria-label="previous"></a><a class="right carousel-control icon icon--before icon--greater" href="#tab-focus-' + focusIndex + '" data-slide="next" aria-label="next"></a>');
        });
      }
      else if($tabFocus && $(window).width() > 767 && isCarouselified) {
        isCarouselified = false;

        $tabFocus.each(function () {
          var $that = $(this);

          focusIndex -= 1;
          $that.attr('id', '');
          $that.next('.nav-tabs-focus').css('display', 'flex'); // we can't use .show() because it should be a flex wrapper
          $that.removeClass('carousel slide').addClass('tab-content tab-border');
          $that.find('ol.carousel-indicators').remove();

          $that.find('.item').each(function () {
            $(this).addClass('tab-pane').removeClass('item');
            $(this).css('height', 'auto');
          });
          $that.find('.tab-pane:first-child').addClass('active in');

          if ( $that.find('.tab-pane').parent().hasClass('carousel-inner') ) {
            $that.find('.tab-pane').unwrap();
          }

          $that.find('.carousel-control').remove();
        });
      }
    }

    function collapsify() {
      var $navTab = $('.nav-tabs:not(.focus)'),
          $collapsify = $('.collapsify'),
          linkIndex = 0;

      if($navTab && $(window).width() <= 767 && !isCollapsified ) {
        isCollapsified = true;

        $navTab.not('.tab-focus').each(function (){
          var $that = $(this);

          $that.removeClass('nav-tabs').addClass('collapsify');
          $that.next('.tab-content').hide();

          $that.find('a').each(function (){
            var $target = $(this).attr('href');
            linkIndex += 1;
            $(this).unwrap();
            $('<div class="collapse" id="collapse-' + linkIndex + '">' + $($target).html() + '</div>').insertAfter(this);
            $(this).attr('data-toggle', 'collapse');
            $(this).attr('data-target', '#collapse-' + linkIndex);
            $(this).addClass('collapse-closed');
            $(this).click(function(){
              $(this).toggleClass('collapse-closed');
            });
          });
          //$that.find('a:first-child').removeClass('collapse-closed').next('.collapse').addClass('in');
        });
      }
      else if($collapsify && $(window).width() > 767 && isCollapsified) {
        isCollapsified = false;

        $collapsify.each(function (){
          var $that = $(this);

          $that.addClass('nav-tabs').removeClass('collapsify');
          $that.next('.tab-content').show();

          $that.find('a').each(function (){
            linkIndex -= 1;
            $(this).wrap('<li></li>');
            $(this).parent().next('.collapse').remove();
            $(this).attr('data-toggle', 'tab');
            $(this).attr('data-target', '');
            $(this).removeClass('collapse-closed');
          });

          $that.find('li a').each(function () {
            var $tabTarget = $(this).attr('href');
            if($($tabTarget).hasClass('active')){
              $(this).parent().addClass('active');
            }
          });
        });
      }
    }
  });

}) (jQuery);

(function($) {
  'use strict';

  $('a.social-sharing-facebook').click(function() {
    window.open(
      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.href),
      'facebook-share-dialog',
      'width=626,height=436'
    );
    return false;
  });

  $('a.social-sharing-twitter').click(function() {
    window.open(
      'http://twitter.com/share?url=' + encodeURIComponent(location.href),
      'twitter-share-dialog',
      'width=626,height=436'
    );
    return false;
  });

  $('a.social-sharing-google').click(function() {
    window.open(
      'https://plus.google.com/share?url=' + encodeURIComponent(location.href),
      'google-share-dialog',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600'
    );
    return false;
  });

  $('a.social-sharing-xing').click(function() {
    window.open(
      'https://www.xing.com/spi/shares/new?url=' + encodeURIComponent(location.href),
      'xing-share-dialog',
      'width=626,height=436'
    );
    return false;
  });

  $('a.social-sharing-linkedin').click(function() {
    window.open(
      'https://www.linkedin.com/cws/share?url=' + encodeURIComponent(location.href),
      'linkedin-share-dialog',
      'width=626,height=436'
    );
    return false;
  });

})(jQuery);

/* ==========================================================
 * subnavigation.js
 * Sub-navigation scripts, handles mainly how the nav-page-list behaves on small
 * screens
 *
 * Author: Toni Fisler, toni@antistatique.net
 * Date:   2014-09-24 10:18:19
 *
 * Copyright 2014 Federal Chancellery of Switzerland
 * Licensed under MIT
 ========================================================== */

(function($) {
  'use strict';

  subNavInit(jQuery);
  $(window).resize(function () {
    subNavInit(jQuery);
  });

  $('a[href="#collapseSubNav"]').on('click', function() {
    $(this).attr('aria-expanded', ($(this).attr('aria-expanded') === 'true' ? 'false' : 'true') );
  });

}) (jQuery);

function subNavInit($) {
  'use strict';

  var $drilldown = $('.drilldown[class*=col-]');
  var width = Math.max(window.innerWidth, $(window).width());

  if (width <= 767 && !$drilldown.hasClass('collapse-enabled')) {
    $drilldown
      .addClass('collapse-enabled')
      .find('.drilldown-container')
      .addClass('collapse')
      .attr('id', 'collapseSubNav');
  } else if (width > 767 && $drilldown.hasClass('collapse-enabled')) {
    $drilldown
      .removeClass('collapse-enabled')
      .find('.drilldown-container')
      .removeClass('collapse in')
      .attr('id', '')
      .css({
        'height': 'auto'
      });
  }
}

/* ==========================================================
 * tablesorter.js
 * Control tablesort from markup
 *
 * Author: Simon Perdrisat, simon@antistatique.net
 * Date:   2014-05-01 11:11:33
 *
 * Copyright 2014 Federal Chancellery of Switzerland
 * Licensed under MIT
 ========================================================== */


(function($) {
  'use strict';

  $('.table-sort').tablesorter({ sortLocaleCompare : true });

}) (jQuery);

 /* ==========================================================
  * tabs.js
  * JS for the tabs and tab-focus elements
  *
  * Copyright 2014 Federal Chancellery of Switzerland
  * Licensed under MIT
  ========================================================== */

(function($) {
  'use strict';

  /**
   * @constructor
   * @param {Object} domNode
   */
  function TabFocus(element) {
    this.$wrapper = $(element).parent();
    this.domNodes = '.tab-focus, .nav-tabs-focus';
    this.delay = 3000;
    this.playing = null;
    this.interval = null;

    this.$wrapper
      .on('click', '.nav-tabs-focus', function() {
        this.pause(null, true);
      }.bind(this))
      .on('click', '.tab-focus-control', function() {
        if (this.playing) {
          this.pause(null, true);
        } else {
          this.play(null, true);
        }
      }.bind(this));

    this.play(null, true);
  }

  TabFocus.prototype = {
    addListeners: function() {
      this.$wrapper
        .on('mouseenter.tabfocus focus.tabfocus', this.domNodes, this.pause.bind(this))
        .on('mouseleave.tabfocus blur.tabfocus', this.domNodes, this.play.bind(this));
    },

    removeListeners: function() {
      this.$wrapper
        .off('mouseenter.tabfocus focus.tabfocus', this.domNodes)
        .off('mouseleave.tabfocus blur.tabfocus', this.domNodes);
    },

    play: function(event, startListening) {
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.interval = setInterval(this.slide.bind(this), this.delay);

      if (startListening) {
        this.playing = true;
        this.addListeners();
        this.$wrapper.find('.tab-focus-control .icon').removeClass('icon--play').addClass('icon--pause');
      }
    },

    pause: function(event, stopListening) {
      clearInterval(this.interval);

      if (stopListening) {
        this.playing = false;
        this.removeListeners();
        this.$wrapper.find('.tab-focus-control .icon').removeClass('icon--pause').addClass('icon--play');
      }
    },

    slide: function() {
      var $nav = this.$wrapper.find('.nav-tabs-focus');

      // If the nav is hidden, it means the focus has been changed for a carousel (mobile)
      // We don’t want to slide automatically anymore
      if ($nav.is(':hidden')) {
        return this.pause(null, true);
      }

      if ($nav.find('> li').length) {
        var tabs = this.$wrapper.find('.nav-tabs-focus > li'),
            activeTab = tabs.filter('.active'),
            nextTab = activeTab.next('li'),
            newTab = nextTab.length ? nextTab.find('a') : tabs.eq(0).find('a');

        newTab.tab('show');
      }
    }
  };

  $.fn.tabFocus = function() {
    return this.each(function() {
      if (!$.data(this, 'TabFocus')) {
        $.data(this, 'TabFocus', new TabFocus(this));
      }
    });
  };

  $('.tab-focus').tabFocus();

})(jQuery);

/* ==========================================================
 * treecrumb.js
 * Change icon class to change the caret direction
 *
 * Author: Yann Gouffon, yann@antistatique.net
 * Date:   2014-05-01 11:11:33
 *
 * Copyright 2014 Federal Chancellery of Switzerland
 * Licensed under MIT
 ========================================================== */

(function($) {
  'use strict';

  $('.treecrumb').each(function() {
    var $that = $(this);
    $that.on('hide.bs.dropdown', function() {
      $that.find('.dropdown-toggle span').removeClass('icon--bottom');
      $that.find('.dropdown-toggle span').addClass('icon--right');
    });
    $that.on('show.bs.dropdown', function(e) {
      var target = e.relatedTarget;
      $that.find('.dropdown-toggle span').removeClass('icon--bottom');
      $that.find('.dropdown-toggle span').addClass('icon--right');
      $(target).find('span').removeClass('icon--right');
      $(target).find('span').addClass('icon--bottom');
    });
  });

}) (jQuery);

(function($){
  'use strict';

  // Setup twitter widget (see: https://dev.twitter.com/web/javascript/loading)
  window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
      t = window.twttr || {};
    if (d.getElementById(id)) {
      return t;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function(f) {
      t._e.push(f);
    };
    return t;
  }(document, "script", "twitter-wjss"));

  window.twttr.ready(function (twitter) {
    $('.mod-twitterstream .twitter-timeline').each(function () {
      twitter.widgets.createTimeline(
        {
          sourceType: 'profile',
          screenName: $(this).data('profile')
        },
        this,
        {
          borderColor: '#ccc', // $silver
          linkColor: '#069', // $cerulean
          chrome: 'noheader nofooter transparent',
          tweetLimit: $(this).data('tweet-limit')
        })
        .then(function (iframe) {
          var head = $(iframe).contents().find('head');
          if (head.length) {
            head.append('<link type="text/css" rel="stylesheet" href="../css/twitter-inject.css" />');

            /*
            Injected CSS has an impact on the iframe body's height.
            So we need to force widget.js to recalculate the iframe height.
             */
            $(iframe).css('height', '100%');

            /*
            As we apply some custom styling which is not intendend by Twitter,
            let's try to detect any changes by Twitter that may break it.
            */
            reportTwitterHtmlChanges($(iframe));
          }
        });
      twitter.widgets.createFollowButton(
        $(this).data('profile'),
        $(this).parent().get(0),
        {
          showCount: false
        }
      );
    });
  });

  function reportTwitterHtmlChanges(iframe) {
    reportMissingTwitterHmlElement(iframe, '.TweetAuthor-name');
    reportMissingTwitterHmlElement(iframe, '.TweetAuthor-link');
    reportMissingTwitterHmlElement(iframe, '.TweetAuthor-avatar');
    reportMissingTwitterHmlElement(iframe, '.SandboxRoot.env-bp-min .TweetAuthor-avatar');
    reportMissingTwitterHmlElement(iframe, '.TweetAuthor-avatar .Avatar');
    reportMissingTwitterHmlElement(iframe, '.SandboxRoot.env-bp-min .TweetAuthor-avatar .Avatar');
    reportMissingTwitterHmlElement(iframe, '.timeline-Tweet-author');
    reportMissingTwitterHmlElement(iframe, '.TweetAuthor-name.Identity-name');
    reportMissingTwitterHmlElement(iframe, '.TweetAuthor-screenName.Identity-screenName');
    reportMissingTwitterHmlElement(iframe, '.timeline-Tweet-text');
    reportMissingTwitterHmlElement(iframe, '.SandboxRoot.env-bp-min .timeline-Tweet-text');
    reportMissingTwitterHmlElement(iframe, '.timeline-Tweet-action.timeline-ShareMenu');
    reportMissingTwitterHmlElement(iframe, '.timeline-Tweet-brand');
    reportMissingTwitterHmlElement(iframe, '.TweetAuthor-verifiedBadge');
    reportMissingTwitterHmlElement(iframe, '.timeline-Tweet-metadata *');
    reportMissingTwitterHmlElement(iframe, '.timeline-Tweet-retweetCredit', true);
    reportMissingTwitterHmlElement(iframe, '.Icon.Icon--retweetBadge', true);
    reportMissingTwitterHmlElement(iframe, '.Icon.Icon--heart.TweetAction-icon.Icon--heartEdge');
    reportMissingTwitterHmlElement(iframe, '.TweetAction .Icon.Icon--heart.TweetAction-icon.Icon--heartEdge');
    reportMissingTwitterHmlElement(iframe, '.timeline-Body');
    reportMissingTwitterHmlElement(iframe, '.timeline-ShowMoreButton');
  }

  function reportMissingTwitterHmlElement(iframe, selector, isOptional) {
    if (0 < $(iframe).contents().find(selector).length) {
      return;
    }
    var message = [
      'mod-twitterstream #',
      $(iframe).attr('id'),
      ': The following ',
      isOptional ? ' optional ' : '',
      'elements could not be found inside Twitter widget HTML: "',
      selector,
      '". This may be caused by a Twitter widget HTML change. ',
      'In this case, Twitter stream may not be CI/CD compliant.'
    ].join('');

    isOptional ? console.log(message) : console.warn(message);
  }
})(jQuery);

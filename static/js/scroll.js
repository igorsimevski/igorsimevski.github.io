$(document).ready(function() {

    // Page scrolling feature
    $('a.page-scroll').bind('click', function(event) {
        var link = $(this);
        $('html, body').stop().animate({
            scrollTop: $(link.attr('href')).offset().top - 50
        }, 500);
        event.preventDefault();
        $("#navbar").collapse('hide');
    });
});

var cbpAnimatedHeader = (function() {
    var changeHeaderOn = 100, scrollDebounce = 250;

    function scrollPage() {
      $('.navbar-light').toggleClass('navbar-scroll', scrollY() >= changeHeaderOn);
    }

    function scrollY() {
      return window.pageYOffset || document.documentElement.scrollTop;
    }

    window.addEventListener('scroll', function() { setTimeout(scrollPage, scrollDebounce); }, false);
})();

// Activate WOW.js plugin for animation on scroll
new WOW(
  {
    animateClass: 'animate__animated'
  }
).init();

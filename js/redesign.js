$(window).scroll(function () {
    $('#header').toggleClass('scrollable', $(this).scrollTop() > 200);
});
$(document).ready(function () {
    $('.slider-controls a').on('click', function(e) {
        e.preventDefault();
        $('.slider-controls a').removeClass('active');
        $(this).addClass('active');
        $('.slide').hide();
        $($(this).attr('href')).show();
    });
    setInterval(function () {
        if ($('.slider-controls a.active').next().length) {
            $('.slider-controls a.active').next().trigger('click');
        } else {
            $('.slider-controls a:first-child').trigger('click')
        }
    }, 8000);
});

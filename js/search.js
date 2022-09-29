$(document).ready(function(){

    var $body = $('body');

    $body.on('click', '.search-switcher a', function(e){
        if ($(this).hasClass('active')) {
            e.preventDefault();
            $('#search-form').slideToggle();
        } else {
            $(this).closest('.search-switcher').find('a').removeClass('active');
            $(this).addClass('active');
            $('#search-form input[name="search_type"]').val($(this).text().toLowerCase());
        }
    });

    $body.on('click', '.js-show-search-form', function(e){
        e.preventDefault();
        $('#search-form').slideToggle();
    });

});

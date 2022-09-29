$(document).ready(function(){

    var $body = $('body');

    $body.on('click', '.js-show-feed-form', function(e){
        e.preventDefault();
        $('.feed-form').slideToggle();
    });

    $body.on('click', '.js-feed-filter-link', function(){
        var activeClass = 'active';
        $(this).closest('ul').find('.' + activeClass).removeClass(activeClass);
        $(this).closest('li').addClass(activeClass);
    });

});

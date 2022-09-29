$(document).ready(function(){
    $('.ihealtho-tabs a').on('click', function(){

        $(this).closest('.ihealtho-tabs').find('a').removeClass('tt-active');
        $('.ihealtho-active-tab').hide();

        $(this).addClass('tt-active');
        $($(this).attr('href')).addClass('ihealtho-active-tab').show();

    });
});

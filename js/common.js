var t ;
$('.full-height-scroll').on('scroll', function(){
        window.clearTimeout( t );
        t = window.setTimeout( function(){
            $('[data-datepicker-source]').each(function(){ $(this).data('datepicker').place(); });
            $('[data-krajee-daterangepicker]').each(function(){ $(this).data('daterangepicker').move(); });
        }, 0 );
    }
);

$(window).on('load resize', function(){
    var header_height = $('body > .header').height();
    var page_title_height = $('.page-title').height();
    var avatar_height = $('.user-photo-square').height();
    var chat_panel_height = $('.chat-panel').height();
    if( $('body > .content').width()<=767 && $('#main > .column').length == 2 ) page_title_height *= 2;
    $('.full-height-scroll').height($(window).height() - header_height - page_title_height);
    $('.full-height-scroll-without-page-title').height($(window).height() - header_height);
    $('.titled-sidebar-scroll').height($(window).height() - header_height - 40 - avatar_height);
    $('.sidebar-scroll').height($(window).height() - header_height - avatar_height);
    $('.sign-up-scroll').height($(window).height() - header_height);
    $('.chat-scroll').height($(window).height() - header_height - page_title_height - chat_panel_height);
});

$(window).on('resize', function(){
    var header_height = $('body > .header').height();
    var page_title_height = $('.page-title').height(); 
    var chat_panel_height = $('.chat-panel').height(); 
    $('.chat-scroll').height($(window).height() - header_height - page_title_height - chat_panel_height);
});

$(document).ready(function(){

    var $body = $('body');

    $('.js-fake-change-photo').on('click', function(e){
        e.preventDefault();
        $(this).closest('form').find('input[type="file"]').click();
    });

    $('#user-avatar').on('change', function(e){
        e.preventDefault();
        $('[name="User[cur_avatar]"]').remove();
        $(this).closest('form').submit();
    });

    $('.js-chat-search').on('keyup', function(e){
        var searchText = $(this).val();
        $('.chat-content a p').each(function(){
            var userName = $(this).text();
            var eq = userName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
            $(this).closest('a').toggle(eq);
        });
    });

    $body.on('change', '.js-approve-doctor', function(e){
        $.ajax({
            type: 'post',
            data: {
                doctor_ids: [$(this).val()]
            },
            success: function(){
                window.location.reload();
            }
        });
    });

    $('.js-invite-doctor').on('click', function(e){
        e.preventDefault();
        if(confirm('Do you really want to invite this doctor?')){
            $.ajax({
                url: $(this).attr('rel'),
                success: function(){
                    showMessage('Doctor has been invited.');
                }
            });
        }
    });


    $('.js-standard-ajax-form').on('beforeSubmit', function(e){
        e.preventDefault();

        var $form = $(e.currentTarget);

        $.ajax({
            url: $form.attr('action'),
            type: $form.attr('method'),
            dataType: 'json',
            data: $form.serialize()
        }).done(function(response){
            if(response.success){
                $form[0].reset();
            }
            //$.pjax.reload({container : '#system-notifications'});
            showMessage(response.message, response.message_type);
        });

        return false;
    });

    $('.js-choose-clinic-toggle').on('click', function(){
        $('.js-choose-clinic').toggle($(this).prop('checked'));
    });

    $('.js-like-feed-answer').on('click', function(e){
        e.preventDefault();
        var $that = $(this);
        $.ajax({
            url: $(this).attr('href'),
            dataType: 'json'
        }).done(function(response){
            if(response.success){
                $that.find('span').html(response.likes);
            }
        });
    });

    $body.on('click', '.chat-left .js-switcher', function(e){
        e.preventDefault();
        $(this).closest('.chat-left').toggleClass('expanded collapsed');
    });

    $body.on('click', '.chat-right-on, .chat-right-off', function(e){
        e.preventDefault();
        if($(this).hasClass('chat-right-off')){
            $('.page-title').filter(":last").prepend('<div class="title-control" id="contacts-toggle"><a href="#" class="chat-right-on"><i class="fa fa-list"></i></a></div>');
        }else {
            $('.chat-right-on').closest('.title-control').remove();
        }
        $('.chat-right').toggle();
        $('.feeds').masonry('layout');
    });

    $('.js-show-profile-trigger').on('click', function(e) {
        e.preventDefault();
        if (!$('.chat-full').length && $(this).hasClass('back')) {
            window.history.back();
        } else {
            $('.chat-full, .profile-full, .profile-right-column').toggle();
        }
    });

});

$(document).on('pjax:start', function() { NProgress.start(); });
$(document).on('pjax:end',   function() { NProgress.done();  });

function sendAjax(url, data, callback){
    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: data,
        success: function(response) {
            callback(response);
        }
    });
}

function showMessage(message, type){
    if(typeof type === 'undefined'){
        type = 'info';
    }
    var $tpl = $('<div class="alert"><a href="#" class="close" data-dismiss="alert">&times;</a></div>');
    $tpl.addClass('alert-' + type).append(message);
    $('.flash-messenger').prepend($tpl);
    setTimeout(function () {
        $tpl.remove();
    }, 5000);
}

$(function(){
    initChart($('.js-doctor-patients-stats'), 'patients', function(response){
        var chart = $('#js-patients-chart').highcharts();
        chart.series[0].setData(response.data);
        chart.xAxis[0].setCategories(response.categories);
    });

    initChart($('.js-doctor-funds-stats'), 'funds', function(response){
        var chart = $('#js-funds-chart').highcharts();
        chart.series[0].setData(response.data.subscription);
        chart.series[1].setData(response.data.single);
        chart.xAxis[0].setCategories(response.categories);
    });

    initChart($('.js-doctor-chats-stats'), 'chats', function(response){
        var chart = $('#js-chats-chart').highcharts();
        chart.series[0].setData(response.data);
        chart.xAxis[0].setCategories(response.categories);
    });

    function initChart($container, chartType, callback){
        $container.find('[name="period"], .js-period-type-control').on('change', function(){
            updateChart($container, chartType, callback);
        });
        $container.find('[name="period"]').trigger('change');
    }

    function updateChart($container, chartType, callback){
        $.ajax({
            data: {
                period : $container.find('[name="period"]').val(),
                periodType : $container.find('.js-period-type-control').val(),
                chartType : chartType
            },
            dataType: 'json'
        }).done(function (response) {
            callback(response);
        });
    }
});

function _hasPopupBlocker(poppedWindow) {
    var result = false;

    try {
        if (typeof poppedWindow === 'undefined') {
            result = true;
        }
        else if (poppedWindow && poppedWindow.closed) {
            result = false;
        }
        else if (poppedWindow && poppedWindow.focus) {
            result = false;
        }
        else {
            result = true;
        }

    } catch (err) {
        result = true;
    }

    return result;
}

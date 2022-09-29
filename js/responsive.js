$(document).ready(function () {
    
    // Main code    
    $( window ).resize(function() {
        setTimeout(adaptivity, 10);
    });
    setTimeout(adaptivity(), 10);
    init_menu();
    init_activity_button();
    init_profile_button();
    mobile_tabs();
    
    // Functions:
    
    function show_contacts_button() {
        $('.page-title').filter(":last").prepend('<div class="title-control" id="contacts-toggle"><a href="#" class="chat-right-on"><i class="fa fa-list"></i></a></div>');        
    }
    
    function hide_contacts_button() {
        $('.chat-right-on').closest('.title-control').remove();
    }
    
    function show_activity_button() {
        $('#main .column:first > .page-title').prepend('<div class="title-control" id="activity-toggle"><a href="#" class="activity-left-on"><i class="fa fa-user"></i></a></div>');        
    }
    
    function hide_activity_button() {
        $('.activity-left-on').closest('.title-control').remove();
    }
    
    function show_profile_button() {
        $('#main > .page-title').prepend('<div class="title-control" id="profile-toggle"><a href="#" class="profile-left-on"><i class="fa fa-edit"></i></a></div>');        
    }
    
    function hide_profile_button() {
        $('.profile-left-on').closest('.title-control').remove();
    }
    
    function adaptivity() {
        if( $('body > .content').width()<=1280 ){
            if( $('.activity-left-on').length == 0 && $('.activity-left').length>0) {
                show_activity_button();
            }                 
            if( $('.profile-left-on').length == 0 && $('.profile-left-column').length>0) {
                show_profile_button();
            }         
        } else {
            if( $('.activity-left-on').length > 0 && $('.activity-left').length>0) {
                hide_activity_button();
            }          
            if( $('.profile-left-on').length > 0 && $('.profile-left-column').length>0) {
                hide_profile_button();
            } 
        }
        
        if( $('body > .content').width()<=1195 ){            
            if( $('#main > .column').length > 1 && $('.chat-right-on').length == 0 && $('.chat-right').length>0) {
                show_contacts_button();
            }
        } else {
            if( $('#main > .column').length > 1 && $('.chat-right-on').length > 0 && $('.chat-right').length>0) {
                hide_contacts_button();
            }            
        }

        if( $('body > .content').width()<=1024 ){                     
            if( $('.chat-left').length > 0 && $('.chat-left').hasClass('expanded')) {
                $('.chat-left').addClass('collapsed').removeClass('expanded');
            } 
            if( $('#main > .column').length < 2 && $('.chat-right-on').length == 0 && $('.chat-right').length>0) {
                show_contacts_button();
            }          
        } else {
            if( $('#main > .column').length < 2 && $('.chat-right-on').length > 0 && $('.chat-right').length>0) {
                hide_contacts_button();
            }            
        }
        
        var submit_holder1 = $('.field-clinicprofile-contact_person').parent();
        var submit_holder2 = $('.field-user-newspecialityids').parent();
        if( $('body > .content').width()<=767 ){            
            if($('.main-menu:not(.footer-menu) .lang-switch').length == 0) {
                $('.lang-switch').appendTo($('.main-menu:not(.footer-menu)'));
            }
            if($('.main-menu:not(.footer-menu) .sett').length == 0) {
                $('.sett').appendTo($('.main-menu:not(.footer-menu)'));
            }
            if($('.active-side').length == 0) {
                $('#main > .column.width50:last-of-type').addClass('active-side');
            } 
            if(submit_holder1.find('.submit')) {
                $(submit_holder1.find('.submit')).appendTo(submit_holder2);
            }
        } else {            
            if( $('.header .wrapper > .lang-switch').length < 1 ) {                
                $('.lang-switch').appendTo($('.header .wrapper'));
            }            
            if( $('.header .wrapper > .sett').length < 1 ) {                
                $('.sett').appendTo($('.header .wrapper'));
            }
            
            if(submit_holder2.find('.submit')) {
                $(submit_holder2.find('.submit')).appendTo(submit_holder1);
            }
            
            var menu = $('.main-menu');
            if(menu.css('display') == 'none') {
                menu.attr('style','');
            }            
        }
    }
    
    function init_menu() {
        $('.navigation__icon').click(function(){
            var menu = $('.main-menu');
            if(menu.css('display') == 'none') {
                menu.slideDown();
            } else {
                menu.slideUp(); 
            }
        });
    }
    
    function init_activity_button() {
        if($('.activity-left .activity-left-off').length == 0 && $('.activity-left').length>0) {
            $('.activity-left').prepend('<a href="#" class="activity-left-off"><i class="fa fa-power-off"></i></a>');             
        }
        $(document).on('click', '.activity-left-on, .activity-left-off', function(e){
            e.preventDefault();
            
            $('.activity-left').toggle(); 
        });
    }
    
    function init_profile_button() {
        if($('.profile-left-column .profile-left-off').length == 0 && $('.profile-left-column').length>0) {
            $('.profile-left-column').prepend('<a href="#" class="profile-left-off"><i class="fa fa-power-off"></i></a>');             
        }
        $(document).on('click', '.profile-left-on, .profile-left-off', function(e){
            e.preventDefault();
            
            $('.profile-left-column').toggle(); 
        });
    }
     
    function mobile_tabs() {
        if($('#main > .column').length<2) return;
        if($('#main > .column').hasClass('width50')) {
            $('#main').addClass('padded');
        }
        var $body = $('body');
        $body.on('click', '.tab-switch', function(e){
            var tab = $(this);
            if( tab.parent().hasClass('active-side') ) return;
            
            if( $('body > .content').width()<=767 ) {
                
                $.when( $('.active-side').removeClass('active-side') ).then( tab.parent().addClass('active-side') );
                
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }
})

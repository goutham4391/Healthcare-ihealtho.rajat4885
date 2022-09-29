function ChatController () {

    var _self = this;
    _self.intervalID = null;
    _self.$container = $('#js-chat');
    _self.$messages_container = $('#js-chat-messages');
    _self.$form = _self.$container.find('form');
    _self.own_message_html = $('.js-own-message-template').html();
    _self.message_html = $('.js-user-message-template').html();
    _self.$scrollbar = $('.chat-scroll');

    _self.messageFiles = [];

    this.init = function(){

        if(!_self.$form.length){
            return;
        }

        _self.$form.on('beforeSubmit', function(){

            if (!$(this).find('textarea').val().trim() && !$('.js-ct-files .file').length) {
                return false;
            }

            if ($(this).find('.has-error').length == 0) {
                var fd = new FormData(_self.$form[0]);
                $.each(_self.messageFiles, function(i, file) {
                    fd.append('files[]', file);
                });
                $.ajax({
                    url: _self.$form.attr('action'),
                    type: 'post',
                    data: fd,
                    processData: false,
                    contentType: false,
                    success: function(response) {
                        /*console.log(response);*/
                    },
                    error: function(jqXHR, textStatus, errorMessage) {
                        console.log(errorMessage); // Optional
                    }
                });
                _self.messageFiles = [];
                if ($('.js-ct-files').is(':visible')) {
                    $('.chat-scroll').height($('.chat-scroll').height() + $('.js-ct-files').height());
                    $('.js-ct-files').html('').hide();
                }
                _self.$form[0].reset();
            }
            return false;
        });

        setInterval(function(){
            _self.checkChatMessages(_self.$form.data('chat_id'), _self.$form.data('last_message_id'), _self.$form.data('timestamp'));
        }, 1000);

        _self.$container.find('.js-change-status').on('change', function(e){
            e.preventDefault();
            $.ajax({
                url: $(this).data('url'),
                type: 'post',
                dataType: 'json',
                data: {
                    chat_id : _self.$form.data('chat_id'),
                    status: $(this).val()
                },
                success: function(response) {
                    if (typeof response.message !== 'undefined') {
                        showMessage(response.message);
                    }
                }
            });
        });

    };

    this.checkChatMessages = function(chat_id, last_message_id, timestamp){
        $.ajax({
            url: _self.$form.data('check_url'),
            type: 'post',
            dataType: 'json',
            data: {
                chat_id: chat_id,
                last_message_id: last_message_id,
                timestamp: timestamp
            },
            success: function(response) {
                if(response.success && response.messages.length > 0){
                    var i;
                    var messages = response.messages;
                    for(i=0; i<messages.length; i++){
                        var $message = $(messages[i].own ? _self.own_message_html : _self.message_html);
                        $message.find('p').html(response.messages[i].text);
                        if(messages[i].files.length){
                            for(var j=0; j<messages[i].files.length; j++){
                                $message.find('p').append('<br><a href="' + messages[i].files[j].path + '">' +
                                    messages[i].files[j].name +
                                    '[' + messages[i].files[j].mime + ']' +
                                    '</a>');
                            }
                        }
                        _self.$messages_container.append($message) ;
                    }
                    _self.$scrollbar.scrollTop(_self.$scrollbar[0].scrollHeight);
                }
                _self.$form.data('timestamp', response.timestamp);
                _self.$form.data('last_message_id', response.last_message_id);
            }
        });
    };
}

$(document).ready(function(){
    var chatController = new ChatController();
    chatController.init();

    $('.js-send-message').on('click', function(e){
        e.preventDefault();
        chatController.$form.submit();
    });

    $('.js-open-call').on('click', function(e){
        e.preventDefault();
        if(_hasPopupBlocker(window.open('/chat/default/call', "Call", "width=640,height=480,resizable=yes,scrollbars=yes,status=yes"))) {
            showMessage('Currently your browser settings don\'t allow Pop-ups!<br><br>You should allow the browser to ' +
                'show a Pop-up window so you can authenticate and authorize the G4 Search web application.');
        }
    });

    chatController.$form.find('textarea').on('keydown', function(e) {
        if (e.ctrlKey && e.keyCode == 13) {
            chatController.$form.submit();
        }
    });

    $(document).on('click', '.js-check-chat-status', function(e){
        e.preventDefault();
        var $that = $(this);
        NProgress.start();
        sendAjax($that.attr('rel'), {}, function(response){
            NProgress.done();
            if(response.success){
                window.location.href = response.redirect_url;
            } else {
                $that.attr('href', response.redirect_url);
                $that.data('title', response.data.popupTitle);
                $that.data('icon', 'fa-question-circle');
                showModal($that);
            }
        });
    });

    chatController.$form.find('.js-attach-file').on('click', function(){
        chatController.$form.find('.js-message-files').trigger('click');
    });

    chatController.$form.find('.js-message-files').on('change', function(){
        var i;
        if (this.files.length) {
            for (i=0; i<this.files.length; i++) {
                chatController.messageFiles.push(this.files[i]);
            }
            showFiles();
            $(this).replaceWith( $(this).clone( true ) );
        }
    });

    function showFiles () {
        var i;
        var $container = $('.js-ct-files').html('');
        for (i=0; i<chatController.messageFiles.length; i++) {
            $container.append('<span class="file">' + chatController.messageFiles[i].name + '</span>');
        }
        if (!$('.js-ct-files').is(':visible')) {
            $('.chat-scroll').height($('.chat-scroll').height() - $container.height());
            chatController.$scrollbar.scrollTop(chatController.$scrollbar[0].scrollHeight);
        }
        $container.show();
    }

    $('.js-timer').each(function() {
        initializeTimer($(this));
    });

});

function initializeTimer($timer) {
    var timer = $timer.data('duration'),
        days,
        hours,
        minutes,
        seconds;

    if (timer < 0) {
        $timer.closest('.time-left').hide();
        return false;
    }

    setInterval(function () {
        days = parseInt((timer / 60 / 60 / 24), 10);
        hours = parseInt((timer / 60 / 60) % 24, 10);
        minutes = parseInt((timer / 60) % 60, 10);
        seconds = parseInt(timer % 60, 10);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        $timer.text(days + 'day' + (days>1 ? 's ' : ' ') + hours + ":" + minutes + ":" + seconds);

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

function onBeforeSubmitAjaxForm(e) {
    var $form = $(e.target),
        url = $form.attr('action'),
        type = $form.attr('method'),
        data = $form.serialize();
    $.ajax({
        url: url,
        dataType: 'json',
        type: type,
        data: data
    }).done(function(response){
        if(response.success){
            $form.closest('#modal').modal('hide');
        }
        if(typeof response.message !== 'undefined'){
            showMessage(response.message, response.success ? 'success' : 'error');
        }
        if(typeof response.callback !== 'undefined'){
            window[response.callback](response.data);
        }
    });
    return false;
}

$(document).on('beforeSubmit', 'form.ajax-form', onBeforeSubmitAjaxForm);

function changeAboutText(text){
    $('#user-about-text').html(text);
}

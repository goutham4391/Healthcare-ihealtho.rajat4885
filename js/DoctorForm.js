$(document).ready(function(){
    var $body = $('body');
    $body.on('click', '.js-add-item', function (e) {
        e.preventDefault();
        var item = $(this).data('item');
        var $visible = $('.' + item + ':visible');
        if ($visible.length >= 5) {
            showMessage('You can only add 5 ' + item + 's', 'danger');
            return;
        }
        $('.' + item + ':not(:visible)').first().show();
    });
    $body.on('click', '.js-delete-item', function (e) {
        e.preventDefault();
        var item = $(this).data('item');
        $(this).closest('.' + item).hide();
        $(this).closest('.' + item).find('input').each(function() {
            $(this).val('');
        });
    });
});

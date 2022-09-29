$(function(){

    function reposition() {
        var modal = $(this);
        var dialog = modal.find('.modal-dialog');
        modal.css('display', 'block');

        // Dividing by two centers the modal exactly, but dividing by three
        // or four works better for larger screens.
        dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
    }

    // Reposition when a modal is shown
    $('.modal').on('show.bs.modal', reposition);
    $('.modal').on('loaded.bs.modal', reposition);
    // Reposition when the window is resized
    $(window).on('resize', function() {
        $('.modal:visible').each(reposition);
    });

    var $body = $('body'),
        $modal = $('#modal');

    $modal.on('hidden.bs.modal', function(){
        $modal.find('.modal-header h4').html('');
        $modal.find('.modal-body').html('');
    });

    $body.on('click', '.modal-link', function(e){
        NProgress.start();
        e.preventDefault();
        showModal($(this));
    });

});

function showModal($that, callback){
    var $modal = $('#modal'),
        $modalDialog = $modal.find('.modal-dialog'),
        $modalBody = $modalDialog.find('.modal-body'),
        $modalHeader = $modalDialog.find('.modal-header'),
        remote = $that.attr('href'),
        title = $that.data('title'),
        icon = $that.data('icon');

    if(typeof title !== 'undefined'){
        $modalHeader.find('h4').remove();
        $modalHeader.append('<h4 class="modal-title"><i class="fa ' + icon + '"></i>' + title + '</h4>');
    }

    $modalBody.load(remote, function(){
        NProgress.done();
        $modalDialog.css("margin-top", Math.max(0, ($(window).height() - $modalDialog.height()) / 2));
        $modal.modal('show');
        if (typeof callback === 'function') {
            callback();
        }
    });
}

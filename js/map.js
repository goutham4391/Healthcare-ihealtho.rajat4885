$(document).ready(function(){
    function initializeMap($map) {
        var address = $map.data('address');
        var latlng = new google.maps.LatLng(-34.397, 150.644);
        var isDraggable = !('ontouchstart' in document.documentElement); 
        
        var mapOptions = {
            zoom: 8,
            center: latlng,
            draggable: isDraggable,
            scrollwheel: false
        };
        
        var map = new google.maps.Map($map[0], mapOptions);
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({address: address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                console.log("Geocode was not successful for the following reason: " + status);
            }
        });
    }
    $('.map').each(function(){
        if( $('.content').width() > 1024) {
            $('.map').height($('.information').height() + 30); 
        }
        
        initializeMap($(this));       
    });
});

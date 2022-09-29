var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
var PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
const ICE_SERVERS = {
    'iceServers': [
        {
            'url': 'stun:stun.l.google.com:19302'
        },
        {
            'url': 'stun:stun.schlund.de'
        },
        {
            'url': 'turn:192.158.29.39:3478?transport=udp',
            'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            'username': '28224511:1379330808'
        },
        {
            'url': 'turn:192.158.29.39:3478?transport=tcp',
            'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            'username': '28224511:1379330808'
        }
    ]
};
const CALL_OPTIONS = navigator.userAgent.toLowerCase().indexOf('chrome') > -1 ? {mandatory: {OfferToReceiveAudio: true, OfferToReceiveVideo: true}} : {mandatory: {offerToReceiveAudio: true, offerToReceiveVideo: true}};

var USER_MEDIA_OPTIONS = {
    audio: true,
    video: true
};
var MY_STREAM = null;
var IS_ANSWERED = false;
var peerConnection;
var ringtone = '#ringtone';
var COMPANION_ID;

function sendSocketData (data) {
    var preparedData = {
        type : data.type,
        my_user_id : MY_USER_ID,
        companion_id : COMPANION_ID,
        data: data
    };
    socket.emit('message', preparedData);
}

function stopRingTone () {
    $(ringtone)[0].pause();
    $(ringtone)[0].currentTime = 0;
}

function onIncomingCall (companion_id) {
    $(ringtone)[0].play();
    var $a = $('<a href="/chat/default/incoming-call?user_id=' + companion_id + '" data-title="Incoming call" class="modal-link"></a>');
    showModal($a, function(){$('#modal button.close').on('click', function (e) {e.preventDefault();endCall();});});
    $a.remove();
    setNotAcceptedCallTimer();
}

function setNotAcceptedCallTimer () {
    setTimeout(function(){if (IS_ANSWERED == false) { endCall(); }}, 30000);
}


$(document).ready(function () {
    $('body')
        .on('click', '.js-call-attempt', function (e) {
            e.preventDefault();
            COMPANION_ID = $(this).data('user_id');
            setNotAcceptedCallTimer();
            initiateCall();
        })
        .on('click', '.js-decline-call', function(e) {
            e.preventDefault();
            endCall();
        })
        .on('click', '.js-approve-call-offer', function(e){
            e.preventDefault();
            COMPANION_ID = $(this).data('user_id');
            beforeCall();
            stopRingTone();
        }).on('click', '.js-end-call', function(e){
            e.preventDefault();
            endCall();
        })
    ;
});

function createNewPeerConnection () {
    peerConnection = new PeerConnection (ICE_SERVERS);
    peerConnection.oniceconnectionstatechange = function (event) {
        if (event.currentTarget.iceConnectionState == 'disconnected') {
            endCall();
        }
    };
    peerConnection.onicecandidate = function (event) {
        if (event.candidate) {
            sendSocketData({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });
        }
    };
    return peerConnection;
}

function onError (error) {
    console.error(error, arguments);
}

function initiateCall () {
    navigator.getUserMedia(
        USER_MEDIA_OPTIONS,
        function (stream) {
            MY_STREAM = stream;
            peerConnection = createNewPeerConnection();
            sendSocketData({type: 'callerPeerConnectionReady'});
        },
        onError
    );
}

function beforeCall () {
    navigator.getUserMedia(
        USER_MEDIA_OPTIONS,
        function (stream) {
            MY_STREAM = stream;
            peerConnection = createNewPeerConnection();
            sendSocketData({type: 'calleePeerConnectionReady'});
        },
        onError
    );
}

function createOffer () {
    peerConnection.addStream(MY_STREAM);
    peerConnection.createOffer(
        function (description) {
            peerConnection.setLocalDescription(description);
            sendSocketData(description);
        },
        onError,
        CALL_OPTIONS
    );
}

function onOfferReceived (message) {
    peerConnection.addStream(MY_STREAM);
    peerConnection.setRemoteDescription(new SessionDescription(message.data), function () {
        peerConnection.createAnswer(
            function (description){
                peerConnection.setLocalDescription(description);
                sendSocketData(description);
                startStreaming (message);
            },
            onError,
            CALL_OPTIONS
        );
    });
}

function onAnswerReceived (message) {
    peerConnection.setRemoteDescription(new SessionDescription(message.data), function () {
        startStreaming(message)
    });
}

function startStreaming (message) {
    IS_ANSWERED = true;
    var localStream = peerConnection.getLocalStreams()[0];
    var remoteStream = peerConnection.getRemoteStreams()[0];
    var $a = $('<a href="/chat/default/call?user_id=' + message.companion_id + '" data-title="Calling..." class="modal-link"></a>');
    showModal($a, function(){
        $('#callContainer').show();
        $('#localVideo').attr('src', URL.createObjectURL(localStream));
        $('#remoteVideo').attr('src', URL.createObjectURL(remoteStream));
        $('#modal button.close').on('click', function (e) {
            e.preventDefault();
            endCall();
        });
    });
    $a.remove();
}

function onCandidate (message) {
    var candidate = new IceCandidate({sdpMLineIndex: message.data.label, candidate: message.data.candidate});
    peerConnection.addIceCandidate(candidate);
}

function endCall () {
    var i, j, tracks;
    var streams = [];
    if (typeof peerConnection.getLocalStreams()[0] !== 'undefined') {
        streams.push(peerConnection.getLocalStreams()[0]);
    }
    if (typeof peerConnection.getRemoteStreams()[0] !== 'undefined') {
        streams.push(peerConnection.getRemoteStreams()[0]);
    }
    for (i in streams) {
        if (streams.hasOwnProperty(i)) {
            tracks = streams[i].getTracks();
            for (j in tracks) {
                if (tracks.hasOwnProperty(j)) {
                    tracks[j].stop();
                }
            }
        }
    }
    peerConnection.close();
    peerConnection = createNewPeerConnection();
    if (typeof callEndedCallback === 'function') {
        callEndedCallback();
    }
}

//callbacks
function callEndedCallback () {
    var $ringTone = $('#ringtone');
    $ringTone[0].pause();
    $ringTone[0].currentTime = 0;
    showMessage('Call ended', 'warning');
    $('#modal').modal('hide');
}

if (typeof MY_USER_ID !== 'undefined') {
    var socket = io.connect('https://' + window.location.hostname + ':10033', {query: 'user_id=' + MY_USER_ID});
    socket.on('message', function (message){
        console.log(new Date($.now()).getMilliseconds(), message);
        switch (message.type) {
            case 'callerPeerConnectionReady':
                onIncomingCall (message.my_user_id);
                break;
            case 'calleePeerConnectionReady':
                createOffer();
                break;
            case 'offer':
                onOfferReceived(message);
                break;
            case 'answer':
                onAnswerReceived(message);
                break;
            case 'candidate':
                onCandidate(message);
                break;
            default:
                console.log(message);
                break;
        }
    });
}

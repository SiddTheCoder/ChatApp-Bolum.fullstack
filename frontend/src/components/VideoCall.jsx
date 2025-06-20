import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../context/SocketContext';

const VideoCall = () => {
  const { socket } = useSocket();

  const [isCalling, setIsCalling] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        peerConnectionRef.current = new RTCPeerConnection({
          iceServers: [
            {
              urls: 'stun:stun.l.google.com:19302',
            },
          ],
        });

        // Add local stream tracks to the peer connection
        stream.getTracks().forEach((track) => {
          peerConnectionRef.current.addTrack(track, stream);
        });

        // Handle remote stream
        peerConnectionRef.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // Send ICE candidates
        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('ice-candidate', event.candidate);
          }
        };
      } catch (err) {
        console.error('Error accessing media devices:', err);
      }
    };

    getMedia();

    // Signaling: when receiving offer
    socket.on('offer', async (offer) => {
      console.log('📩 Received Offer');
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.emit('answer', answer);
      }
    });

    // Signaling: when receiving answer
    socket.on('answer', async (answer) => {
      console.log('📩 Received Answer');
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    // Signaling: when receiving ICE candidate
    socket.on('ice-candidate', async (candidate) => {
      console.log('📩 Received ICE candidate');
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    });

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      if (peerConnectionRef.current) peerConnectionRef.current.close();
    };
  }, [socket]);

  const startCall = async () => {
    if (peerConnectionRef.current) {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit('offer', offer);
      setIsCalling(true);
    }
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setIsCalling(false);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="fixed z-50 top-20 right-5 p-4 bg-white border border-purple-300 rounded-xl shadow-lg w-[350px]">
      <div className="flex flex-col gap-3 items-center">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-[180px] bg-black rounded-md object-cover"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-[180px] bg-black rounded-md object-cover"
        />

        <div className="flex gap-4">
          {!isCalling ? (
            <button
              onClick={startCall}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              Start Call
            </button>
          ) : (
            <button
              onClick={endCall}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              End Call
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;

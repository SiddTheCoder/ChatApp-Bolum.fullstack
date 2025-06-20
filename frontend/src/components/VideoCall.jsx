// frontend/src/components/VideoCall.js
import { useEffect, useRef, useState } from 'react';
import { useSocket } from '../context/SocketContext'

const VideoCall = () => {
  const {socket} = useSocket()
  const [isCalling, setIsCalling] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        peerConnectionRef.current = new RTCPeerConnection();

        stream.getTracks().forEach(track => peerConnectionRef.current.addTrack(track, stream));

        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('ice-candidate', event.candidate);
          }
        };

        peerConnectionRef.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };
      } catch (err) {
        console.error('Error accessing media devices.', err);
      }
    };

    getMedia();

    socket.on('offer', async (offer) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        socket.emit('answer', answer);
      }
    });

    socket.on('answer', async (answer) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on('ice-candidate', async (candidate) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error('Error adding received ICE candidate', err);
        }
      }
    });

    return () => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);

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
      setIsCalling(false);
    }
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
      <div>
        {isCalling ? (
          <button onClick={endCall}>End Call</button>
        ) : (
          <button onClick={startCall}>Start Call</button>
        )}
      </div>
    </div>
  );
};

export default VideoCall;

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import SimplePeer from 'simple-peer';
import { useSelector, useDispatch } from 'react-redux';
import { joinRoom, leaveRoom, addMessage, setLocalStream, addPeer } from '../redux/liveSlice';
import { serverUrl } from '../App';
import axios from 'axios';
import useScreenshotPrevention from '../customHooks/useScreenshotPrevention';

const LiveStream = () => {
  useScreenshotPrevention(lectureId);

  const { lectureId } = useParams();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { currentRoom, messages, localStream, peers, isEducator } = useSelector((state) => state.live);

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const videoRef = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    if (!userData) return;

    // Join live session via API
    const joinSession = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/live/join-live/${lectureId}`, { withCredentials: true });
        const { roomId } = res.data;
        dispatch(joinRoom({ roomId, isEducator: userData.role === 'educator' }));

        // Connect to Socket.io
        const newSocket = io(serverUrl);
        setSocket(newSocket);

        newSocket.emit('join-room', roomId);

        newSocket.on('user-connected', (peerId) => {
          if (isEducator) {
            // Create offer for new peer
            const peer = createPeer(peerId, newSocket, true);
            peersRef.current.push(peer);
            dispatch(addPeer({ id: peerId }));
          }
        });

        newSocket.on('offer', ({ offer, sender }) => {
          const peer = createPeer(sender, newSocket, false, offer);
          peersRef.current.push(peer);
          dispatch(addPeer({ id: sender }));
        });

        newSocket.on('answer', ({ answer, sender }) => {
          const peer = peersRef.current.find(p => p.peerId === sender);
          if (peer) peer.signal(answer);
        });

        newSocket.on('ice-candidate', ({ candidate, sender }) => {
          const peer = peersRef.current.find(p => p.peerId === sender);
          if (peer) peer.signal(candidate);
        });

        newSocket.on('receive-message', (data) => {
          dispatch(addMessage(data));
        });

        // Get local stream
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
          dispatch(setLocalStream(stream));
          if (videoRef.current) videoRef.current.srcObject = stream;
        });

      } catch (error) {
        console.error('Failed to join live session:', error);
      }
    };

    joinSession();

    return () => {
      if (socket) socket.disconnect();
      dispatch(leaveRoom());
    };
  }, [dispatch, lectureId, userData]);

  const createPeer = (peerId, socket, isInitiator = false, offer = null) => {
    const peer = new SimplePeer({
      initiator: isInitiator,
      trickle: false,
      stream: localStream,
    });

    peer.on('signal', (data) => {
      if (!data.candidate && !data.type) return;
      socket.emit(data.type === 'offer' ? 'offer' : data.type === 'answer' ? 'answer' : 'ice-candidate', {
        ...data,
        roomId: currentRoom,
      });
    });

    peer.on('stream', (stream) => {
      // Add remote video element dynamically
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      video.className = 'w-64 h-48 object-cover rounded';
      video.oncontextmenu = (e) => e.preventDefault();
      video.ondragstart = (e) => e.preventDefault();
      document.getElementById('remote-videos').appendChild(video);
    });

    if (offer) peer.signal(offer);

    return { peer, peerId };
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('send-message', { message, roomId: currentRoom });
      dispatch(addMessage({ message, sender: userData.name, timestamp: new Date() }));
      setMessage('');
    }
  };

  if (!currentRoom) return <div>Loading live session...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-4">
        {/* Local Video */}
        <div className="mb-4">
          <video ref={videoRef} muted className="w-64 h-48 object-cover rounded" onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} />
          <p>{isEducator ? 'Your Stream (Educator)' : 'Your Stream'}</p>
        </div>

        {/* Remote Videos */}
        <div id="remote-videos" className="grid grid-cols-2 gap-4 mb-4"></div>
      </div>

      {/* Chat */}
      <div className="w-80 bg-white border-l p-4">
        <h2 className="text-lg font-bold mb-4">Live Chat</h2>
        <div className="h-96 overflow-y-auto mb-4 border p-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-2 ${msg.sender === userData.name ? 'text-right' : 'text-left'}`}>
              <span className="font-semibold">{msg.sender}: </span>
              <span>{msg.message}</span>
              <span className="text-xs text-gray-500 ml-2">{msg.timestamp.toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border p-2 rounded-l"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 rounded-r">Send</button>
        </form>
      </div>
    </div>
  );
};

export default LiveStream;

'use client'
import React,{useEffect,useRef,useState} from 'react';


interface WebcamOverlayProps {
    stream: MediaStream | null;
    mirror: boolean;
  }

const WebcamOverlay:React.FC<WebcamOverlayProps> = ({ stream, mirror }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPipEnabled, setIsPipEnabled] = useState(false);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

//   useEffect(() => {
//     const enablePiP = async () => {
//       if (videoRef.current && document.pictureInPictureEnabled) {
//         try {
//           if (document.pictureInPictureElement !== videoRef.current) {
//             await videoRef.current.requestPictureInPicture();
//           }
//         } catch (error) {
//           console.error('Failed to enter Picture-in-Picture mode', error);
//         }
//       }
//     };

//     enablePiP();

//     return () => {
//       if (document.pictureInPictureElement) {
//         document.exitPictureInPicture().catch(console.error);
//       }
//     };
//   }, []);

// useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     const enablePiP = async () => {
//       if (document.pictureInPictureEnabled && !isPipEnabled) {
//         try {
//           await video.requestPictureInPicture();
//           setIsPipEnabled(true);
//         } catch (error) {
//           console.error('Failed to enter Picture-in-Picture mode', error);
//         }
//       }
//     };

//     const handleLoadedMetadata = () => {
//       video.play().then(enablePiP).catch(console.error);
//     };

//     video.addEventListener('loadedmetadata', handleLoadedMetadata);

//     return () => {
//       video.removeEventListener('loadedmetadata', handleLoadedMetadata);
//       if (document.pictureInPictureElement === video) {
//         document.exitPictureInPicture().catch(console.error);
//       }
//     };
//   }, [isPipEnabled]);

  return (
    // <video 
    //   ref={videoRef} 
    //   autoPlay 
    //   muted 
    //   style={{ 
    //     position: 'fixed',
    //     bottom: '10px',
    //     right: '10px',
    //     width: '20%',
    //     maxHeight: '20%',
    //     objectFit: 'contain',
    //     backgroundColor: 'black',
    //     border: '2px solid white',
    //     transform: mirror ? 'scaleX(-1)' : 'none',
    //     zIndex: 9999,
    //     //height: '150px',
    //     //borderRadius: '8px',
    //     //overflow: 'hidden'
    //   }} 
    // />
    <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 10000,
        width: '200px',
        height: '150px',
        backgroundColor: 'black',
        border: '2px solid white',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            transform: mirror ? 'scaleX(-1)' : 'none',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
  );
    
}
export default WebcamOverlay;




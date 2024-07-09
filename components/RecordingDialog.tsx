'use client'
import React,{useCallback, useState} from 'react';
import { useSearchParams } from 'next/navigation';
import {useRef,useEffect} from 'react';
import { CiDesktop } from "react-icons/ci";
import { GoDeviceCameraVideo } from "react-icons/go";
import { MdSplitscreen } from "react-icons/md";
import { PiDeviceTabletCameraFill } from "react-icons/pi";
import { createRoot,Root } from 'react-dom/client';
import WebcamOverlay from './WebcamOverlay';
import axios from "axios";
import { useVideos } from '@/context/VideosContext';
//import { broadcastChannel } from '@/broadcast';

type RecordingDialogProps = {
    open:boolean,
    onClose:()=>void
};
interface CaptureOptions {
    video: boolean;
    audio: boolean;
    screen: boolean;
    mirror: boolean;
  }

const RecordingDialog:React.FC<RecordingDialogProps> = React.memo(({open,onClose}) => {
    const [countdownChecked,setCountdownChecked] = useState(true)
    const [bgBlurChecked,setbgBlurChecked] = useState(true)
    const [mirrorCameraChecked,setmirrorCameraChecked] = useState(true)
    const [isRecording, setIsRecording] = useState(false);
    const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [errorMessage, setErrorMessage] = React.useState('')
    const {videos,setVideos,refreshVideos} = useVideos()
    const [showOverlay, setShowOverlay] = useState(false);
    const broadcastChannel = useRef<BroadcastChannel | null>(null);
    const [isUploading, setIsUploading] = React.useState(false)
    const [isUnmounting, setIsUnmounting] = useState(false);
    const apiKey = process.env.NEXT_PUBLIC_VIDEO_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_VIDEO_API_SECRET;
    const [options, setOptions] = useState<CaptureOptions>({
        video: true,
        audio: true,
        screen: true,
        mirror: mirrorCameraChecked,
      });

    const [uploadStatus, setUploadStatus] = useState<string>('');
    const recorderRef = useRef<MediaRecorder | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null);
    const webcamVideoRef = useRef<HTMLVideoElement>(null);
    const popupWindowRef = useRef<Window | null>(null);
    const handleClose = useCallback(() => {
      setIsUnmounting(true);
      // Delay the actual closing to allow for unmounting
      setTimeout(() => {
        onClose();
        setIsUnmounting(false);
      }, 0);
    }, [onClose]);
  
    // ... (keep the VideoApi configuration as before)
  
    const captureMedia = async (options: CaptureOptions): Promise<MediaStream> => {
      let captureStream: MediaStream | null = null;
      
      if (options.screen) {
        try {
          captureStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: options.audio,
            
          });
        } catch (error) {
          console.error("Error capturing screen:", error);
        }
      }
  
      if (options.video) {
        try {
          const webcamStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: options.audio && !captureStream // Only capture audio if not already captured
          });
          setWebcamStream(webcamStream);
  
          if (!captureStream) {
            captureStream = webcamStream;
          }
        } catch (error) {
          console.error("Error capturing webcam:", error);
        }
      }
  
      if (!captureStream) {
        throw new Error("No media captured");
      }
  
      return captureStream;
    };

    const getSignedURL = async () => {
      try {
          const response = await axios({
              url:'https://api.thetavideoapi.com/upload', 
              method:"POST",
              headers: {
                  'x-tva-sa-id':apiKey,
                  'x-tva-sa-secret':apiSecret
              }
          });
          return response.data.body.uploads[0];
      } catch (error) {
          console.error('Error fetching signed URL:', error);
      }
  }


  const getvids = async () => {
    try {
      
        const response = await axios.get(`https://api.thetavideoapi.com/video/${apiKey}/list`, {
            headers: {
                'x-tva-sa-id': apiKey,
                'x-tva-sa-secret': apiSecret
            }
        });
        console.log('vidssssssssssssssss',response.data.body)
        return response.data.body;
    } catch (error) {
        console.error('Error fetching signed URL:', error);
    }
}

const transcodeVideo = async(id:string)=>{
  try {
    setIsUploading(true);
    const response = await axios({
      method:"POST",
      url:'https://api.thetavideoapi.com/video',
      data:JSON.stringify({source_upload_id:id,playback_policy:"public",resolutions:[360,720]}), 
      headers: {
            'x-tva-sa-id': apiKey,
            'x-tva-sa-secret': apiSecret,
            'Content-Type': 'application/json'
        },
      });
    setUploadStatus(response.data.body.state)
    console.log(response.data.body,'transcode response data');
    //setIsUploading(false);
} catch (error) {
    ////setTranscodingId('');
    //const errorMessage = videoURL ? 'Invalid video URL. Please fix and then try again.' : 'Error starting Video transcoding';
    setErrorMessage(errorMessage);
    console.error('Error fetching transcoding Video:', error);
}finally{
  setIsUploading(false)
}
}
  

  
  
    const startRecording = async () => {
      try {
        const mediaStream = await captureMedia(options);
        setStream(mediaStream);
  
        const recorder = new MediaRecorder(mediaStream, { mimeType: 'video/mp4' });
        recorderRef.current = recorder;
  
        const chunks: Blob[] = [];
        recorder.ondataavailable = (event: BlobEvent) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
            console.log(chunks,'chunkssssssssssssssssssssssssssssssssssssssssssssss')
          }
        };
  
        recorder.onstop = async() => {
          if(chunks){try{
            const blob = new Blob(chunks, { type: 'video' });
            const file = new File([blob], 'video.mp4', { type: 'video/mp4; codecs=vp8' });
            // const videourl = URL.createObjectURL(blob)
            // const a = document.createElement('a')
            // a.href=videourl
            // a.download = 'test.webm'
            // a.click()
            //const matroskaFileName = 'example_video.mkv';
            
          //setIsUploading(true)
          
          getvids()
            const uploads = await getSignedURL()
            console.log(uploads,'uploadddddddddddddddddddddddddddddddddddddddddddddddddd')
            const signedURL = uploads.presigned_url;
            const uploadId = uploads.id;
            console.log(signedURL,'signedurl')
            if (!signedURL) {
              console.error('Failed to get signed URL.');
              setErrorMessage('Failed to get signed URL.')
              return;
          }

          // const matroskaFile = new File([blob], matroskaFileName, {
          //   type: blob.type,
          //   lastModified: new Date().getTime()
          // });

          await axios.put(signedURL, blob, {
              headers: {
                  'Content-Type': 'application/octet-stream',
              }
          });
          await transcodeVideo(uploadId);
          }catch(error){
            //setIsUploading(false)
            console.error('Error uploading the file:', error);
          }}
          
        };
  
        recorder.start();
        //openPopupWindow()
        setIsRecording(true);
        // Broadcast the webcam stream
        if (webcamStream) {
          setIsRecording(true);
        }
      } catch (error) {
        console.error("Failed to start recording:", error);
      }
    };
  
    const stopRecording = () => {
      if (recorderRef.current && stream) {
        recorderRef.current.stop();
        stream.getTracks().forEach(track => track.stop());
        if (webcamStream) {
          webcamStream.getTracks().forEach(track => track.stop());
        }
        
        setIsRecording(false);
        setStream(null);
        setWebcamStream(null);
      }
    };
  
    // ... (keep the uploadToTheta function as before)
  
    useEffect(() => {
      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      if (webcamStream && webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = webcamStream;
        //webcamVideoRef.current.style.transform = options.mirror ? 'scaleX(-1)' : 'none';
      }
    }, [stream, webcamStream, ]);
    // useEffect(() => {
    //   broadcastChannel.current = new BroadcastChannel('webcam_overlay');
    //   return () => {
    //     broadcastChannel.current?.close();
    //   };
    // }, []);
    // const toggleOverlay = (visible: boolean) => {
    //   setShowOverlay(visible);
    //   broadcastChannel.current?.postMessage({
    //     type: 'TOGGLE_OVERLAY',
    //     visible,
    //   });
    // };

   
    const rootRef = useRef<Root | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(()=>{
    const update_vids = async() =>{
      try{
        if(uploadStatus ==='success'){
          refreshVideos()
        }
      }catch(err){
        console.log('error updating videos',err)
      }
    }
    update_vids()
  },[uploadStatus,refreshVideos])
  
  //   useEffect(() => {
  //     if (!webcamStream && !options.video) return;
  //     const container = document.createElement('div');
  // document.body.appendChild(container);
  // const root = createRoot(container);
  
  // containerRef.current = container;
  // rootRef.current = root;
  
  // return () => {
  //   // This cleanup function will run when the component unmounts
  //   root.unmount();
  //   if (document.body.contains(container)) {
  //     document.body.removeChild(container);
  //   }
  // };
  //   }, [webcamStream && options.video]); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    containerRef.current = container;

    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
      }
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
      
    };
  }, []);
  
    // useEffect(() => {
    //   if (!rootRef.current) return;
  
    //   if (webcamStream && options.video) {
    //     rootRef.current.render(
    //       <WebcamOverlay stream={webcamStream} mirror={options.mirror} />
    //     );
    //   } else {
    //     rootRef.current.render(null);
    //   }
    // }, [webcamStream, options.video, options.mirror,isUnmounting]);


    // useEffect(() => {
    //   if (webcamStream && options.video) {
    //     if (!rootRef.current && containerRef.current) {
    //       rootRef.current = createRoot(containerRef.current);
    //     }
    //     rootRef.current?.render(
    //       <WebcamOverlay stream={webcamStream} mirror={options.mirror} />
    //     );
    //   } else if (rootRef.current) {
    //     rootRef.current.unmount();
    //     rootRef.current = null;
    //   }
    // }, [webcamStream, options.video, options.mirror]);

    useEffect(() => {
      if (options.video && webcamStream) {
        if (!containerRef.current) {
          const container = document.createElement('div');
          document.body.appendChild(container);
          containerRef.current = container;
          rootRef.current = createRoot(container);
        }
        rootRef.current?.render(
          <WebcamOverlay stream={webcamStream} mirror={options.mirror} />
        );
      } else {
        if (rootRef.current) {
          rootRef.current.unmount();
          rootRef.current = null;
        }
        if (containerRef.current) {
          document.body.removeChild(containerRef.current);
          containerRef.current = null;
        }
      }
    }, [webcamStream, options.video, options.mirror]);



    const record = ()=>{}
    
    return (
        <div className={`${open ? '': 'invisible'} w-[100%]  rounded-sm absolute top-0 h-full backdrop-filter backdrop-brightness-75 backdrop-blur-md  flex items-center justify-center`}>
          <div className='px-16 rounded-lg flex flex-col bg-neutral-900 py-2 relative'>
            <div className='absolute top-2 right-2 rounded-full bg-white text-black   w-4 h-4 flex items-center justify-center cursor-pointer' onClick={handleClose}><span className='text-xs'>X</span></div>
            <h1 className='text-2xl'>What would you like to record?</h1>
            <p className='text-xs text-gray-400 mt-1'>Select the source(s) and the settings for your recording.</p>
            <div className='flex items-center justify-around gap-5 mt-5 flex-wrap'>
                <div className='flex items-center gap-2 bg-black p-3 rounded-lg cursor-pointer'>
                    <CiDesktop className='text-blue-600'/>
                    <span className='text-xs'>Screen Only</span>
                </div>
                <div className='flex items-center gap-2 bg-black p-3 rounded-lg cursor-pointer'>
                    <PiDeviceTabletCameraFill className='text-blue-600'/>
                    <span className='text-xs'>Screen + Camera</span>
                </div>
                <div className='flex items-center gap-2 bg-black p-3 rounded-lg cursor-pointer'>
                    <MdSplitscreen className='text-blue-600'/>
                    <span className='text-xs'>Split Screen</span>
                </div>
                <div className='flex items-center gap-2 bg-black p-3 rounded-lg cursor-pointer'>
                    <GoDeviceCameraVideo className='text-blue-600'/>
                    <span className='text-xs'>Camera Only</span>
                </div>
            </div>
            <div className='flex  mt-5 gap-4'>
                <div className='flex flex-col gap-3  basis-3/6'>
                    <div className='flex flex-col'>
                        <p className='text-xs text-gray-400'>Screen</p>
                        <div className='bg-black px-2 py-2 rounded-lg mt-2 text-sm'>Screen-1</div>
                    </div>
                    <div className='flex flex-col '>
                        <p className='text-xs text-gray-400'>Camera</p>
                        <div className='bg-black px-2 py-2 rounded-lg mt-2 text-sm'>Permission Required</div>
                    </div>
                    <div className='flex flex-col'>
                        <p className='text-xs text-gray-400'>Audio</p>
                        <div className='bg-black px-2 py-2 rounded-lg mt-2 text-sm'>Permission Required</div>
                    </div>
                    <div className='flex flex-col'>
                        <p className='text-xs text-gray-400'>Quality</p>
                        <div className='bg-black px-2 py-2 rounded-lg mt-2 text-sm'>UHD-2160P</div>
                    </div>
                </div>
                <div className=' basis-3/6 flex flex-col gap-4'>
                  <div className='flex'>
                    <div>
                        <p className='text-sm font-bold'>Countdown</p>
                        <p className='text-xs text-gray-400'>3 seconds countdown before recording starts</p>
                    </div>
                    <div>
                        <label className='relative inline-flex cursor-pointer items-center'>
                            <input type='checkbox' className='peer sr-only' checked={countdownChecked} onChange={()=>setCountdownChecked(!countdownChecked)}/>
                            <div className="h-6 w-11 rounded-full border-gray-600 bg-gray-600 after:absolute after:start-[2px] after-top-0.5 after:h-5 after:w-5 after:rounded-full after:border  after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
                        </label>
                    </div>
                  </div>
                  {/**second */}
                  <div className='flex'>
                    <div>
                        <p className='text-sm font-bold'>Background Blur</p>
                        <p className='text-xs text-gray-400'>Apply a background blur effect to your camera</p>
                    </div>
                    <div>
                        <label className='relative inline-flex cursor-pointer items-center'>
                            <input type='checkbox' className='peer sr-only' checked={bgBlurChecked} onChange={()=>setbgBlurChecked(!bgBlurChecked)}/>
                            <div className="h-6 w-11 rounded-full border-gray-600 bg-gray-600 after:absolute after:start-[2px] after-top-0.5 after:h-5 after:w-5 after:rounded-full after:border  after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
                        </label>
                    </div>
                  </div>
                  {/**third */}
                  <div className='flex'>
                    <div>
                        <p className='text-sm font-bold'>Mirror Camera</p>
                        <p className='text-xs text-gray-400'>Mirror the output display of your camera</p>
                    </div>
                    <div>
                        <label className='relative inline-flex cursor-pointer items-center'>
                            <input type='checkbox' className='peer sr-only' checked={mirrorCameraChecked} onChange={()=>setmirrorCameraChecked(!mirrorCameraChecked)}/>
                            <div className="h-6 w-11 rounded-full border-gray-600 bg-gray-600 after:absolute after:start-[2px] after-top-0.5 after:h-5 after:w-5 after:rounded-full after:border  after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
                        </label>
                    </div>
                  </div>
                </div>
            </div>
            <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        
        {/* {webcamStream && options.video && (
        <video 
          ref={webcamVideoRef} 
          autoPlay 
          muted 
          style={{ 
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            width: '20%',
            maxHeight: '20%',
            objectFit: 'contain',
            backgroundColor: 'black',
            border: '2px solid white',
            transform: options.mirror ? 'scaleX(-1)' : 'none',
          }} 
        />
      )} */}
            <button className='bg-blue-600 text-black rounded-lg p-2 mt-5 flex items-center justify-center' onClick={record}> <GoDeviceCameraVideo className='mr-2 text-lg'/> <span className='text-sm'>Start recording</span></button>
           </div>
        </div>
    )
})
RecordingDialog.displayName = 'RecordingDialog';
export default RecordingDialog;
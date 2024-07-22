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
import { useContractFunction } from '@usedapp/core';
import { Contract, utils } from 'ethers';
import { workspace_abi } from '@/lib/constants';
import { useWeb3Context } from '@/context/SignUp';


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
    const [videoName,setVideoName] = useState('')
    const [workspaceName,setWorkspaceName] = useState('');
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
    const audioContextRef = useRef<AudioContext | null>(null);
    const popupWindowRef = useRef<Window | null>(null);
    const rootRef = useRef<Root | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const resolutions = [2160, 1080, 720, 360];
    const [selectedResolutions, setSelectedResolutions] = React.useState<number[]>([360]);
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
    const abiInterface = new utils.Interface(workspace_abi)
    const contract = new Contract(contractAddress, abiInterface)
    const {state: createState, send: createWorkspace}= useContractFunction(contract,'createWorkspace',{})
    const { state: uploadState, send: uploadVideoId } = useContractFunction(contract, 'addVideoToWorkspace',{});
    const { handleLogin, deactivate, account } = useWeb3Context();
    const handleClose = useCallback(() => {
      setIsUnmounting(true);
      // Delay the actual closing to allow for unmounting
      setTimeout(() => {
        onClose();
        setIsUnmounting(false);
      }, 0);
    }, [onClose]);

    function getSupportedMimeType() {
      const types = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm'
      ];
      
      for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
          console.log('Using MIME type:', type);
          return type;
        }
      }
      
      throw new Error('No supported MIME types found for MediaRecorder');
    }
    const handleCreateWorkspace = async(uploadId:string)=>{
      try{
          await createWorkspace(workspaceName,account,uploadId,{  })
      }catch(err){
          console.log('Error creating Workspace',err)
      }finally{
          setWorkspaceName('')
          
      }
    }
    const handleVideoIdUploadToBlockchain = async()=>{
      try{
          await uploadVideoId()
      }catch(err){
          console.log('Error creating Workspace',err)
      }finally{
          setWorkspaceName('')
          
      }
  }
  
    const captureMedia = async (options: CaptureOptions): Promise<MediaStream> => {
      let captureStream: MediaStream | null = null;
      let audioStream: MediaStreamTrack| null = null;
      let audioContext: AudioContext | null = null;
      let audioDestination: MediaStreamAudioDestinationNode | null = null;
      if (options.screen) {
        try {
          console.log('options.screeeeeeeeeeeeeeeeeeeeeeeeeeeeeeen')
          captureStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 },
            
          });
        } catch (error) {
          console.error("Error capturing screen:", error);
        }
      }
      if (options.audio) {
        audioContext = new AudioContext();
        audioContextRef.current = new AudioContext();
        audioDestination = audioContextRef.current.createMediaStreamDestination();
        if (captureStream) {
            const systemAudioTrack = captureStream.getAudioTracks()[0];
            if (systemAudioTrack) {
                const systemAudioSource = audioContextRef.current.createMediaStreamSource(new MediaStream([systemAudioTrack]));
                systemAudioSource.connect(audioDestination);
            }
        }

        try {
            const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const micTrack = micStream.getAudioTracks()[0];
            const micSource = audioContextRef.current.createMediaStreamSource(new MediaStream([micTrack]));
            micSource.connect(audioDestination);
        } catch (error) {
            console.error("Error capturing microphone:", error);
        }
      }
      if (options.video) {
        try {
            const webcamStream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });
            setWebcamStream(webcamStream)

            if (!captureStream) {
                captureStream = webcamStream;
            } else {
                captureStream.addTrack(webcamStream.getVideoTracks()[0]);
            }
        } catch (error) {
            console.error("Error capturing webcam:", error);
        }
      }
  
      if (!captureStream) {
        throw new Error("No media captured");
      }

      if (audioDestination) {
        audioDestination.stream.getAudioTracks().forEach(track => {
            captureStream!.addTrack(track);
        });
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
        let video_data = {
          source_upload_id:id, // 
          playback_policy:"public",
          resolution: selectedResolutions,
          //use_drm: true,
          // drm_rules: [{
          //     chain_id: 361,
          //     nft_collection: "0x7fe9b08c759ed2591d19c0adfe2c913a17c54f0c"
          // }],
          metadata:{
              name:videoName,
              description:"A recording video"
          }
      }
        const response = await axios({
          method:"POST",
          url:'https://api.thetavideoapi.com/video',
          data:JSON.stringify(video_data), 
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
        setErrorMessage('Error transcoding video');
        console.error('Error fetching transcoding Video:', error);
      }finally{
        setIsUploading(false)
      }
    }
    const startRecording = async () => {
      try { 
        const mediaStream = await captureMedia(options);
        console.log('Audio track active:', mediaStream.getAudioTracks()[0].readyState === 'live');
        setStream(mediaStream);
        const mimeType_options = { 
          mimeType: 'video/mp4',
          videoBitsPerSecond: 3000000 // 3 Mbps
        };
        console.log('Tracks being recorded:', mediaStream.getTracks().map(track => ({kind: track.kind, readyState: track.readyState})));
        const recorder = new MediaRecorder(mediaStream,   mimeType_options );
        recorderRef.current = recorder;
        const chunks: Blob[] = [];
        recorder.ondataavailable = (event: BlobEvent) => {
           if (event.data.size > 0) {
             chunks.push(event.data);
          }
        };
        mediaStream.getAudioTracks()[0].onended = () => {
           console.log('Audio track ended unexpectedly');
        };
        mediaStream.getAudioTracks().forEach((track, index) => {
          console.log(`Audio track ${index}:`, {
            label: track.label,
            settings: track.getSettings()
          });
        });
        recorder.onstop = async() => {
           if(chunks){
            try{
               const blob = new Blob(chunks, { type: 'video/mp4' });
              const videourl = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href=videourl
              a.download = `test.mp4`
              a.click()
              // const audio = new Audio(videourl);
              // audio.play();
              //setIsUploading(true)
              //getvids()
              const uploads = await getSignedURL()
              
              const signedURL = uploads.presigned_url;
              const uploadId = uploads.id;
              //console.log(signedURL,'signedurl')
              if (!signedURL) {
                 console.error('Failed to get signed URL.');
                setErrorMessage('Failed to get signed URL.')
                return;
              }
              await handleCreateWorkspace(uploadId)
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
      }
      if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().then(() => {
        console.log('AudioContext closed');
        audioContextRef.current = null;
      });
      }
      setIsRecording(false);
      setStream(null);
      setWebcamStream(null);
    };
  
    useEffect(() => {
    if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
    }
    if (webcamStream && webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = webcamStream;
        //webcamVideoRef.current.style.transform = options.mirror ? 'scaleX(-1)' : 'none';
    }
    }, [stream, webcamStream, ]);

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

    // React.useEffect(() => {
    //   setSelectedResolutions(resolutions);
    // }, []);

    const toggleResolution = (resolution: number) => {
      console.log(selectedResolutions,'selsectedresolution')
      console.log(resolution,'resolution')
      if (selectedResolutions.includes(resolution)) {
        setSelectedResolutions(prev => prev.filter(res => res !== resolution));
    } else {
        setSelectedResolutions(prev => [...prev, resolution]);
    }
    
    };

    const removeResolution = (resolution: number) => {
      setSelectedResolutions(prev => prev.filter(res => res !== resolution));
    };
    return (
        <div className={`${open ? '': 'invisible'} w-full  rounded-sm absolute top-0 h-full backdrop-filter backdrop-brightness-75 backdrop-blur-md  flex items-center justify-center`}>
          <div>
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
                        <div className='bg-black px-2 py-2 rounded-lg mt-2 text-sm'>Permission Required</div>
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
                        {/* <div className='bg-black px-2 py-2 rounded-lg mt-2 text-sm'>UHD-2160P</div> */}
                        <select  defaultValue={selectedResolutions[0]} className='bg-black text-gray-400 rounded-lg px-2 py-2 text-sm mt-2' onChange={(e)=>toggleResolution(Number(e.target.value))}>
                          <option value={360}>360</option>
                          <option value={720}>720</option>
                          <option value={1080}>1080</option>
                          <option value={2160}>2160</option>
                        </select>
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
                  {/* <div className='flex'>
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
                  </div> */}
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
                  {/**fourth */}
                  <div>
                    <p className='text-sm font-bold'>Video Name</p>
                    <input type='text' placeholder='Video Name' value={videoName} onChange={(e)=>setVideoName(e.target.value)} className='bg-black text-gray-300 rounded-lg px-2 py-2 text-sm mt-2'/>
                  </div>
                  {/*fifth*/}
                  <div>
                    <p className='text-sm font-bold'>Workspace Name</p>
                    <input type='text' placeholder='Workspace Name' value={workspaceName} onChange={(e)=>setWorkspaceName(e.target.value)} className='bg-black text-gray-300 rounded-lg px-2 py-2 text-sm mt-2'/>
                  </div>
                </div>
            </div>
            <button className='bg-blue-600 text-black rounded-lg p-2 mt-5 flex items-center justify-center' onClick={isRecording ? stopRecording : startRecording}> <GoDeviceCameraVideo className='mr-2 text-lg'/> <span className='text-sm'>{isRecording ? 'Stop Recording' : 'Start Recording'}</span></button>
          </div>
          </div>
        </div>
    )
})
RecordingDialog.displayName = 'RecordingDialog';
export default RecordingDialog;
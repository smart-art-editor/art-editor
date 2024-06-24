'use client'
import React,{useState} from 'react';
import { useSearchParams } from 'next/navigation';
import {useRef,useEffect} from 'react';
import { CiDesktop } from "react-icons/ci";
import { GoDeviceCameraVideo } from "react-icons/go";
import { MdSplitscreen } from "react-icons/md";
import { PiDeviceTabletCameraFill } from "react-icons/pi";

type RecordingDialogProps = {
    open:boolean,
    onClose:()=>void
};

const RecordingDialog:React.FC<RecordingDialogProps> = ({open,onClose}) => {
    const [countdownChecked,setCountdownChecked] = useState(true)
    const [bgBlurChecked,setbgBlurChecked] = useState(true)
    const [mirrorCameraChecked,setmirrorCameraChecked] = useState(true)
    
    return (
        <div className={`${open ? '': 'invisible'} w-[100%]  rounded-sm absolute top-0 h-full backdrop-filter backdrop-brightness-75 backdrop-blur-md  flex items-center justify-center`}>
          <div className='px-16 rounded-lg flex flex-col bg-neutral-900 py-2 relative'>
            <div className='absolute top-2 right-2 rounded-full bg-white text-black   w-4 h-4 flex items-center justify-center cursor-pointer' onClick={onClose}><span className='text-xs'>X</span></div>
            <h1 className='text-2xl'>What would you like to record?</h1>
            <p className='text-xs text-gray-400 mt-1'>Select the source(s) and the settings for your recording.</p>
            <div className='flex items-center justify-around gap-5 mt-5 flex-wrap'>
                <div className='flex items-center gap-2 bg-black p-3 rounded-lg cursor-pointer'>
                    <CiDesktop className='text-yellow-600'/>
                    <span className='text-xs'>Screen Only</span>
                </div>
                <div className='flex items-center gap-2 bg-black p-3 rounded-lg cursor-pointer'>
                    <PiDeviceTabletCameraFill className='text-yellow-600'/>
                    <span className='text-xs'>Screen + Camera</span>
                </div>
                <div className='flex items-center gap-2 bg-black p-3 rounded-lg cursor-pointer'>
                    <MdSplitscreen className='text-yellow-600'/>
                    <span className='text-xs'>Split Screen</span>
                </div>
                <div className='flex items-center gap-2 bg-black p-3 rounded-lg cursor-pointer'>
                    <GoDeviceCameraVideo className='text-yellow-600'/>
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
                            <div className="h-6 w-11 rounded-full border-gray-600 bg-gray-600 after:absolute after:start-[2px] after-top-0.5 after:h-5 after:w-5 after:rounded-full after:border  after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-yellow-600 peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
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
                            <div className="h-6 w-11 rounded-full border-gray-600 bg-gray-600 after:absolute after:start-[2px] after-top-0.5 after:h-5 after:w-5 after:rounded-full after:border  after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-yellow-600 peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
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
                            <div className="h-6 w-11 rounded-full border-gray-600 bg-gray-600 after:absolute after:start-[2px] after-top-0.5 after:h-5 after:w-5 after:rounded-full after:border  after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-yellow-600 peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"></div>
                        </label>
                    </div>
                  </div>
                </div>
            </div>
            <button className='bg-yellow-600 text-black rounded-lg p-2 mt-5 flex items-center justify-center'> <GoDeviceCameraVideo className='mr-2 text-lg'/> <span className='text-sm'>Start recording</span></button>
           </div>
        </div>
    )
}
export default RecordingDialog;
'use client'
import React from 'react';
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
    
    return (
        <div className={`${open ? '': 'invisible'} w-[100%]  rounded-sm absolute top-0 h-full backdrop-filter backdrop-brightness-75 backdrop-blur-md  flex items-center justify-center`}>
          <div className='px-16 rounded-lg flex flex-col bg-neutral-900 py-2 relative'>
            <div className='absolute top-2 right-2 rounded-full bg-white text-black   w-4 h-4 flex items-center justify-center cursor-pointer' onClick={onClose}><span className='text-xs'>X</span></div>
            <h1 className='text-2xl'>What would you like to record?</h1>
            <p className='text-xs text-gray-400 mt-1'>Select the source(s) and the settings for your recording.</p>
            <div className='flex items-center justify-around gap-5 mt-5 flex-wrap'>
                <div className='flex items-center gap-2 bg-black p-3 rounded-lg'>
                    <CiDesktop className='text-yellow-600'/>
                    <span className='text-xs'>Screen Only</span>
                </div>
                <div className='flex items-center gap-2 bg-black p-3 rounded-lg'>
                    <PiDeviceTabletCameraFill className='text-yellow-600'/>
                    <span className='text-xs'>Screen + Camera</span>
                </div>
                <div className='flex items-center gap-2 bg-black p-3 rounded-lg'>
                    <MdSplitscreen className='text-yellow-600'/>
                    <span className='text-xs'>Split Screen</span>
                </div>
                <div className='flex items-center gap-2 bg-black p-3 rounded-lg'>
                    <GoDeviceCameraVideo className='text-yellow-600'/>
                    <span className='text-xs'>Camera Only</span>
                </div>
            </div>
           </div>
        </div>
    )
}
export default RecordingDialog;
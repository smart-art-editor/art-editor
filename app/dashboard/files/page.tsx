'use client'
import React, { useState } from 'react';
import { IoMdAdd } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import RecordingDialog from '@/components/RecordingDialog';

type pageProps = {
    
};

const FilesPage:React.FC<pageProps> = () => {
    const [modalOpen,setModalOpen]=useState(false);
    return (
        <div className={`flex flex-col w-full text-white ` }>
            <div className='w-full flex items-center justify-between mt-5 p-4'>
                <h2 className='text-2xl'>My Record</h2>
                <div></div>
            </div>
            <div className='flex flex-wrap items-center justify-between gap-3 mt-10 p-4'>
                <div className='border border-blue-600 p-2 rounded-lg text-sm'><span>Videos</span></div>
                <div className='border border-blue-600 p-2 rounded-lg text-sm'><span>Folders</span></div>
                <div className='flex flex-1 items-center border border-blue-600 rounded-lg p-2'>
                    <input type='text' placeholder='Search video or file' className='flex-1 text-sm outline-none bg-transparent'/>
                    <CiSearch className=' h-full text-lg cursor-pointer'/>
                </div>
                <button className='flex items-center p-2 rounded-lg bg-blue-600 text-sm' onClick={()=>setModalOpen(true)}><IoMdAdd/> <span className='ml-1'>New Video</span></button>
            </div>
            <div className='p-4'>
             <hr className="border-t border-blue-600 mt-5"></hr>
            </div>
            {modalOpen && <RecordingDialog open={modalOpen} onClose={()=>setModalOpen(false)}/>}
            
            <div className='mt-10 flex items-center justify-center p-4'>
                <p>You have not taken any records yet</p>
            </div>
        </div>
    )
}
export default FilesPage;
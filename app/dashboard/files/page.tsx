'use client'
import React, { useCallback, useState,useEffect } from 'react';
import { IoMdAdd } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import dynamic from 'next/dynamic';
import axios from "axios";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { TimeAgoComponent } from '@/components/TimeAgo';
import { DurationComponent } from '@/components/Duration';
const RecordingDialog = dynamic(() => import('@/components/RecordingDialog'), { ssr: false });

type pageProps = {
    
};

interface Video {
    id: number;
    name: string;
    playback_uri:string;
    create_time:string;
    update_time:string;
    service_account_id:string;
    file_name:string | null;
    state:string;
    sub_state:string;
    source_uri:string;
    source_upload_id:string;
    playback_policy:string;
    progress:number;
    error: string |null;
    duration:string;
    resolution:number;
    metadata:{}
  }

const FilesPage:React.FC<pageProps> = () => {
    const [modalOpen,setModalOpen]=useState(false);
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
    }, []);
    const apiKey = process.env.NEXT_PUBLIC_VIDEO_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_VIDEO_API_SECRET;
    
    useEffect(()=>{
        console.log('ttttttttttttttttttttttttttttttttttt')
        const getvids = async() => {
            try {
                console.log('agaiiiiiiiiiiiiin')
                setLoading(true)
                const response = await axios.get(`https://api.thetavideoapi.com/video/${apiKey}/list`, {
                    headers: {
                        'x-tva-sa-id': apiKey,
                        'x-tva-sa-secret': apiSecret
                    }
                });
                console.log(response)
                setVideos(response.data.body.videos)
                console.log('vidssssssssssssssss',response.data.body)
                return response.data.body;
            } catch (error) {
                console.error('Error fetching signed URL:', error);
            }finally {
                setLoading(false);
        }} 
        getvids()},[])
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
            {modalOpen && <RecordingDialog open={modalOpen} onClose={handleCloseModal} />}
            
            <div className='mt-10 p-4 '>
                {/* {loading && <p>Loading</p>} */}
                {loading ? (
                    <p className='text-center w-full text-3xl'>Loading....</p>
                    ):(<>
                {videos.length > 0 ? (
                    <div className='w-full flex  flex-wrap gap-3  items-center'>
                        {videos.map((video)=>(
                            <div
                             key={video.id}
                             className='rounded-sm'
                             style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection:'column',
                                padding:'3px',
                                backgroundColor:'white',
                                
                              }}>
                            <iframe src={`https://player.thetavideoapi.com/video/${video.id}`}
                            allowFullScreen          
                            style={{
                                display:'flex',
                                alignItems:'center',
                                justifyContent:'center',
                                width: '100%',               
                            }}/>
                            <div className='flex flex-col w-full mt-3 px-1'>
                                <div className='flex items-center justify-between w-full text-gray-500 text-sm'>
                                    <TimeAgoComponent dateString={video.create_time} />
                                    <DurationComponent duration={Number(video.duration)} />
                                    
                                </div>
                            </div>
                           </div>
                        ))}
                    </div>):(<p  className='text-center w-full '>You have not taken any recordings yet</p>)}</>)}
                
            </div>
        </div>
    )
}
export default FilesPage;
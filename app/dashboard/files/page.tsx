'use client'
import React, { useCallback, useState,useEffect } from 'react';
import { IoMdAdd } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import dynamic from 'next/dynamic';
import axios from "axios";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { TimeAgoComponent } from '@/components/TimeAgo';
import { DurationComponent } from '@/components/Duration';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import WorkspaceList from '@/components/WorkSpaceList';
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
    resolution:number[];
    metadata:{
        name:string|null,
        description:string|null
    }
  }

export default function FilesPage () {
    const [modalOpen,setModalOpen]=useState(false);
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [videosPerPage, setVideosPerPage] = useState(6);
    const lastVideoIndex = currentPage * videosPerPage;
    const firstVideoIndex = lastVideoIndex - videosPerPage;
    const currentVideos = videos.slice(firstVideoIndex, lastVideoIndex);
    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
    }, []);
    const apiKey = process.env.NEXT_PUBLIC_VIDEO_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_VIDEO_API_SECRET;
    
    useEffect(()=>{
       
        const getvids = async() => {
            try {
                
                setLoading(true)
                const response = await axios.get(`https://api.thetavideoapi.com/video/${apiKey}/list`, {
                    headers: {
                        'x-tva-sa-id': apiKey,
                        'x-tva-sa-secret': apiSecret
                    }
                });
                
                setVideos(response.data.body.videos)
                console.log(response.data.body.videos)
                
                return response.data.body;
            } catch (error) {
                console.error('Error fetching signed URL:', error);
            }finally {
                setLoading(false);
        }} 
        getvids()},[])
    return (
        <div className={`flex flex-col w-full text-white h-full relative ` }>
            <div className='w-full flex items-center justify-between mt-5 p-4'>
                <h2 className='text-2xl'>My Record</h2>
                <div></div>
            </div>
            <div className='flex flex-wrap items-center justify-between gap-3 mt-10 p-4'>
                <div className='border border-blue-600 p-2 rounded-lg text-sm'><span>Videos</span></div>
                <div className='border border-blue-600 p-2 rounded-lg text-sm'><span>Livestreams</span></div>
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
                     <WorkspaceList videos={currentVideos}/>
                {/* {currentVideos.length > 0 ? (
                    <div className='w-full max-h-[70%]  flex  flex-wrap gap-3  items-center justify-center'>
                      <WorkspaceList videos={currentVideos}/> */}
                        {/* {currentVideos.map((video)=>(
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
                            {video.metadata.name && <h2 className='text-black'>{video.metadata.name}</h2>}
                            {video.metadata.description && <h2 className='text-black'>{video.metadata.description}</h2>}
                           </div>
                        ))} */}
                    {/* </div>):(<p  className='text-center w-full '>You have not taken any recordings yet</p>)} */}
                    </>)}
                
            </div>
            {/* <div className='w-full flex items-center justify-center '>
            <PaginationSection
                    totalVideos={videos?.length}
                    videosPerPage={videosPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
            /> 
            </div> */}
        </div>
    )
}
//export default FilesPage;

function PaginationSection({
    totalVideos,
    videosPerPage,
    currentPage,
    setCurrentPage,
  }: {
    totalVideos: any;
    videosPerPage: any;
    currentPage: any;
    setCurrentPage: any;
  }) {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalVideos / videosPerPage); i++) {
      pageNumbers.push(i);
    }
  
    const maxPageNum = 5; // Maximum page numbers to display at once
    const pageNumLimit = Math.floor(maxPageNum / 2); // Current page should be in the middle if possible
  
    let activePages = pageNumbers.slice(
      Math.max(0, currentPage - 1 - pageNumLimit),
      Math.min(currentPage - 1 + pageNumLimit + 1, pageNumbers.length)
    );
  
    const handleNextPage = () => {
      if (currentPage < pageNumbers.length) {
        setCurrentPage(currentPage + 1);
      }
    };
  
    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
  
    // Function to render page numbers with ellipsis
    const renderPages = () => {
      const renderedPages = activePages.map((page, idx) => (
        <PaginationItem
          key={idx}
          className={currentPage === page ? "bg-neutral-100 rounded-md text-blue-600" : ""}
        >
          <PaginationLink onClick={() => setCurrentPage(page)}>
            {page}
          </PaginationLink>
        </PaginationItem>
      ));
  
      // Add ellipsis at the start if necessary
      if (activePages[0] > 1) {
        renderedPages.unshift(
          <PaginationEllipsis
            key="ellipsis-start"
            onClick={() => setCurrentPage(activePages[0] - 1)}
          />
        );
      }
  
      // Add ellipsis at the end if necessary
      if (activePages[activePages.length - 1] < pageNumbers.length) {
        renderedPages.push(
          <PaginationEllipsis
            key="ellipsis-end"
            onClick={() =>
              setCurrentPage(activePages[activePages.length - 1] + 1)
            }
          />
        );
      }
  
      return renderedPages;
    };
  
    return (
      <div>
        <Pagination className='border border-blue-500 rounded mx-4   flex items-center '>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={handlePrevPage} />
            </PaginationItem>
  
            {renderPages()}
  
            <PaginationItem>
              <PaginationNext onClick={handleNextPage} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  }
// 'use client'
// import React, { useEffect, useMemo, useState } from 'react';
// import { useCall, useEthers } from '@usedapp/core';
// import { Contract, utils } from 'ethers';
// import { Interface } from '@ethersproject/abi';
// import { workspace_abi } from '@/lib/constants';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"


// const abiInterface = new utils.Interface(workspace_abi)
// const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
// const contract = new Contract(contractAddress, abiInterface)

// interface Workspace {
//   id: number;
//   name: string;
//   creator: string;
//   participants: string[];
//   videoIds: string[];
// }
// interface Video {
//   id: number;
//   name: string;
//   playback_uri:string;
//   create_time:string;
//   update_time:string;
//   service_account_id:string;
//   file_name:string | null;
//   state:string;
//   sub_state:string;
//   source_uri:string;
//   source_upload_id:string;
//   playback_policy:string;
//   progress:number;
//   error: string |null;
//   duration:string;
//   resolution:number[];
//   metadata:{
//       name:string|null,
//       description:string|null
//   }
// }

// export default function WorkspaceDetails({ id,workspaceVids }: { id: number,workspaceVids:Video[] }) {
//   const { account } = useEthers();
  
//   const { value, error } = useCall({
//     contract: contract,
//     method: 'getWorkspaceDetails',
//     args: [id]
//   }) ?? {};

//   // if (error) {
//   //   console.error(`Error fetching workspace ${id}:`, error);
//   //   return null;
//   // }
//   useEffect(() => {
//     if (error) {
//       console.error(`Error fetching workspace ${id}:`, error);
//     }
//   }, [error, id]);

//   if (!value) return null;

//   const [name, creator, participants, videoIds] = value;
//   // const filteredVideos = workspaceVids.filter(video => videoIds.includes(video?.source_upload_id));
//   // console.log('filteredvideos',filteredVideos)
//   // Memoize the filteredVideos calculation
//   const filteredVideos = useMemo(() => {
//     return workspaceVids.filter(video => videoIds.includes(video.source_upload_id));
//   }, [workspaceVids, videoIds]);

//   // Log filteredVideos only when it changes
//   useEffect(() => {
//     console.log('filteredVideos', filteredVideos);
//   }, [filteredVideos]);
//   if (!participants.includes(account)) return null;

//   return (
//     <div>
//       <h1>{id}</h1>
//       <h3>{name}</h3>
//       <p>Creator: {creator}</p>
//       <p>Participants: {participants.join(', ')}</p>
//       <p>Videos: {videoIds.join(', ')}</p>
      
//       <Accordion type="single" collapsible>
//         <AccordionItem value="item-1">
//           <AccordionTrigger>{name}</AccordionTrigger>
//           <AccordionContent>
//              Yes. It adheres to the WAI-ARIA design pattern.
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>

//     </div>
//   );
// }


'use client'
import React, { useEffect, useState } from 'react';
import { useCall, useEthers } from '@usedapp/core';
import { Contract, utils } from 'ethers';
import { Interface } from '@ethersproject/abi';
import { workspace_abi } from '@/lib/constants';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TimeAgoComponent } from './TimeAgo';
import { DurationComponent } from './Duration';
import ParticipantDisplay from './ParticipantDisplay';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const abiInterface = new utils.Interface(workspace_abi)
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
const contract = new Contract(contractAddress, abiInterface)

interface Workspace {
  id: number;
  name: string;
  creator: string;
  participants: string[];
  videoIds: string[];
}

interface Video {
  id: number;
  name: string;
  playback_uri: string;
  create_time: string;
  update_time: string;
  service_account_id: string;
  file_name: string | null;
  state: string;
  sub_state: string;
  source_uri: string;
  source_upload_id: string;
  playback_policy: string;
  progress: number;
  error: string | null;
  duration: string;
  resolution: number[];
  metadata: {
    name: string | null,
    description: string | null
  }
}

export default function WorkspaceDetails({ id, workspaceVids }: { id: number, workspaceVids: Video[] }) {
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage, setVideosPerPage] = useState(6);
  const lastVideoIndex = currentPage * videosPerPage;
    const firstVideoIndex = lastVideoIndex - videosPerPage;
    const currentVideos = filteredVideos.slice(firstVideoIndex, lastVideoIndex);
  const { account } = useEthers();
  const { value, error } = useCall({ contract: contract, method: 'getWorkspaceDetails', args: [id] }) ?? {};


  useEffect(() => {
    if (error) {
      console.error(`Error fetching workspace ${id}:`, error);
    }
  }, [error, id]);

  useEffect(() => {
    if (value) {
      const [name, creator, participants, videoIds] = value;
      const filtered = workspaceVids.filter(video => videoIds.includes(video?.source_upload_id));
      setFilteredVideos(filtered);
      console.log('filteredVideos', filtered);
    }
  }, [value, workspaceVids]);

  if (!value) return null;
  const [name, creator, participants, videoIds] = value;

  if (!participants.includes(account)) return null;

  return (
    <div>
      {/* <h1>{id}</h1>
      <h3>{name}</h3>
      <p>Creator: {creator}</p>
      <p>Participants: {participants.join(', ')}</p>
      <p>Videos: {videoIds.join(', ')}</p> */}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className='flex items-center no-underline'>{name} Workspace </AccordionTrigger>
          <AccordionContent>
            <div className='w-full max-h-[70%]  flex  flex-wrap gap-3  items-center justify-center'>
              {currentVideos.map((video)=>(
                            <div
                             key={video.id}
                             className='rounded-sm'
                             style={{
                                display: 'flex',
                                justifyContent: 'center',
                                
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
                            {video.metadata.name && <h2 className='text-black  text-xl'>{video.metadata.name}</h2>}
                            {video.metadata.description && <h2 className='text-black'>{video.metadata.description}</h2>}
                           </div>
                        ))}
                        
            </div>
            <div>
            <PaginationSection
                    totalVideos={filteredVideos?.length}
                    videosPerPage={videosPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
            /> 
            </div>
            
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}


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
      <Pagination className='border border-blue-500 rounded mt-4  flex items-center '>
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
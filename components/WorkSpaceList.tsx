'use client'
import React,{ useEffect, useState } from "react";
import { BigNumber, Contract, utils } from 'ethers'
import { workspace_abi } from '@/lib/constants';
import { useCall } from "@usedapp/core";
import WorkspaceDetails from "./WorkSpaceDetails";

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

type WorkSpaceListProps = {
  videos:Video[],
  
};


 const WorkspaceList:React.FC<WorkSpaceListProps> = ({videos}) =>{
    const [workspaceIds, setWorkspaceIds] = useState<number[]>([]);
    const abiInterface = new utils.Interface(workspace_abi)
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
    const contract = new Contract(contractAddress, abiInterface)
  
    const { value: workspaceIdsResult, error: workspaceIdsError } = useCall({
      contract: contract,
      method: 'getAllWorkspaces',
      args: []
    }) ?? {};
  
    useEffect(() => {
      if (workspaceIdsResult && !workspaceIdsError) {
        const ids = workspaceIdsResult[0].map((bn: { toNumber: () => any; })=> bn.toNumber());
        setWorkspaceIds(ids);
      }
    }, [workspaceIdsResult, workspaceIdsError]);
  
    if (workspaceIdsError) {
      return <div>Error loading workspaces</div>;
    }
  
    return (
      <div className=" w-full">
        <h2 className="font-bold text-2xl text-blue-500">Your Workspaces</h2>
        {workspaceIds.map((id) => (
          <WorkspaceDetails key={id} id={id} workspaceVids={videos}/>
        ))}
      </div>
    );
  }
  
  export default WorkspaceList;
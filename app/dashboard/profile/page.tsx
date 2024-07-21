'use client'
import { useWeb3Context } from '@/context/SignUp';
import React, { useEffect, useState } from 'react';
import { IoPersonCircleOutline } from "react-icons/io5";
import { Signer, utils } from 'ethers'
import { Contract } from 'ethers'
import { workspace_abi } from '@/lib/constants';
import { useContractFunction,useCall, useCalls } from '@usedapp/core';



type pageProps = {
    
};
interface Workspace {
    name: string;
    creator: string;
    participants: string[];
    videoIds: string[];
  }

const ProfilePage:React.FC<pageProps> = () => {
    const { handleLogin, deactivate, account } = useWeb3Context();
    const [userWorkspaces, setUserWorkspaces] = useState<Workspace[]>([]);
    const [workspaceIds, setWorkspaceIds] = useState<number[]>([]);
    const abiInterface = new utils.Interface(workspace_abi)
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
    const contract = new Contract(contractAddress, abiInterface)
   
    const { value: workspaceIdsResult, error: workspaceIdsError } = useCall({
        contract: contract,
        method: 'getAllWorkspaces',
        args: []
      }) ?? {};
    

  

    
    return (
    <div className='text-white flex flex-col items-center justify-center mt-5'>
        <div className='flex flex-col items-center'>
            <IoPersonCircleOutline className='text-8xl'/>
            <p className='text-blue-500 border border-blue-600 p-2 rounded-lg'>{account?.slice(0, 6)}...{account?.slice(account.length -4,account.length)}</p>
        </div>
        
    </div>)
}
export default ProfilePage;
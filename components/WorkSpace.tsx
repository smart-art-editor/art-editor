'use client'
import React, { useState } from 'react';
import { Signer, utils } from 'ethers'
import { Contract } from 'ethers'
import {organizationfactory_abi, organizationnft_abi, workspace_abi} from '../lib/constants'
import { useContractFunction } from '@usedapp/core';
import { useWeb3Context } from '@/context/SignUp';

type WorkSpaceProps = {
    open:boolean,
    onClose:()=>void
};

const WorkSpace:React.FC<WorkSpaceProps> = ({open,onClose}) => {
    const [orgName,setOrgName] = useState('');
    const [orgSymbol,setOrgSymbol] = useState('')
    const [workspace_addresses,setWorkspace_addresses] =useState(['']);
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
    const { handleLogin, deactivate, account } = useWeb3Context();
    const abiInterface = new utils.Interface(workspace_abi)
    const contract = new Contract(contractAddress, abiInterface)
    const {state,send}= useContractFunction(contract,'createWorkspace',{})
    
    const handleCreateWorkspace = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        try{
            await send(orgName,account,{  })
        }catch(err){
            console.log('Error creating Workspace',err)
        }finally{
            setOrgName('')
            
        }
    }
    
    return (
    <div className={`${open ? '': 'invisible'} w-full  rounded-sm absolute top-0 h-full backdrop-filter backdrop-brightness-75 backdrop-blur-md  flex items-center justify-center`}>
        <div className='flex flex-col relative items-center bg-white text-black px-16 py-4 rounded-lg'>
            <div className='absolute top-2 right-2 rounded-full bg-black text-white   w-4 h-4 flex items-center justify-center cursor-pointer' onClick={onClose}><span className='text-xs'>X</span></div>
            <h1 className='font-bold text-md'>Create Workspace :)</h1>
            <form className='flex flex-col items-center mt-5 gap-3' onSubmit={handleCreateWorkspace}>
                <input type='text' placeholder='Workspace name' required className='border border-gray-400 p-2 rounded-sm' value={orgName} onChange={(e)=>setOrgName(e.target.value)}/>
                {/* <input type='text' placeholder='Video viewer' required className='border border-gray-400 p-2 rounded-sm' value={orgSymbol} onChange={(e)=>setOrgSymbol(e.target.value)}/> */}
                <button type='submit' className='bg-black text-white rounded-sm p-2'>Submit</button>
                {state.status === 'Mining' && <p>Creating workspace...</p>}
                {state.status === 'Success' && <p>Workspace created successfully!</p>}
                {state.status === 'Exception' && <p>Error: {state.errorMessage}</p>}
            </form>
        </div>
    </div>)
}
export default WorkSpace;
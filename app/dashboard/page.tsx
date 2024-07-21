
'use client'

import { useEffect,useState,useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3Context } from '@/context/SignUp';
import Image from 'next/image';
import DashboardImage from '../../public/Dashboard.webp'
import WorkSpace from '@/components/WorkSpace';

export default function Dashboard() {
  const [modalOrgOpen,setModalOrgOpen]=useState(false);
  const { account } = useWeb3Context();
  const router = useRouter();

  useEffect(() => {
    if (!account) {
      router.push('/');
    }
  }, [account, router]);

  if (!account) {
    return null; // or a loading spinner
  }
  const handleCloseOrgModal = ()=>{
    setModalOrgOpen(false)
  }

  return (
    <div className='text-white flex items-center justify-center h-full'>
      <div className=' flex flex-col items-center'>
        <Image src={DashboardImage} alt='Dashboard Image' className='border border-gray-200 rounded-lg'/>
        <h2 className='font-bold mt-2 mb-5'>Improve Remote Productivity with Emergent</h2>
        <p className='text-gray-400 mb-2'>Add Teammates and you’ll be able to collaborate and quickly get a sense of what’s happening at work.</p>
        <button className='bg-blue-500 rounded-lg py-2 px-4' onClick={()=>setModalOrgOpen(true)}>Create Workspace</button>
        {modalOrgOpen && <WorkSpace open={modalOrgOpen} onClose={handleCloseOrgModal} />}
      </div>
    </div>
  );
}
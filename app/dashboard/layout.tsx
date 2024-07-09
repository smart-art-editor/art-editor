"use client"

import type { Metadata } from "next";
import { Inter,Pacifico } from "next/font/google";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { BsFiles } from "react-icons/bs";
import { FaHome } from "react-icons/fa";
import { LuWorkflow } from "react-icons/lu";
import { IoIosNotifications } from "react-icons/io";
import { IoIosSettings } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoAddOutline, IoExtensionPuzzle } from "react-icons/io5";
import { VideosProvider } from "@/context/VideosContext";


const inter = Inter({ subsets: ["latin"] });
const pacifico = Pacifico({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
  })


export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const pathname = usePathname()
    const [open,setOpen] = useState(true)
    return (
    <VideosProvider>
    <> 
      <div className="flex ">
        <div className={` flex-col h-screen p-5 pt-8 bg-black text-white relative  rounded-tr-lg duration-300 border-r-2 border-gray-600 ${open ? 'w-72' : 'w-20'}`}>
            <div className={`font-bold mb-9 ${!open && 'hidden'}`}>
                <Link href='/' className={`${pacifico.className} text-blue-600 text-2xl`}>Emergent</Link>
            </div>
            <FaArrowLeft className={`absolute bg-white text-blue-600 border border-blue-500 text-3xl rounded-full -right-3 top-9 cursor-pointer font-light ${!open && 'rotate-180'}`} onClick={()=>setOpen(!open)}/>
            <h2 className={`text-sm text-gray-500 ${!open && 'hidden'}`}>MENU</h2>
            <ul className="pt-2 gap-1 flex flex-col">
                <li className={` text-sm flex items-center cursor-pointer   rounded-md mt-1 ${pathname ==='/' ? 'bg-white text-blue-600':" text-gray-300"} ${open && 'hidden'}`}>
                    <Link href='/' className="flex gap-x-4 items-center  w-full rounded-md  p-2">
                        <span className="text-2xl block float-left"><FaHome/></span>
                        <span className={`text-base font-medium flex-1 duration-200 ${!open && 'hidden'}`}>Home</span>
                    </Link>
                </li>
                <li className={` text-sm flex items-center cursor-pointer  rounded-md mt-1 ${pathname ==='/dashboard' ? 'bg-white text-blue-600':" text-gray-300"}`}>
                    <Link href='/dashboard' className="flex gap-x-4 items-center  w-full rounded-md  p-2">
                        <span className="text-2xl block float-left"><MdDashboard/></span>
                        <span className={`text-base font-medium flex-1 duration-200 ${!open && 'hidden'}`}>Dashboard</span>
                    </Link>
                </li>
                <li className={` text-sm flex  items-center cursor-pointer   rounded-md mt-1 ${pathname ==='/dashboard/workflow' ? 'bg-white text-blue-600':" text-gray-300"}`}>
                    <Link href='/dashboard/workflow' className="flex gap-x-4 items-center  w-full rounded-md  p-2">
                        <span className="text-2xl block float-left"><LuWorkflow/></span>
                        <span className={`text-base font-medium flex-1 duration-200 ${!open && 'hidden'}`}>Workflow</span>
                    </Link>
                </li>
                <li className={` text-sm flex items-center cursor-pointer  rounded-md mt-1 ${pathname ==='/dashboard/files' ? 'bg-white text-blue-600':" text-gray-300"}`}>
                    <Link href='/dashboard/files' className="flex gap-x-4 items-center  w-full rounded-md  p-2">
                        <span className="text-2xl block float-left"><BsFiles/></span>
                        <span className={`text-base font-medium flex-1 duration-200 ${!open && 'hidden'}`}>Files</span>
                    </Link>
                </li>
                <li className={` text-sm flex  gap-x-4 items-center cursor-pointer p-2  rounded-md mt-1 ${pathname ==='/dashboard/notifications' ? 'bg-white text-blue-600':" text-gray-300"}`}>
                    <span className="text-2xl block float-left"><IoIosNotifications/></span>
                    <span className={`text-base font-medium flex-1 duration-200 ${!open && 'hidden'}`}>Notifications</span>
                </li>
                <li className={` text-sm flex  gap-x-4 items-center cursor-pointer p-2  rounded-md mt-1 ${pathname ==='/dashboard/settings' ? 'bg-white text-blue-600':" text-gray-300"}`}>
                    <span className="text-2xl block float-left"><IoIosSettings/></span>
                    <span className={`text-base font-medium flex-1 duration-200 ${!open && 'hidden'}`}>Settings</span>
                </li>
                
            </ul>
            <div className="absolute bottom-9">
                <h2 className={`text-sm text-gray-500 ${!open && 'hidden'}`}>OPTIONS</h2>
                <ul className=" flex flex-col">
                    <li className={` text-sm flex  gap-x-4 items-center cursor-pointer p-2  rounded-md mt-1 ${pathname ==='/dashboard/profile' ? 'bg-white text-blue-600':" text-gray-300"}`}>
                        <span className="text-2xl block float-left"><CgProfile/></span>
                        <span className={`text-base font-medium flex-1 duration-200 ${!open && 'hidden'}`}>Profile</span>
                    </li>
                    <li className={` text-sm flex  gap-x-4 items-center cursor-pointer p-2  rounded-md mt-1 ${pathname ==='/logout' ? 'bg-white text-blue-600':" text-gray-300"}`}>
                        <span className="text-2xl block float-left"><MdOutlineLogout/></span>
                        <span className={`text-base font-medium flex-1 duration-200 ${!open && 'hidden'}`}>Sign Out</span>
                    </li>
                    <li className={` text-sm flex  gap-x-4 items-center cursor-pointer p-2  rounded-md mt-1 ${pathname ==='/install' ? 'bg-white text-blue-600':" text-gray-300"}`}>
                        <span className="text-2xl block float-left"><IoExtensionPuzzle/></span>
                        <span className={`text-base font-medium flex-1 duration-200 ${!open && 'hidden'}`}>Extension</span>
                </li>
                </ul>
            </div>
            {/* <ul className='mt-5 flex flex-col gap-8 pt-2'>
                <li className={`flex gap-2 items-center ${pathname === '/dashboard' ?'text-white bg-black rounded py-2 px-4 font-semibold':'text-black text-md'}`}><Link href='/dashboard' className=''>Dashboard</Link></li>
            </ul>
            <ul className='mt-5 flex flex-col gap-8'>
                <li className={`flex gap-2 items-center ${pathname === '/dashboard/analytics' ?'text-white bg-black rounded py-2 px-4 font-semibold':'text-black text-md'}`}><Link href='/dashboard/analytics' className=''>Analytics</Link></li>
            </ul>
            <ul className='mt-5 flex flex-col gap-8'>
                <li className={`flex gap-2 items-center ${pathname === '/logout' ?'text-white bg-black rounded py-2 px-4 font-semibold':'text-black text-md'}`}><Link href='/logout' className=''>Logout</Link></li>
            </ul> */}
        </div>
        <div className="w-full  bg-black relative">{children}</div>
      </div>
    </>
    </VideosProvider>
    );
  }
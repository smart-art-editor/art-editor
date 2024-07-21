'use client'
import React, { useContext } from 'react';
import { Pacifico } from 'next/font/google';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { useWeb3Context } from '@/context/SignUp';
import { useEthers } from '@usedapp/core';


const pacifico = Pacifico({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
  })

type NavBarProps = {
    
};

const NavBar:React.FC<NavBarProps> = () => {
    const { handleLogin, deactivate, account } = useWeb3Context();
    //const { activateBrowserWallet, account, deactivate } = useEthers();
    const pathname = usePathname()
    function handleConnectWallet() {
        console.log('connect')
        handleLogin();
        console.log(account,'account')
      }
    
    return (
        <main className="flex gap-5 justify-between items-center px-7 py-4   leading-[154.5%] max-md:flex-wrap max-md:px-5">
            <div className="flex gap-1.5 justify-center self-stretch my-auto text-2xl tracking-tighter text-neutral-700">
                <p className={`${pacifico.className} text-blue-600 text-2xl`}>Emergent</p>
            </div>
            <ul className="gap-5 justify-between self-stretch my-auto text-sm leading-5 text-white font-bold max-md:flex-wrap max-md:max-w-full hidden md:flex">
                <li className= {` ${pathname === '/' ? 'underline decoration-blue-600 decoration-2':''}`}><Link href='/' className=''>Home</Link></li>
                {account &&
                <li className= {` ${pathname === '/dashboard' ? 'underline decoration-blue-600 decoration-2':''}`}><Link href='/dashboard'>Dashboard</Link></li>}
                {/* <li className= {` ${pathname === '/install' ? 'underline decoration-blue-600 decoration-2':''}`}><Link href='/install'>Install</Link></li> */}
                {/* <li className= {` ${pathname === '#features' ? 'underline decoration-blue-600 decoration-2':''}`}><Link href='#fearures'>Features</Link></li>
                <li className= {` ${pathname === '#contact' ? 'underline decoration-blue-600 decoration-2':''}`}><Link href='#contact'>Contact</Link></li> */}
            </ul>
            <div className='flex items-center gap-4 text-sm font-bold'>
                {/* <button className=" "> Sign In</button> */}
                <button className='border border-gray-300 text-blue-600 py-4 px-4 rounded-lg' onClick={handleLogin}> {account ? `${account.slice(0, 6)}...${account.slice(account.length -4,account.length)}` : 'Sign Up for free'}</button>
            </div>
        </main>
    )
}
export default NavBar;
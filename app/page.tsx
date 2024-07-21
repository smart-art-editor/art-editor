import NavBar from "@/components/NavBar";
import Image from "next/image";
import Emergent from '../public/Emergent.png'

export default function Home() {
  return (
    <main className="bg-black text-white h-full ">
      <NavBar/>
      <div className=" grid items-start justify-center mt-10 ">
        <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-blue-600 rounded-lg blur opacity-75"></div>
      <button className="relative px-7 py-4 bg-gray-900 rounded-lg leading-none flex items-center divide-x divide-gray-200">
        <span className="text-gray-100 pr-3">Powered by Theta Labs</span>
        <span className="text-blue-400 pl-3">Screen Recorder</span>
      </button>
      </div>
      </div>
      <section className="">
      <div className="flex items-center justify-center flex-col mt-10 gap-4 ">
        <h2 className="non-italic font-bold text-4xl ">Share, Collaborate & Effortlessly Capture your screen with Ease!</h2>
        <p className="max-w-5xl text-gray-600">Make communication clear and engaging. Record your screen, webcam, and audio to create powerful visuals that explain concepts, showcase workflows, and share your ideas effectively.</p>
        
      </div>
      <div className="flex items-center justify-center w-full h-full mt-[20px] ">
        
           <Image src={Emergent} alt="Hero Image" layout="responsive" width={500}
            height={100} className="max-w-4xl object-fill border-4 border-gray-700 rounded-lg"/>
        
      </div>
      
      </section>
    </main>
  );
}

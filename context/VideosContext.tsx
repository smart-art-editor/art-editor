'use client'
import { getvids } from '@/utils';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface VideosContextType {
  videos: string[];
  setVideos: React.Dispatch<React.SetStateAction<string[]>>;
  refreshVideos: () => void;
}

const VideosContext = createContext<VideosContextType | undefined>(undefined);

export const VideosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<string[]>([]);

  const refreshVideos = async() => {
    
    try{
         getvids().then(setVideos)
    }catch(err){
        console.log('Error fetching videos')
    }
    
  };

  return (
    <VideosContext.Provider value={{ videos, setVideos, refreshVideos }}>
      {children}
    </VideosContext.Provider>
  );
};

export const useVideos = () => {
  const context = useContext(VideosContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
};

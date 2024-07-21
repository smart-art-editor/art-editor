

'use client'
import React, { createContext, ReactNode, useContext } from 'react';
import { DAppProvider, Config, useEthers, Theta,ThetaTestnet } from '@usedapp/core';
import { getDefaultProvider } from 'ethers';

const config: Config = {
  readOnlyChainId: ThetaTestnet.chainId,
  readOnlyUrls: {
    [ThetaTestnet.chainId]: getDefaultProvider('https://eth-rpc-api-testnet.thetatoken.org/rpc'),
  }
};

interface Web3ContextProps {
  handleLogin: () => void;
  account: string | null | undefined;
  deactivate: () => void;
}

const Web3Context = createContext<Web3ContextProps | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <DAppProvider config={config}>
      <InnerProvider>{children}</InnerProvider>
    </DAppProvider>
  );
};

const InnerProvider = ({ children }: { children: ReactNode }) => {
  const { activateBrowserWallet, account, deactivate } = useEthers();

  const handleLogin = async () => {
    try {
      console.log('Attempting to connect wallet');
      await activateBrowserWallet();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  }

  const contextValue = {
    handleLogin,
    account,
    deactivate
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3Context = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3Context must be used within a Web3Provider');
  }
  return context;
};
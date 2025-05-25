import React from 'react';
import ConnectWalletButton from './ConnectWalletButton';

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white shadow">
      <div className="text-xl font-bold">Название сайта</div>
      <ConnectWalletButton />
    </header>
  );
}
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import ConnectWalletModal from './ConnectWalletModal';

export default function ConnectWalletButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Connect Wallet
      </Button>
      <ConnectWalletModal isOpen={open} setIsOpen={setOpen} />
    </>
  );
}
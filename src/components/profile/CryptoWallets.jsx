import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Bitcoin, Plus, Trash2, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

const cryptoTypes = [
  { value: 'bitcoin', label: 'Bitcoin (BTC)' },
  { value: 'ethereum', label: 'Ethereum (ETH)' },
  { value: 'usdc', label: 'USD Coin (USDC)' },
];

const CryptoWallets = ({ cryptoWallets, setUserData, onConnectWallet }) => {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWalletData, setNewWalletData] = useState({ type: 'bitcoin', name: '', address: '', isDefault: false });

  const handleAddWallet = () => {
    if (!newWalletData.name || !newWalletData.address) {
      toast({ title: "Error", description: "Please fill all wallet details.", variant: "destructive" });
      return;
    }
    const newWallet = {
      id: uuidv4(),
      type: newWalletData.type,
      name: newWalletData.name,
      address: newWalletData.address,
      isDefault: newWalletData.isDefault,
    };

    setUserData(prev => {
      let updatedWallets = [...prev.cryptoWallets, newWallet];
      if (newWallet.isDefault) {
        updatedWallets = updatedWallets.map(w => ({ ...w, isDefault: w.id === newWallet.id }));
      }
      return { ...prev, cryptoWallets: updatedWallets };
    });

    setNewWalletData({ type: 'bitcoin', name: '', address: '', isDefault: false });
    setIsAddModalOpen(false);
    toast({ title: "Crypto Wallet Added", description: "New wallet has been added successfully." });
  };

  const handleRemoveWallet = (id) => {
    setUserData(prev => ({
      ...prev,
      cryptoWallets: prev.cryptoWallets.filter(wallet => wallet.id !== id)
    }));
    toast({ title: "Crypto Wallet Removed", description: "Wallet has been removed." });
  };

  const handleSetDefault = (id) => {
    setUserData(prev => ({
      ...prev,
      cryptoWallets: prev.cryptoWallets.map(w => ({ ...w, isDefault: w.id === id }))
    }));
    toast({ title: "Default Crypto Wallet Updated" });
  };

  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    toast({ title: "Address Copied", description: "Wallet address copied to clipboard." });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cryptocurrency Wallets</CardTitle>
        <CardDescription>Manage your crypto wallets for payments.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {cryptoWallets.length === 0 && (
          <p className="text-muted-foreground">No crypto wallets saved yet.</p>
        )}
        <div className="space-y-4">
          {cryptoWallets.map((wallet) => (
            <div key={wallet.id} className="p-4 border border-border rounded-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                <div className="flex items-center">
                  <Bitcoin className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <h4 className="font-medium">{wallet.name} <span className="text-xs text-muted-foreground">({wallet.type.toUpperCase()})</span></h4>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {wallet.isDefault && (
                    <Badge variant="outline" className="bg-primary/10">Default</Badge>
                  )}
                  {!wallet.isDefault && (
                     <Button variant="ghost" size="sm" onClick={() => handleSetDefault(wallet.id)}>Set Default</Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyAddress(wallet.address)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => handleRemoveWallet(wallet.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3 bg-secondary/20 rounded break-all text-sm font-mono">
                {wallet.address}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
            <Button className="flex-1" onClick={onConnectWallet}>
                <Bitcoin className="h-4 w-4 mr-2" />
                Connect New Wallet (e.g. MetaMask)
            </Button>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add Wallet Manually
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Add Crypto Wallet Manually</DialogTitle>
                <DialogDescription>Enter your wallet details below.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="walletName">Wallet Name</Label>
                    <Input id="walletName" value={newWalletData.name} onChange={(e) => setNewWalletData({...newWalletData, name: e.target.value})} placeholder="e.g., My Savings Wallet" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="walletType">Wallet Type</Label>
                    <Select value={newWalletData.type} onValueChange={(value) => setNewWalletData({...newWalletData, type: value})}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                        {cryptoTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="walletAddress">Wallet Address</Label>
                    <Input id="walletAddress" value={newWalletData.address} onChange={(e) => setNewWalletData({...newWalletData, address: e.target.value})} placeholder="Enter public wallet address" />
                </div>
                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="isDefaultWallet" checked={newWalletData.isDefault} onChange={(e) => setNewWalletData({...newWalletData, isDefault: e.target.checked})} />
                    <Label htmlFor="isDefaultWallet">Set as default crypto wallet</Label>
                </div>
                </div>
                <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                <Button onClick={handleAddWallet}>Add Wallet</Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoWallets;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

const PaymentMethods = ({ paymentMethods, setUserData }) => {
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCardData, setNewCardData] = useState({ number: '', expiry: '', cvc: '', name: '', isDefault: false });

  const handleAddPaymentMethod = () => {
    if (!newCardData.number || !newCardData.expiry || !newCardData.cvc || !newCardData.name) {
      toast({ title: "Error", description: "Please fill all card details.", variant: "destructive" });
      return;
    }
    const newMethod = {
      id: uuidv4(),
      type: 'card',
      last4: newCardData.number.slice(-4),
      expiry: newCardData.expiry,
      name: newCardData.name,
      isDefault: newCardData.isDefault,
    };

    setUserData(prev => {
      let updatedMethods = [...prev.paymentMethods, newMethod];
      if (newMethod.isDefault) {
        updatedMethods = updatedMethods.map(m => ({ ...m, isDefault: m.id === newMethod.id }));
      }
      return { ...prev, paymentMethods: updatedMethods };
    });

    setNewCardData({ number: '', expiry: '', cvc: '', name: '', isDefault: false });
    setIsAddModalOpen(false);
    toast({ title: "Payment Method Added", description: "New card has been added successfully." });
  };

  const handleRemovePaymentMethod = (id) => {
    setUserData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter(method => method.id !== id)
    }));
    toast({ title: "Payment Method Removed", description: "Card has been removed." });
  };

  const handleSetDefault = (id) => {
    setUserData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map(m => ({ ...m, isDefault: m.id === id }))
    }));
    toast({ title: "Default Payment Method Updated" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Manage your saved credit/debit cards.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {paymentMethods.length === 0 && (
          <p className="text-muted-foreground">No payment methods saved yet.</p>
        )}
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-md gap-4 sm:gap-2">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 sm:h-5 sm:w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Ending in •••• {method.last4}</p>
                  <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                  {method.name && <p className="text-xs text-muted-foreground">Cardholder: {method.name}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                {method.isDefault ? (
                  <Badge variant="outline" className="bg-primary/10">Default</Badge>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => handleSetDefault(method.id)}>Set as Default</Button>
                )}
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => handleRemovePaymentMethod(method.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Payment Card</DialogTitle>
              <DialogDescription>Enter your card details below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input id="cardName" value={newCardData.name} onChange={(e) => setNewCardData({...newCardData, name: e.target.value})} placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" value={newCardData.number} onChange={(e) => setNewCardData({...newCardData, number: e.target.value})} placeholder="•••• •••• •••• ••••" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardExpiry">Expiry Date</Label>
                  <Input id="cardExpiry" value={newCardData.expiry} onChange={(e) => setNewCardData({...newCardData, expiry: e.target.value})} placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardCvc">CVC</Label>
                  <Input id="cardCvc" value={newCardData.cvc} onChange={(e) => setNewCardData({...newCardData, cvc: e.target.value})} placeholder="123" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isDefaultCard" checked={newCardData.isDefault} onChange={(e) => setNewCardData({...newCardData, isDefault: e.target.checked})} />
                <Label htmlFor="isDefaultCard">Set as default payment method</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddPaymentMethod}>Add Card</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
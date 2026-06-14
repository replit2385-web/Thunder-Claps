import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAppStore } from '@/store/appStore';
import { useCreateCouple } from '@workspace/api-client-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function Setup() {
  const [, setLocation] = useLocation();
  const setCouple = useAppStore(state => state.setCouple);
  const createCouple = useCreateCouple();

  const [name, setName] = useState('');
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [anniversary, setAnniversary] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !partner1 || !partner2) return;

    createCouple.mutate({
      data: { name, partner1, partner2, anniversaryDate: anniversary || null }
    }, {
      onSuccess: (data) => {
        setCouple({
          id: data.id,
          name: data.name,
          partner1: data.partner1,
          partner2: data.partner2,
          anniversaryDate: data.anniversaryDate ?? undefined,
          avatarJson: data.avatarJson ?? undefined,
        });
        setLocation('/dashboard');
      }
    });
  };

  return (
    <div className="min-h-screen p-6 flex flex-col justify-center max-w-md mx-auto">
      <h1 className="text-3xl font-serif mb-2 text-primary">Begin Your Journey</h1>
      <p className="text-muted-foreground mb-8">Tell us about yourselves to create your shared space.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Couple Name</Label>
          <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. The Smiths, Jack & Jill" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="p1">Partner 1 Name</Label>
          <Input id="p1" value={partner1} onChange={e => setPartner1(e.target.value)} placeholder="Your name" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="p2">Partner 2 Name</Label>
          <Input id="p2" value={partner2} onChange={e => setPartner2(e.target.value)} placeholder="Their name" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="anniversary">Anniversary Date (Optional)</Label>
          <Input id="anniversary" type="date" value={anniversary} onChange={e => setAnniversary(e.target.value)} />
        </div>

        <Button type="submit" className="w-full mt-8" disabled={createCouple.isPending}>
          {createCouple.isPending ? 'Creating...' : 'Enter Our Space'}
        </Button>
      </form>
    </div>
  );
}

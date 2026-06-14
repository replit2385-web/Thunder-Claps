import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateRoom, useGetRoom } from '@workspace/api-client-react';
import { useLocation } from 'wouter';

export default function Live() {
  const couple = useAppStore(state => state.couple);
  const [code, setCode] = useState('');
  const createRoom = useCreateRoom();
  const [, setLocation] = useLocation();

  const handleCreate = () => {
    if (!couple) return;
    createRoom.mutate({ data: { coupleId: couple.id } }, {
      onSuccess: (room) => {
        // Just mocking the flow for now
        alert(`Room created: ${room.joinCode}`);
      }
    });
  };

  return (
    <div className="p-6 flex flex-col justify-center min-h-[80vh] max-w-md mx-auto text-center space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-primary mb-2">Live Sync</h1>
        <p className="text-muted-foreground">Play together in real-time across devices.</p>
      </div>

      <div className="bg-card border border-border p-6 rounded-2xl space-y-6">
        <div>
          <h2 className="font-medium mb-4">Start a new session</h2>
          <Button onClick={handleCreate} className="w-full">Create Room</Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or join existing</span>
          </div>
        </div>

        <div className="space-y-4">
          <Input 
            placeholder="Enter 6-digit code" 
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase().slice(0, 6))}
            className="text-center text-xl tracking-widest uppercase"
          />
          <Button variant="secondary" className="w-full" disabled={code.length !== 6}>
            Join Room
          </Button>
        </div>
      </div>
    </div>
  );
}

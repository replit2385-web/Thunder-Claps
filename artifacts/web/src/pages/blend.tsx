import { useAppStore } from '@/store/appStore';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Blend() {
  const couple = useAppStore(state => state.couple);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!couple) return;
    setLoading(true);
    
    const prompt = `A beautiful artistic portrait of two people in love, ${couple.partner1} and ${couple.partner2}, romantic impressionist painting, warm golden light, intimate moment`;
    const encoded = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&nologo=true`;
    
    // Simulate slight delay for effect
    setTimeout(() => {
      setImageUrl(url);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="p-6 pb-24 max-w-md mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-serif text-primary mb-2">Two Become One</h1>
        <p className="text-muted-foreground">An AI-generated portrait of your combined essence.</p>
      </header>

      <div className="aspect-square bg-card border border-border rounded-2xl overflow-hidden flex items-center justify-center mb-8 relative">
        {imageUrl ? (
          <img src={imageUrl} alt="Blend portrait" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-6 text-muted-foreground">
            {loading ? (
              <div className="animate-pulse">Generating your portrait...</div>
            ) : (
              <div>Tap below to generate</div>
            )}
          </div>
        )}
      </div>

      <Button 
        onClick={handleGenerate} 
        disabled={loading} 
        className="w-full py-6 text-lg rounded-xl"
      >
        {loading ? 'Creating Magic...' : 'Generate Portrait'}
      </Button>
    </div>
  );
}

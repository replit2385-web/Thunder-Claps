import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SAMPLE_CARDS, getCardColor, Card as CardType } from '@/features/cards/cards';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Play() {
  const [, setLocation] = useLocation();
  const [cards, setCards] = useState<CardType[]>(() => [...SAMPLE_CARDS].sort(() => Math.random() - 0.5));
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      setLocation('/dashboard');
    }
  };

  if (cards.length === 0) return null;
  const card = cards[currentIndex];

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
        <Button variant="ghost" onClick={() => setLocation('/dashboard')}>Close</Button>
        <span className="text-sm text-muted-foreground">{currentIndex + 1} / {cards.length}</span>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: -100, rotate: -10 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="w-full max-w-sm aspect-[3/4] rounded-2xl p-8 flex flex-col justify-between shadow-2xl"
          style={{ backgroundColor: getCardColor(card.type) }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (Math.abs(info.offset.x) > 100) {
              handleNext();
            }
          }}
        >
          <div className="flex justify-between items-start text-white/80">
            <span className="uppercase tracking-widest text-xs font-bold">{card.type.replace('-', ' ')}</span>
            <span className="capitalize text-xs border border-white/30 px-2 py-1 rounded-full">{card.depth}</span>
          </div>

          <h2 className="text-2xl font-serif text-white leading-snug">{card.text}</h2>

          <div className="text-xs text-white/60">
            {card.framework ? `Based on ${card.framework}` : 'Infinite Us Original'}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-12 text-center text-muted-foreground text-sm animate-pulse">
        Swipe or tap to draw
      </div>
      
      {/* Invisible overlay for tap to next */}
      <div className="absolute inset-0 z-0" onClick={handleNext} />
    </div>
  );
}

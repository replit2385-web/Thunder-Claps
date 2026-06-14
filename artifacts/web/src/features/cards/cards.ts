export type CardDepth = 'surface' | 'current' | 'deep';
export type CardType = 'dare' | 'this-or-that' | 'what-if' | 'challenge' | 'spicy' | 'thunder' | 'legacy' | 'repair' | 'nostalgia';

export interface Card {
  id: string;
  type: CardType;
  depth: CardDepth;
  text: string;
  framework?: string;
}

export const SAMPLE_CARDS: Card[] = [
  { id: "d1", type: "dare", depth: "surface", text: "Tell your partner one thing they do that you find secretly adorable." },
  { id: "d2", type: "dare", depth: "current", text: "Share a worry you've been carrying alone this week." },
  { id: "tot1", type: "this-or-that", depth: "surface", text: "Spontaneous road trip OR perfectly planned vacation?" },
  { id: "tot2", type: "this-or-that", depth: "current", text: "Talk through conflict immediately OR take space first?" },
  { id: "wi1", type: "what-if", depth: "deep", text: "What if you could redesign how you met — would you change anything?" },
  { id: "wi2", type: "what-if", depth: "current", text: "What if money were no object — what would your life look like in 5 years?" },
  { id: "ch1", type: "challenge", depth: "surface", text: "Give your partner a 60-second appreciation speech. Go." },
  { id: "ch2", type: "challenge", depth: "current", text: "Name three things you've never thanked your partner for. Thank them now." },
  { id: "sp1", type: "spicy", depth: "deep", text: "What's one fantasy about your relationship you've never said out loud?" },
  { id: "sp2", type: "spicy", depth: "current", text: "What's the boldest thing you've ever wanted to try together?" },
  { id: "th1", type: "thunder", depth: "deep", text: "What moment in our relationship do you wish we could live again?", framework: "Attachment Theory" },
  { id: "l1", type: "legacy", depth: "deep", text: "What story do you hope people tell about our relationship when we're gone?" },
  { id: "r1", type: "repair", depth: "current", text: "Is there something unresolved between us that we've been avoiding?", framework: "Gottman Method" },
  { id: "n1", type: "nostalgia", depth: "surface", text: "What's the first trip we took together, and what do you remember most?" },
  { id: "n2", type: "nostalgia", depth: "current", text: "What was the moment you knew this was serious?" }
];

export const getCardColor = (type: CardType): string => {
  switch (type) {
    case 'dare': return '#e879a0'; // rose/pink
    case 'this-or-that': return '#8b5cf6'; // violet
    case 'what-if': return '#0ea5e9'; // sky blue
    case 'challenge': return '#f59e0b'; // amber
    case 'spicy': return '#ef4444'; // red
    case 'thunder': return '#1e293b'; // dark navy
    case 'legacy': return '#7ec8a4'; // sage green
    case 'repair': return '#a78bfa'; // soft purple
    case 'nostalgia': return '#f8c06c'; // warm gold
    default: return '#e879a0';
  }
};

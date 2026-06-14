import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { useGetMirrorResults, useSaveMirrorResult } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const LOVE_LANGUAGES = ['Words of Affirmation', 'Acts of Service', 'Receiving Gifts', 'Quality Time', 'Physical Touch'];
const CONFLICT_STYLES = ['Pursuer', 'Withdrawer', 'Redirector'];

export default function Mirror() {
  const couple = useAppStore(state => state.couple);
  const { data: results, refetch } = useGetMirrorResults(couple?.id || '', {
    query: { enabled: !!couple?.id, queryKey: ['mirror', couple?.id] }
  });
  const saveResult = useSaveMirrorResult();

  const [activeTab, setActiveTab] = useState<'love_language' | 'conflict_style'>('love_language');
  const [partner1Answer, setPartner1Answer] = useState('');
  const [partner2Answer, setPartner2Answer] = useState('');

  if (!couple) return null;

  const hasCompletedLoveLanguage = results?.some(r => r.quizType === 'love_language');
  const hasCompletedConflict = results?.some(r => r.quizType === 'conflict_style');

  const handleSubmit = () => {
    if (!partner1Answer || !partner2Answer) return;
    
    saveResult.mutate({
      coupleId: couple.id,
      data: {
        quizType: activeTab,
        partner1Result: partner1Answer,
        partner2Result: partner2Answer,
      }
    }, {
      onSuccess: () => {
        setPartner1Answer('');
        setPartner2Answer('');
        refetch();
      }
    });
  };

  const renderQuiz = (type: 'love_language' | 'conflict_style', title: string, options: string[], isCompleted: boolean) => {
    if (isCompleted) {
      const result = results?.find(r => r.quizType === type);
      return (
        <Card className="bg-card border-border/50 shadow-lg mt-6">
          <CardHeader>
            <CardTitle className="text-xl text-primary font-serif">Results: {title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-background rounded-lg border border-border">
              <span className="font-medium">{couple.partner1}</span>
              <span className="text-primary">{result?.partner1Result}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-background rounded-lg border border-border">
              <span className="font-medium">{couple.partner2}</span>
              <span className="text-primary">{result?.partner2Result}</span>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-8 mt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{couple.partner1}, what resonates most?</h3>
          <div className="grid gap-2">
            {options.map(opt => (
              <Button 
                key={`p1-${opt}`} 
                variant={partner1Answer === opt ? 'default' : 'outline'}
                className="justify-start h-auto py-3 px-4 text-left"
                onClick={() => setPartner1Answer(opt)}
              >
                {opt}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">{couple.partner2}, what resonates most?</h3>
          <div className="grid gap-2">
            {options.map(opt => (
              <Button 
                key={`p2-${opt}`} 
                variant={partner2Answer === opt ? 'default' : 'outline'}
                className="justify-start h-auto py-3 px-4 text-left"
                onClick={() => setPartner2Answer(opt)}
              >
                {opt}
              </Button>
            ))}
          </div>
        </div>

        <Button 
          className="w-full py-6 text-lg" 
          disabled={!partner1Answer || !partner2Answer || saveResult.isPending}
          onClick={handleSubmit}
        >
          {saveResult.isPending ? 'Revealing...' : 'Reveal Truth'}
        </Button>
      </div>
    );
  };

  return (
    <div className="p-6 pb-24 max-w-md mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-primary mb-2">The Mirror</h1>
        <p className="text-muted-foreground">See yourselves clearly. Assessments for deeper understanding.</p>
      </header>

      <div className="flex bg-background border border-border rounded-lg p-1 mb-6">
        <button 
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'love_language' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('love_language')}
        >
          Love Language
        </button>
        <button 
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'conflict_style' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('conflict_style')}
        >
          Conflict Style
        </button>
      </div>

      {activeTab === 'love_language' && renderQuiz('love_language', 'How We Receive Love', LOVE_LANGUAGES, !!hasCompletedLoveLanguage)}
      {activeTab === 'conflict_style' && renderQuiz('conflict_style', 'Under Pressure', CONFLICT_STYLES, !!hasCompletedConflict)}
    </div>
  );
}

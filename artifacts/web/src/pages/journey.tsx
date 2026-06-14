import { useAppStore } from '@/store/appStore';
import { useGetJourney } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function JourneyPage() {
  const couple = useAppStore(state => state.couple);
  const { data: journey, isLoading } = useGetJourney(couple?.id || '', {
    query: { enabled: !!couple?.id, queryKey: ['journey', couple?.id] }
  });

  if (!couple) return null;

  const currentSeason = journey?.currentSeason || 'Foundations';
  const completed = journey?.completedDays || 0;
  
  // Hardcoded season max lengths
  const seasonLengths: Record<string, number> = {
    'Foundations': 30,
    'Deepening': 30,
    'Adventure': 21,
    'Renewal': 14
  };
  
  const maxDays = seasonLengths[currentSeason] || 30;
  const progressPercent = Math.min(100, Math.round((completed / maxDays) * 100));

  return (
    <div className="p-6 pb-24 max-w-md mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-primary mb-2">The Journey</h1>
        <p className="text-muted-foreground">Your guided seasonal progression.</p>
      </header>

      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-40 bg-card rounded-2xl"></div>
          <div className="h-24 bg-card rounded-2xl"></div>
        </div>
      ) : (
        <>
          <Card className="bg-card border-primary/30 mb-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-primary/5"></div>
            <CardContent className="p-8 relative z-10">
              <div className="text-sm uppercase tracking-widest text-primary font-bold mb-2">Current Season</div>
              <h2 className="text-4xl font-serif mb-6">{currentSeason}</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Day {completed} of {maxDays}</span>
                  <span className="text-primary">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-2 bg-background" />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="font-medium text-lg">Today's Focus</h3>
            <Card className="bg-background border-border/50">
              <CardContent className="p-6 text-center text-muted-foreground">
                <p className="italic">"What is one thing your partner did this week that made you feel safe?"</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

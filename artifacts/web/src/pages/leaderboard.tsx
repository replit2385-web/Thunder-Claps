import { useGetLeaderboard } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useGetLeaderboard({
    query: { queryKey: ['leaderboard'] }
  });

  return (
    <div className="p-6 pb-24 max-w-md mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-primary mb-2">Global Ranking</h1>
        <p className="text-muted-foreground">Couples dedicated to their growth.</p>
      </header>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-16 bg-card animate-pulse rounded-xl border border-border/50"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard?.map((entry) => (
            <Card key={entry.coupleId || entry.rank} className="bg-card border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                    ${entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' : 
                      entry.rank === 2 ? 'bg-gray-300/20 text-gray-300' : 
                      entry.rank === 3 ? 'bg-amber-700/20 text-amber-700' : 
                      'bg-background text-muted-foreground'}`}>
                    {entry.rank}
                  </div>
                  <div>
                    <div className="font-medium">{entry.coupleName}</div>
                    <div className="text-xs text-muted-foreground flex gap-2">
                      <span>🔥 {entry.streak} day streak</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{entry.totalScore}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">{entry.momentum}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

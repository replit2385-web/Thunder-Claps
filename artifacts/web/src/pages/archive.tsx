import { useAppStore } from '@/store/appStore';
import { useGetSessions } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

export default function Archive() {
  const couple = useAppStore(state => state.couple);
  const { data: sessions, isLoading } = useGetSessions(couple?.id || '', {
    query: { enabled: !!couple?.id, queryKey: ['sessions', couple?.id] }
  });

  if (!couple) return null;

  return (
    <div className="p-6 pb-24 max-w-md mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-primary mb-2">The Archive</h1>
        <p className="text-muted-foreground">A record of your journey together.</p>
      </header>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-card animate-pulse rounded-2xl border border-border/50"></div>
          ))}
        </div>
      ) : sessions && sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map(session => (
            <Card key={session.id} className="bg-card border-border/50 overflow-hidden relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-50"></div>
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {format(new Date(session.date), 'MMMM d, yyyy')}
                  </div>
                  <div className="font-medium text-lg flex items-center gap-2">
                    {session.cardsPlayed} Cards Played
                    {session.moodEmoji && <span className="text-xl">{session.moodEmoji}</span>}
                  </div>
                  {session.momentTag && (
                    <div className="text-sm text-primary/80 mt-1">{session.momentTag}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-serif font-bold text-primary">+{session.scoreEarned}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Growth</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground mb-4">No sessions recorded yet.</p>
          <p className="text-sm">Head to Play to start your first connection.</p>
        </div>
      )}
    </div>
  );
}

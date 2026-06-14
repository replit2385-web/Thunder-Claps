import { useAppStore } from '@/store/appStore';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetGrowthScore } from '@workspace/api-client-react';

export default function Dashboard() {
  const couple = useAppStore(state => state.couple);
  const [, setLocation] = useLocation();

  const { data: scoreData } = useGetGrowthScore(couple?.id || '', {
    query: { enabled: !!couple?.id, queryKey: ['growth', couple?.id] }
  });

  if (!couple) return null;

  return (
    <div className="p-6 pb-24 space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif text-primary">{couple.name}</h1>
          <p className="text-muted-foreground">{couple.partner1} & {couple.partner2}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Growth</div>
          <div className="text-2xl font-bold">{scoreData?.total || 0}</div>
        </div>
      </header>

      <div className="grid gap-4">
        <Card className="bg-card hover-elevate cursor-pointer border-primary/20" onClick={() => setLocation('/play')}>
          <CardHeader>
            <CardTitle className="text-primary">Draw a Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Start a quick session and deepen your connection.</p>
          </CardContent>
        </Card>

        <Card className="bg-card hover-elevate cursor-pointer" onClick={() => setLocation('/live')}>
          <CardHeader>
            <CardTitle>Live Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Sync your screens and play together.</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card hover-elevate cursor-pointer" onClick={() => setLocation('/mirror')}>
            <CardContent className="pt-6">
              <div className="text-lg font-medium mb-1">The Mirror</div>
              <p className="text-xs text-muted-foreground">Assessments & quizzes</p>
            </CardContent>
          </Card>
          <Card className="bg-card hover-elevate cursor-pointer" onClick={() => setLocation('/blend')}>
            <CardContent className="pt-6">
              <div className="text-lg font-medium mb-1">Blend</div>
              <p className="text-xs text-muted-foreground">Two become one</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

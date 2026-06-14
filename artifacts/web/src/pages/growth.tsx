import { useAppStore } from '@/store/appStore';
import { useGetGrowthScore } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Growth() {
  const couple = useAppStore(state => state.couple);
  const { data: score } = useGetGrowthScore(couple?.id || '', {
    query: { enabled: !!couple?.id, queryKey: ['growth', couple?.id] }
  });

  if (!couple) return null;

  const data = score?.historyJson || [];

  return (
    <div className="p-6 pb-24 max-w-md mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-primary mb-2">Growth Score</h1>
        <p className="text-muted-foreground">The measure of your ongoing commitment.</p>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="bg-card border-border/50">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-serif font-bold text-primary mb-2">{score?.total || 0}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Total Points</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-serif font-bold text-foreground mb-2">{score?.streak || 0}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border/50 overflow-hidden mb-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium">Momentum</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
              ${score?.momentum === 'rising' ? 'bg-primary/20 text-primary' : 
                score?.momentum === 'steady' ? 'bg-secondary text-secondary-foreground' : 
                'bg-muted text-muted-foreground'}`}>
              {score?.momentum || 'steady'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {score?.momentum === 'rising' && "You're consistently putting in the work. Keep it up."}
            {score?.momentum === 'steady' && "Maintaining connection. Try playing a Deep card today."}
            {score?.momentum === 'cooling' && "Things have been quiet. Take 5 minutes to reconnect."}
          </p>
        </CardContent>
      </Card>

      {data.length > 1 && (
        <div className="h-64 w-full">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Score History</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.5rem' }}
                itemStyle={{ color: 'hsl(var(--primary))' }}
              />
              <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

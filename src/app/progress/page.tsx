"use client";

import { useAppStore } from "@/store/useAppStore";
import { Flame, Clock, CheckSquare, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const MOCK_CHART_DATA = [
  { name: 'Mon', minutes: 12 },
  { name: 'Tue', minutes: 18 },
  { name: 'Wed', minutes: 15 },
  { name: 'Thu', minutes: 25 },
  { name: 'Fri', minutes: 20 },
  { name: 'Sat', minutes: 30 },
  { name: 'Sun', minutes: 10 },
];

export default function ProgressPage() {
  const { streak, totalPracticeTime } = useAppStore();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="font-playfair text-3xl font-bold text-foreground mb-8">Your Progress</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3 text-primary">
              <Flame className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-foreground">{streak}</p>
            <p className="text-sm text-muted-foreground mt-1">Day Streak</p>
          </CardContent>
        </Card>
        
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-3 text-blue-600">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {Math.floor(totalPracticeTime / 60)}h {totalPracticeTime % 60}m
            </p>
            <p className="text-sm text-muted-foreground mt-1">Practice Time</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-3 text-purple-600">
              <CheckSquare className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-foreground">142</p>
            <p className="text-sm text-muted-foreground mt-1">Sentences Practiced</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3 text-amber-600">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-3xl font-bold text-foreground">87%</p>
            <p className="text-sm text-muted-foreground mt-1">Avg Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm">
        <h2 className="font-bold text-xl text-foreground mb-6">Weekly Activity (Minutes)</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_CHART_DATA}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-muted-foreground)'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-muted-foreground)'}} />
              <Tooltip 
                cursor={{fill: 'var(--color-muted)'}}
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-card-foreground)' }}
              />
              <Bar dataKey="minutes" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

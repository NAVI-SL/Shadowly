"use client";

import { PlayCircle, Mic, Activity, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-muted py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="font-playfair text-5xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
            Master Spoken English with <span className="text-primary">Precision</span>.
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Shadowly uses the proven shadowing technique. Listen to real native speakers, repeat after them, and get instant feedback on your pronunciation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/practice">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-white px-8 h-14 text-lg rounded-full w-full sm:w-auto">
                Start Practicing
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-primary/10 px-8 h-14 text-lg rounded-full w-full sm:w-auto">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features/Steps */}
      <section id="how-it-works" className="w-full py-20 bg-card text-card-foreground">
        <div className="container mx-auto px-4">
          <h2 className="font-playfair text-3xl font-bold text-center text-foreground mb-16">
            Three Steps to Natural English
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <PlayCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">1. Paste a Video</h3>
              <p className="text-muted-foreground">Use any YouTube video URL. We'll generate an interactive transcript instantly.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Headphones className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">2. Listen and Repeat</h3>
              <p className="text-muted-foreground">Listen to a native speaker, then record your own voice mimicking their rhythm.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">3. Compare and Improve</h3>
              <p className="text-muted-foreground">Compare your audio waveform with the original and receive actionable feedback.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="w-full py-20 bg-muted">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="font-playfair text-3xl font-bold text-foreground mb-12">
            Why Shadowing Works
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Pronunciation', 'Rhythm', 'Listening', 'Confidence'].map((benefit) => (
              <div key={benefit} className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border">
                <h4 className="font-bold text-foreground">{benefit}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

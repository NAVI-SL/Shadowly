"use client";

import { useAppStore } from "@/store/useAppStore";
import { Search, Volume2, CheckCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VocabularyPage() {
  const { vocabulary, toggleMastered, removeVocabulary } = useAppStore();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="font-playfair text-3xl font-bold text-foreground mb-8">Your Vocabulary</h1>
      
      <div className="flex items-center mb-8 bg-card text-card-foreground p-4 rounded-xl shadow-sm border border-border">
        <Search className="w-5 h-5 text-muted-foreground mr-3" />
        <Input 
          type="text" 
          placeholder="Search saved vocabulary..." 
          className="border-none shadow-none focus-visible:ring-0 text-lg p-0"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {vocabulary.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-muted-foreground">
            <p>You haven&apos;t saved any vocabulary yet.</p>
            <p className="mt-2">Practice with videos and click the bookmark icon to save words.</p>
          </div>
        ) : (
          vocabulary.map((item) => (
            <div key={item.id} className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl text-foreground">{item.word}</h3>
                  <button className="text-primary bg-primary/10 p-2 rounded-full hover:bg-border transition-colors">
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-muted-foreground mb-4 text-sm">{item.definition}</p>
                <div className="bg-muted p-3 rounded-lg text-sm text-foreground mb-4 italic">
                  &quot;{item.exampleSentence}&quot;
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleMastered(item.id)}
                  className={`${item.mastered ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {item.mastered ? "Mastered" : "Mark Mastered"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeVocabulary(item.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

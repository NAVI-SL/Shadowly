"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Settings, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ModeToggle } from "@/components/layout/mode-toggle";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Practice", href: "/practice" },
  { name: "Vocabulary", href: "/vocabulary" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border dark:border-border bg-card text-card-foreground dark:bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Shadowly Logo" 
              width={140} 
              height={40} 
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 h-16">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium h-full flex items-center border-b-2 transition-colors ${
                  pathname === link.href
                    ? "text-primary dark:text-emerald-400 border-primary dark:border-emerald-400"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground">
            <Bell className="h-5 w-5" />
          </button>
          <Link href="/settings" className="text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground">
            <Settings className="h-5 w-5" />
          </Link>
          <ModeToggle />
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-full px-6">
            Start Practice
          </Button>
          <div className="h-8 w-8 rounded-full bg-secondary dark:bg-secondary overflow-hidden border border-border dark:border-border">
            {/* Avatar placeholder */}
            <div className="w-full h-full bg-primary/10 dark:bg-secondary flex items-center justify-center text-primary dark:text-emerald-400 font-bold text-sm">
              U
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

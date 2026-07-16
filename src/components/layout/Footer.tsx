import Link from "next/link";
import { PlayCircle } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border dark:border-border bg-muted dark:bg-background py-8">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Shadowly Logo" 
              width={105} 
              height={30} 
              className="h-6 w-auto object-contain"
            />
            <span className="text-sm text-muted-foreground dark:text-muted-foreground ml-2">
              © 2026 Shadowly. Master English with precision.
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground dark:text-muted-foreground">
            <Link href="#" className="hover:text-foreground dark:hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground dark:hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground dark:hover:text-foreground transition-colors">Help Center</Link>
            <Link href="#" className="hover:text-foreground dark:hover:text-foreground transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

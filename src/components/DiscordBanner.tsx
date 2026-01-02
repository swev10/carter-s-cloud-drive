import { MessageCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DiscordBanner = () => {
  return (
    <div className="relative z-20 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border-b border-primary/30">
      <div className="container mx-auto px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-accent" />
            <span className="text-foreground">
              <strong>Limited Access:</strong> CarterCloud is currently invite-only.
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-accent/50 hover:bg-accent/10 hover:border-accent gap-2"
            onClick={() => window.open('https://discord.gg/MXcQVkPQ', '_blank')}
          >
            <MessageCircle className="w-4 h-4" />
            Join Discord for Access
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscordBanner;

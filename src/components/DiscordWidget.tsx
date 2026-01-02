import { MessageCircle } from 'lucide-react';
import { Button } from './ui/button';

export const DiscordWidget = () => {
    return (
        <div className="fixed bottom-6 right-6 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-1000">
            <div className="relative group">
                <div className="absolute inset-0 bg-primary blur-lg opacity-40 group-hover:opacity-60 transition-opacity rounded-full" />
                <Button
                    onClick={() => window.open('https://discord.gg/MXcQVkPQ', '_blank')}
                    size="lg"
                    className="relative h-14 w-14 rounded-full bg-gradient-to-br from-[#5865F2] to-[#4752C4] hover:scale-110 transition-transform shadow-2xl p-0"
                    title="Join our Discord"
                >
                    <MessageCircle className="w-7 h-7 text-white" />
                </Button>
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="glass px-4 py-2 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                        <p className="text-sm font-medium">Join our Discord</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscordWidget;

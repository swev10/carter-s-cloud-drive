import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, User, Lock, LogIn, Eye, EyeOff, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Globe from '@/components/Globe';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const trimmedUsername = username.trim();
    const trimmedPassword = password;

    if (!trimmedUsername || !trimmedPassword) {
      toast({
        title: 'Missing fields',
        description: 'Please enter both username and password.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(trimmedUsername, trimmedPassword);

      if (result.success) {
        toast({
          title: 'Welcome back!',
          description: `Logged in as ${trimmedUsername}`,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Authentication failed',
          variant: 'destructive',
        });
      }
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Could not connect to server',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-primary blur-2xl opacity-50 animate-pulse-glow" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
              <Cloud className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">Carter</span>Cloud
          </h1>
          <p className="text-muted-foreground mt-1">Personal Cloud Storage</p>
        </div>

        {/* Auth Card */}
        <div className="glass rounded-2xl p-8 shadow-xl">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 bg-secondary/50 border-border/50"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-secondary/50 border-border/50"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-6">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Limited Access</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  CarterCloud is currently invite-only. To request an account, please join our Discord server and reach out to an admin.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-accent/50 hover:bg-accent/10 hover:border-accent"
                  onClick={() => window.open('https://discord.gg/lovable-dev', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Join Discord to Request Access
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Globe showing server location */}
        <div className="mt-8 flex flex-col items-center">
          <p className="text-sm text-muted-foreground mb-4">Cloud Server Location</p>
          <Globe />
        </div>
      </div>
    </div>
  );
};

export default Login;

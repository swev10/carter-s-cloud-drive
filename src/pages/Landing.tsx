import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { 
  Cloud, 
  Zap, 
  Shield, 
  HardDrive, 
  ArrowRight, 
  Check,
  Lock,
  Gauge
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Globe from '@/components/Globe';

const features = [
  {
    icon: HardDrive,
    title: '10TB Storage',
    description: 'Massive storage space for all your files, documents, and media.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Upload and download at incredible speeds with our optimized infrastructure.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your files are encrypted and stored locally. No third-party access.',
  },
  {
    icon: Cloud,
    title: 'Access Anywhere',
    description: 'Access your files from any device with an internet connection.',
  },
];

const stats = [
  { value: '10TB', label: 'Storage per user' },
  { value: '99.9%', label: 'Uptime guaranteed' },
  { value: '< 50ms', label: 'Response time' },
  { value: '256-bit', label: 'Encryption' },
];

const Landing = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary blur-lg opacity-50" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <Cloud className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="gradient-text">Carter</span>Cloud
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/login">
                <Button className="gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              Now with 10TB storage per user
            </div>
            
            <h1 className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 delay-100 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0 text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Your Personal
              <br />
              <span className="gradient-text">Cloud Storage</span>
            </h1>
            
            <p className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 delay-200 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0 text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Store, organize, and access all your files in one secure place. 
              Lightning-fast uploads, military-grade encryption, and 10TB of space.
            </p>
            
            <div className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 delay-300 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <Button size="lg" className="gap-2 text-lg px-8 h-14 glow">
                  Start Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8 h-14 border-border/50">
                  <Lock className="w-5 h-5" />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 border-y border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0 text-center`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0 text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make file management effortless
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:scale-105 transition-all duration-300 group`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Server Location Section with Globe */}
      <section className="relative z-10 py-24 border-y border-border/50 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="scroll-animate opacity-0 -translate-x-8 transition-all duration-700 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-x-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                <Cloud className="w-4 h-4" />
                Global Infrastructure
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Your data, 
                <br />
                <span className="gradient-text">securely hosted</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our servers are located in New York, providing lightning-fast access 
                with enterprise-grade security. Your files never leave our secure 
                infrastructure.
              </p>
              <ul className="space-y-3">
                {[
                  'Enterprise-grade data centers',
                  '24/7 monitoring and security',
                  'Redundant backup systems',
                  'GDPR compliant storage',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="scroll-animate opacity-0 translate-x-8 transition-all duration-700 delay-200 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-x-0 flex justify-center">
              <Globe />
            </div>
          </div>
        </div>
      </section>

      {/* Speed Section */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="scroll-animate opacity-0 -translate-x-8 transition-all duration-700 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-x-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Gauge className="w-4 h-4" />
                Blazing Fast
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Upload at the
                <br />
                <span className="gradient-text">speed of light</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our infrastructure is optimized for speed. Upload gigabytes in minutes, 
                not hours. With local storage optimization and smart caching, your files 
                are always ready when you need them.
              </p>
              <ul className="space-y-3">
                {[
                  'Parallel upload processing',
                  'Smart compression technology',
                  'Instant file preview',
                  'Resumable uploads',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="scroll-animate opacity-0 translate-x-8 transition-all duration-700 delay-200 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-x-0 relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative glass rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Upload Speed</span>
                    <span className="font-medium text-primary">1.2 GB/s</span>
                  </div>
                  <div className="storage-bar h-3">
                    <div className="storage-bar-fill w-[85%]" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Download Speed</span>
                    <span className="font-medium text-primary">2.4 GB/s</span>
                  </div>
                  <div className="storage-bar h-3">
                    <div className="storage-bar-fill w-[95%]" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Latency</span>
                    <span className="font-medium text-primary">&lt; 50ms</span>
                  </div>
                  <div className="storage-bar h-3">
                    <div className="storage-bar-fill w-[15%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="scroll-animate opacity-0 scale-95 transition-all duration-700 ease-out [&.animate-in]:opacity-100 [&.animate-in]:scale-100 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join thousands of users who trust CarterCloud with their files.
            </p>
            <Link to="/login">
              <Button size="lg" className="gap-2 text-lg px-10 h-14 glow">
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-primary" />
              <span className="font-semibold">CarterCloud</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 CarterCloud. Your files, your control.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

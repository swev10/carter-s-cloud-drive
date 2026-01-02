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
import Particles from '@/components/Particles';
import DiscordBanner from '@/components/DiscordBanner';
import DiscordWidget from '@/components/DiscordWidget';

const features = [
  {
    icon: HardDrive,
    title: '500GB Storage',
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
  { value: '500GB', label: 'Storage per user' },
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
      <Particles />

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px]" />
      </div>

      <DiscordBanner />

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/home" className="hover:opacity-80 transition-opacity">
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
            </Link>

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
              Now with 500GB storage per user
            </div>

            <h1 className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 delay-100 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0 text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Your Personal
              <br />
              <span className="gradient-text">Cloud Storage</span>
            </h1>

            <p className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 delay-200 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0 text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Store, organize, and access all your files in one secure place.
              Lightning-fast uploads, military-grade encryption, and 500GB of space.
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


      {/* Pricing Section */}
      <section className="relative z-10 py-24 border-t border-border/50">
        <div className="container mx-auto px-6">
          <div className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0 text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your storage needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 delay-100 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0 p-8 rounded-3xl bg-card/50 border border-border/50 flex flex-col hover:border-primary/30 transition-all group">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <p className="text-muted-foreground text-sm">Perfect to get started</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  '500GB Secure Storage',
                  'Standard Upload Speed',
                  'Basic Support',
                  'Core Features',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/login">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 delay-200 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0 p-8 rounded-3xl bg-primary/5 border-2 border-primary relative flex flex-col hover:scale-105 transition-all shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest">
                Recommended
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">Premium</h3>
                <p className="text-primary/70 text-sm">For power users</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold">$4.99</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  '1TB Secure Storage',
                  'Priority Upload Speed',
                  'Premium Support',
                  'Advanced Features',
                  'Early Beta Access',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm italic">
                    <Check className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => window.open('https://discord.gg/MXcQVkPQ', '_blank')}
                className="w-full glow"
              >
                Upgrade Now
              </Button>
            </div>

            {/* Max Plan */}
            <div className="scroll-animate opacity-0 translate-y-8 transition-all duration-700 delay-300 ease-out [&.animate-in]:opacity-100 [&.animate-in]:translate-y-0 p-8 rounded-3xl bg-card/50 border border-border/50 flex flex-col hover:border-accent/30 transition-all group">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">Max</h3>
                <p className="text-muted-foreground text-sm">Unlimited potential</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold">$7.99</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  '2TB Secure Storage',
                  'Maximum Link Speed',
                  '24/7 VIP Support',
                  'Enterprise Features',
                  'Custom Branding',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => window.open('https://discord.gg/MXcQVkPQ', '_blank')}
                variant="outline"
                className="w-full border-accent/50 hover:bg-accent/10"
              >
                Go Max
              </Button>
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
      <DiscordWidget />
    </div>
  );
};

export default Landing;

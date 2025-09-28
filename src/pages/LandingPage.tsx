import { useState } from 'react'
import { ArrowRight, Shield, Brain, Users, BarChart3, CheckCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/components/AuthContext'
import { useNavigate } from 'react-router-dom'
import logo from '@/assets/logo.png'
import heroBanner from '@/assets/hero-banner.jpg'
import aiAnalytics from '@/assets/ai-analytics.jpg'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analytics',
    description: 'Advanced machine learning algorithms provide predictive insights for better patient outcomes and operational efficiency.'
  },
  {
    icon: Shield,
    title: 'FHIR Compliant',
    description: 'Built on HL7 FHIR standards ensuring seamless interoperability and data security across healthcare systems.'
  },
  {
    icon: Users,
    title: 'Multi-Role Support',
    description: 'Comprehensive role-based access for super admins, organization admins, practitioners, and patients.'
  },
  {
    icon: BarChart3,
    title: 'Real-time Monitoring',
    description: 'Live patient monitoring, vital signs tracking, and instant alerts for critical health events.'
  }
]

const testimonials = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Chief Medical Officer',
    organization: 'VitalAI Medical Center',
    content: 'VitalAI has revolutionized our patient care delivery. The AI insights help us make better clinical decisions.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'IT Director',
    organization: 'Community Health Network',
    content: 'The FHIR compliance and seamless integration saved us months of development time.',
    rating: 5
  }
]

export function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="VitalAI" className="h-8 w-8" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-primary">VitalAI</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Healthcare Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <Button onClick={() => navigate('/dashboard')} className="medical-button">
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/login')} className="medical-button">
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 hero-gradient opacity-5"></div>
        <div className="container mx-auto px-4 lg:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <Badge variant="outline" className="w-fit">
                  🚀 AI-Powered Healthcare Platform
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Transform Healthcare with{' '}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Intelligent
                  </span>{' '}
                  Solutions
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  VitalAI combines the power of artificial intelligence with FHIR-compliant healthcare 
                  standards to deliver unprecedented insights and improve patient outcomes.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={handleGetStarted} className="medical-button">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">FHIR Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">HIPAA Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground">AI-Powered</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl transform rotate-3"></div>
              <img 
                src={heroBanner} 
                alt="Healthcare professionals using VitalAI platform"
                className="relative rounded-2xl w-full h-auto shadow-2xl hover:shadow-xl transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="w-fit">Features</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">
              Comprehensive Healthcare Intelligence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From patient management to AI-driven insights, VitalAI provides everything 
              healthcare organizations need to deliver exceptional care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="medical-card group hover:shadow-xl">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* AI Analytics Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <img 
                src={aiAnalytics} 
                alt="AI Analytics Dashboard"
                className="rounded-2xl w-full h-auto shadow-2xl hover:shadow-xl transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl"></div>
            </div>
            
            <div className="space-y-6 order-1 lg:order-2">
              <Badge variant="outline" className="w-fit">
                🧠 AI Intelligence
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold">
                Advanced AI Models for{' '}
                <span className="text-primary">Predictive Healthcare</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Our AI models analyze patient data to predict health risks, suggest treatments, 
                and optimize care delivery. Get insights that help save lives.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Predictive risk assessment and early intervention alerts</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Treatment recommendation engine based on evidence</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Automated patient monitoring and vital signs analysis</span>
                </div>
              </div>
              
              <Button size="lg" className="medical-button">
                Explore AI Features
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="w-fit">Testimonials</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold">
              Trusted by Healthcare Leaders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="medical-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <blockquote className="text-lg mb-4">
                    "{testimonial.content}"
                  </blockquote>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.organization}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10"></div>
        <div className="container mx-auto px-4 lg:px-6 relative">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Transform Your Healthcare Organization?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join leading healthcare providers who trust VitalAI to deliver 
              better patient outcomes through intelligent healthcare solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleGetStarted} className="medical-button">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="VitalAI" className="h-6 w-6" />
              <span className="font-semibold text-primary">VitalAI</span>
              <span className="text-muted-foreground">Healthcare Intelligence Platform</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 VitalAI. All rights reserved. FHIR compliant healthcare platform.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    overflow-x: hidden;
  }
`;

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 1; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const Container = styled.div`
  position: relative;
  background: linear-gradient(135deg, #000000 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%);
  min-height: 100vh;
  overflow-x: hidden;
`;

const AnimatedBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const FloatingCube = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #8B5CF6, #A855F7);
  border-radius: 8px;
  animation: ${float} 6s ease-in-out infinite;
  opacity: 0.6;
  backdrop-filter: blur(10px);
  
  &:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
  &:nth-child(2) { top: 60%; left: 80%; animation-delay: 2s; }
  &:nth-child(3) { top: 80%; left: 20%; animation-delay: 4s; }
`;

const PulsingSphere = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, #EC4899, #F472B6);
  border-radius: 50%;
  animation: ${pulse} 4s ease-in-out infinite;
  
  &:nth-child(4) { top: 30%; right: 15%; animation-delay: 1s; }
  &:nth-child(5) { bottom: 30%; left: 15%; animation-delay: 3s; }
`;

const RotatingRing = styled.div`
  position: absolute;
  width: 80px;
  height: 80px;
  border: 3px solid transparent;
  border-top: 3px solid #8B5CF6;
  border-radius: 50%;
  animation: ${rotate} 8s linear infinite;
  
  &:nth-child(6) { top: 50%; left: 5%; }
  &:nth-child(7) { bottom: 20%; right: 10%; animation-direction: reverse; }
`;

// Navigation
const Navigation = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(45deg, #8B5CF6, #EC4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      color: #EC4899;
      transform: translateY(-2px);
    }
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Hero Section
const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  z-index: 2;
  padding: 0 2rem;
`;

const HeroContent = styled.div`
  max-width: 800px;
  animation: ${fadeInUp} 1s ease-out;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #FFFFFF, #EC4899, #8B5CF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CTAButton = styled.button`
  background: linear-gradient(45deg, #8B5CF6, #EC4899);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(139, 92, 246, 0.4);
  }
`;

// Section Base
const Section = styled.section`
  position: relative;
  padding: 5rem 2rem;
  z-index: 2;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(45deg, #FFFFFF, #EC4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Container2 = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Features Section
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, #8B5CF6, #EC4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  h3 {
    color: white;
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
  }
`;

// Roles Section
const RolesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const RoleCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.1);
  }
  
  .role-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }
  
  h3 {
    color: white;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  ul {
    list-style: none;
    text-align: left;
    
    li {
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 0.5rem;
      padding-left: 1rem;
      position: relative;
      
      &:before {
        content: '✓';
        position: absolute;
        left: 0;
        color: #EC4899;
        font-weight: bold;
      }
    }
  }
`;

// Benefits Section
const BenefitsSection = styled(Section)`
  background: rgba(0, 0, 0, 0.3);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const StatCard = styled.div`
  text-align: center;
  
  .stat-number {
    font-size: 3rem;
    font-weight: 800;
    background: linear-gradient(45deg, #8B5CF6, #EC4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.1rem;
  }
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

// CTA Section
const CTASection = styled(Section)`
  text-align: center;
  background: linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
`;

// Footer
const Footer = styled.footer`
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  padding: 3rem 2rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 2;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  h4 {
    color: white;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
  
  a, p {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    margin-bottom: 0.5rem;
    display: block;
    transition: color 0.3s ease;
    
    &:hover {
      color: #EC4899;
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
`;

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => {
      const element = el as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'all 0.8s ease-out';
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: '🛡️', title: 'Role-Based Access', desc: 'Secure access control for admins, teachers, and students' },
    { icon: '📊', title: 'Advanced Analytics', desc: 'Real-time performance tracking and detailed reports' },
    { icon: '🔒', title: 'Enterprise Security', desc: 'Bank-level security with encrypted data protection' },
    { icon: '📅', title: 'Smart Scheduling', desc: 'Automated timetable management with conflict detection' },
    { icon: '💬', title: 'Communication Hub', desc: 'Integrated messaging and notification system' },
    { icon: '📱', title: 'Mobile Responsive', desc: 'Access from any device, anywhere, anytime' },
    { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized performance for seamless user experience' },
    { icon: '🔄', title: 'Auto Sync', desc: 'Real-time data synchronization across all platforms' }
  ];

  const benefits = [
    { title: 'Streamlined Operations', desc: 'Reduce administrative workload by 60%' },
    { title: 'Enhanced Communication', desc: 'Improve parent-teacher engagement by 80%' },
    { title: 'Data-Driven Decisions', desc: 'Make informed choices with comprehensive analytics' },
    { title: 'Cost Effective', desc: 'Save up to 40% on administrative costs' }
  ];

  return (
    <>
      <GlobalStyle />
      <Container>
        <AnimatedBackground>
          <FloatingCube />
          <FloatingCube />
          <FloatingCube />
          <PulsingSphere />
          <PulsingSphere />
          <RotatingRing />
          <RotatingRing />
        </AnimatedBackground>

        <Navigation>
          <Logo>Smart CRM</Logo>
          <NavLinks>
            <a href="#features">Features</a>
            <a href="#roles">Roles</a>
            <a href="#benefits">Benefits</a>
            <a href="#contact">Contact</a>
          </NavLinks>
        </Navigation>

        <HeroSection ref={heroRef}>
          <HeroContent>
            <HeroTitle>Transform Your Institution with Smart CRM</HeroTitle>
            <HeroSubtitle>
              Comprehensive management system with role-based access, real-time analytics, 
              and intelligent automation for educational institutions.
            </HeroSubtitle>
            <CTAButton onClick={() => navigate('/role-selection')}>
              Get Started Today
            </CTAButton>
          </HeroContent>
        </HeroSection>

        <Section id="features">
          <Container2>
            <SectionTitle className="animate-on-scroll">Powerful Features</SectionTitle>
            <FeaturesGrid>
              {features.map((feature, index) => (
                <FeatureCard key={index} className="animate-on-scroll">
                  <div className="icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </FeatureCard>
              ))}
            </FeaturesGrid>
          </Container2>
        </Section>

        <Section id="roles">
          <Container2>
            <SectionTitle className="animate-on-scroll">Role-Based Portals</SectionTitle>
            <RolesGrid>
              <RoleCard className="animate-on-scroll">
                <div className="role-icon">👨💼</div>
                <h3>Admin Portal</h3>
                <ul>
                  <li>Complete user management</li>
                  <li>System configuration</li>
                  <li>Advanced reporting</li>
                  <li>Security monitoring</li>
                  <li>Schedule management</li>
                </ul>
              </RoleCard>
              <RoleCard className="animate-on-scroll">
                <div className="role-icon">👨🏫</div>
                <h3>Teacher Portal</h3>
                <ul>
                  <li>Student performance tracking</li>
                  <li>Assignment management</li>
                  <li>Class scheduling</li>
                  <li>Parent communication</li>
                  <li>Grade book management</li>
                </ul>
              </RoleCard>
              <RoleCard className="animate-on-scroll">
                <div className="role-icon">🎓</div>
                <h3>Student Portal</h3>
                <ul>
                  <li>Personal dashboard</li>
                  <li>Assignment tracking</li>
                  <li>Grade viewing</li>
                  <li>Schedule access</li>
                  <li>Progress analytics</li>
                </ul>
              </RoleCard>
            </RolesGrid>
          </Container2>
        </Section>

        <BenefitsSection id="benefits">
          <Container2>
            <SectionTitle className="animate-on-scroll">Why Choose Smart CRM?</SectionTitle>
            <StatsGrid>
              <StatCard className="animate-on-scroll">
                <div className="stat-number">500+</div>
                <div className="stat-label">Institutions</div>
              </StatCard>
              <StatCard className="animate-on-scroll">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Active Users</div>
              </StatCard>
              <StatCard className="animate-on-scroll">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </StatCard>
              <StatCard className="animate-on-scroll">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </StatCard>
            </StatsGrid>
            <BenefitsGrid>
              {benefits.map((benefit, index) => (
                <FeatureCard key={index} className="animate-on-scroll">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.desc}</p>
                </FeatureCard>
              ))}
            </BenefitsGrid>
          </Container2>
        </BenefitsSection>

        <CTASection>
          <Container2>
            <SectionTitle className="animate-on-scroll">Ready to Get Started?</SectionTitle>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', marginBottom: '2rem' }}>
              Join thousands of institutions already using Smart CRM
            </p>
            <CTAButton onClick={() => navigate('/role-selection')}>
              Start Your Journey
            </CTAButton>
          </Container2>
        </CTASection>

        <Footer id="contact">
          <FooterContent>
            <FooterSection>
              <h4>Smart CRM</h4>
              <p>Transforming education through intelligent management systems.</p>
            </FooterSection>
            <FooterSection>
              <h4>Quick Links</h4>
              <a href="#features">Features</a>
              <a href="#roles">Roles</a>
              <a href="#benefits">Benefits</a>
              <a href="#contact">Contact</a>
            </FooterSection>
            <FooterSection>
              <h4>Contact Info</h4>
              <p>Email: info@smartcrm.edu</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Address: 123 Education St, Learning City</p>
            </FooterSection>
            <FooterSection>
              <h4>Follow Us</h4>
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">LinkedIn</a>
              <a href="#">Instagram</a>
            </FooterSection>
          </FooterContent>
          <FooterBottom>
            <p>&copy; 2024 Smart Institutional CRM. All rights reserved.</p>
          </FooterBottom>
        </Footer>
      </Container>
    </>
  );
}
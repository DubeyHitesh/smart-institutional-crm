import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Torus } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const Container = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
`;

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const ContentOverlay = styled(motion.div)`
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 2rem;
  background: rgba(0,0,0,0.3);
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  margin-bottom: 1rem;
  font-weight: 800;
  background: linear-gradient(45deg, #667eea, #764ba2, #f093fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.4rem;
  margin-bottom: 3rem;
  max-width: 700px;
  line-height: 1.6;
  color: rgba(255,255,255,0.9);
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const GetStartedButton = styled(motion.button)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 18px 50px;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const Features = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 5rem;
  max-width: 1200px;
  width: 100%;
`;

const Feature = styled(motion.div)`
  background: rgba(255,255,255,0.05);
  padding: 2.5rem;
  border-radius: 20px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    background: rgba(255,255,255,0.1);
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }
  
  h3 {
    color: #667eea;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  p {
    color: rgba(255,255,255,0.8);
    line-height: 1.6;
  }
`;

// 3D Scene Components
interface FloatingProps {
  position: [number, number, number];
  color: string;
  speed?: number;
}

function FloatingCube({ position, color, speed = 1 }: FloatingProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.01 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });
  
  return (
    <Box ref={meshRef} position={position} args={[1, 1, 1]}>
      <meshStandardMaterial color={color} transparent opacity={0.8} />
    </Box>
  );
}

function FloatingSphere({ position, color, speed = 1 }: FloatingProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005 * speed;
      meshRef.current.rotation.z += 0.005 * speed;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed) * 0.3;
    }
  });
  
  return (
    <Sphere ref={meshRef} position={position} args={[0.8, 32, 32]}>
      <meshStandardMaterial color={color} transparent opacity={0.7} />
    </Sphere>
  );
}

function FloatingTorus({ position, color, speed = 1 }: FloatingProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.02 * speed;
      meshRef.current.rotation.y += 0.01 * speed;
      meshRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.4;
    }
  });
  
  return (
    <Torus ref={meshRef} position={position} args={[1, 0.3, 16, 100]}>
      <meshStandardMaterial color={color} transparent opacity={0.6} />
    </Torus>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#764ba2" />
      
      <FloatingCube position={[-4, 2, -2]} color="#667eea" speed={0.8} />
      <FloatingCube position={[4, -1, -3]} color="#764ba2" speed={1.2} />
      <FloatingSphere position={[-2, -2, -1]} color="#f093fb" speed={0.6} />
      <FloatingSphere position={[3, 3, -2]} color="#667eea" speed={1.1} />
      <FloatingTorus position={[0, 0, -4]} color="#764ba2" speed={0.9} />
      <FloatingTorus position={[-3, 1, -1]} color="#f093fb" speed={0.7} />
      
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 15px 40px rgba(102, 126, 234, 0.6)",
      transition: {
        duration: 0.3
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const featureVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    },
    hover: {
      y: -10,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <Container>
      <CanvasContainer>
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Scene />
        </Canvas>
      </CanvasContainer>
      
      <ContentOverlay
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Title variants={itemVariants}>
          Smart Institutional CRM
        </Title>
        
        <Subtitle variants={itemVariants}>
          Transform your educational institution with our comprehensive management system featuring role-based access, real-time analytics, and intelligent scheduling for admins, teachers, and students.
        </Subtitle>
        
        <GetStartedButton
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => navigate('/role-selection')}
        >
          Get Started
        </GetStartedButton>
        
        <Features
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Feature
            variants={featureVariants}
            whileHover="hover"
          >
            <h3>🎛️ Admin Dashboard</h3>
            <p>Complete user management, login tracking, schedule management, and comprehensive system administration with detailed analytics and reporting.</p>
          </Feature>
          
          <Feature
            variants={featureVariants}
            whileHover="hover"
          >
            <h3>👨‍🏫 Teacher Portal</h3>
            <p>Interactive student performance tracking, assignment management, real-time analytics, class scheduling, and seamless communication tools.</p>
          </Feature>
          
          <Feature
            variants={featureVariants}
            whileHover="hover"
          >
            <h3>🎓 Student Interface</h3>
            <p>Personal performance analytics, assignment tracking, progress visualization, schedule viewing, and comprehensive academic progress monitoring.</p>
          </Feature>
        </Features>
      </ContentOverlay>
    </Container>
  );
}
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 4rem 3rem;

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 900px;
`;

const GlitchText = styled.h1`
  font-size: 5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  color: ${({ theme }) => theme.text};

  &::before,
  &::after {
    content: "Michael Portale";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &::before {
    left: 2px;
    text-shadow: -2px 0 ${({ theme }) => theme.primary};
    clip: rect(44px, 450px, 56px, 0);
    animation: glitch-anim 5s infinite linear alternate-reverse;
  }

  &::after {
    left: -2px;
    text-shadow: -2px 0 ${({ theme }) => theme.secondary};
    clip: rect(44px, 450px, 56px, 0);
    animation: glitch-anim2 5s infinite linear alternate-reverse;
  }

  @media (max-width: 992px) {
    font-size: 3.5rem;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 576px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 2rem;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 576px) {
    font-size: 1rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Button = styled.a`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitionSpeed};
  border: none;
  cursor: pointer;
  font-size: 1rem;
`;

const PrimaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.primary};
  color: white;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  border: 2px solid ${({ theme }) => theme.primary};

  &:hover {
    background-color: rgba(74, 107, 255, 0.1);
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: bounce 2s infinite;
`;

const Mouse = styled.div`
  width: 30px;
  height: 50px;
  border: 2px solid ${({ theme }) => theme.highlight};
  border-radius: 20px;
  position: relative;

  &::before {
    content: "";
    width: 4px;
    height: 10px;
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${({ theme }) => theme.highlight};
    border-radius: 2px;
    animation: scroll 2s infinite;
  }
`;

const ScrollText = styled.p`
  margin-top: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.7;
`;

const Hero: React.FC = () => {
  return (
    <HeroSection id="home">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <HeroContent>
          <GlitchText>Michael Portale</GlitchText>
          <Subtitle>Computer Science Student at Columbia University</Subtitle>
          <ButtonContainer>
            <PrimaryButton href="#projects">View My Work</PrimaryButton>
            <SecondaryButton href="#contact">Get In Touch</SecondaryButton>
          </ButtonContainer>
        </HeroContent>
      </motion.div>
      <ScrollIndicator>
        <Mouse />
        <ScrollText>Scroll Down</ScrollText>
      </ScrollIndicator>
    </HeroSection>
  );
};

export default Hero; 
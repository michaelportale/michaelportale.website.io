import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MoonIcon, SunIcon } from '../../utils/Icons';
import { useTheme } from '../../context/ThemeContext';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  background-color: ${({ theme }) => `rgba(${theme.background === '#0f1624' ? '15, 22, 36' : '240, 240, 240'}, 0.95)`};
  backdrop-filter: blur(10px);
  transition: all 0.5s ease;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 576px) {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled.a<{ active: boolean }>`
  text-decoration: none;
  color: ${({ theme, active }) => (active ? theme.highlight : theme.text)};
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 0;
  position: relative;
  transition: all 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${({ active }) => (active ? '100%' : '0')};
    height: 2px;
    background-color: ${({ theme }) => theme.highlight};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.highlight};

    &::before {
      width: 100%;
    }
  }
`;

const ThemeToggle = styled.div`
  cursor: pointer;
  font-size: 1.2rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(30deg);
    color: ${({ theme }) => theme.highlight};
  }
`;

const Navbar: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('home');
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      let currentSection = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          currentSection = section.id;
        }
      });
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
    <NavbarContainer>
      <Logo>MP</Logo>
      <NavLinks>
        <NavLink href="#home" active={activeSection === 'home'}>
          Home
        </NavLink>
        <NavLink href="#about" active={activeSection === 'about'}>
          About
        </NavLink>
        <NavLink href="#projects" active={activeSection === 'projects'}>
          Projects
        </NavLink>
        <NavLink href="#contact" active={activeSection === 'contact'}>
          Contact
        </NavLink>
      </NavLinks>
      <ThemeToggle onClick={toggleTheme}>
        {isDarkMode ? <MoonIcon /> : <SunIcon />}
      </ThemeToggle>
    </NavbarContainer>
  );
};

export default Navbar; 
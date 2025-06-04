import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';
import { useTheme } from '../../context/ThemeContext';

const Main = styled.main`
  min-height: 100vh;
`;

const Cursor = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.highlight};
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 9999;
  transition: width 0.3s, height 0.3s, border-color 0.3s;
  display: none;

  @media (max-width: 768px) {
    display: none !important;
  }
`;

const CursorShadow = styled.div`
  width: 40px;
  height: 40px;
  background-color: rgba(100, 255, 218, 0.1);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 9998;
  transition: width 0.5s, height 0.5s;
  display: none;

  @media (max-width: 768px) {
    display: none !important;
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorShadowRef = useRef<HTMLDivElement>(null);
  useTheme();

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorShadow = cursorShadowRef.current;
    
    if (!cursor || !cursorShadow || window.innerWidth <= 768) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.display = 'block';
      cursorShadow.style.display = 'block';
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursorShadow.style.left = `${e.clientX}px`;
      cursorShadow.style.top = `${e.clientY}px`;
    };
    
    const handleMouseDown = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
      cursorShadow.style.transform = 'translate(-50%, -50%) scale(0.7)';
    };
    
    const handleMouseUp = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorShadow.style.transform = 'translate(-50%, -50%) scale(1)';
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Clean up event listeners
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      <Cursor ref={cursorRef} />
      <CursorShadow ref={cursorShadowRef} />
      <Navbar />
      <Main>{children}</Main>
      <Footer />
    </>
  );
};

export default Layout; 
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { TimesIcon } from '../../utils/Icons';
import SnakeGame from '../ui/SnakeGame';

const ProjectsSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 4rem 3rem;

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 3rem;
  position: relative;

  h2 {
    font-size: 2.5rem;
    font-weight: 700;
    display: inline-block;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -10px;
      width: 100px;
      height: 4px;
      background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
    }

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

const ProjectCard = styled(motion.div)<{ $featured?: boolean }>`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 10px;
  overflow: hidden;
  height: ${({ $featured }) => ($featured ? '300px' : '250px')};
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  grid-column: ${({ $featured }) => ($featured ? 'span 2' : 'span 1')};
  background: ${({ $featured, theme }) => 
    $featured 
      ? `linear-gradient(135deg, ${theme.cardBackground}, #1d2842)` 
      : theme.cardBackground};
  border: ${({ $featured, theme }) => 
    $featured ? `1px solid ${theme.primary}` : 'none'};

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 992px) {
    grid-column: span 1;
  }
`;

const ProjectContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ProjectTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.highlight};
`;

const ProjectDescription = styled.p`
  margin-bottom: 1.5rem;
  font-size: 1rem;
  flex: 1;
`;

const ProjectActions = styled.div`
  margin-top: auto;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitionSpeed};
  border: none;
  cursor: pointer;
  font-size: 1rem;
  background-color: ${({ theme }) => theme.primary};
  color: white;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  background-color: rgba(0, 0, 0, 0.7);
`;

const ModalContent = styled(motion.div)`
  width: 80%;
  max-width: 800px;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.highlight};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.highlight};
    transform: rotate(90deg);
  }
`;

const GameControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const Score = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.highlight};
`;

const Projects: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [score, setScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
  };

  const projectsData = [
    {
      id: 'snake',
      title: 'Snake Game',
      description: 'An interactive Snake game built with HTML Canvas and React.',
      featured: true,
      action: () => setIsModalOpen(true)
    },
    {
      id: 'project2',
      title: 'Project 2',
      description: 'Coming Soon',
      featured: false,
      action: null
    },
    {
      id: 'project3',
      title: 'Project 3',
      description: 'Coming Soon',
      featured: false,
      action: null
    }
  ];

  return (
    <ProjectsSection id="projects">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <SectionHeader>
          <h2>Projects</h2>
        </SectionHeader>
      </motion.div>

      <ProjectsGrid>
        {projectsData.map((project, index) => (
          <ProjectCard
            key={project.id}
            $featured={project.featured}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <ProjectContent>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>
              {project.action && (
                <ProjectActions>
                  <Button onClick={project.action}>
                    {project.id === 'snake' ? 'Play Game' : 'Learn More'}
                  </Button>
                </ProjectActions>
              )}
            </ProjectContent>
          </ProjectCard>
        ))}
      </ProjectsGrid>

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <ModalContent
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <ModalHeader>
                <ModalTitle>Snake Game</ModalTitle>
                <CloseButton onClick={() => setIsModalOpen(false)}>
                  <TimesIcon />
                </CloseButton>
              </ModalHeader>
              
              <SnakeGame onScoreChange={handleScoreChange} />
              
              <GameControls>
                <p>Use arrow keys to move the snake</p>
                <Score>Score: {score}</Score>
              </GameControls>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </ProjectsSection>
  );
};

export default Projects; 
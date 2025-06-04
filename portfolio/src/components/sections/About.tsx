import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutSection = styled.section`
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

const AboutContent = styled.div`
  display: flex;
  gap: 4rem;
  margin-top: 2rem;

  @media (max-width: 992px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const AboutText = styled.div`
  flex: 1;

  p {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    line-height: 1.8;
  }
`;

const SkillsContainer = styled.div`
  flex: 1;

  h3 {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

interface SkillTagProps {
  delay: number;
}

const SkillTag = styled(motion.span)<SkillTagProps>`
  background-color: ${({ theme }) => theme.cardBackground};
  padding: 0.5rem 1rem;
  border-radius: 30px;
  border: 1px solid ${({ theme }) => theme.primary};
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
    transform: translateY(-5px);
  }
`;

const skillsData = [
  'Java',
  'Python',
  'JavaScript',
  'TypeScript',
  'React',
  'HTML/CSS',
  'Node.js',
  'Git',
  'MongoDB',
  'SQL',
];

const About: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <AboutSection id="about">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <SectionHeader>
          <h2>About Me</h2>
        </SectionHeader>
      </motion.div>

      <AboutContent>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <AboutText>
            <p>
              I am a rising junior at Columbia University studying Computer Science. I have a strong foundation in programming with a focus on Java, Python, HTML, CSS, and JavaScript.
            </p>
            <p>
              My passion lies in creating interactive web experiences and applications that are both functional and visually appealing. I'm constantly learning new technologies and frameworks to expand my skill set.
            </p>
          </AboutText>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <SkillsContainer>
            <h3>Skills</h3>
            <SkillTags as={motion.div} variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {skillsData.map((skill, index) => (
                <SkillTag key={skill} delay={index * 0.1} variants={item}>
                  {skill}
                </SkillTag>
              ))}
            </SkillTags>
          </SkillsContainer>
        </motion.div>
      </AboutContent>
    </AboutSection>
  );
};

export default About; 
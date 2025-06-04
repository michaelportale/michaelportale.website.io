import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { EnvelopeIcon, LinkedinIcon, GithubIcon } from '../../utils/Icons';

const ContactSection = styled.section`
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

const ContactContent = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
`;

interface ContactItemProps {
  delay: number;
}

const ContactItem = styled(motion.div)<ContactItemProps>`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateX(10px);
  }

  svg {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.primary};
  }

  a {
    color: ${({ theme }) => theme.text};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.highlight};
    }
  }
`;

const contactLinks = [
  {
    id: 'email',
    icon: <EnvelopeIcon />,
    text: 'mvp2137@columbia.edu',
    href: 'mailto:mvp2137@columbia.edu'
  },
  {
    id: 'linkedin',
    icon: <LinkedinIcon />,
    text: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mportale/'
  },
  {
    id: 'github',
    icon: <GithubIcon />,
    text: 'GitHub',
    href: 'https://github.com/michaelportale'
  }
];

const Contact: React.FC = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <ContactSection id="contact">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <SectionHeader>
          <h2>Contact</h2>
        </SectionHeader>
      </motion.div>

      <ContactContent>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <ContactInfo>
            {contactLinks.map((link, index) => (
              <ContactItem
                key={link.id}
                delay={index * 0.1}
                variants={item}
              >
                {link.icon}
                {link.id === 'email' ? (
                  <p>{link.text}</p>
                ) : (
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.text}
                  </a>
                )}
              </ContactItem>
            ))}
          </ContactInfo>
        </motion.div>
      </ContactContent>
    </ContactSection>
  );
};

export default Contact; 
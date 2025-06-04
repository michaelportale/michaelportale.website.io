import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => `rgba(${theme.background === '#0f1624' ? '15, 22, 36' : '240, 240, 240'}, 0.8)`};
  padding: 2rem;
  text-align: center;
  margin-top: 2rem;
`;

const FooterContent = styled.div`
  p {
    font-size: 0.9rem;
    opacity: 0.7;
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <p>&copy; {new Date().getFullYear()} Michael Portale. All rights reserved.</p>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 
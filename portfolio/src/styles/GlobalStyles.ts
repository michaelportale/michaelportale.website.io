import { createGlobalStyle } from 'styled-components';
import { ThemeType } from './theme';

export const GlobalStyles = createGlobalStyle<{ theme: ThemeType }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    line-height: 1.6;
    overflow-x: hidden;
    transition: background-color 0.5s ease;
  }

  @keyframes glitch-anim {
    0% {
        clip: rect(42px, 9999px, 44px, 0);
    }
    5% {
        clip: rect(12px, 9999px, 59px, 0);
    }
    10% {
        clip: rect(48px, 9999px, 29px, 0);
    }
    15.0% {
        clip: rect(42px, 9999px, 73px, 0);
    }
    20% {
        clip: rect(63px, 9999px, 27px, 0);
    }
    25% {
        clip: rect(34px, 9999px, 55px, 0);
    }
    30.0% {
        clip: rect(86px, 9999px, 73px, 0);
    }
    35% {
        clip: rect(20px, 9999px, 20px, 0);
    }
    40% {
        clip: rect(26px, 9999px, 60px, 0);
    }
    45% {
        clip: rect(25px, 9999px, 66px, 0);
    }
    50% {
        clip: rect(57px, 9999px, 98px, 0);
    }
    55.0% {
        clip: rect(5px, 9999px, 46px, 0);
    }
    60.0% {
        clip: rect(82px, 9999px, 31px, 0);
    }
    65% {
        clip: rect(54px, 9999px, 27px, 0);
    }
    70% {
        clip: rect(28px, 9999px, 99px, 0);
    }
    75% {
        clip: rect(45px, 9999px, 69px, 0);
    }
    80% {
        clip: rect(23px, 9999px, 85px, 0);
    }
    85.0% {
        clip: rect(54px, 9999px, 84px, 0);
    }
    90% {
        clip: rect(45px, 9999px, 47px, 0);
    }
    95% {
        clip: rect(37px, 9999px, 20px, 0);
    }
    100% {
        clip: rect(4px, 9999px, 91px, 0);
    }
  }

  @keyframes glitch-anim2 {
    0% {
        clip: rect(65px, 9999px, 100px, 0);
    }
    5% {
        clip: rect(52px, 9999px, 74px, 0);
    }
    10% {
        clip: rect(79px, 9999px, 85px, 0);
    }
    15.0% {
        clip: rect(75px, 9999px, 5px, 0);
    }
    20% {
        clip: rect(67px, 9999px, 61px, 0);
    }
    25% {
        clip: rect(14px, 9999px, 79px, 0);
    }
    30.0% {
        clip: rect(1px, 9999px, 66px, 0);
    }
    35% {
        clip: rect(86px, 9999px, 30px, 0);
    }
    40% {
        clip: rect(23px, 9999px, 98px, 0);
    }
    45% {
        clip: rect(85px, 9999px, 72px, 0);
    }
    50% {
        clip: rect(71px, 9999px, 75px, 0);
    }
    55.0% {
        clip: rect(2px, 9999px, 48px, 0);
    }
    60.0% {
        clip: rect(30px, 9999px, 16px, 0);
    }
    65% {
        clip: rect(59px, 9999px, 50px, 0);
    }
    70% {
        clip: rect(41px, 9999px, 62px, 0);
    }
    75% {
        clip: rect(2px, 9999px, 82px, 0);
    }
    80% {
        clip: rect(47px, 9999px, 73px, 0);
    }
    85.0% {
        clip: rect(3px, 9999px, 27px, 0);
    }
    90% {
        clip: rect(26px, 9999px, 55px, 0);
    }
    95% {
        clip: rect(42px, 9999px, 97px, 0);
    }
    100% {
        clip: rect(38px, 9999px, 49px, 0);
    }
  }

  @keyframes scroll {
    0% {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
    100% {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
    }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
        transform: translateX(-50%) translateY(0);
    }
    40% {
        transform: translateX(-50%) translateY(-10px);
    }
    60% {
        transform: translateX(-50%) translateY(-5px);
    }
  }
`; 
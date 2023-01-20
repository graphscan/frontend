import styled from 'styled-components';
import { CloseButton as CloseButtonMixin } from '../close-button/close-button.styled';

export const ModalBackground = styled.div<{ animationDuration: number }>`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 100;
  animation: fadeIn 0.25s;

  &.fading {
    animation: fadeOut ${({ animationDuration }) => animationDuration / 1000}s;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

export const ModalComponent = styled.div`
  position: relative;
  margin: 20px;
  background: #1a2637;
  box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.05), 0px 2px 2px rgba(0, 0, 0, 0.08), inset 0px 1px 1px #253450;
  border-radius: 6px;
  overflow: hidden;
`;

export const CloseButton = styled(CloseButtonMixin)`
  position: absolute;
  top: 12px;
  right: 16px;
`;

export const Title = styled.h2`
  padding: 26px 32px 0;
  margin-bottom: 21px;
  width: 100%;
  text-align: center;
  font-weight: 600;
  font-size: 24px;
  line-height: 1;
  color: #95b0d9;

  @media (max-width: 1920px) {
    font-size: 22px;
  }

  @media (max-width: 1440px) {
    font-size: 20px;
  }

  @media (max-width: 1280px) {
    font-size: 18px;
  }
`;

export const Underline = styled.hr`
  margin: 0;
  border-color: transparent;
  border-top: 2px solid #304462;

  @media (max-width: 1280px) {
    border-width: 1px;
  }
`;

export const Content = styled.div<{ padding: number }>`
  position: relative;
  max-height: calc(100vh - 130px);
  padding: ${({ padding }) => padding}px;
  overflow: auto;
`;

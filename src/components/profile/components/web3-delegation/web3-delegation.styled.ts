import styled from 'styled-components';
import { DescriptionBlock } from '../../../common/description-block/description-block.styled';

export const Container = styled.article`
  display: grid;
  grid-template-columns: 1fr 70px 1fr;
  width: 1040px;

  @media (max-width: 1920px) {
    width: 920px;
  }

  @media (max-width: 1440px) {
    width: 830px;
  }

  @media (max-width: 1280px) {
    width: 750px;
  }
`;

export const Section = styled.section`
  position: relative;
`;

export const Background = styled(DescriptionBlock)`
  padding: 0;
  background-color: #1f2d40;
  border-radius: 6px;
`;

export const Account = styled.article`
  margin-bottom: 32px;
  display: flex;
`;

export const Userpick = styled.div`
  margin-right: 10px;
`;

export const Heading = styled.section`
  display: flex;
  align-items: center;
`;

export const HeadingText = styled.h2`
  margin-right: 12px;
  font-weight: bold;
  font-size: 26px;
  line-height: 1;
  color: #dae3ef;

  @media (max-width: 1920px) {
    font-size: 24px;
  }

  @media (max-width: 1440px) {
    font-size: 22px;
  }

  @media (max-width: 1280px) {
    font-size: 20px;
  }
`;

export const Clarification = styled.p`
  font-weight: 500;
  font-size: 20px;
  line-height: 1.14;
  color: #ff6e3f;

  @media (max-width: 1920px) {
    font-size: 18px;
  }

  @media (max-width: 1440px) {
    font-size: 16px;
  }

  @media (max-width: 1280px) {
    font-size: 14px;
  }
`;

export const Stats = styled(Background)`
  margin-bottom: 24px;
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Row = styled.div`
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  font-size: 20px;
  line-height: 1;
  color: #dae3ef;
  border-bottom: 2px solid #2b3b55;
  white-space: nowrap;

  @media (max-width: 1920px) {
    font-size: 18px;
  }

  @media (max-width: 1440px) {
    font-size: 16px;
  }

  @media (max-width: 1280px) {
    font-size: 14px;
    border-width: 1px;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const Key = styled.span`
  font-weight: 400;
`;

export const Value = styled.span`
  margin-left: 5px;
  font-weight: 700;
  font-size: 24px;
  cursor: default;

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

export const Postfix = styled.span`
  margin-left: 3px;
  font-weight: 500;
  font-size: 18px;
  line-height: 1;
  color: #687d9d;

  @media (max-width: 1920px) {
    font-size: 16px;
  }

  @media (max-width: 1440px) {
    font-size: 14px;
  }

  @media (max-width: 1280px) {
    font-size: 12px;
  }
`;

export const To = styled.section<{ active: boolean }>`
  padding-top: ${({ active }) => (active ? '20px' : '0')};
  justify-self: center;
  align-self: ${({ active }) => (active ? 'start' : 'center')};

  img {
    width: 34px;
    height: 22px;

    @media (max-width: 1920px) {
      width: 32px;
      height: 20px;
    }

    @media (max-width: 1440px) {
      width: 30px;
      height: 18px;
    }

    @media (max-width: 1280px) {
      width: 28px;
      height: 16px;
    }
  }
`;

import styled from "styled-components";

export const StyledDocs = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.21;
  color: #fff;

  @media (max-width: 1920px) {
    font-size: 18px;
  }

  @media (max-width: 1440px) {
    font-size: 16px;
  }

  @media (max-width: 1280px) {
    font-size: 14px;
  }

  &:last-of-type {
    margin-bottom: 14px;
  }

  h1 {
    margin-bottom: 24px;
    font-weight: bold;
    font-size: 30px;

    @media (max-width: 1920px) {
      font-size: 28px;
    }

    @media (max-width: 1440px) {
      font-size: 26px;
    }

    @media (max-width: 1280px) {
      font-size: 24px;
    }
  }

  a {
    font-weight: 600;
    color: #4d9fff;
    transition: color 0.2s;

    &:hover,
    &:focus {
      color: #3b73df;
    }
  }

  p {
    margin-bottom: 16px;
    font-weight: 500;

    &:last-child {
      margin-bottom: 0;
    }
  }

  ol {
    padding-left: 20px;
    width: 100%;
    list-style: decimal;
    font-weight: bold;
    font-size: 20px;

    @media (max-width: 1920px) {
      font-size: 18px;
    }

    @media (max-width: 1440px) {
      font-size: 16px;
    }

    @media (max-width: 1280px) {
      font-size: 14px;
    }

    ul {
      padding-left: 20px;
      list-style: disc;
      font-weight: 500;
      font-size: 20px;

      @media (max-width: 1920px) {
        font-size: 18px;
      }

      @media (max-width: 1440px) {
        font-size: 16px;
      }

      @media (max-width: 1280px) {
        font-size: 14px;
      }

      ul {
        padding-left: 20px;
        list-style: circle;
        font-size: 18px;

        @media (max-width: 1920px) {
          font-size: 16px;
        }

        @media (max-width: 1440px) {
          font-size: 14px;
        }

        @media (max-width: 1280px) {
          font-size: 12px;
        }

        ul {
          padding-left: 20px;
          list-style: "- ";
          font-size: 16px;

          @media (max-width: 1920px) {
            font-size: 14px;
          }

          @media (max-width: 1440px) {
            font-size: 12px;
          }

          @media (max-width: 1280px) {
            font-size: 10px;
          }

          li {
            margin: 6px 0;
          }
        }
      }
    }

    li {
      margin: 8px 0;

      p {
        margin: 8px 0;
      }
    }
  }

  footer {
    padding: 33px 0px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    width: 100%;
  }
`;

import React from "react";
import styled from "styled-components";
import { Flex } from "../Box";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { StyledToolsContainer } from "./styles";
import { FooterProps } from "./types";

const MenuItem: React.FC<React.PropsWithChildren<FooterProps>> = ({
  items,
  isDark,
  toggleTheme,
  currentLang,
  langs,
  setLang,
  cakePriceUsd,
  buyCakeLabel,
  ...props
}) => {
  const textColor = isDark ? "#FFFFFF" : "#07194F";

  return (
    <Flex
      borderTop={isDark ? "1px solid #383241" : "1px solid #E7E3EB"}
      background={isDark ? "#27262C" : "#fff"}
      p={["40px 16px", null, "56px 40px 32px 40px"]}
      {...props}
      justifyContent="center"
    >
      <Flex flexDirection="column" width={["100%", null, "1200px;"]}>
        <StyledToolsContainer
          order={[1, null, 3]}
          flexDirection={["column", null, "row"]}
          justifyContent="space-between"
        >
          <Flex order={[2, null, 1]} alignItems="center">
            <ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} />
          </Flex>
          <Flex
            width="200px"
            height="100px"
            order={[1, null, 2]}
            mb={["24px", null, "0"]}
            justifyContent="space-between"
            alignItems="center"
          >
            <StyledLink as="a" href="https://hesman.net/" target="_blank">
              <img src="https://hesman.net/wp-content/uploads/2022/02/hesman-logo.svg" alt="Hesman Shard" />
            </StyledLink>
          </Flex>
        </StyledToolsContainer>
      </Flex>
    </Flex>
  );
};

export default MenuItem;

const StyledLink = styled("a")`
  display: flex;
  align-items: center;
  .mobile-icon {
    width: 32px;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: none;
    }
  }
  .desktop-icon {
    width: 160px;
    display: none;
    ${({ theme }) => theme.mediaQueries.nav} {
      display: block;
    }
  }
  .eye {
    animation-delay: 20ms;
  }
  &:hover {
    .eye {
      transform-origin: center 60%;
      animation-duration: 350ms;
      animation-iteration-count: 1;
    }
  }
`;

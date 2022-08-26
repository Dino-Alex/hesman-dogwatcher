import React from "react";
import styled, { keyframes } from "styled-components";
import PanIcon from "./PanIcon";
import PancakeIcon from "./PancakeIcon";
import { SpinnerProps } from "./types";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const float = keyframes`
	0% {
		transform: translatey(0px);
	}
	50% {
		transform: translatey(10px);
	}
	100% {
		transform: translatey(0px);
	}
`;

const Container = styled.div`
  position: relative;
`;

const RotatingPancakeIcon = styled(PancakeIcon)`
  position: absolute;
  top: 0;
  left: 0;
  animation: ${rotate} 2s linear infinite;
  transform: translate3d(0, 0, 0);
`;

const FloatingPanIcon = styled(PanIcon)`
  animation: ${float} 6s ease-in-out infinite;
  transform: translate3d(0, 0, 0);
`;

const Wrap = styled.div`
  display:flex;
  position: relative;
  align-content: space-around;
  justify-content: center;
`

const Svg = styled.svg`
  position: absolute;
  left: -50px; 
  top: 200px;
  transform: translateY(-50%);
  fill: none;
  stroke-width: 5px;
  stroke-linecap: round;
  stroke: rgb(64, 0, 148);
`

const CircleBg = styled.circle`
  stroke-width: 8px;
  stroke: rgb(207, 205, 245);
`

const CircleAni = styled.circle`
  stroke-dasharray: 242.6;
  animation: fill-animation 1s cubic-bezier(1,1,1,1) 0s infinite;

  @keyframes fill-animation{
    0%{
      stroke-dasharray: 40 242.6;
      stroke-dashoffset: 0;
    }
    50%{
      stroke-dasharray: 141.3;
      stroke-dashoffset: 141.3;
    }
    100%{
      stroke-dasharray: 40 242.6;
      stroke-dashoffset: 282.6;
    }
  }
`


const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 128 }) => {
  return (
    <Container>
      {/* <RotatingPancakeIcon width={`${size * 0.5}px`} /> */}
      {/* <FloatingPanIcon width={`${size}px`} /> */}
      <Svg height="100" width="100" viewBox="0 0 100 100">
          <CircleBg cx="50" cy="50" r="45" />
          <CircleAni cx="50" cy="50" r="45" />
      </Svg>
    </Container>
  );
};

export default Spinner;

import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

interface LogoProps extends SvgProps {
  isDark: boolean;
}

const Logo: React.FC<LogoProps> = ({ isDark, ...props }) => {
  const textColor = isDark ? "#FFFFFF" : "#07194F";
  return isDark ? (
    <img src="https://hesman.net/wp-content/uploads/2022/02/hesman-logo.svg" alt="Hesman Shard" width="80" />
  ) : (
    <img src="https://hesman.net/wp-content/uploads/2022/02/hesman-logo.svg" alt="Hesman Shard" width="80" />
  );
};

export default React.memo(Logo, (prev, next) => prev.isDark === next.isDark);

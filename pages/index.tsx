import React from "react";
import { Parallax, ParallaxLayer } from '@react-spring/parallax'

export default () => {
  return (
    <Parallax pages={3}>
      <ParallaxLayer offset={1} speed={1} style={{ backgroundColor: "blue" }} />
    </Parallax>
  );
};

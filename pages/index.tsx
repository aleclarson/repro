import React from "react";
const { Parallax, ParallaxLayer } = require("react-spring/addons.cjs");
// import { Parallax, ParallaxLayer } from 'react-spring/addons'
// import { Parallax, ParallaxLayer } from 'react-spring/addons.cjs'

export default () => {
  return (
    <Parallax pages={3}>
      <ParallaxLayer offset={1} speed={1} style={{ backgroundColor: "blue" }} />
    </Parallax>
  );
};

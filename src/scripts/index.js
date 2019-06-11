import { Spring, a } from "@react-spring/web";
import ReactDOM from "react-dom";
import React from "react";

const AnimatedView = createAnimatedComponent("div");

const App = () => (
  <Spring
    from={{ width: 0, height: 0, backgroundColor: "transparent" }}
    to={async update => {
      while (true) {
        const size = Math.random() * 1000;
        await update({ width: size, height: size, backgroundColor: "red" });
        await update({ backgroundColor: "transparent" });
        await update({ width: 0, height: 0, immediate: true });
      }
    }}
  >
    {props => <a.div style={props} />}
  </Spring>
);

ReactDOM.render(<App />, document.body);

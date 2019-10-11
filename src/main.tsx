import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const DEFAULT_MESSAGE = "loading ...";

const MyComponent: React.FC<{ level: number; color: string }> = ({
  level,
  color
}) => {
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  useEffect(() => {
    const newMessage = `Level ${level}`;
    console.log(newMessage);
    setMessage(newMessage);
  }, [level]);

  return (
    <div style={{ border: `4px solid ${color}` }}>
      {message}
      {message !== DEFAULT_MESSAGE && level > 0 && (
        <MyComponent level={level - 1} color={color} />
      )}
    </div>
  );
};

ReactDOM.render(
  <MyComponent level={10} color="green" />,
  document.querySelector("#root1")
);
ReactDOM.render(
  <MyComponent level={10} color="red" />,
  document.querySelector("#root2")
);
ReactDOM.render(
  <MyComponent level={10} color="yellow" />,
  document.querySelector("#root3")
);

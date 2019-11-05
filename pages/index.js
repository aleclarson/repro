import { useTransition, animated } from "react-spring";

const Cmp = React.memo(() => {
  const [bool, set] = React.useState(false);
  const t = useTransition(bool, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 }
  });
  return (
    <div>
      <button onClick={() => set(v => !v)}>toggle</button>
      {t((style, item) => {
        return item ? (
          <animated.div style={style}>
            hello
          </animated.div>
        ) : null;
      })}
    </div>
  );
});

const Page = () => {
  return <Cmp />;
};

export default Page;

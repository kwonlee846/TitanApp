import { useState } from "react";
import { Header } from "./Header";
import { SelfDiagnosis } from "./SelfDiagnosis";
import { SoundGauge } from "./SoundGauge";
import { useLocation } from "react-router-dom";

export const Homepage = () => {
  const [dbLevel, setDbLevel] = useState<number>(0);
  const location = useLocation();
  const username = location.state?.username || "";

  return (
    <>
      <Header username={username} />
      <SoundGauge dbLevel={dbLevel} setDbLevel={setDbLevel} />
      <SelfDiagnosis dbLevel={dbLevel} username={username} />
    </>
  );
};

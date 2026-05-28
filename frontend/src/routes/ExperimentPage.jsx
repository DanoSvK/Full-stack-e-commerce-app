import { useState } from "react";

import { TestTube2 } from "lucide-react";

import KillSwitch from "../components/KillSwitch";

function ExperimentPage() {
  const [isExperimentActive, setIsExperimentActive] = useState(true);
  const content = {
    title: "Experiments",
    secondaryTitle: "Experiment kill switch",
    text: "Run A/B tests, multivariate tests, and personalization experiments. Monitor performance and optimize your e-commerce flow.",
    secondaryText: isExperimentActive
      ? "Experiments active"
      : "All experiments disabled",
    icon: TestTube2,
  };

  function handleKillSwitch() {
    setIsExperimentActive(!isExperimentActive);
  }

  return (
    <KillSwitch
      content={content}
      onKillSwitch={handleKillSwitch}
      isActive={isExperimentActive}
    />
  );
}

export default ExperimentPage;

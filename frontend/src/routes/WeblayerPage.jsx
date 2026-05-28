import { Layers } from "lucide-react";

import KillSwitch from "../components/KillSwitch";
import { useState } from "react";

function WeblayerPage() {
  const [isWeblayerActive, setIsWeblayerActive] = useState(true);

  const content = {
    title: "Weblayers",
    secondaryTitle: "Weblayer kill switch",
    text: "Manage and test dynamic overlays, banners, and personalized content. Use the kill switch to globally disable all weblayers for testing.",
    secondaryText: isWeblayerActive
      ? "Weblayers active"
      : " All weblayers disabled",
    icon: Layers,
  };

  function handleKillSwitch() {
    setIsWeblayerActive(!isWeblayerActive);
  }

  return (
    <KillSwitch
      content={content}
      isActive={isWeblayerActive}
      onKillSwitch={handleKillSwitch}
    />
  );
}

export default WeblayerPage;

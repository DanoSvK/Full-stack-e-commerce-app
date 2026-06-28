import Profile from "../features/account/Profile";
import Wishlist from "../features/account/Wishlist";
import Orders from "../features/account/Orders";
import Security from "../features/account/Security";
import AccountSidebar from "../features/account/AccountSidebar";

import { useState } from "react";
import { User, Heart, Shield, Package } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const items = [
    { name: "profile", label: "Profile", icon: User, component: Profile },
    { name: "wishlist", label: "Wishlist", icon: Heart, component: Wishlist },
    { name: "orders", label: "Orders", icon: Package, component: Orders },
    { name: "security", label: "Security", icon: Shield, component: Security },
  ];

  const activeItem = items.find((item) => item.name === activeTab);
  const Content = activeItem?.component || Profile;

  function handleActive(name) {
    setActiveTab(name);
  }

  return (
    <div className="flex gap-12 flex-col md:flex-row">
      <AccountSidebar
        key={activeTab}
        onHandleActive={handleActive}
        activeTab={activeTab}
        items={items}
      />

      <section className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <Content />
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}

export default AccountPage;

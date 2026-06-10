export const bre = () => {
  if (typeof window === "undefined") return null;
  return window.exponea || window.brweb || null;
};

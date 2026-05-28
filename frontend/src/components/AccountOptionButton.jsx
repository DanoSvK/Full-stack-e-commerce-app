function AccountOptionButton() {
  const btnClassName =
    "w-full flex items-center gap-3 px-4 py-3 cursor-pointer hover:text-white hover:bg-zinc-900 rounded-xl text-sm font-medium transition-all font-bold";

    

  return (
    <button className={`${btnClassName} text-zinc-950 focus:bg-accent`}>
      <User size={20} aria-hidden="true" />
      <span>Profile</span>
    </button>
  );
}

export default AccountOptionButton;

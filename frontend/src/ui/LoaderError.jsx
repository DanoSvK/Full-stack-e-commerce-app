function LoaderError({ message = "Something went wrong!" }) {
  return (
    <div className="w-full h-2/3 bg-[#FFE9EA] p-10 text-center">
      <h1 className="text-xl text-black font-black tracking-tighter uppercase">
        {message}
      </h1>
    </div>
  );
}

export default LoaderError;

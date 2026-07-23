import { Link, useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center flex-col items-center gap-2">
      <h1 className="text-3xl text-center">404 </h1>
      <h1 className="text-3xl text-center">Page not found</h1>
      <img src="/not-found.png" alt="" className="w-full h-full max-w-115" />
      <button onClick={() => navigate(-1)} className="btn-secondary">
        Go back
      </button>
    </div>
  );
}

export default NotFoundPage;

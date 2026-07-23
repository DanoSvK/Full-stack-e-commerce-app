import { Link, useNavigate } from "react-router-dom";

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center flex-col items-center gap-2">
      <h1 className="text-3xl text-center">Something went wrong</h1>
      <p className="max-w-120 text-center">
        An unexpected error occurred on this page. Try refreshing — if the
        problem keeps happening, contact support and we'll look into it.
      </p>
      <img
        src="/unexpected-error.png"
        alt=""
        className="w-full h-full max-w-115"
      />
      <button onClick={() => navigate(-1)} className="btn-primary">
        Go back
      </button>
    </div>
  );
}

export default ErrorPage;

function LoaderError({
  message = "Something went wrong!",
  onRetry,
  isRetrying,
}) {
  return (
    <div className="rounded-lg bg-red-50 p-4 text-red-800">
      <p className="font-medium">{message}</p>

      <p className="mt-1 text-sm">Please try again in a moment.</p>

      {onRetry && (
        <button
          onClick={() => onRetry()}
          disabled={isRetrying}
          className="mt-3 rounded-md bg-red-100 px-3 py-2
                   text-sm font-medium hover:bg-red-200
                   disabled:opacity-50"
        >
          {isRetrying ? "Retrying..." : "Try again"}
        </button>
      )}
    </div>
  );
}

export default LoaderError;

import AppError from "../utils/appError.js";

// Missing/invalid fields, wrong types in query
const handlePrismaValidationError = (err) => {
  const match = err.message.match(/Argument `(\w+)`.*$/m);
  const detail = match ? match[0] : "Invalid input data";
  return new AppError(`Validation failed: ${detail}`, 400);
};

// Known DB constraint errors (unique, foreign key, not found, etc.)
const handlePrismaKnownRequestError = (err) => {
  // P1xxx are infra/config errors, not user errors — don't expose them
  if (err.code.startsWith("P1")) {
    const infraErr = new AppError("Internal server error", 500);
    infraErr.isOperational = false;
    return infraErr;
  }

  switch (err.code) {
    case "P2002": {
      const fields =
        err.meta?.driverAdapterError?.cause?.constraint?.fields?.join(", ") ??
        "field";
      return new AppError(
        `${fields.charAt(0).toUpperCase() + fields.slice(1)} already exists`,
        409,
      );
    }
    case "P2025":
      return new AppError("Record not found", 404);
    case "P2003": {
      const field = err.meta?.field_name ?? "field";
      return new AppError(`Related record not found for: ${field}`, 400);
    }
    default:
      return new AppError(`Database error (${err.code})`, 400);
  }
};

// Unexpected DB errors with no specific code
const handlePrismaUnknownRequestError = () => {
  return new AppError("An unexpected database error occurred", 500);
};

const handleJWTError = () => {
  return new AppError("Invalid session. Please log in again!", 401);
};

const handleTokenExpiredError = () => {
  return new AppError("Your session has expired. Please log in again!", 401);
};

// Handle detailed error message in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Handle brief error message in production
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error("ERROR 💥", err);

    res.status(500).json({
      status: "error",
      message: err.message || "Something went wrong!",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // Pass err directly, no spread
    let error = err;

    if (error.name === "PrismaClientValidationError")
      error = handlePrismaValidationError(error);

    if (error.name === "PrismaClientKnownRequestError")
      error = handlePrismaKnownRequestError(error);

    if (error.name === "PrismaClientUnknownRequestError")
      error = handlePrismaUnknownRequestError(error);

    if (error.name === "JsonWebTokenError") error = handleJWTError();

    if (error.name === "TokenExpiredError") error = handleTokenExpiredError();

    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;

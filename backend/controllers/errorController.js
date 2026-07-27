import AppError from "../utils/appError.js";
import logger from "../utils/logger.js";

// Missing/invalid fields, wrong types in query
const handlePrismaValidationError = (err) => {
  // Full detail goes to server logs only — never to the client
  logger.warn({ err: err.message }, "Prisma validation error");
  return new AppError("Invalid input data. Please check your request.", 400);
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

      logger.debug(
        { fieldCount: fields.split(", ").length },
        "Unique constraint violation",
      );
      if (fields.split(", ").length > 1) {
        return new AppError("This record already exists.", 409);
      }

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
      return new AppError(`Internal server error`, 500);
  }
};

const handlePrismaDriverAdapterError = (err) => {
  const appErr = new AppError("Internal server error", 500);
  appErr.isOperational = false;
  return appErr;
};

// Unexpected DB errors with no specific code
const handlePrismaUnknownRequestError = () => {
  return new AppError("Internal server error", 500);
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
    logger.error({ err }, "Unexpected error");

    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
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

    if (error.name === "DriverAdapterError")
      error = handlePrismaDriverAdapterError(error);

    if (error.name === "JsonWebTokenError") error = handleJWTError();

    if (error.name === "TokenExpiredError") error = handleTokenExpiredError();

    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;

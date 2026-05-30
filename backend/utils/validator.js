import { ZodError } from "zod";
import catchAsync from "./catchAsync.js";

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        status: "fail",
        errors: err.flatten(),
      });
    }

    next(err);
  }
};

export default validate;

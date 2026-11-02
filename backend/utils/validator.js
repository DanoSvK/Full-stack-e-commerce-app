import { ZodError } from "zod";
import * as z from "zod";

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed;

    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        status: "fail",
        message: [...new Set(err.issues.map((issue) => issue.message))].join(
          ". ",
        ),
        errors: z.treeifyError(err),
      });
    }

    next(err);
  }
};

export default validate;

import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const taskSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name is a mandatory field and needs to be a string!",
    },
  },
  content: {
    in: ["body"],
    isString: {
      errorMessage: "Description is a mandatory field and needs to be a string!",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a string",
    },
  },
  done: {
    in: ["body"],
    isString: {
      errorMessage: "Done is a mandatory field and needs to be a string",
    },
  },
};

export const checkTaskSchema = checkSchema(taskSchema);

export const triggerBadRequest = (req, res, next) => {
  const errorList = validationResult(req);

  if (!errorList.isEmpty()) {
    next(createHttpError(400, "Error during post validation", { errors: errorList.array() }));
    // next(createHttpError(400, "Error during post validation"));
  } else {
    next();
  }
};

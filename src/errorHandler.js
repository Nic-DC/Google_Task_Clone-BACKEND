export const badRequestHandler = (err, req, res, next) => {
  // 400
  // if(responsibility of that kind of error is mine) send the error back to the client as response
  // else send the error to the next error handler
  if (err.status === 400) {
    res.status(400).send({ message: err.message, list: err.errors.map((error) => error.msg) });
    // res.status(400).send({ message: err.message });
  } else {
    next(err);
  }
};

export const notFoundHandler = (err, req, res, next) => {
  // 404
  if (err.status === 404) {
    res.status(404).send({ message: err.message });
  } else {
    next(err);
  }
};

export const serverErrorHandler = (err, req, res, next) => {
  console.log("THE ERROR IS FROM ABOVE: ", err);
  res.status(500).send({ message: "An error occured on our side and we'll fix it shortly!" });
};

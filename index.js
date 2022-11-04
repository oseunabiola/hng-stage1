const express = require("express");

const app = express();

const PORT = 3000;

app.disable("x-powered-by");
app.disable("etag");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

class CustomError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "CustomError";
  }

  static badRequest(message) {
    return new CustomError(405, message);
  }
  static notFound(message) {
    return new CustomError(404, message);
  }
}

app.route("/api/me").get(handleMe).all(methodNotAllowed);
app.route("/api/arithmetic").post(handleArithmetic).all(methodNotAllowed);
app.use((err, req, res, next) => {
  console.log(err);

  let message = "Oops! Something went wrong.",
    code = 500;
  if (err.name === "CustomError") {
    code = err.code;
    message = err.message;
  }

  res.status(code).json({ message, success: false });
});

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});

function handleArithmetic(req, res) {
  let { operation_type, x, y } = req.body;

  x = Number(x);
  y = Number(y);
  let result;
  switch (operation_type) {
    case "addition":
      result = x + y;
      break;
    case "subtraction":
      result = x - y;
      break;
    case "multiplication":
      result = x * y;
      break;

    default:
      throw CustomError.badRequest("Operation type not supported");
  }

  res.end(
    JSON.stringify({
      slackUsername: "oseunabiola",
      operation_type: req.body.operation_type.toUpperCase(),
      result,
    })
  );
}

function handleMe(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    slackUsername: "oseunabiola",
    backend: true,
    age: 30,
    bio: "I am Oluwaseun. I am a software developer.",
  });
}

function methodNotAllowed(req, res, next) {
  res.status(405).json({ message: "Method not allowed", success: false });
}

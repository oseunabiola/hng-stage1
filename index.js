const http = require("http");

const PORT = 3000;

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

const server = http.createServer((req, res) => {
  try {
    if (req?.method?.toUpperCase() !== "GET") throw CustomError.badRequest("Method not allowed");

    if (req?.url?.toLowerCase() !== "/api/me") throw CustomError.badRequest("Not found");

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        slackUsername: "oseunabiola",
        backend: true,
        age: 30,
        bio: "I am Oluwaseun. I am a software developer.",
      })
    );
  } catch (error) {
    let message = "Oops! Something went wrong.",
      code = 500;
    if (error.name === "CustomError") {
      code = error.code;
      message = error.message;
    }

    res.statusCode = code;
    res.end(JSON.stringify({ message, success: false }));
  }
});

server.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});

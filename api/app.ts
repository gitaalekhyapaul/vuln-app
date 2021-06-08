import express, { Request, Response, NextFunction, Express } from "express";
import { config as dotenvConfig } from "dotenv";
import { join } from "path";

dotenvConfig();

const app: Express = express();
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.render("index");
});

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    res.status(500).json({
      success: false,
      error: `${err.name} : ${err.message}`,
    });
  } else {
    res.status(500).json({
      success: false,
      error: "Some Error Occurred!",
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server running mode:${process.env.NODE_ENV} on port:${process.env.PORT}`
  );
});

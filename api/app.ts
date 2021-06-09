import express, { Request, Response, NextFunction, Express } from "express";
import { config as dotenvConfig } from "dotenv";
import { join } from "path";
import { unserialize } from "node-serialize";

dotenvConfig();

const app: Express = express();
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));
app.use(express.json());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.render("index", { result: null });
});

app.post(
  "/api/v1/uppercase",
  (req: Request, res: Response, next: NextFunction) => {
    const payload = Buffer.from(req.body.payload, "base64").toString();
    console.log(payload);
    const parsed = unserialize(payload);
    console.log(parsed);
    const uppercase = parsed.word.toUpperCase();
    res.status(200).json({ success: true, result: uppercase });
  }
);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.dir(err);
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

process.on("SIGHUP", () => {
  console.log("Received SIGINT. Bye!");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("Received SIGINT. Bye!");
  process.exit(0);
});

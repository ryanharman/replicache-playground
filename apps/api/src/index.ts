import express from "express";
import cors from "cors";

const app = express();
const port = 3001;

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use(express.json());

app.post("/push", (req, res) => {
  console.log("Push URL hit");
  console.log({ body: req.body as unknown });
  res.send({ message: "Hello from the API" });
});

app.post("/pull", (req, res) => {
  console.log("Pull URL hit");
  console.log({ body: req.body as unknown });
  res.send({ message: "Hello from the API" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

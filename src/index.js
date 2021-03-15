import express from "express";
import router from "./routes";
import path from "path";
import { urlencoded } from "body-parser";
import "./discordbot";

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(path.join(__dirname, "../public")));
app.use(urlencoded({ extended: true }));
app.use(router);

app.listen(process.env.PJS_PORT, () => {
  console.log(`Listening on ${process.env.PJS_PORT}`);
});

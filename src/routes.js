import { Router } from "express";
import * as sql from "./sql";
import json5 from "json5";

const router = Router();

router.get("/", (_, res) => res.render("index"));
router.get("/create", (_, res) => res.render("create"));

router.post("/create", async (req, res) => {
  if (!req.body || !req.body.name || !req.body.json) return res.status(400);
  let parsed;
  try {
    parsed = json5.parse(req.body.json);
  } catch (err) {
    return res.render("create", { type: "failjson" });
  }
  if (await sql.getTag(req.body.name)) {
    return res.render("create", { type: "tagexists" });
  }
  await sql.addTag(req.body.name.split(" ").join("_"), JSON.stringify(parsed));
  return res.redirect("/");
});

router.get("/list", async (req, res) => {
  return res.render("list", { tags: await sql.listTags() });
});

router.get("/:name/edit", async (req, res) => {
  if (!(await sql.getTag(req.params.name))) return res.status(404);
  else {
    const tag = await sql.getTag(req.params.name);
    return res.render("edit", { json: tag.data });
  }
});

router.post("/:name/edit", async (req, res) => {
  if (!(await sql.getTag(req.params.name))) return res.status(404);
  if (!req.body || !req.body.json) return res.status(400);
  else {
    await sql.updateTag(req.params.name, req.body.json);
    return res.redirect("/list");
  }
});

router.get("/:name/delete", async (req, res) => {
  await sql.deleteTag(req.params.name);
  return res.redirect("/list");
});

export default router;

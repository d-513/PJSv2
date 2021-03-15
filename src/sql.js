import { knex } from "./knex";

export async function addTag(name, data) {
  await knex("tags").insert({ name, data });
}

export async function listTags() {
  return await knex("tags").select();
}

export async function getTag(name) {
  const a1 = await knex("tags").where({ name }).select();
  return a1[0];
}

export async function updateTag(name, data) {
  await knex("tags").where({ name }).update({ data });
}

export async function deleteTag(name) {
  await knex("tags").where({ name }).delete();
}

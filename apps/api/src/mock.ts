import { createId } from "@paralleldrive/cuid2";
import { db, replicache_space } from "@playground/db";
import { type Response, type Request } from "express";
import { type PushRequestV1 } from "replicache";

async function mockHandler(
  _req: Request<unknown, unknown, PushRequestV1>,
  res: Response,
) {
  const spaceID = createId();
  await db
    .insert(replicache_space)
    .values({
      id: spaceID,
      version: 1,
    })
    .execute();

  res.send({ spaceID });
}

export { mockHandler };

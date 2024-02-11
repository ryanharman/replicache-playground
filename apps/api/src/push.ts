/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { db, eq, inArray } from "@playground/db";
import {
  getCurrentSpaceVersion,
  getLastMutationIDs,
} from "@playground/db/src/core/replicache.js";
import { replicache_space, replicache_client } from "@playground/db/src/schema";
import { type Response, type Request } from "express";
import { type PushRequestV1 } from "replicache";

async function pushHandler(
  req: Request<unknown, unknown, PushRequestV1>,
  res: Response,
) {
  const t0 = Date.now();

  const push = req.body;
  console.log("Processing push ", JSON.stringify(push, null, 2));

  if (req.query.spaceID === undefined) {
    res.status(400).send("Missing spaceID");
    return;
  }

  const spaceID = req.query.spaceID as string;

  const previousSpaceVersion = await getCurrentSpaceVersion(spaceID);

  if (!previousSpaceVersion) {
    throw new Error(`Unknown space ${spaceID}`);
  }

  const nextVersion = previousSpaceVersion.version + 1;
  const clientIDs = [...new Set(push.mutations.map((m) => m.clientID))];

  const lastMutationIDPerClient = await getLastMutationIDs(clientIDs);

  try {
    for (const mutation of push.mutations) {
      const t1 = Date.now();

      const lastMutationID = lastMutationIDPerClient.find(
        (x) => x.id === mutation.clientID,
      )?.lastMutationID;

      if (lastMutationID === undefined) {
        throw new Error(
          `Unknown clientID ${mutation.clientID} in push request`,
        );
      }

      const expectedMutationID = lastMutationID + 1;

      if (mutation.id < expectedMutationID) {
        console.log(
          `Mutation ID ${mutation.id} has already been processed - skipping`,
        );
        continue;
      }
      if (mutation.id > expectedMutationID) {
        console.warn(
          `Mutation ID ${mutation.id} is from the future, lastMutationID is ${lastMutationID}`,
        );
        break;
      }

      try {
        await db.transaction(async (tx) => {
          const { clientID, args, name } = mutation;
          // @ts-expect-error - we cant know for sure if this table is valid, but we check below
          const tableToUpdateFromSchema = tx._.schema[name];

          if (!tableToUpdateFromSchema) {
            throw new Error(`Unknown table ${name}`);
          }

          // 🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧

          // TODO: This is where we need to expose our
          // "server mutators" that we can use to update
          // the database.

          // This wont actually work, we need to declare our own
          // upsert function that is based on the name
          const updatedTable = await tx
            .update(tableToUpdateFromSchema)
            .set(args as any)
            .where(eq(tableToUpdateFromSchema.id, mutation.id));

          // 🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧

          await tx
            .update(replicache_client)
            .set({ lastMutationID: expectedMutationID })
            .where(eq(replicache_client.id, clientID));

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return updatedTable;
        });
      } catch (e) {
        console.error(e);
      }

      console.log("Processed mutation", mutation, "in", Date.now() - t1, "ms");
    }

    // Once we process all mutations successfully, update the
    // space version and client last modified version
    await db
      .update(replicache_space)
      .set({ version: nextVersion })
      .where(eq(replicache_space.id, spaceID));
    await db
      .update(replicache_client)
      .set({ lastModifiedVersion: nextVersion })
      .where(inArray(replicache_client.id, clientIDs));

    res.send("{}");
    // TODO: Send a poke
    // await sendPoke();
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  } finally {
    console.log("Processed push in", Date.now() - t0, "ms");
  }
}

export { pushHandler };

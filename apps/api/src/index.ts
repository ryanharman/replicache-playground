/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import express, { type Request } from "express";
import cors from "cors";
import { db, eq, inArray } from "@playground/db";

import { type PushRequestV1 } from "replicache";
import {
  replicache_client,
  replicache_space,
} from "@playground/db/src/models/replicache.js";

const app = express();
const port = 3001;

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use(express.json());

app.post(
  "/push",
  async (req: Request<unknown, unknown, PushRequestV1>, res) => {
    const t0 = Date.now();

    const push = req.body;
    console.log("Processing push ", JSON.stringify(push, null, 2));

    if (req.query.spaceID === undefined) {
      res.status(400).send("Missing spaceID");
      return;
    }

    const spaceID = req.query.spaceID as string;

    const previousSpaceVersion = await db.query.replicache_space.findFirst({
      where: eq(replicache_space.id, spaceID),
      columns: { version: true },
    });

    if (!previousSpaceVersion) {
      throw new Error(`Unknown space ${spaceID}`);
    }

    const nextVersion = previousSpaceVersion.version + 1;
    const clientIDs = [...new Set(push.mutations.map((m) => m.clientID))];

    const lastMutationIDPerClient = await db.query.replicache_client.findMany({
      where: inArray(replicache_client.id, clientIDs),
      columns: {
        id: true,
        lastMutationID: true,
      },
    });

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
            const { clientID } = mutation;
            // TODO: Process the mutation based on the mutator name
            const tableForUpdate = mutation.name;
            // @ts-expect-error - we cant know for sure if this table is valid, but we check below
            const tableToUpdateFromSchema = tx._.schema[tableForUpdate];

            if (!tableToUpdateFromSchema) {
              throw new Error(`Unknown table ${tableForUpdate}`);
            }

            const updatedTable = await tx
              .update(tableToUpdateFromSchema)
              .set(mutation.args as any)
              .where(eq(tableToUpdateFromSchema.id, mutation.id));

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

        console.log(
          "Processed mutation",
          mutation,
          "in",
          Date.now() - t1,
          "ms",
        );
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
  },
);

app.post("/pull", (req, res) => {
  console.log("Pull URL hit");
  console.log({ body: req.body as unknown });
  res.send({ message: "Hello from the API" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

import {
  db,
  eq,
  getCurrentSpaceVersion,
  getLastMutationIDs,
  replicache_space,
  replicache_client,
  replicache_client_group,
} from "@playground/db";
import { type Response, type Request } from "express";
import { type PushRequestV1 } from "replicache";
import { serverMutators } from "@playground/replicache";

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
  const clientGroupID = req.body.clientGroupID;

  const previousSpaceVersion = await getCurrentSpaceVersion(spaceID);

  if (!previousSpaceVersion) {
    throw new Error(`Unknown space ${spaceID}`);
  }

  const nextVersion = previousSpaceVersion.version + 1;
  const clientIDs = [...new Set(push.mutations.map((m) => m.clientID))];

  const lastMutationIDPerClient = await getLastMutationIDs(clientIDs);

  try {
    for (const mutation of push.mutations) {
      const { args, name, clientID, id: mutationID } = mutation;
      const t1 = Date.now();

      const lastMutationID =
        lastMutationIDPerClient.find((x) => x.id === mutation.clientID)
          ?.lastMutationID ?? 0;

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
        console.log("Executing mutation", name, args);
        await serverMutators.execute(name, args);
      } catch (e) {
        console.error(e);
      }

      console.log("Updating client tables", clientGroupID, clientID);
      // If the user doesn't have an existing client group
      // we create one. Same for the client table.
      await db
        .insert(replicache_client_group)
        .values({
          id: clientGroupID,
          space_id: spaceID,
          userID: "THIS NEEDS UPDATING",
        })
        .onDuplicateKeyUpdate({
          set: {
            userID: "THIS NEEDS UPDATING",
            space_id: spaceID,
          },
        });
      await db
        .insert(replicache_client)
        .values({
          id: clientID,
          clientGroupID: clientGroupID,
          lastMutationID: mutationID,
          lastModifiedVersion: nextVersion,
        })
        .onDuplicateKeyUpdate({
          set: {
            lastMutationID: mutationID,
            lastModifiedVersion: nextVersion,
          },
        });

      console.log("Processed mutation", mutation, "in", Date.now() - t1, "ms");
    }

    // Once we process all mutations successfully, update the
    // space version
    await db
      .update(replicache_space)
      .set({ version: nextVersion })
      .where(eq(replicache_space.id, spaceID));

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

import z from "zod";
import { zod } from "../utils";
import { db } from "../index";
import { inArray, eq } from "drizzle-orm";
import { replicache_client, replicache_space } from "../schema";

const getCurrentSpaceVersion = zod(z.string(), (spaceID) =>
  db.query.replicache_space.findFirst({
    where: eq(replicache_space.id, spaceID),
    columns: { version: true },
  }),
);

const getLastMutationIDs = zod(z.array(z.string()), (input) =>
  db.query.replicache_client.findMany({
    where: inArray(replicache_client.id, input),
    columns: {
      id: true,
      lastMutationID: true,
    },
  }),
);

export { getCurrentSpaceVersion, getLastMutationIDs };

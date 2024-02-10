import { createStore } from "solid-js/store";
import { useReplicache } from "../providers";
import { type Replicache } from "replicache";
import { type M } from "./mutators";
import { createMemo } from "solid-js";

/**
 * End goal of the subscribe function: we have an object
 * of drizzle schemas (zod/valibot/whatever) that we can
 * get the table name and also infer the types from. That way
 * when a user passes a key to the subscribe function the
 * type can automatically be inferred for the response of the
 * subscribe function
 *
 * this is probably gonna take a while to get right and implement
 * 🤪🤪🤪🤪🤪🤪🤪🤪🤪🤪🤪🤪🤪🤪🤪
 */

type Args = {
  key: string;
  rep: () => Replicache<M>;
};

function getReplicache<T>(args: Args) {
  const [data, setData] = createStore({
    value: undefined as T | undefined,
  });
  args.rep().subscribe(
    async (tx) => {
      return await tx.get(args.key);
    },
    (value) => {
      setData("value", structuredClone(value as T));
    },
  );
  return createMemo(() => data.value);
}

function scanReplicache<T>(args: Args) {
  const [data, setData] = createStore<T[]>([]);
  args.rep().subscribe(
    async (tx) => {
      return await tx
        .scan({
          prefix: args.key,
        })
        .values()
        .toArray();
    },
    (value) => {
      setData(value as T[]);
    },
  );
  return createMemo(() => data);
}

/**
 * Helper function to subscribe to the replicache store
 */
function subscribe<T>(args: Omit<Args, "rep">) {
  const rep = useReplicache();
  return {
    scan: () => scanReplicache<T>({ key: args.key, rep }),
    get: () => getReplicache<T>({ key: args.key, rep }),
  };
}

export { subscribe };

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import { useReplicache } from "../providers";
import { type Replicache } from "replicache";
import { type Mutators } from "@playground/replicache/src/client";
import { type SchemaNames } from "@playground/db";

type StringWithAutocomplete<T> = T | (string & Record<never, never>);
type ReplicacheStoreKeys = StringWithAutocomplete<SchemaNames>;

type Args = {
  prefix: ReplicacheStoreKeys;
  rep: () => Replicache<Mutators>;
};

function getReplicache<T>(args: Args) {
  const [data, setData] = createStore({
    value: undefined as T | undefined,
  });
  args.rep().subscribe(
    (tx) => tx.get(args.prefix),
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
          prefix: args.prefix,
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

function subscribe<T>(args: Omit<Args, "rep">) {
  const rep = useReplicache();
  return {
    scan: () => scanReplicache<T>({ prefix: args.prefix, rep }),
    get: (id: string) =>
      getReplicache<T>({ prefix: `${args.prefix}/${id}`, rep }),
  };
}

export { subscribe };

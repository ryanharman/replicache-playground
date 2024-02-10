import { type WriteTransaction } from "replicache";

const mutators = {
  increment: async (tx: WriteTransaction, delta: number) => {
    const prev = ((await tx.get("count")) as number) ?? 0;
    const next = prev + delta;
    await tx.set("count", next);
    return next;
  },
};

type M = typeof mutators;

export { mutators };
export type { M };

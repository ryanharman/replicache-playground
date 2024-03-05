/* eslint-disable  @typescript-eslint/no-explicit-any */
import { type Mutation, type ExtractMutations, type Server } from "../server";
import { type WriteTransaction } from "replicache";

// TODO: It would be really handy to create a general 'store' that can interact with
// these mutators, and handle subscribing to the data from one central location. This
// might be something that can be handled with a generic replicache framework that is
// then built into Solids lifecycle/createStore/createSignal fns?

type MutationsArgsObject<S extends Server<any>> = Record<
  ExtractMutations<S>[keyof ExtractMutations<S>]["name"],
  (
    tx: WriteTransaction,
    input: ExtractMutations<S>[keyof ExtractMutations<S>]["input"],
  ) => Promise<void>
>;

type ClientMutationsResult<Mutations extends Record<string, Mutation>> = {
  [key in keyof Mutations]: (
    ctx: WriteTransaction,
    args: Mutations[key]["input"],
  ) => Promise<void>;
};

function createClientMutations<
  S extends Server<any>,
  Mutations extends Record<string, Mutation> = ExtractMutations<S>,
>(mutations: MutationsArgsObject<S>) {
  const mutationsForMap = Object.entries(mutations).map(([key, value]) => [
    key,
    value,
  ]);

  const mutationsMapped = new Map<string, (...input: any) => Promise<void>>(
    // @ts-expect-error - not sure the best way to resolve this. The value property
    // of the mutation is of type unknown for some reason.
    mutationsForMap.map(([key, value]) => [key, value]),
  );

  return Object.fromEntries(
    mutationsMapped.entries(),
  ) as ClientMutationsResult<Mutations>;
}

export { createClientMutations };

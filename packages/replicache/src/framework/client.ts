import { type ExtractMutations, type Mutation, type Server } from "./server";
import { type WriteTransaction } from "replicache";

class Client<
  S extends Server<any>,
  Mutations extends Record<string, Mutation> = ExtractMutations<S>,
> {
  private mutations = new Map<string, (...input: any) => Promise<void>>();

  public mutation<Name extends keyof Mutations>(
    name: Name,
    fn: (
      tx: WriteTransaction,
      input: Mutations[Name]["input"],
    ) => Promise<void>,
  ) {
    this.mutations.set(name as string, fn);
    return this;
  }

  public build(): {
    [key in keyof Mutations]: (
      ctx: WriteTransaction,
      args: Mutations[key]["input"],
    ) => Promise<void>;
  } {
    return Object.fromEntries(this.mutations.entries()) as any;
  }
}

export { Client };

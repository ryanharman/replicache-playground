import { type z, type ZodSchema } from "zod";

interface Mutation<Name extends string = string, Input = any> {
  name: Name;
  input: Input;
}

type ExtractMutations<S extends Server<any>> =
  S extends Server<infer M> ? M : never;

class Server<Mutations> {
  private mutations = new Map<
    string,
    {
      input: ZodSchema;
      fn: (input: any) => Promise<void>;
    }
  >();

  // The expose method allows us to use existing db mutators that we've defined
  // in the db module using the zod helper function.
  public expose<
    Name extends string,
    Shape extends ZodSchema,
    Args = z.infer<Shape>,
  >(
    name: Name,
    fn: ((input: z.infer<ZodSchema>) => Promise<any>) & {
      schema: Shape;
    },
  ): Server<Mutations & { [key in Name]: Mutation<Name, Args> }> {
    this.mutations.set(name as string, {
      fn,
      input: fn.schema,
    });
    return this;
  }

  public execute(name: string, args: unknown) {
    const mut = this.mutations.get(name);
    if (!mut) throw new Error(`Mutation "${name}" not found`);
    return mut.fn(args);
  }
}

export { Server };
export type { ExtractMutations, Mutation };

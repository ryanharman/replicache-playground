import { createEffect, createSignal } from "solid-js";
import { subscribe } from "../data";
import { useReplicache } from "../providers";
import { createId } from "@paralleldrive/cuid2";

function Todo(props: {
  todo: { id: string; title: string; completed: boolean };
  onButtonClick: (id: string, newTitle: string) => Promise<void>;
}) {
  const [inputValue, setInputValue] = createSignal("");

  return (
    <>
      <div>{props.todo.title}</div>
      <input
        value={inputValue()}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        onClick={async () => {
          await props.onButtonClick(props.todo.id, inputValue());
        }}
      >
        update todo
      </button>
    </>
  );
}

function Home() {
  const rep = useReplicache();
  const todos = subscribe<{
    id: string;
    title: string;
    completed: boolean;
    spaceId: string;
  }>({ prefix: "todo" }).scan();

  const todo = subscribe({ prefix: "todo" }).get("a0i3h1vcb4j9mnox00p0i1in");

  const [inputValue, setInputValue] = createSignal("");

  async function onButtonClick(id: string, newTitle: string) {
    await rep().mutate.upsertTodo({
      id,
      title: newTitle,
      completed: false,
      spaceId: "cplf1ag6uyuluuor489pka0m",
    });
  }

  createEffect(() => {
    console.log(todos());
    console.log(todo());
  });

  return (
    <div>
      <button
        onClick={async () => {
          await fetch("http://localhost:3001/mock", {
            method: "POST",
          });
        }}
      >
        press me to mock a client
      </button>
      <h1>Home</h1>
      {todos().map((t) => (
        <Todo todo={t} onButtonClick={onButtonClick} />
      ))}
      <input
        value={inputValue()}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        onClick={async () => {
          await onButtonClick(createId(), inputValue());
        }}
      >
        Create todo
      </button>
    </div>
  );
}

export { Home };

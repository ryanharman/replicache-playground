import { createEffect, createSignal } from "solid-js";
import { subscribe } from "../data";
import { useReplicache } from "../providers";

function Home() {
  const rep = useReplicache();
  const todo = subscribe<{
    title: string;
    completed: boolean;
    spaceId: string;
  }>({ key: "todo" }).get();

  const [inputValue, setInputValue] = createSignal("");

  async function onButtonClick() {
    await rep().mutate.upsertTodo({
      title: inputValue(),
      completed: false,
      spaceId: "default",
    });
  }

  createEffect(() => {
    console.log(todo());
  });

  return (
    <div>
      <h1>Home</h1>
      {todo()?.title}
      <input
        value={inputValue()}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={onButtonClick}>Update todo</button>
    </div>
  );
}

export { Home };

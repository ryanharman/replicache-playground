import { createEffect, createSignal } from "solid-js";
import { subscribe } from "../data";
import { useReplicache } from "../providers";

function Home() {
  const rep = useReplicache();
  const todo = subscribe<{
    id: string;
    title: string;
    completed: boolean;
    spaceId: string;
  }>({ key: "todo" }).get();

  const [inputValue, setInputValue] = createSignal("");

  async function onButtonClick() {
    await rep().mutate.upsertTodo({
      id: todo()?.id,
      title: inputValue(),
      completed: false,
      spaceId: "cplf1ag6uyuluuor489pka0m",
    });
  }

  createEffect(() => {
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

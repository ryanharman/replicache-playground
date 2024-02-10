import { subscribe } from "../data";
import { useReplicache } from "../providers";

function Home() {
  const rep = useReplicache();
  const count = subscribe<number>({ key: "count" }).get();

  async function onButtonClick() {
    await rep().mutate.increment(1);
  }

  return (
    <div>
      <h1>Home</h1>
      {count()}
      <button onClick={onButtonClick}>Increment</button>
    </div>
  );
}

export { Home };

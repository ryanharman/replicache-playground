/* eslint-disable @typescript-eslint/no-misused-promises */
import { type Component } from "solid-js";
import { ReplicacheProvider } from "./providers";
import { Home } from "./pages";

const App: Component = () => {
  return (
    <ReplicacheProvider>
      <Home />
    </ReplicacheProvider>
  );
};

export default App;

import { Replicache } from "replicache";
import { mutators } from "@playground/replicache/src/client";
import {
  type ParentProps,
  createMemo,
  onCleanup,
  createContext,
  useContext,
} from "solid-js";
import { makeEventListener } from "@solid-primitives/event-listener";

function createReplicache(workspace?: string) {
  const replicache = new Replicache({
    name: workspace ?? "NO_WORKSPACE_PROVIDED",
    licenseKey: "l9339e433719b4fe6b77126c0ea281db7",
    // pullURL: "http://localhost:3001/pull",
    pushURL: "http://localhost:3001/push?spaceID=cplf1ag6uyuluuor489pka0m",
    pushDelay: 5000,
    pullInterval: 10000,
    mutators,
  });

  replicache.onSync = (syncing) => {
    // TODO: Sync status update
    console.log("syncing", syncing);
  };

  return replicache;
}

const ReplicacheContext =
  createContext<() => ReturnType<typeof createReplicache>>();

function ReplicacheProvider(props: ParentProps<{ workspace?: string }>) {
  const rep = createMemo(() => createReplicache(props.workspace));

  makeEventListener(window, "focus", async () => {
    await rep().pull();
  });

  onCleanup(async () => {
    await rep().close();
  });

  return (
    <ReplicacheContext.Provider value={rep}>
      {props.children}
    </ReplicacheContext.Provider>
  );
}

function useReplicache() {
  const result = useContext(ReplicacheContext);
  if (!result) {
    throw new Error("useReplicache must be used within a ReplicacheProvider");
  }
  return result;
}

export { ReplicacheProvider, useReplicache };

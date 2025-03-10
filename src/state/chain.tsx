import React, { createContext, ReactElement, useEffect, useState } from "react";
import { Chain, ChainMap } from "./types";
import { remixClient } from "../remix/RemixClient"

interface ContextInterface {
  sourcifyChains: Chain[];
  sourcifyChainMap: ChainMap;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

// create context
const Context = createContext<ContextInterface>({
  sourcifyChains: [],
  sourcifyChainMap: {},
  errorMessage: "",
  setErrorMessage: () => null,
});

const ContextProvider = ({ children }: { children: ReactElement }) => {
  const [sourcifyChains, setSourcifyChains] = useState<Chain[]>([]);
  const [sourcifyChainMap, setSourcifyChainMap] = useState<ChainMap>({});
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch and assign the chains
  useEffect(() => {
    remixClient.fetchChains()
      .then((sourcifyChains) => {
        setSourcifyChains(sourcifyChains.data);
        const chainMap = sourcifyChains.data.reduce(function (
          acc,
          currentChain
        ) {
          acc[currentChain.chainId] = currentChain;
          return acc;
        },
        {});
        setSourcifyChainMap(chainMap);
      })
      .catch((err) => {
        setErrorMessage("Can't fetch Sourcify chains from the server!");
        console.log(err);
      });
  }, []);

  return (
    // the Provider gives access to the context to its children
    <Context.Provider
      value={{
        sourcifyChains,
        sourcifyChainMap,
        errorMessage,
        setErrorMessage,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, ContextProvider };
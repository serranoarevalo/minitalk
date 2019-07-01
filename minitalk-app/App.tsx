import React, { Suspense } from "react";
import { ApolloProvider } from "react-apollo-hooks";
import client from "./apollo";
import Chat from "./Chat";
import { ActivityIndicator, View } from "react-native";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Suspense
        fallback={
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator color="black" />
          </View>
        }
      >
        <Chat />
      </Suspense>
    </ApolloProvider>
  );
}

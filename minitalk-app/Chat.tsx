import React, { useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Text,
  KeyboardAvoidingView
} from "react-native";
import gql from "graphql-tag";
import { useMutation, useQuery } from "react-apollo-hooks";

const SEND_MESSAGE = gql`
  mutation sendMessage($text: String!) {
    sendMessage(text: $text) {
      id
      text
    }
  }
`;

const MESSAGES = gql`
  query messages {
    messages {
      id
      text
    }
  }
`;

export default function Chat() {
  const [message, setMessage] = useState("");
  const sendMessageMutation = useMutation(SEND_MESSAGE, {
    variables: {
      text: message
    },
    refetchQueries: () => [{ query: MESSAGES }]
  });
  const { data, error } = useQuery(MESSAGES, { suspend: true });
  const onChangeText = text => setMessage(text);
  const onSubmit = async () => {
    setMessage("");
    try {
      await sendMessageMutation();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <KeyboardAvoidingView behavior="padding" enabled style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          paddingTop: 50,
          alignItems: "center",
          justifyContent: "flex-end"
        }}
      >
        {data.messages.map(m => (
          <View key={m.id} style={{ marginBottom: 10 }}>
            <Text>{m.text}</Text>
          </View>
        ))}
        <TextInput
          placeholder={"Type your message"}
          onChangeText={onChangeText}
          style={{
            marginVertical: 100,
            height: 50,
            backgroundColor: "#F2F2F2",
            width: "80%",
            borderRadius: 10,
            padding: 10
          }}
          onSubmitEditing={onSubmit}
          returnKeyType="send"
          value={message}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

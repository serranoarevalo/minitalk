import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  ScrollView,
  Text,
  KeyboardAvoidingView
} from "react-native";
import gql from "graphql-tag";
import { useMutation, useQuery, useSubscription } from "react-apollo-hooks";

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

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
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
    }
  });
  const { data: oldMessages } = useQuery(MESSAGES, { suspend: true });
  const { data: newMessage, loading, error } = useSubscription(NEW_MESSAGE);
  const [messages, setMessages] = useState(oldMessages.messages);
  const updateMessages = () => {
    if (newMessage !== undefined) {
      const { newMessage: payload } = newMessage;
      setMessages(previous => [...previous, payload]);
    }
  };
  useEffect(() => {
    updateMessages();
  }, [newMessage]);
  const onChangeText = text => setMessage(text);
  const onSubmit = async () => {
    setMessage("");
    if (message === "") {
      return;
    }
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
        {messages.map(m => (
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

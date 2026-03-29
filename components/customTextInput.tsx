import { StyleSheet, TextInput, View } from "react-native";
import React from "react";

type Props = {
  onChange: (text: string) => void;
  multiline?: boolean;
  placeholder?: string;
  numberOfLines?: number;
  textValue: string;
};

const CustomTextInput = ({ onChange, multiline, placeholder, numberOfLines, textValue }: Props) => {
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={onChange}
        multiline={multiline}
        placeholder={placeholder}
        numberOfLines={numberOfLines}
        value={textValue}
        style={styles.input}
      />
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: "#DDDDDD",
    padding: 10,
  },
  container: {
    marginTop: 20,
  },
});

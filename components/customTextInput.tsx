import { StyleSheet, TextInput, View } from "react-native";
import React, { useState } from "react";
import { colors, radius } from "../theme";

type Props = {
  onChange: (text: string) => void;
  multiline?: boolean;
  placeholder?: string;
  numberOfLines?: number;
  textValue: string;
};

const CustomTextInput = ({ onChange, multiline, placeholder, numberOfLines, textValue }: Props) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <TextInput
        onChangeText={onChange}
        multiline={multiline}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        numberOfLines={numberOfLines}
        value={textValue}
        style={styles.input}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderColor: "#3A3A3A",
    borderRadius: radius.sm,
    backgroundColor: "#2A2A2A",
    height: 48,
    justifyContent: "center",
  },
  containerFocused: {
    borderColor: colors.primary,
  },
  input: {
    paddingHorizontal: 14,
    color: colors.white,
    fontSize: 14,
    height: "100%",
  },
});

import { filterLinesIcon, search } from "@assets";
import { HorizontalSpacer } from "@components";
import React from "react";
import {
  Image,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  placeholder?: string;
  value?: string;
  onChangeText?(arg0: string): void;
  showFilterIcon?: boolean;
  onPressFilterIcon?(): void;
  onSubmitEditting?(
    arg0: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ): void;
}

const SearchField = ({
  placeholder = "Search",
  value,
  onChangeText,
  showFilterIcon = true,
  onPressFilterIcon,
  onSubmitEditting,
}: Props) => {
  return (
    <View style={styles.container}>
      <Image source={search} style={styles.image} />
      <HorizontalSpacer />
      <TextInput
        style={styles.textInput}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditting ?? undefined}
      />
      <HorizontalSpacer />
      {showFilterIcon && (
        <TouchableOpacity onPress={onPressFilterIcon}>
          <Image source={filterLinesIcon} style={styles.image} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    borderRadius: 30,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  image: {
    width: 22,
    height: 22,
  },
  textInput: {
    flex: 1,
    paddingVertical: 0,
    color: "#4A5568",
  },
});

export default SearchField;

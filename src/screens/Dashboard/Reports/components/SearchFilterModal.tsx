import { AppText, VerticalSpacer } from "@components";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { languagePicker } from "@utils";
import { card, doc, filter, key, person, xmarkBox } from "@assets";
import IconTextRow from "./IconTextRow";
import ModalWithHeader from "./ModalWithHeader";

interface IconTextType {
  title: string;
  image: any;
}

const tilesData: IconTextType[] = [
  { title: "All Transactions", image: filter },
  { title: "Invoice Number", image: doc },
  { title: "Reference Number", image: person },
  { title: "Approval Code", image: key },
  { title: "Card Number", image: card },
  { title: "Declined Transactions", image: xmarkBox },
];

interface Props {
  visible: boolean;
  onCloseModal(): void;
  selected: string;
  onUpdatePressed(arg0: string): void;
}

const SearchFilterModal = ({
  visible,
  onCloseModal,
  selected,
  onUpdatePressed,
}: Props) => {
  const language = useSelector((state: any) => state.user.languageType);
  const [selectedType, setSelectedType] = useState<string>("All Transactions");

  return (
    <ModalWithHeader
      visible={visible}
      onCloseModal={onCloseModal}
      onShow={() => setSelectedType(selected)}
      title="Search Filter"
    >
      <VerticalSpacer spaceFactor={2} />
      {tilesData.map((tile) => {
        return (
          <IconTextRow
            key={tile.title}
            icon={tile.image}
            title={tile.title}
            selected={selectedType === tile.title}
            onPress={() => setSelectedType(tile.title)}
          />
        );
      })}

      <View style={styles.flex1} />
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => onUpdatePressed(selectedType)}
      >
        <AppText
          title={languagePicker(language, "Update")}
          colorText="#FFF"
          bold
          size={18}
        />
      </TouchableOpacity>
    </ModalWithHeader>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#FFF",
    paddingHorizontal: 30,
    paddingVertical: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    width: 60,
    height: 60,
  },
  flex1: {
    flex: 1,
  },
  updateButton: {
    backgroundColor: "#27548C",
    borderRadius: 30,
    paddingHorizontal: 50,
    paddingVertical: 12,
    alignSelf: "center",
  },
});

export default SearchFilterModal;

import { close } from "@assets";
import { AppText, AppView } from "@components";
import { languagePicker } from "@utils";
import React, { ReactNode } from "react";
import { Image, Modal, StyleSheet, View, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

interface Props {
  visible: boolean;
  onCloseModal(): void;
  onShow(): void;
  title: string;
  children: ReactNode;
}

const ModalWithHeader = ({
  visible,
  onCloseModal,
  children,
  onShow,
  title,
}: Props) => {
  const language = useSelector((state: any) => state.user.languageType);

  return (
    <Modal visible={visible} animationType="slide" onShow={onShow}>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppText
            title={languagePicker(language, title)}
            size={24}
            colorText="#4A5568"
            semiBold
          />
          <TouchableOpacity onPress={onCloseModal} activeOpacity={0.8}>
            <Image source={close} style={styles.closeButton} />
          </TouchableOpacity>
        </View>
        {children}
      </View>
    </Modal>
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
});

export default ModalWithHeader;

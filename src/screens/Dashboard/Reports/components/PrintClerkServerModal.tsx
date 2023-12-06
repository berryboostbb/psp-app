import { backArrowDark, gToB_Linear, linear } from "@assets";
import { AppHeader, AppText, LinearButton, VerticalSpacer } from "@components";
import { useTheme } from "@react-navigation/native";
import { RF, Typography } from "@theme";
import { languagePicker } from "@utils";
import React from "react";
import { Modal, View, StyleSheet, Image } from "react-native";
import { useSelector } from "react-redux";

interface Props {
  visible: boolean;
  onCloseModal(): void;
  onShow?(): void;
  showDetailedButton: boolean;
  onPressPrintSummaryReport?(): void;
  onPressPrintDetailedReport?(): void;
}

const PrintClerkServerModal = ({
  visible,
  onShow,
  onCloseModal,
  onPressPrintSummaryReport,
  onPressPrintDetailedReport,
  showDetailedButton,
}: Props) => {
  const language = useSelector((state: any) => state.user.languageType);
  const theme: any = useTheme();

  return (
    <Modal visible={visible} animationType="slide" onShow={onShow}>
      <View style={styles.headerView}>
        <AppHeader
          title={languagePicker(language, "Clerk/Server Report")}
          showLeftIcon
          backAction={onCloseModal}
          source={backArrowDark}
          size={Typography.FONTS.SIZE.HEADER}
          textColor={theme.colors.grey}
          showRightIcon
        />
      </View>
      <View style={styles.container}>
        <AppText
          title="Print Clerk/Server Report in summary or detail?"
          size={18}
          bold
          center
          colorText="#141B26"
        />
        <VerticalSpacer />
        <AppText
          title="*Please note that the summary report will only show the Clerk Id and Grand Total of the user"
          size={18}
          center
        />
        <VerticalSpacer spaceFactor={2} />
        <LinearButton
          src={linear}
          title={languagePicker(language, "Summary Report")}
          onClick={() => {}}
          onPress={onPressPrintSummaryReport}
        />
        {showDetailedButton && (
          <LinearButton
            src={gToB_Linear}
            title={languagePicker(language, "Detailed Report")}
            onClick={() => {}}
            onPress={onPressPrintDetailedReport}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFF",
    paddingHorizontal: 58,
    paddingVertical: 30,
    justifyContent: "center",
    alignItems: "center",
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
  headerView: {
    paddingHorizontal: RF(30),
    paddingTop: RF(20),
    backgroundColor: "#FFF",
  },
});

export default PrintClerkServerModal;

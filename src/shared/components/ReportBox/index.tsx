import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import AppText from "../AppText";
import { GST, RF } from "@theme";
import { useSelector } from "react-redux";
import { languagePicker } from "@utils";

interface Props {
  title?: any;
  terminalArray?: any;
  titleTotal?: any;
  amountTitle?: any;
  typeTotal?: any;
  titleCount?: any;
  titleDoller?: any;
  totalCount?: any;
  totalDoller?: any;
  totalAmount?: any;
  cardType?: any;
}
export default function ReportBox(props: Props) {
  const language = useSelector((state: any) => state.user.languageType);
  const {
    title,
    terminalArray,
    titleTotal,
    titleDoller,
    amountTitle,
    typeTotal,
    titleCount,
    totalCount,
    totalDoller,
    totalAmount,
    cardType,
  } = props;
  const theme: any = useTheme();
  const styles = useStyles(theme.colors);
  let dot = new Array(100).fill(".");
  dot.forEach((x) => x);

  return (
    <View style={styles.mainContainer}>
      {title && (
        <AppText
          title={title}
          colorText={theme.colors.border}
          size={18}
          medium
          center
        />
      )}

      <View style={styles.container}>
        <View style={styles.containerView}>
          {cardType && (
            <AppText
              colorText={theme.colors.border}
              title={cardType}
              size={18}
              boldest
            />
          )}

          <View style={styles.TrxTitleView}>
            <View style={[styles.flexFourView]}>
              <AppText title={typeTotal} size={15} bold />
            </View>
            <View style={styles.flexThirdViewCenter}>
              <AppText title={titleCount} size={15} bold />
            </View>
            <View style={[styles.flexTwoView]}>
              <AppText title={titleDoller} size={14} bold />
            </View>
            <View style={[styles.flexThirdView]}>
              <AppText title={amountTitle} size={15} right bold />
            </View>
          </View>
          {terminalArray.map((item: any) => {
            return (
              <>
                <View style={styles.TrxTypeView}>
                  <View style={[styles.flexFourView]}>
                    <AppText
                      title={languagePicker(language, item.transaction_type)}
                      size={14}
                      bold
                    />
                  </View>
                  <View style={styles.flexThirdViewCenter}>
                    <AppText title={item.count} size={14} medium />
                  </View>
                  <View style={styles.flexTwoViewCenter}>
                    <AppText title={item.doller} size={14} medium />
                  </View>
                  <View style={[styles.flexThirdView]}>
                    <AppText title={item.amount} right size={14} medium />
                  </View>
                </View>
              </>
            );
          })}
          <AppText
            title={
              ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . "
            }
            center
            colorText={theme.colors.toggleColor}
          />
          <View style={styles.TrxTotalView}>
            <View style={[styles.flexFourView]}>
              <AppText title={titleTotal} size={18} bold />
            </View>
            <View style={[styles.flexThirdViewCenter]}>
              <AppText title={totalCount} size={18} regular center />
            </View>
            <View style={styles.flexTwoViewCenter}>
              <AppText title={totalDoller} size={18} medium />
            </View>
            <View style={styles.flexThirdView}>
              <AppText title={totalAmount} right size={18} bold />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const useStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      borderWidth: 1,
      borderColor: colors.light_grey,
      borderRadius: RF(16),
      marginTop: RF(10),
      paddingBottom: RF(10),
    },
    containerView: { paddingHorizontal: RF(10), paddingTop: RF(10) },
    flexTwoView: { flex: 2 },
    flexTwoViewCenter: { flex: 2, ...GST.CENTER },
    TrxTitleView: { ...GST.ROW },
    TrxTypeView: { ...GST.ROW },
    TrxTotalView: { ...GST.ROW },
    flexThirdView: { flex: 3 },
    flexThirdViewCenter: { flex: 3, ...GST.CENTER },
    mainContainer: { paddingBottom: RF(35) },
    flexFourView: { flex: 4 },
  });

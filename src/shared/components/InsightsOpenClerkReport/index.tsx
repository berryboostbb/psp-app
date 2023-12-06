import * as React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { GST, RF } from "@theme";
import AppText from "../AppText/index";
import { useSelector } from "react-redux";
import { languagePicker, terminal_setting } from "@utils";

const InsightsOpenClerkReport = ({
  item,
  selected,
}: {
  item?: any;
  selected?: any;
}) => {
  const theme: any = useTheme();
  const styles = useStyles(theme.colors);
  const language = useSelector((state: any) => state.user.languageType);
  return (
    <>
      {selected ? (
        <View style={styles.selectedViewTop}>
          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Visa") + ":"}
              size={16}
              bold
              colorText={theme?.colors?.border}
            />
            <AppText
              title={item?.merchant_id}
              size={16}
              semiBold
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={styles.outerView}>
            <AppText
              title={"XXXXXXXXXXXXXXXXNNNN"}
              size={16}
              regular
              colorText={theme?.colors?.border}
            />
            <AppText
              title={"C"}
              size={16}
              regular
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Clerk/Server ID") + "#"}
              size={16}
              bold
              colorText={theme?.colors?.border}
            />
            <AppText
              title={item?.terminal_id}
              size={16}
              regular
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={styles.outerView}>
            <View style={{ ...GST.ROW }}>
              <AppText
                title={languagePicker(language, "Invoice #:")}
                size={16}
                bold
                colorText={theme?.colors?.border}
              />
              <AppText
                title={item.invoic_no}
                size={16}
                regular
                colorText={theme?.colors?.border}
              />
            </View>
            <View style={{ ...GST.ROW }}>
              <AppText
                title={languagePicker(language, "Reference #:")}
                size={16}
                bold
                colorText={theme?.colors?.border}
              />
              <AppText
                title={item.ref_no}
                size={16}
                regular
                colorText={theme?.colors?.border}
              />
            </View>
          </View>
          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Amount") + ":"}
              size={16}
              bold
              colorText={theme?.colors?.border}
              textStyle={{ flex: 0.5, fontFamily: "Plus Jakarta Sans" }}
            />
            <AppText
              title={"$"}
              size={16}
              medium
              colorText={theme?.colors?.border}
            />
            <AppText
              title={"0.00"}
              size={16}
              regular
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Tip") + ":"}
              size={16}
              bold
              colorText={theme?.colors?.border}
              textStyle={{ flex: 0.5, fontFamily: "Plus Jakarta Sans" }}
            />
            <AppText
              title={"$"}
              size={16}
              medium
              colorText={theme?.colors?.border}
            />
            <AppText
              title={"0.00"}
              size={16}
              regular
              colorText={theme?.colors?.border}
            />
          </View>

          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Surcharge") + ":"}
              size={16}
              bold
              colorText={theme?.colors?.border}
              textStyle={{ flex: 0.5, fontFamily: "Plus Jakarta Sans" }}
            />
            <AppText
              title={"$"}
              size={16}
              medium
              colorText={theme?.colors?.border}
            />
            <AppText
              title={"0.00"}
              size={16}
              regular
              colorText={theme?.colors?.border}
            />
          </View>
          <AppText
            title={
              ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
            }
            colorText={theme.colors.toggleColor}
            center
          />
          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Total") + ":"}
              size={18}
              bold
              colorText={theme?.colors?.border}
              textStyle={{
                flex: 0.5,
                paddingTop: RF(5),
                fontFamily: "Plus Jakarta Sans",
              }}
            />
            <AppText
              title={"$"}
              size={18}
              bold
              colorText={theme?.colors?.border}
            />
            <AppText
              title={"0.00"}
              size={18}
              bold
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={styles.lineView} />
          <View style={styles.lineBottomView} />

          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Interac") + ":"}
              size={16}
              bold
              colorText={theme?.colors?.border}
            />
            <AppText
              title={languagePicker(language, item?.transaction_type)}
              size={16}
              regular
              colorText={theme?.colors?.border}
            />
          </View>

          <View style={styles.outerView}>
            <AppText
              title={"XXXXXXXXXXXXXXXXNNNN"}
              size={16}
              regular
              colorText={theme?.colors?.border}
            />
            <AppText
              title={"C"}
              size={16}
              regular
              colorText={theme?.colors?.border}
            />
          </View>

          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Clerk/Server ID") + "#"}
              size={16}
              bold
              colorText={theme?.colors?.border}
            />
            <AppText
              title={item?.terminal_id}
              size={16}
              regular
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={styles.outerView}>
            <View style={{ ...GST.ROW }}>
              <AppText
                title={languagePicker(language, "Invoice #:")}
                size={16}
                bold
                colorText={theme?.colors?.border}
              />
              <AppText
                title={item.invoic_no}
                size={16}
                regular
                colorText={theme?.colors?.border}
              />
            </View>
            <View style={{ ...GST.ROW }}>
              <AppText
                title={languagePicker(language, "Reference #:")}
                size={16}
                bold
                colorText={theme?.colors?.border}
              />
              <AppText
                title={item.ref_no}
                size={16}
                regular
                colorText={theme?.colors?.border}
              />
            </View>
          </View>
          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Amount") + ":"}
              size={16}
              bold
              colorText={theme?.colors?.border}
              textStyle={{ flex: 0.5, fontFamily: "Plus Jakarta Sans" }}
            />
            <AppText
              title={"$"}
              size={16}
              medium
              colorText={theme?.colors?.border}
            />
            <AppText
              title={"0.00"}
              size={16}
              regular
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Tip") + ":"}
              size={16}
              bold
              colorText={theme?.colors?.border}
              textStyle={{ flex: 0.5, fontFamily: "Plus Jakarta Sans" }}
            />
            <AppText
              title={"$"}
              size={16}
              medium
              colorText={theme?.colors?.border}
            />
            <AppText
              title={"0.00"}
              size={16}
              regular
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Surcharge") + ":"}
              size={16}
              bold
              colorText={theme?.colors?.border}
              textStyle={{ flex: 0.5, fontFamily: "Plus Jakarta Sans" }}
            />
            <AppText
              title={"$"}
              size={16}
              medium
              colorText={theme?.colors?.border}
            />
            <AppText
              title={"0.00"}
              size={16}
              regular
              colorText={theme?.colors?.border}
            />
          </View>
          <AppText
            title={
              ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
            }
            colorText={theme.colors.toggleColor}
          />
          <View style={[styles.outerView, { paddingTop: RF(5) }]}>
            <AppText
              title={languagePicker(language, "Total") + ":"}
              size={18}
              bold
              colorText={theme?.colors?.border}
              textStyle={{ flex: 0.6 }}
            />
            <AppText
              title={"$"}
              size={18}
              bold
              colorText={theme?.colors?.border}
            />
            <AppText
              title={"$0.00"}
              size={18}
              bold
              colorText={theme?.colors?.border}
            />
          </View>
        </View>
      ) : (
        <>
          <View style={styles.trxView}>
            <View style={{ ...GST.ROW }}>
              <AppText
                title={languagePicker(language, "Clerk/Server ID") + ":"}
                size={16}
                bold
                colorText={theme?.colors?.border}
              />
              <AppText
                title={"#" + item.transaction_no}
                size={16}
                bold
                colorText={theme?.colors?.border}
              />
            </View>
            <AppText
              title={item.terminal_id}
              size={18}
              regular
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={{ ...GST.mid_row }}>
            <AppText
              title={languagePicker(language, "Tip Total") + " :"}
              size={16}
              bold
              colorText={theme?.colors?.border}
            />
            <AppText
              title={"$0.00"}
              size={16}
              regular
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={styles.trxView}>
            <AppText
              title={languagePicker(language, "Grand Total") + ":"}
              size={16}
              bold
              colorText={theme?.colors?.border}
            />
            <View style={{ ...GST.ROW }}>
              <AppText
                title={"$" + item.tip_amount}
                size={16}
                regular
                colorText={theme?.colors?.border}
              />
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default InsightsOpenClerkReport;
const useStyles = (colors: any) =>
  StyleSheet.create({
    outerView: { ...GST.mid_row, marginBottom: RF(3), paddingVertical: RF(2) },
    trxView: { ...GST.mid_row },
    selectedViewTop: { paddingTop: RF(20) },
    visaView: { flexDirection: "row", justifyContent: "space-between" },
    lineView: {
      borderBottomColor: colors.line,
      borderBottomWidth: 1,
      paddingTop: RF(15),
    },
    lineBottomView: { paddingTop: RF(20) },
  });

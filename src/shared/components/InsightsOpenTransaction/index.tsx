import * as React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import { GST, RF } from "@theme";
import AppText from "./../AppText/index";
import { languagePicker } from "@utils";
import { useSelector } from "react-redux";
var currencyFormatter = require("currency-formatter");

const InsightsOpenTransaction = ({
  item,
  selected,
}: {
  item?: any;
  selected?: any;
}) => {
  const theme: any = useTheme();
  const styles = useStyles(theme.colors);
  let date = new Date();
  const language = useSelector((state: any) => state.user.languageType);
  return (
    <>
      {selected ? (
        <View style={styles.selectedViewTop}>
          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Merchant ID:")}
              size={15}
              bold
              colorText={theme?.colors?.border}
            />
            <AppText
              title={item?.merchant_id.toUpperCase()}
              size={15}
              regular
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Terminal ID:")}
              size={15}
              bold
              colorText={theme?.colors?.border}
            />
            <AppText
              title={item?.terminal_id.toUpperCase()}
              size={15}
              regular
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Transaction Number:")}
              size={15}
              bold
              colorText={theme?.colors?.border}
            />
            <AppText
              title={item?.transaction_no.toUpperCase()}
              size={15}
              regular
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={{ ...GST.mid_row }}>
            <View style={{ ...GST.mid_row }}>
              <AppText
                title={languagePicker(language, "Date:")}
                size={15}
                bold
                colorText={theme?.colors?.border}
              />
              <AppText
                title={"     " + item.date ? item.date : date}
                size={15}
                regular
                colorText={theme?.colors?.border}
              />
            </View>
            <View style={{ ...GST.ROW }}>
              <AppText
                title={languagePicker(language, "Time:")}
                size={15}
                bold
                colorText={theme?.colors?.border}
              />
              <AppText
                title={item.time}
                size={15}
                regular
                colorText={theme?.colors?.border}
              />
            </View>
          </View>
          <View style={styles.selectedViewTop} />
          <View style={{ ...GST.mid_row }}>
            <View style={{ ...GST.ROW }}>
              <AppText
                title={languagePicker(language, "Inv Numb:")}
                size={15}
                bold
                colorText={theme?.colors?.border}
              />
              <AppText
                title={item.invoice_no.toUpperCase()}
                size={15}
                regular
                colorText={theme?.colors?.border}
              />
            </View>
            <View style={{ ...GST.ROW }}>
              <AppText
                title={languagePicker(language, "Ref Numb:")}
                size={15}
                bold
                colorText={theme?.colors?.border}
              />
              <AppText
                title={item.reference_no}
                size={15}
                regular
                colorText={theme?.colors?.border}
              />
            </View>
          </View>
          <View style={[styles.outerView, styles.visaTopView]}>
            <AppText
              title={item.card_type}
              size={15}
              bold
              colorText={theme?.colors?.border}
            />
            <AppText
              title={item?.card_number}
              size={15}
              semiBold
              colorText={theme?.colors?.border}
            />
            {/* <AppText
              title={"Sale"}
              size={15}
              regular
              colorText={theme?.colors?.border}
            /> */}
          </View>
          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Entry Method") + ":"}
              size={15}
              bold
              colorText={theme?.colors?.border}
            />
            <AppText
              title={item?.entry_mode}
              size={15}
              regular
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Amount") + ":"}
              size={15}
              bold
              colorText={theme?.colors?.border}
              textStyle={{ flex: 0.5, fontFamily: "Plus Jakarta Sans" }}
            />
            <AppText
              title={currencyFormatter.format(parseFloat(item?.amount), {
                code: "CAD",
              })}
              size={14}
              semiBold
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Tip") + ":"}
              size={15}
              bold
              colorText={theme?.colors?.border}
              textStyle={{ flex: 0.5, fontFamily: "Plus Jakarta Sans" }}
            />

            <AppText
              title={currencyFormatter.format(parseFloat(item?.tip), {
                code: "CAD",
              })}
              size={14}
              semiBold
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Cashback") + ":"}
              size={15}
              bold
              colorText={theme?.colors?.border}
              textStyle={{ flex: 0.5, fontFamily: "Plus Jakarta Sans" }}
            />

            <AppText
              title={currencyFormatter.format(parseFloat(item.cashback), {
                code: "CAD",
              })}
              size={14}
              semiBold
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={styles.outerView}>
            <AppText
              title={languagePicker(language, "Surcharge") + ":"}
              size={15}
              bold
              colorText={theme?.colors?.border}
              textStyle={{ flex: 0.5, fontFamily: "Plus Jakarta Sans" }}
            />
            <AppText
              title={currencyFormatter.format(parseFloat(item?.surcharge), {
                code: "CAD",
              })}
              size={14}
              semiBold
              colorText={theme?.colors?.border}
            />
          </View>
          <AppText
            title={
              ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
            }
            colorText={theme.colors.toggleColor}
          />
          <View style={[styles.outerView, { paddingTop: RF(5) }]}>
            <AppText
              title={languagePicker(language, "Total Amount:")}
              size={17}
              bold
              colorText={theme?.colors?.border}
              textStyle={{ flex: 0.5, fontFamily: "Plus Jakarta Sans" }}
            />
            <AppText
              title={currencyFormatter.format(item?.total, {
                code: "CAD",
              })}
              size={16}
              semiBold
              colorText={theme?.colors?.border}
            />
          </View>
        </View>
      ) : (
        <>
          <View style={styles.trxView}>
            <View style={{ ...GST.ROW }}>
              <AppText
                title={languagePicker(language, "Transaction") + " "}
                size={17}
                bold
                colorText={theme?.colors?.border}
              />
              <AppText
                title={"#" + item?.transaction_no.substring(0, 16)}
                size={17}
                bold
                colorText={theme?.colors?.border}
              />
            </View>
            <AppText
              title={languagePicker(language, "Sale")}
              size={16}
              medium
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={{ ...GST.ROW }}>
            <AppText
              title={languagePicker(language, item?.type) + ": "}
              size={16}
              regular
              colorText={theme?.colors?.border}
            />
            <AppText
              title={item?.card_number}
              size={16}
              regularItalic
              colorText={theme?.colors?.border}
            />
          </View>
          <View style={styles.trxView}>
            <AppText
              title={currencyFormatter.format(item.total, {
                code: "CAD",
              })}
              size={16}
              regular
              colorText={theme?.colors?.border}
            />
            <View style={{ ...GST.ROW }}>
              <AppText
                title={languagePicker(language, "Tip") + ":"}
                size={16}
                regular
                colorText={theme?.colors?.border}
              />
              <AppText
                title={currencyFormatter.format(item?.tip, {
                  code: "CAD",
                })}
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

export default InsightsOpenTransaction;
const useStyles = (colors: any) =>
  StyleSheet.create({
    outerView: { ...GST.mid_row, marginBottom: RF(3) },
    trxView: { ...GST.mid_row, marginBottom: RF(5) },
    selectedViewTop: { paddingTop: RF(20) },
    visaView: { flexDirection: "row", justifyContent: "space-between" },
    visaTopView: { paddingTop: RF(2) },
  });

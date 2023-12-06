import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { RF } from "@theme";
import { AppText } from "@components";
import { GST } from "@theme";
import { useSelector } from "react-redux";
import { languagePicker } from "@utils";
interface Props {
  cardTitle?: any;
  tipCardArray?: any;
}

export const TipReportBox = (props: Props) => {
  const { tipCardArray, cardTitle } = props;
  const theme: any = useTheme();
  const style = useStyles(theme.colors);
  const language = useSelector((state: any) => state.user.languageType);

  return (
    <View style={style.container}>
      <AppText title={cardTitle} center medium size={18} />
      {tipCardArray.map((item: any) => {
        return (
          <View style={style.containerBox}>
            <View style={style.containerView}>
              {item.card_type !== "" && (
                <AppText
                  title={languagePicker(language, item.card_type)}
                  size={18}
                  bold
                  colorText={theme.colors.border}
                />
              )}

              <View style={style.flexRow}>
                <View style={style.flexThirdView}>
                  <AppText
                    title={languagePicker(language, "Transaction")}
                    size={16}
                    bold
                  />
                </View>
                <View style={style.flexThirdViewCenter}>
                  <AppText
                    title={languagePicker(language, "Tip Count")}
                    size={17}
                    bold
                  />
                </View>
                <View style={style.flexTwoViewCenter}>
                  <AppText title={""} size={16} bold />
                </View>
                <View style={style.flexTwoView}>
                  <AppText
                    title={languagePicker(language, "Totals")}
                    size={16}
                    right
                    bold
                  />
                </View>
              </View>
              <AppText
                title={
                  ". . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . ."
                }
                colorText={theme.colors.toggleColor}
                center
              />
              <View style={style.flexRow}>
                <View style={style.flexThirdView}>
                  <AppText
                    title={languagePicker(language, item.transaction_type)}
                    size={16}
                    regular
                  />
                </View>
                <View style={style.flexThirdViewCenter}>
                  <AppText title={"23"} size={16} regular center />
                </View>
                <View style={style.flexTwoViewCenter}>
                  <AppText title={"$"} size={16} regular center />
                </View>
                <View style={style.flexTwoView}>
                  <AppText title={"890"} right size={16} regular />
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const useStyles = (colors: any) =>
  StyleSheet.create({
    container: { paddingTop: RF(20), paddingBottom: RF(30) },
    containerBox: {
      width: "100%",
      borderWidth: 1,
      borderColor: colors.light_grey,
      borderRadius: RF(16),
      marginTop: RF(10),
      paddingBottom: RF(10),
    },
    containerView: { paddingHorizontal: RF(10), paddingTop: RF(10) },
    flexTwoView: { flex: 2 },
    flexThirdView: { flex: 3 },
    flexThirdViewCenter: { flex: 3, ...GST.CENTER },
    flexTwoViewCenter: { flex: 2, ...GST.CENTER },
    flexRow: { ...GST.ROW },
  });

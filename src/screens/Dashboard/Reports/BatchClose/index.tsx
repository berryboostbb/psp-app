import React, { useState, useEffect } from "react";
import { GST, RF } from "@theme";
import { backArrow, cross } from "@assets";
import { navigate } from "@services";
import { View, ScrollView } from "react-native";
import { AppHeader, AppText, LinearButton, Wrapper } from "@components";
import { useTheme, RouteProp } from "@react-navigation/native";
import useStyles from "./style";
import { useSelector } from "react-redux";
import { languagePicker } from "@utils";
interface Props {
  navigation: any;
  route: RouteProp<{
    params: {
      type?: any;
    };
  }>;
}

const BatchClose = ({ route, navigation }: Props) => {
  const language = useSelector((state: any) => state.user.languageType);
  const theme: any = useTheme();
  const [batch, setBatch] = useState<any>();
  const { type } = route?.params;
  const style = useStyles(theme.colors);
  const [onClick, setOnClick] = useState<any>("");

  const onClickYes = () => {
    if (batch) {
      navigate("ReportsSection", { type: true });
    } else if (type === "batchClose") {
      setBatch(true);
    } else {
      navigate("OpenBatchTerminal", { confirmation: true });
    }
  };

  return (
    <Wrapper isPaddingH isTop>
      <AppHeader
        title={languagePicker(language, "Batch Close")}
        showLeftIcon
        source={cross}
        backAction={() => navigate("Admin_Settings", { type: "" })}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.conatiner}>
          {batch ? (
            <>
              <AppText
                title={languagePicker(language, "Close Batch") + "?"}
                medium
                size={16}
                center
                defaultTextColor
              />
            </>
          ) : (
            <>
              <AppText
                title={languagePicker(
                  language,
                  "Print Transaction Detail Report?"
                )}
                medium
                size={16}
                center
                defaultTextColor
              />
              <AppText
                title={languagePicker(language, "*Please note that during the")}
                medium
                size={14}
                center
                colorText={theme.colors.border}
                textStyle={style.topMarginView}
              />
              <AppText
                title={languagePicker(
                  language,
                  "print, the printing message will"
                )}
                medium
                size={14}
                center
                colorText={theme.colors.border}
              />
              <AppText
                title={languagePicker(language, "display")}
                medium
                size={14}
                center
                colorText={theme.colors.border}
              />
            </>
          )}
          <View style={style.topMarginView}>
            <LinearButton
              title={languagePicker(language, "Yes")}
              onPress={onClickYes}
              onClick={onClick}
            />
            <LinearButton
              title={languagePicker(language, "No")}
              onPress={() => navigation.goBack()}
              onClick={onClick}
            />
          </View>
        </View>
      </ScrollView>
    </Wrapper>
  );
};

export default BatchClose;

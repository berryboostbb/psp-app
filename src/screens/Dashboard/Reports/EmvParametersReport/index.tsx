import React, { useCallback, useState } from "react";
import {
  AppHeader,
  AppText,
  AppView,
  VerticalSpacer,
  Wrapper,
} from "@components";
import { languagePicker } from "@utils";
import { FlatList, StyleSheet, View } from "react-native";
import { backArrowDark, printer } from "@assets";
import { RF, Typography } from "@theme";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useSelector } from "react-redux";
import KeyValueRow from "../components/KeyValueRow";
import { getEmvParameterReportData } from "../helpers/functions";
import Card from "../components/Card";

const EmvParametersReport = () => {
  const language = useSelector((state: any) => state.user.languageType);
  const theme: any = useTheme();
  const navigation = useNavigation();

  const _printReceipt = () => {};

  const _renderHeader = useCallback(() => {
    return (
      <AppView>
        <KeyValueRow keyStr="Merchant ID:" value="136200499100000" />
        <VerticalSpacer spaceFactor={0.4} />
        <KeyValueRow keyStr="Terminal ID:" value="10015843" />
        <VerticalSpacer spaceFactor={0.4} />
        <KeyValueRow keyStr="Date: DD/MM/YYYY:" value="Time: HH/MM/SS" />
        <VerticalSpacer />
      </AppView>
    );
  }, []);

  const _renderItem = ({ item }: any) => {
    const itemData = item?.data;
    return (
      <View>
        <AppText title={item?.title} center size={18} colorText="#4A5568" />
        <VerticalSpacer spaceFactor={0.7} />
        <Card>
          {Object.keys(itemData)?.map((d) => {
            return (
              <>
                {d != "Default" && (
                  <>
                    <VerticalSpacer spaceFactor={0.4} />
                    <AppText
                      title={d}
                      center
                      size={16}
                      colorText="#4A5568"
                      bold
                    />
                  </>
                )}
                {Object.keys(itemData[d]).map((k) => {
                  return <KeyValueRow keyStr={k} value={itemData[d][k]} />;
                })}
              </>
            );
          })}
        </Card>
        <VerticalSpacer />
      </View>
    );
  };

  return (
    <>
      <View style={styles.headerView}>
        <AppHeader
          title={languagePicker(language, "EMV Parameter Report")}
          showLeftIcon
          backAction={() => navigation.goBack()}
          source={backArrowDark}
          size={Typography.FONTS.SIZE.HEADER}
          textColor={theme.colors.grey}
          showRightIcon
          rightIcon={printer}
          rightIconStyle={{ width: 20, height: 20 }}
          onPressRightIcon={_printReceipt}
        />
      </View>
      <Wrapper>
        <VerticalSpacer spaceFactor={0.6} />
        <FlatList
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={_renderHeader}
          renderItem={_renderItem}
          data={getEmvParameterReportData()}
        />
        {/* <VerticalSpacer spaceFactor={3} /> */}
      </Wrapper>
    </>
  );
};

const styles = StyleSheet.create({
  headerView: {
    paddingHorizontal: RF(30),
    paddingTop: RF(20),
    backgroundColor: "#FFF",
  },

  listContainer: {
    padding: 16,
  },
});

export default EmvParametersReport;

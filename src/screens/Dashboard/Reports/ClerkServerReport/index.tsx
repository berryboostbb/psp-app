import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { GST, RF } from "@theme";
import { backArrow, cross, printer } from "@assets";
import { navigate } from "@services";
import {
  AppHeader,
  AppText,
  InsightsOpenClerkReport,
  SearchBarInput,
  Wrapper,
} from "@components";
import { useTheme, RouteProp } from "@react-navigation/native";
import useStyles from "./style";
import { transaction_list } from "@utils";
import { useSelector } from "react-redux";
import { languagePicker, terminal_setting } from "@utils";

const ClerkServerReport = () => {
  const language = useSelector((state: any) => state.user.languageType);
  const theme: any = useTheme();
  const style = useStyles(theme.colors);
  const [selectedItem, setSelectedItem] = useState(-1);
  const [searchText, setSearchText] = useState<any>("");

  const onClickItem = (item: any, index: any) => {
    setSelectedItem(index);
  };
  return (
    <Wrapper isTop isPaddingH>
      <AppHeader
        title={languagePicker(language, "Clerk Server Report")}
        showLeftIcon
        showRightIcon
        source={cross}
        rightIcon={printer}
        backAction={() => navigate("Admin_Settings", { type: "" })}
      />
      <View style={style.searchView}>
        <SearchBarInput
          placeholder={languagePicker(language, "Search Clerk/Server ID")}
          placeholderTextColor={theme?.colors?.border}
        />
      </View>
      <FlatList
        style={style.flatView}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        data={transaction_list}
        renderItem={({ item, index }) => (
          <Pressable
            key={index}
            style={[
              selectedItem == index ? style.selectedView : style.mainView,
              {
                marginBottom: item.id == 15 ? RF(20) : 0,
              },
              style.pressableView,
            ]}
            onPress={() => onClickItem(item, index)}
          >
            {selectedItem == index ? (
              <TouchableOpacity
                onPress={() => navigate("ClerkServerPrintReport")}
              >
                <InsightsOpenClerkReport item={item} selected />
              </TouchableOpacity>
            ) : (
              <>
                <InsightsOpenClerkReport item={item} />
              </>
            )}
          </Pressable>
        )}
      />
    </Wrapper>
  );
};

export default ClerkServerReport;

import {
  TextInput,
  StyleSheet,
  Image,
  View,
  TextInputProps,
  Pressable,
} from "react-native";
import * as React from "react";
import { useTheme } from "@react-navigation/native";
import { RF, Typography, GST } from "@theme";
import { search, searchLine } from "@assets";
import Search from "react-native-vector-icons/AntDesign";
import Menu from "react-native-vector-icons/Feather";

interface Props extends TextInputProps {
  pressFilter?: () => void;
  filterImage?: any;
  widthContainer?: any;
}

const SearchBarInput = (props: Props) => {
  const theme: any = useTheme();
  const styles = useStyles(theme.colors);
  const {
    style,
    value,
    onSubmitEditing,
    onChangeText,
    pressFilter,
    filterImage,
    widthContainer,
  } = props;

  return (
    <View style={[styles.container, { width: widthContainer }]}>
      <View style={styles.searchBar__unclicked}>
        {/* <Image source={search} style={styles.imgSearch} /> */}
        <Search name={"search1"} size={RF(20)} />
        <TextInput
          {...props}
          style={[styles.input]}
          // value={searchPhrase}
          // onChangeText={setSearchPhrase}
          // onFocus={() => {
          //   setClicked(true);
          // }}
        />
        {filterImage && (
          <Pressable onPress={pressFilter}>
            <Menu name={"menu"} size={RF(24)} />
            {/* <Image source={searchLine} style={styles.imgLine} /> */}
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default SearchBarInput;

const useStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
    },
    searchBar__unclicked: {
      padding: 1,
      flexDirection: "row",
      width: "100%",
      backgroundColor: colors.background,
      alignItems: "center",
      borderRadius: RF(50),
      paddingLeft: RF(20),
    },
    searchBar__clicked: {
      padding: 10,
      flexDirection: "row",
      width: "80%",
      backgroundColor: "#d9dbda",
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "space-evenly",
    },
    input: {
      fontSize: RF(18),
      marginLeft: 5,
      width: "79%",
      color: colors.border,
      fontFamily: Typography.FONTS.TYPE.MEDIUM,
    },
    imgLine: {
      width: RF(23),
      height: RF(22),
    },
    imgSearch: {
      resizeMode: "contain",
      width: RF(16),
      height: RF(22),
      marginBottom: RF(1),
    },
  });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  Modal,
  FlatList,
  Keyboard,
} from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "@react-navigation/native";
import { cross } from "@assets";
import { countryPicker } from "@utils";
import { GST, RF } from "@theme";
const windowHeight = Dimensions.get("window").height;
import MaskInput from "react-native-mask-input";
import AppText from "../AppText";
interface Props {
  country?: any;
  placeholder?: string;
  image?: any;
  value?: any;
  countryModal?: any;
  handleCountryModal?: any;
  onchange?: any;
  hanldeCountryPicker?: any;
  handleCountryFlagSign?: any;
  flagSign?: any;
}
const CountryPickerInput = (props: Props) => {
  const {
    country,
    placeholder,
    image,
    value,
    countryModal,
    onchange,
    hanldeCountryPicker,
    handleCountryModal,
    handleCountryFlagSign,
    flagSign,
  } = props;
  const myTheme: any = useTheme();
  const styles = useStyles(myTheme.colors);
  const [searchData, setSearchdata] = useState([]);
  const [stringTosearch, setStringtosearch] = useState("");
  const [countryList, setCountrylist] = useState(countryPicker);
  const [phone, setPhone] = React.useState("");

  const searchFilterFunction = (text: any) => {
    const formattedQuery = text.toLowerCase();
    const data = countryList?.filter((item: any) => {
      if (
        item?.name?.toLowerCase()?.includes(formattedQuery) ||
        item?.dial_code?.toLowerCase()?.includes(formattedQuery)
      ) {
        return true;
      }
    });
    setSearchdata(data);
  };
  useEffect(() => {
    searchFilterFunction(stringTosearch);
  }, [stringTosearch]);
  const onChangeSearch = (query: any) => setStringtosearch(query);

  return (
    <View style={{}}>
      <View style={{ flex: 1 }}>
        <Modal
          visible={countryModal}
          animationType="slide"
          onRequestClose={() => handleCountryModal()}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                handleCountryModal(), setStringtosearch("");
              }}
              style={{ width: "8%", marginLeft: "3%" }}
            >
              <Image
                source={cross}
                style={{ height: 20, width: 20, tintColor: "black" }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TextInput
              onChangeText={onChangeSearch}
              value={stringTosearch}
              maxLength={25}
              placeholder="Enter country name"
              placeholderTextColor={"gray"}
              style={styles.searchText}
            />
          </View>
          <FlatList
            decelerationRate={"fast"}
            data={stringTosearch ? searchData : countryList}
            renderItem={(item) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    hanldeCountryPicker(item?.item?.callingCode),
                      handleCountryModal();
                    setStringtosearch("");
                    handleCountryFlagSign(item?.item?.flag);
                  }}
                  style={styles.flatView}
                >
                  <Image
                    source={{ uri: item?.item?.flag }}
                    style={{ height: 20, width: 20 }}
                    resizeMode="contain"
                  />
                  <Text style={styles.countryname}>{item?.item?.name}</Text>
                  <Text style={{ color: "black", paddingLeft: "1%" }}>
                    {"+" + item?.item?.callingCode}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </Modal>
      </View>

      <Text
        style={{
          paddingLeft: RF(20),
          marginVertical: 10,
          color: myTheme.colors.text,
          fontFamily: "Plus Jakarta Sans",
          fontWeight: "700",
          fontSize: RF(18),
        }}
      >
        {placeholder}
      </Text>
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => handleCountryModal()}
            style={[styles.countryView, { backgroundColor: "white" }]}
          >
            <View style={styles.countryCodeView}>
              <Image
                source={{ uri: flagSign }}
                style={{ height: 20, width: 20 }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: myTheme.colors.text,
                  paddingLeft: RF(10),
                }}
              >
                {country}
              </Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              paddingLeft: RF(10),
              width: "70%",
              // backgroundColor: myTheme.colors.textInputBckground,
            }}
          >
            <MaskInput
              value={phone}
              onChangeText={(masked, unmasked) => {
                setPhone(masked);
                onchange(masked)
              }}
              placeholder="(905) - 299 - 6644"
              style={{ fontSize: 20 }}
              mask={[
                "(",
                /\d/,
                /\d/,
                /\d/,
                ")",
                "-",
                /\d/,
                /\d/,
                /\d/,
                "-",
                /\d/,
                /\d/,
                /\d/,
                /\d/,
              ]}
              keyboardType={"numeric"}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CountryPickerInput;

const useStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: 60,
      backgroundColor: colors.light_grey,
      borderRadius: 40,
      justifyContent: "center",
      paddingHorizontal: RF(10),
    },
    countryView: {
      width: "30%",
      borderRadius: 40,
      alignItems: "center",
      justifyContent: "center",
      // backgroundColor: "orange",
    },
    Input: {
      width: "80%",
      marginLeft: "5%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      // marginLeft: "2%",
      backgroundColor: colors.text,
    },
    TextinputView: {
      width: "80%",
      // paddingVertical: 5,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 30,
      flexDirection: "row",
      // marginLeft: "2%",
    },
    Input: {
      width: "80%",
      borderRadius: 30,
    },
    IconView: {
      width: "10%",
      marginRight: "3%",
    },
    Icon: {
      height: 25,
      width: 25,
      resizeMode: "contain",
    },
    countryname: {
      color: "black",
      fontSize: 14,
      paddingLeft: "2%",
    },
    countryCodeView: {
      flexDirection: "row",
    },
    searchText: {
      height: windowHeight * 0.07,
      width: "90%",
      color: "black",
    },
    flatView: {
      flexDirection: "row",
      paddingHorizontal: "3%",
      paddingVertical: "4%",
      borderBottomWidth: 1,
      // justifyContent: "center",
      alignItems: "center",
      borderBottomColor: colors.line,
    },
  });

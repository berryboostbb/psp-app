import useStyles from "./styles";
import React, { useRef, useState } from "react";
import { cross, exclaimation, good } from "@assets";
import { useTheme } from "@react-navigation/native";
import {
  Wrapper,
  AppHeader,
  AppText,
  Delete_Box,
  SearchBarInput,
  PrimaryButton,
  Overlay,
  SuccessHeader,
} from "@components";
import { RF, Typography } from "@theme";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { languagePicker } from "@utils";
import { delete_Clerk_Server, navigate } from "@services";
import { FlatList } from "react-native-gesture-handler";
import moment from "moment";

const Clerk_List = ({ navigation }: any) => {
  const language = useSelector((state: any) => state.user.languageType);
  const myTheme: any = useTheme();
  const styles = useStyles(myTheme.colors);
  const { users } = useSelector((state: any) => state.tms);
  // console.log("uuu.....", users);
  const currentDate = new Date();

  const [keyword, setKeyword] = useState("");
  const [searchResult, setSearchResults] = useState(users);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const ref: any = useRef();
  const [notifyType, setNotifyType] = useState("");

  const onSearch = (text: any) => {
    setKeyword(text);
    let cloneSettings = users.map((a: any) => ({ ...a }));
    let filteredData = cloneSettings.filter(function (item: any) {
      return item.name.includes(text);
    });
    setSearchResults(filteredData);
  };

  const handleDelete = async (id: any) => {
    delete_Clerk_Server(id)
      .then(async (res) => {
        // console.log("res....", res);
        if (res?.success) {
          console.log("success");
        } else {
          setNotifyType("error");
          await setOverlayVisible(true);
          ref?.current?.alertWithType("custom", `${res?.message}`, "");
        }
        setTimeout(() => {
          setOverlayVisible(false);
        }, 5000);
      })
      .catch((err) => {
        console.log("err...", err);
      });
  };

  return (
    <>
      {overlayVisible && (
        <View style={{ zIndex: 10 }}>
          <Overlay>
            <SuccessHeader
              ref={ref}
              ml={notifyType == "success" ? 120 : 120}
              imageSrc={notifyType == "success" ? good : exclaimation}
              bgClr={notifyType == "success" ? "#E3F8CFD9" : "#D74120E5"}
              title_mT={notifyType == "success" ? 92 : 90}
              tintClr={
                notifyType == "success" ? myTheme.colors.toggleColor : "#000"
              }
              img_mT={notifyType == "success" ? 102 : 97}
            />
          </Overlay>
        </View>
      )}
      <Wrapper isPaddingH isTop>
        <AppHeader
          title={languagePicker(language, "Clerk/Server List")}
          showLeftIcon
          source={cross}
          backAction={() => navigation.navigate("Admin_Settings", { type: "" })}
        />
        <View style={{ flexDirection: "row", paddingHorizontal: RF(30) }}>
          <View style={styles.main}>
            <AppText
              title={languagePicker(language, "Date:")}
              size={Typography.FONTS.SIZE.LARGE}
              bold
            />
            <AppText
              title={moment(currentDate).format("DD/MM/YYYY")}
              size={Typography.FONTS.SIZE.LARGE}
              semiBold
            />
          </View>

          <View style={[styles.main, { paddingLeft: RF(40) }]}>
            <AppText
              title={languagePicker(language, "Time:")}
              size={Typography.FONTS.SIZE.LARGE}
              bold
            />
            <AppText
              title={moment(currentDate).format("HH:mm")}
              size={Typography.FONTS.SIZE.LARGE}
              semiBold
            />
          </View>
        </View>

        <View style={{ flexDirection: "row", paddingTop: RF(30) }}>
          <SearchBarInput
            placeholder={languagePicker(language, "Search")}
            placeholderTextColor={myTheme?.colors?.border}
            pressFilter={() => navigate("SearchFilter")}
            widthContainer={"50%"}
            onChangeText={(txt) => onSearch(txt)}
            // onSubmitEditing={onSearch}
          />
          <PrimaryButton
            buttonStyle={{
              width: "45%",
              height: 50,
              borderRadius: RF(15),
              marginLeft: RF(10),
            }}
            title={"Add  Clerk/Server"}
            bgColor={myTheme.colors.line}
            clr={myTheme.colors.text}
            onPress={() => navigate("Add_Clerk")}
          />
        </View>

        <View style={{ flex: 1 }}>
          <FlatList
            data={keyword !== "" ? searchResult : users}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  // justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 50,
                }}
              >
                <AppText
                  defaultTextColor
                  title={"No User Found"}
                  size={Typography.FONTS.SIZE.XLARGE}
                />
              </View>
            )}
            renderItem={({ item, index }) => {
              return (
                <Delete_Box
                  key={item?._id}
                  val1={item?.name}
                  val2={item?.clerk_id}
                  onPress={() => handleDelete(item?._id)}
                />
              );
            }}
          />
        </View>

        <View style={{ marginBottom: 30 }} />
      </Wrapper>
    </>
  );
};

export default Clerk_List;

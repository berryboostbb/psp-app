import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { AppText, Wrapper, PressImageText, SecondaryButton } from "@components";
import { close, filter, doc, person, key, card, folder } from "@assets";
import { RF } from "@theme";
import { useTheme } from "@react-navigation/native";
import useStyles from "./style";
import { useState } from "react";
import { navigate } from "@services";
import { useSelector } from "react-redux";
import { languagePicker, terminal_setting } from "@utils";

const SearchFilter = ({ navigation }: any) => {
  const language = useSelector((state: any) => state.user.languageType);
  const theme: any = useTheme();
  const style = useStyles(theme.colors);
  const [selected, setSelected] = useState(null);

  return (
    <Wrapper isTop isPaddingH>
      <View style={style.headerFilter}>
        <AppText
          title={languagePicker(language, "Search Filter")}
          size={22}
          colorText={theme.colors.border}
          textStyle={style.headerText}
        />
        <Pressable onPress={() => navigation.goBack()}>
          <Image source={close} style={style.closeImage} />
        </Pressable>
      </View>

      <View style={style.containerList}>
        <PressImageText
          onPress={() => console.log("--------")}
          title={languagePicker(language, "All Transactions")}
          imageName={filter}
        />
        <PressImageText
          onPress={() => console.log("--------")}
          title={languagePicker(language, "Invoice Number")}
          imageName={doc}
        />
        <PressImageText
          onPress={() => console.log("--------")}
          title={languagePicker(language, "Reference Number")}
          imageName={person}
        />
        <PressImageText
          onPress={() => console.log("--------")}
          title={languagePicker(language, "Approval Code")}
          imageName={key}
        />
        <PressImageText
          onPress={() => console.log("--------")}
          title={languagePicker(language, "Card Number")}
          imageName={card}
        />
        <PressImageText
          onPress={() => navigate("SummaryReport")}
          title={languagePicker(language, "Summary Report")}
          imageName={folder}
          bgColor={theme.colors.background}
        />
      </View>
      <View style={{ paddingTop: RF(60) }}>
        <SecondaryButton small title={languagePicker(language, "Update")} />
      </View>
    </Wrapper>
  );
};

export default SearchFilter;

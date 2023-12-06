import { GST, RF, Typography } from "@theme";
import { Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Wrapper, SwitchCard, AppText, AppTextInput } from "@components";
import { useDispatch, useSelector } from "react-redux";
import { setflowtype, setSettings } from "@redux";
import { ScrollView } from "react-native-gesture-handler";
import styles from "./styles";

const Settings = ({ navigation }: any) => {
  const [debitIncludSurchrg, setdebitIncludSurchrg] = useState(false);
  const [debitExcludSurchrg, setdebitExcludSurchrg] = useState(false);
  const [creditIncludSurchrg, setcreditIncludSurchrg] = useState(false);
  const [creditExcludSurchrg, setcreditExcludSurchrg] = useState(false);
  const [pointIncludSurchrg, setPointIncludSurchrg] = useState(false);
  const { flowType, settings } = useSelector((state: any) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      onToggle(flowType);
    });

    return () => {
      unsubscribe;
    };
  }, [navigation]);

  useEffect(() => {}, [navigation]);

  const onToggle = (type: any) => {
    dispatch(setflowtype(type));

    if (type == "debIncl") {
      setdebitIncludSurchrg(!debitIncludSurchrg);
      setdebitExcludSurchrg(false);
      setcreditIncludSurchrg(false);
      setcreditExcludSurchrg(false);
    } else if (type == "debExcl") {
      setdebitIncludSurchrg(false);
      setdebitExcludSurchrg(!debitExcludSurchrg);
      setcreditIncludSurchrg(false);
      setcreditExcludSurchrg(false);
    } else if (type == "credIncl") {
      setdebitExcludSurchrg(false);
      setdebitIncludSurchrg(false);
      setcreditIncludSurchrg(!creditIncludSurchrg);
      setcreditExcludSurchrg(false);
    } else if (type == "credExcl") {
      setdebitExcludSurchrg(false);
      setdebitIncludSurchrg(false);
      setcreditIncludSurchrg(false);
      setcreditExcludSurchrg(!creditExcludSurchrg);
    } else if (type == "pointIncl") {
      setdebitExcludSurchrg(false);
      setdebitIncludSurchrg(false);
      setcreditIncludSurchrg(false);
      setcreditExcludSurchrg(false);
      setPointIncludSurchrg(!pointIncludSurchrg);
    }
  };

  const handleToggleSwitch = (item: any) => {
    let cloneSettings = settings.map((a: any) => ({ ...a }));
    cloneSettings.map((i: any, index: any) => {
      if (i.title == item.title) {
        cloneSettings[index].isEnabled = !cloneSettings[index]?.isEnabled;
      }
    });
    dispatch(setSettings(cloneSettings));
  };

  const handleToggleSubSettings = (item: any, subItem: any) => {
    let cloneSettings = settings.map((a: any) => ({ ...a }));
    let itemToUpdate: any = null;
    let indexToUpdate: any = null;
    cloneSettings.map(async (i: any, index: any) => {
      if (item.title == i.title) {
        itemToUpdate = i;
        indexToUpdate = index;
      }
    });

    let cloneSubSettings = itemToUpdate?.subSettings.map((a: any) => ({
      ...a,
    }));

    if (cloneSubSettings) {
      cloneSubSettings.map(async (ite: any, ind: any) => {
        if (ite.title == subItem.title) {
          ite.isEnabled = !ite.isEnabled;
        }
      });
    }
    cloneSettings[indexToUpdate].subSettings = cloneSubSettings;

    dispatch(setSettings(cloneSettings));
  };

  const handleChangeCashback = (
    text: any,
    type: any,
    itemIndex: any,
    subItem: any,
    item: any
  ) => {
    let cloneSettings = settings.map((a: any) => ({ ...a }));

    if (type == "amount") {
      cloneSettings.map((i: any, index: any) => {
        if (i.title == "Cashback") {
          i.cashback_amount_limit = text;
        }
      });
    } else if (type == "preset") {
      let itemToUpdate: any = null;
      let indexToUpdate: any = null;
      let subItemToUpdate: any = null;
      let subIndexToUpdate: any = null;

      cloneSettings.map(async (i: any, index: any) => {
        if (i.title == item.title) {
          itemToUpdate = i;
          indexToUpdate = index;
        }
      });

      let cloneSubSettings = itemToUpdate?.subSettings.map((a: any) => ({
        ...a,
      }));

      if (cloneSubSettings) {
        cloneSubSettings.map(async (ite: any, ind: any) => {
          if (ite.title == subItem.title) {
            subItemToUpdate = ite;
            subIndexToUpdate = ind;
          }
        });

        let cloneSubSettingsValues = subItemToUpdate?.values.map((a: any) => ({
          ...a,
        }));

        if (cloneSubSettingsValues) {
          cloneSubSettingsValues.map((v: any, INDEX: any) => {
            if (INDEX == itemIndex) {
              v.value = text;
            }
          });
        }
        cloneSubSettings[subIndexToUpdate].values = cloneSubSettingsValues;
      }

      cloneSettings[indexToUpdate].subSettings = cloneSubSettings;
    }

    dispatch(setSettings(cloneSettings));
  };

  const renderSettings = (item: any) => {
    return (
      <View key={item.title}>
        <SwitchCard
          title={item.title}
          onToggle={() => handleToggleSwitch(item)}
          isEnabled={item.isEnabled}
          width={"100%"}
        />
        {item?.subSettings && item.isEnabled && (
          <>
            {item.title == "Cashback" && (
              <>
                <View style={styles.valueRow}>
                  <AppText
                    defaultTextColor
                    title={"Amount Limit:"}
                    size={Typography.FONTS.SIZE.SMALL}
                  />
                  <View style={styles.inputView}>
                    <AppText
                      defaultTextColor
                      title={"$"}
                      size={Typography.FONTS.SIZE.SMALL}
                    />

                    <TextInput
                      style={styles.input}
                      onChangeText={(text) =>
                        handleChangeCashback(text, "amount")
                      }
                      value={item.cashback_amount_limit}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </>
            )}

            {item?.subSettings?.map((subItem: any) => (
              <>
                <View key={subItem.title}>
                  <SwitchCard
                    title={subItem.title}
                    onToggle={() => handleToggleSubSettings(item, subItem)}
                    isEnabled={subItem.isEnabled}
                    width={"85%"}
                  />
                </View>
                {(subItem.title == "Pre Set Cashback Amount" ||
                  subItem.title == "Tip Amount" ||
                  subItem.title == "Tip Percentage") &&
                  subItem.isEnabled && (
                    <View>
                      {subItem.values.map((v: any, index: any) => (
                        <View style={styles.valueRow}>
                          <AppText
                            defaultTextColor
                            title={v.title}
                            size={Typography.FONTS.SIZE.SMALL}
                          />
                          <View style={styles.inputView}>
                            <AppText
                              defaultTextColor
                              title={
                                subItem.title == "Tip Percentage" ? "%" : "$"
                              }
                              size={Typography.FONTS.SIZE.SMALL}
                            />

                            <TextInput
                              style={styles.input}
                              onChangeText={(text) =>
                                handleChangeCashback(
                                  text,
                                  "preset",
                                  index,
                                  subItem,
                                  item
                                )
                              }
                              value={v.value}
                              keyboardType="numeric"
                            />
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
              </>
            ))}
          </>
        )}
      </View>
    );
  };

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        {settings.map((item: any) => (
          <>{renderSettings(item)}</>
        ))}

        {/* <View style={{ height: 40, borderBottomWidth: 2 }} />
        <SwitchCard
          title={"Debit Including Surcharge"}
          onToggle={() => onToggle("debIncl")}
          isEnabled={debitIncludSurchrg}
          width={"100%"}
        />

        <SwitchCard
          title={"Debit Excluding Surcharge"}
          onToggle={() => onToggle("debExcl")}
          isEnabled={debitExcludSurchrg}
          width={"100%"}
        />

        <SwitchCard
          title={"Credit Including Surcharge"}
          onToggle={() => onToggle("credIncl")}
          isEnabled={creditIncludSurchrg}
          width={"100%"}
        />

        <SwitchCard
          title={"Credit Excluding Surcharge"}
          onToggle={() => onToggle("credExcl")}
          isEnabled={creditExcludSurchrg}
          width={"100%"}
        />

        <SwitchCard
          title={"Point Including Surcharge"}
          onToggle={() => onToggle("pointIncl")}
          isEnabled={pointIncludSurchrg}
          width={"100%"}
        />*/}
      </View>
    </ScrollView>
  );
};

export default Settings;

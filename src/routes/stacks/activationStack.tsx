import React from "react";
import {
  ActivationScreen,
  ListingData,
  RecieptMail,
  ReferenceInputScreen,
  Signature,
  SaleWelcome,
  TapProcess,
} from "@screens";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { SuccessHeader } from "@components";

const Stack = createStackNavigator();

const ActivationStack = () => {
  return (
    <>
      <SuccessHeader />
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerShown: false,
          hidesBarsWhenKeyboardAppears: true,
        })}
        initialRouteName="ActivationScreen"
      >
        <Stack.Screen
          name="ActivationScreen"
          component={ActivationScreen}
          options={{ header: (props) => null }}
        />
        {/* <Stack.Screen
          name="ReferenceInputScreen"
          component={ReferenceInputScreen}
          options={{ header: (props: any) => null }}
        /> */}
        <Stack.Screen
          name="ListingData"
          component={ListingData}
          options={{ header: (props) => null }}
        />
        <Stack.Screen
          name="TapProcess"
          component={TapProcess}
          options={{ header: (props) => null }}
        />
      </Stack.Navigator>
    </>
  );
};

export default ActivationStack;
const styles = StyleSheet.create({});

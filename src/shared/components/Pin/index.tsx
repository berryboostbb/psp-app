import { RF } from "@theme";
import React from "react";
import { setTimeLayout, store } from "@redux";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";

interface Props {
  code?: any;
  setCode?: any;
  pinColor?: any;
  inputRef?: any;
  onTextChange?: any;
  onSubmitEditing?: (cod: any) => void;
}

const Pin = React.forwardRef((props: Partial<Props>) => {
  const theme: any = useTheme();
  const { code, setCode, onSubmitEditing, pinColor, inputRef, onTextChange } =
    props;

  const handleSubmit = (code: any) => {
    onSubmitEditing(code);
    // store.dispatch(setTimeLayout(code));
    // setCode();
    //setFocus(!focus);
  };

  const pinHandle = (code: any) => {
    setCode(code);
    // store.dispatch(setTimeLayout(code));
  };

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     ref.current?.blur();
  //     ref.current?.focus();
  //   }, 100);
  //   return () => clearTimeout(timeout);
  // }, []);

  return (
    <KeyboardAvoidingView>
      <SmoothPinCodeInput
        ref={inputRef}
        cellSpacing={-20}
        placeholder={
          <View style={[styles.view, { borderColor: pinColor }]}></View>
        }
        mask={
          <View
            style={[
              styles.mask,
              {
                backgroundColor: theme.colors.white,
              },
            ]}
          />
        }
        cellStyle={null}
        cellStyleFocused={null}
        value={code}
        password={true}
        maskDelay={1000}
        onTextChange={(code: any) => onTextChange(code)}
        // onTextChange={(code: any) => setCode(code)}
        onFulfill={(code: any) => handleSubmit(code)}
        textStyle={{ color: "#fff", fontSize: 24 }}
        keyboardType={"decimal-pad"}
        inputProps={{ secureTextEntry: true }}
      />
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  mask: {
    width: 12,
    height: 12,
    borderRadius: 25,
  },
  view: {
    width: RF(18),
    height: RF(18),
    opacity: 0.3,
    borderWidth: 2,
    borderRadius: 25,
  },
});

export default Pin;

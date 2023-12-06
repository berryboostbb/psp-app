import SignatureScreen from "react-native-signature-canvas";
import React, { Component,useMemo, useRef } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import SignatureCapture from "react-native-signature-capture";
import { WIDTH } from "@utils";
import { setTimeLayout, store } from "@redux";

const Sign = React.forwardRef((props: any, ref: any) => {
  const signRef = useRef<any>(null);

  const { text, onOK, colors, viewMode } = props;

  const saveSign = () => {
    signRef.current.saveImage();
  };

  const resetSign = () => {
    signRef.current.resetImage();
  };

  const _onSaveEvent = (result: any) => {
    onOK(result);
    // store.dispatch(setTimeLayout(result));
  };
  const _onDragEvent = (event: any) => {
    // This callback will be called when the user enters signature
    //  store.dispatch(setTimeLayout(event.dragged));
  };

  const memoizedSignComponent = useMemo(
    () => (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <SignatureCapture
          style={[{ flex: 1 }, styles.signature]}
          ref={ref}
          onSaveEvent={_onSaveEvent}
          onDragEvent={(event) => _onDragEvent(event)}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          showTitleLabel={false}
          backgroundColor={colors.line}
          strokeColor="#000000"
          minStrokeWidth={8}
          maxStrokeWidth={8}
          viewMode={viewMode}
        />
      </View>
    ),
    [viewMode]
  );

  return memoizedSignComponent;
});


export default Sign;

const styles = StyleSheet.create({
  signature: {
    flex: 1,
    borderColor: "#000033",
    borderWidth: 1,
    width: WIDTH * 1.7,
  },
  buttonStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "#eeeeee",
    margin: 10,
  },
});

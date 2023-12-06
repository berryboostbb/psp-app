import React, { Component } from "react";
import {
  Button,
  PanResponder,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
} from "react-native";
var { width, height } = Dimensions.get("window");
export default class UserActivityMonitor extends Component {
  state = {
    show: false,
  };
  _panResponder = {};
  timer = 0;
  componentDidMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        this.resetTimer();
        return true;
      },
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => {
        this.resetTimer();
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
    });
    this.timer = setTimeout(() => this.setState({ show: true }), 200000);
  }

  resetTimer() {
    clearTimeout(this.timer);
    if (this.state.show) this.setState({ show: false });
    this.timer = setTimeout(() => this.setState({ show: true }), 200000);
  }

  render() {
    return (
      <View
        style={styles.container}
        collapsable={false}
        {...this._panResponder.panHandlers}
      >
        {/* {this.state.show ? (
          <Text style={{ fontSize: 30 }}>Timer Expired : 5sec</Text>
        ) : null} */}

        {!this.state.show ? (
          <Text style={{ fontSize: 30 }}>active</Text>
        ) : (
          <Text style={{ fontSize: 30 }}>unActive</Text>
        )}

        {/* <TouchableOpacity>
          <Image
            style={{ width: 300, height: 300 }}
            source={{ uri: "https://facebook.github.io/react/img/logo_og.png" }}
          />
        </TouchableOpacity> */}

        {/* <Button title="Here is a button for some reason" onPress={() => {}} /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

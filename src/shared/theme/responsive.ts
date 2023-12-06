import { Dimensions, PixelRatio } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
const { width, height } = Dimensions.get("window");
// 1st Way
const widthPercentageToDP = (widthPercent: any) => {
  const screenWidth = Dimensions.get("window").width;
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};
const heightPercentageToDP = (heightPercent: any) => {
  const screenHeight = Dimensions.get("window").height;
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};
export { widthPercentageToDP as WP, heightPercentageToDP as HP, RFValue as RF };
// return Math.round
// 2nd way
const BASE_UNIT_WIDTH = 360;
const BASE_UNIT_HEIGHT = 592;
const horizontalScale = (size: any) => (width / BASE_UNIT_WIDTH) * size;
const verticalScale = (size: any) => (height / BASE_UNIT_HEIGHT) * size;
const moderateScale = (size: any, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;
export { horizontalScale, verticalScale, moderateScale };
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const ASPECT_RATIO = SCREEN_HEIGHT / SCREEN_WIDTH;
export const BASE_ASPECT_RATIO = BASE_UNIT_HEIGHT / BASE_UNIT_WIDTH;
export const ASPECT_DIFF = ASPECT_RATIO / BASE_ASPECT_RATIO;

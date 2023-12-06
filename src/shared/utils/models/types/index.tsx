import { NavigationProp, RouteProp } from "@react-navigation/core";
// import { Source } from "react-native-fast-image";

export interface GenericNavigation {
  navigation?: NavigationProp<any>;
  route?: RouteProp<any, any>;
}

export interface IntroSlide {
  key: number;
  title: string;
  text: string;
  image: any;
  color: string;
}

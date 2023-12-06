import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppHeader, AppText, Wrapper } from '@components'
import { backArrow,printer,close,filter } from "@assets";
import { GST,RF } from '@theme';
import { useTheme } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';


interface Props {
    imageName?:any;
    title?:any;
    onPress?: () => void;
    bgColor?:any
  }
  

const PressImageText = (props:Props) => {
  const {imageName,title,onPress,bgColor} = props
  const theme: any = useTheme();
  const style = useStyles(theme.colors);
  return (
      <TouchableOpacity
      onPress={onPress}
      style={[style.btnView,{backgroundColor: bgColor ? bgColor : "white"}]}
      >
      <Image
      source={imageName}
      style={style.img}
      />  
      <AppText 
      title={title}
      size={16}
      colorText={theme.colors.border}
      medium
      />
      </TouchableOpacity>
   
  )
}

export default PressImageText


const useStyles = (colors: any) =>
  StyleSheet.create({
    btnView:{borderRadius:RF(10),height:RF(63),paddingLeft:RF(20),...GST.ROW,...GST.AIC},
    img:{width:RF(18),height:RF(18),marginRight:RF(15),resizeMode:'contain',tintColor:colors.border}
  });

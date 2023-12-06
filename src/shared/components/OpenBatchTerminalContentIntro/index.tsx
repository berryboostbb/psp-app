import { StyleSheet, Text, View, } from 'react-native'
import React from 'react'
import { AppText } from '@components';
import { RF,GST } from '@theme';
import { useTheme } from '@react-navigation/native';

interface Props {
  terminalTitle?:string,
  terminalContent?:string,
  wrapRowShow?:any,
  titleLeft?:any,
  titleLeftContent?:any,
  titleRight?:any,
  titleRightContent?:any
 
}

const OpenBatchTerminalContentIntro = (props:Props) => {
  const {terminalTitle,terminalContent,wrapRowShow,titleLeft,titleLeftContent,titleRight,titleRightContent} = props
  const theme: any = useTheme();
  const style = useStyles(theme.colors);
  return (
    <View style={style.introContainer}>
      {
        terminalTitle &&  
        <AppText
        title={terminalTitle}
        colorText={theme.colors.border} 
        size={17} 
        bold 
      />
      }
      {
        terminalContent &&  
        <AppText
          title={terminalContent}
          colorText={theme.colors.border}
          size={17}
          medium
        />
      }  
      {
      wrapRowShow && 
      <>
         <View style={style.rowView}>
          <AppText
          title={titleLeft}
          size={17}
          colorText={theme.colors.border}
          bold
          />
          <AppText
          title={titleLeftContent}
          size={17}
          colorText={theme.colors.border}
          medium
          />
         </View>
         <View style={style.rowView}>
          <AppText
          title={titleRight}
          size={17}
          colorText={theme.colors.border}
          bold
          />
          <AppText
          title={titleRightContent}
          size={17}
          colorText={theme.colors.border}
          medium
          />
         </View>
      </>
    }
    </View>
  )
}

export default OpenBatchTerminalContentIntro

const useStyles = (colors: any) =>
 StyleSheet.create({
  introContainer:{...GST.mid_row,paddingVertical:RF(5),},
  rowView:{...GST.ROW}
 
 })
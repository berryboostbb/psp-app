import React, { useCallback, useRef, useState } from 'react';
import { AppHeader, AppText, AppView, VerticalSpacer, Wrapper } from '@components';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { RF } from '@theme';
import KeyValueRow from '../components/KeyValueRow';
import { getFormattedDate, getFormattedTime, getReceiptHeader, getTerminalConfigurationData } from '../helpers/functions';
import Card from '../components/Card';
import ViewShot from 'react-native-view-shot';
import { useSelector } from 'react-redux';

const TerminalConfigurationScreenshot = React.forwardRef((_, ref: any) => {
    const currentDate = useRef(new Date()).current;
    const { tms_settings } = useSelector((state: any) => state?.pr);
    const printerConfiguration = tms_settings?.printer;
    const _renderHeader = useCallback(() => {
        return (
            <AppView>
                <KeyValueRow keyStr="Merchant ID:" value="136200499100000" fontSize={20} textColor="#000" />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="Terminal ID:" value="10015843" fontSize={20} textColor="#000" />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr={`Date: ${getFormattedDate(currentDate.toString())}`} value={`Time: ${getFormattedTime(currentDate.toString())}`} fontSize={20} textColor="#000" />
                <VerticalSpacer />
            </AppView>
        );
    }, []);

    const _renderItem = (item: any) => {
        const itemData = item?.data;
        return (
            <View>
                <AppText title={item?.title} center size={24} colorText="#000" />
                <VerticalSpacer spaceFactor={0.7} />
                <Card style={styles.itemContainer}>
                    {Object.keys(itemData)?.map(d => {
                        return <KeyValueRow keyStr={d} value={itemData?.[d]} textColor="#000" fontSize={20} />;
                    })}
                </Card>
                <VerticalSpacer />
            </View>
        );
    };

    return (
        <>
            <View style={styles.headerView}></View>
            <Wrapper>
                <VerticalSpacer spaceFactor={0.6} />
                <ScrollView contentContainerStyle={styles.listContainer}>
                    <ViewShot ref={ref} options={{ format: 'png' }}>
                        <AppText title={getReceiptHeader()} bold center colorText="#000" size={20} />
                        {/* {printerConfiguration?.receipt_header_lines?.line_1 ? (
              <View style={styles.headerImageContainer}>
                <Image
                  source={{
                    uri: printerConfiguration?.receipt_header_lines?.line_1,
                  }}
                  style={styles.headerImage}
                />
              </View>
            ) : (
              <></>
            )} */}
                        {_renderHeader()}
                        {getTerminalConfigurationData().map(item => {
                            return _renderItem(item);
                        })}
                    </ViewShot>
                </ScrollView>
                {/* <FlatList
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={_renderHeader}
          renderItem={_renderItem}
          data={getTerminalConfigurationData()}
        /> */}
            </Wrapper>
        </>
    );
});

const styles = StyleSheet.create({
    headerView: {
        paddingHorizontal: RF(30),
        paddingTop: RF(20),
        backgroundColor: '#FFF',
    },
    itemContainer: {
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#000',
    },
    listContainer: {
        padding: 8,
    },
    headerImage: {
        width: '80%',
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerImageContainer: {
        width: '100%',
        justifyContent: 'center',
        // backgroundColor: "red",
        alignItems: 'center',
    },
});

export default TerminalConfigurationScreenshot;

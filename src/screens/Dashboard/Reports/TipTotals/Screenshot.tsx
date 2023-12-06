import React, { useCallback, useEffect } from 'react';
import { AppHeader, AppText, AppView, VerticalSpacer, Wrapper } from '@components';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { RF } from '@theme';
import KeyValueRow from '../components/KeyValueRow';
import Card from '../components/Card';
import ReportRowItem from '../components/ReportRowItem';
import useTransactionList from '../../../../db/hooks/useTransactionList';
import { getFormattedDate, getFormattedTime, getReceiptHeader } from '../helpers/functions';
var RNFS = require('react-native-fs');
import { useSelector } from 'react-redux';

const dataKeys = ['Transaction', 'Tip Count', 'Currency', 'Total'];
const skippedKeysFromHead = ['Currency'];

interface Props {
    data: any;
}

const TipScreenshot = React.forwardRef(({ data }: Props, ref: any) => {
    const { tms_settings } = useSelector((state: any) => state?.pr);
    const printerConfiguration = tms_settings?.printer;
    const _renderHeader = useCallback(() => {
        return (
            <AppView>
                <KeyValueRow keyStr="Merchant ID:" value="136200499100000" fontSize={20} textColor="#000" />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="Terminal ID:" value="10015843" fontSize={20} textColor="#000" />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="Current Date:" value={getFormattedDate(new Date().toString())} fontSize={20} textColor="#000" />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="Time:" value={getFormattedTime(new Date().toString())} fontSize={20} textColor="#000" />
                <VerticalSpacer />
            </AppView>
        );
    }, []);

    const _renderItem = useCallback(item => {
        return (
            <AppView>
                <AppView style={styles.sectionHeaderContainer}>
                    <AppText title={item.title} colorText="#000" center size={24} />
                </AppView>
                {item.tips.map((tip: any, index: number) => {
                    return (
                        <Card style={styles.itemContainer} key={index.toString()}>
                            {tip?.['Card Type'] ? <AppText title={tip['Card Type']} bold size={20} colorText="#000" /> : <></>}
                            <AppView style={styles.reportItemContainer}>
                                {dataKeys.map((d: any, index: number) => {
                                    return (
                                        <ReportRowItem
                                            key={index.toString()}
                                            title={skippedKeysFromHead.includes(d) ? ' ' : d}
                                            alignLeft={index === 0}
                                            flex2={[0, 1].includes(index)}
                                            bold
                                            textColor="#000"
                                            fontSize={20}
                                        />
                                    );
                                })}
                            </AppView>
                            <View style={styles.divider} />
                            <AppView style={styles.reportItemContainer}>
                                <ReportRowItem title={tip[dataKeys[0]]} alignLeft flex2 textColor="#000" fontSize={20} />
                                <ReportRowItem title={tip[dataKeys[1]]} flex2 textColor="#000" fontSize={20} />
                                <ReportRowItem title={tip[dataKeys[2]]} textColor="#000" fontSize={20} />
                                <ReportRowItem title={tip[dataKeys[3]]} textColor="#000" fontSize={20} />
                            </AppView>
                        </Card>
                    );
                })}
            </AppView>
        );
    }, []);

    return (
        <Wrapper>
            <ScrollView contentContainerStyle={styles.listContainer}>
                <ViewShot ref={ref} options={{ format: 'png' }}>
                    <AppText title={getReceiptHeader()} bold center colorText="#000" size={20} />
                    {/* {printerConfiguration?.receipt_header_lines?.line_1 != null &&
          printerConfiguration?.receipt_header_lines?.line_1 != "" ? (
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
                    <VerticalSpacer spaceFactor={1.5} />
                    {_renderHeader()}
                    {data?.map((item: any, index: any) => {
                        return <View key={index}>{_renderItem(item)}</View>;
                    })}
                </ViewShot>
            </ScrollView>
        </Wrapper>
    );
});

const styles = StyleSheet.create({
    headerView: {
        paddingHorizontal: RF(30),
        paddingTop: RF(20),
        backgroundColor: '#FFF',
    },
    listContainer: {
        backgroundColor: '#FFF',
        padding: 16,
    },
    sectionHeaderContainer: {
        marginTop: 20,
        marginBottom: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#000',
    },
    reportItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: '#000',
        borderStyle: 'dashed',
        marginVertical: 2,
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

export default TipScreenshot;

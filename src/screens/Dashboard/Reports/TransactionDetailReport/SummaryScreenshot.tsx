import React, { useCallback } from 'react';
import { AppText, AppView, VerticalSpacer, Wrapper } from '@components';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Card from '../components/Card';
import ReportRowItem from '../components/ReportRowItem';
import ViewShot from 'react-native-view-shot';
import { store } from '@redux';
import { getReceiptHeader } from '../helpers/functions';
import { useSelector } from 'react-redux';

const summaryDataKeys = ['Transaction Type', 'Count', 'Currency', 'Sub-Totals'];
const skippedKeysFromHead = ['Transaction Type', 'Currency'];

interface Props {
    summaryData: any;
}

const SummaryScreenshot = React.forwardRef(({ summaryData }: Props, ref: any) => {
    const { tms_settings } = useSelector((state: any) => state?.pr);
    const printerConfiguration = tms_settings?.printer;
    const _renderSummaryItem = useCallback(item => {
        const data = item.data;
        return (
            <AppView style={styles.summaryItemContainer}>
                <AppText title={item.title} center colorText="#000" size={22} />
                <VerticalSpacer />
                <Card style={styles.transactionContainer}>
                    <View style={styles.reportItemContainer}>
                        {summaryDataKeys.map((d: any, index: number) => {
                            return <ReportRowItem title={skippedKeysFromHead.includes(d) ? ' ' : d} alignLeft={index === 0} flex2={[0, 3].includes(index)} textColor="#000" fontSize={18} bold />;
                        })}
                    </View>
                    {data.map((d: any) => {
                        const k = summaryDataKeys;
                        return (
                            <View style={[styles.reportItemContainer, ['Total', 'Grand Total'].includes(d[k[0]]) && styles.topBorder]}>
                                <ReportRowItem title={d[k[0]]} textColor="#000" alignLeft bold flex2 fontSize={18} />
                                <ReportRowItem title={d[k[1]]} textColor="#000" fontSize={18} />
                                <ReportRowItem title={d[k[2]]} textColor="#000" fontSize={18} />
                                <ReportRowItem title={d[k[3]]} textColor="#000" flex2 fontSize={18} />
                            </View>
                        );
                    })}
                </Card>
            </AppView>
        );
    }, []);

    return (
        <>
            <Wrapper>
                <VerticalSpacer />
                <ScrollView contentContainerStyle={styles.listContainer}>
                    <ViewShot ref={ref} options={{ format: 'png' }}>
                        <AppText title={getReceiptHeader()} bold center colorText="#000" size={20} />
                        {/* {printerConfiguration?.receipt_header_lines?.line_1 != null ? (
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
                        {summaryData?.map((item: any, index: number) => {
                            return <View key={index.toString()}>{_renderSummaryItem(item)}</View>;
                        })}
                    </ViewShot>
                </ScrollView>
            </Wrapper>
        </>
    );
});

const styles = StyleSheet.create({
    listContainer: {
        padding: 16,
        paddingBottom: 36,
        paddingTop: 12,
    },
    summaryItemContainer: {
        marginVertical: 12,
    },
    reportItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    topBorder: {
        borderTopWidth: 1,
        borderTopColor: '#000',
        borderStyle: 'dashed',
        marginTop: 6,
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
    transactionContainer: {
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#000',
    },
});

export default SummaryScreenshot;

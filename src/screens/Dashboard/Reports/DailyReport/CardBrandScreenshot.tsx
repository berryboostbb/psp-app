import React, { useCallback } from 'react';
import { AppText, AppView, VerticalSpacer, Wrapper } from '@components';
import Card from '../components/Card';
import KeyValueRow from '../components/KeyValueRow';
import { Image, ScrollView, SectionList, StyleSheet, View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { getReceiptHeader } from '../helpers/functions';
import { store } from '@redux';
import ReportRowItem from '../components/ReportRowItem';
import { useSelector } from 'react-redux';

interface Props {
    startDate: any;
    endDate: any;
    startTime: any;
    endTime: any;
    lastTransactionDate: any;
    transactionData: any;
}

const cardDataKeys: any = {
    'Card Brand Totals': ['Card Type', 'Count', 'Currency', 'Totals'],
    'Interac Totals': ['Interac', 'Count', 'Currency', 'Totals'],
    'Visa Totals': ['Visa', 'Count', 'Currency', 'Totals'],
    'MasterCard Totals': ['MasterCard', 'Count', 'Currency', 'Totals'],
};
const skippedKeysFromHead = ['Currency'];

const CardBrandScreenshot = React.forwardRef(({ startDate, endDate, startTime, endTime, lastTransactionDate, transactionData }: Props, ref: any) => {
    const _renderHeader = useCallback(() => {
        return (
            <AppView>
                <KeyValueRow keyStr="Merchant ID:" value="136200499100000" fontSize={20} textColor="#000" />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="Terminal ID:" value="10015843" fontSize={20} textColor="#000" />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="Start Date:" value={startDate} fontSize={20} textColor="#000" />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="Start Time:" value={startTime} fontSize={20} textColor="#000" />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="End Date:" value={endDate} fontSize={20} textColor="#000" />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="End Time:" value={endTime} fontSize={20} textColor="#000" />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="Last Transaction:" value={lastTransactionDate} fontSize={20} textColor="#000" />
                <VerticalSpacer />
            </AppView>
        );
    }, []);

    const _renderCardBrandItem = useCallback(item => {
        return (
            <View>
                <View style={styles.sectionHeaderContainer}>
                    <AppText title={item.title} center size={22} colorText="#000" bold />
                </View>
                <Card style={styles.itemContainer}>
                    <View style={styles.reportItemContainer}>
                        {cardDataKeys[item.title].map((d: any, index: number) => {
                            return <ReportRowItem title={skippedKeysFromHead.includes(d) ? ' ' : d} alignLeft={index === 0} flex2={[0, 3].includes(index)} bold textColor="#000" fontSize={18} />;
                        })}
                    </View>
                    {item?.data?.map((d: any) => {
                        const k = cardDataKeys[item.title];
                        return (
                            <View style={[styles.reportItemContainer, ['Sub Total', 'Grand Total'].includes(d[k[0]]) && styles.topBorder]}>
                                <ReportRowItem title={d[k[0]]} textColor="#000" fontSize={18} alignLeft bold flex2 />
                                <ReportRowItem title={d[k[1]]} textColor="#000" fontSize={18} />
                                <ReportRowItem title={d[k[2]]} textColor="#000" fontSize={18} />
                                <ReportRowItem title={d[k[3]]} flex2 textColor="#000" fontSize={18} />
                            </View>
                        );
                    })}
                </Card>
            </View>
        );
    }, []);

    return (
        <>
            <Wrapper>
                <VerticalSpacer />
                <ScrollView contentContainerStyle={styles.listContainer}>
                    <ViewShot options={{ format: 'png' }} ref={ref}>
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
                        {_renderHeader()}
                        {transactionData?.map((item: any, index: number) => {
                            return <View key={index.toString()}>{_renderCardBrandItem(item)}</View>;
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
    item: {
        marginVertical: 3,
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
    marginTop: {
        marginTop: 12,
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

export default CardBrandScreenshot;

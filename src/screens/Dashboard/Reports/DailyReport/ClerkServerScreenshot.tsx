import React, { useCallback } from 'react';
import { AppText, AppView, VerticalSpacer, Wrapper } from '@components';
import Card from '../components/Card';
import KeyValueRow from '../components/KeyValueRow';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { getReceiptHeader } from '../helpers/functions';
import { store } from '@redux';
import { useSelector } from 'react-redux';

interface Props {
    startDate: any;
    endDate: any;
    startTime: any;
    endTime: any;
    lastTransactionDate: any;
    transactionData: any;
}

const ClerkServerScreenshot = React.forwardRef(({ startDate, endDate, startTime, endTime, lastTransactionDate, transactionData }: Props, ref: any) => {
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

    const _renderSectionHeader = useCallback(section => {
        return (
            <View style={styles.sectionHeaderContainer}>
                <AppText title={section.title} center colorText="#000" size={22} />
            </View>
        );
    }, []);

    const _renderItem = useCallback(item => {
        return (
            <Card style={styles.itemContainer}>
                {Object.keys(item).map(k => {
                    return (
                        <View style={[styles.item, k.toString() === 'Total Refunds' && styles.marginTop]}>
                            <KeyValueRow
                                keyStr={k.toString() === 'No. of Refunds' ? 'No. of Transactions' : k.toString()}
                                value={item[k].toString()}
                                fontSize={20}
                                textColor="#000"
                                // boldKey={selectedFilter === "Clerk/Server"}
                            />
                        </View>
                    );
                })}
            </Card>
        );
    }, []);

    console.log('transactionData: ', transactionData);

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
                            return (
                                <View key={index.toString()}>
                                    {_renderSectionHeader(item)}
                                    {item?.data?.map((d: any) => {
                                        return _renderItem(d);
                                    })}
                                </View>
                            );
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

export default ClerkServerScreenshot;

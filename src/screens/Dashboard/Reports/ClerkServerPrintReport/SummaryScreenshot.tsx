import React, { useCallback, useState } from 'react';
import { AppText, VerticalSpacer, Wrapper } from '@components';
import { ScrollView, StyleSheet, View } from 'react-native';
import { RF } from '@theme';
import Card from '../components/Card';
import KeyValueRow from '../components/KeyValueRow';
import useTransactionList from '../../../../db/hooks/useTransactionList';
import { getReceiptHeader } from '../helpers/functions';
import { Image } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { useSelector } from 'react-redux';

const SummaryScreenshot = React.forwardRef((_, ref: any) => {
    const { tms_settings } = useSelector((state: any) => state?.pr);
    const printerConfiguration = tms_settings?.printer;
    const { transactionList } = useTransactionList();

    const _getFilteredClerksData = useCallback(() => {
        const data: any = {};
        transactionList.forEach(d => {
            if (d?.clerk_id in data) {
                data[d.clerk_id].push(d);
            } else {
                data[d.clerk_id] = [d];
            }
        });
        return data;
    }, []);

    const _renderItem = (item: any) => {
        const data = _getFilteredClerksData();
        const clerkData = data[item];
        if (clerkData && clerkData?.length > 0) {
            const sales = clerkData?.filter((d: any) => d?.sale_amount > 0 && d?.status === 'Sale' && d?.transactionStatus === 'Approved');
            const salesTotal = sales?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);
            const refunds = clerkData?.filter((d: any) => d?.sale_amount > 0 && d?.status === 'Refunded');
            const refundsTotal = refunds?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.sale_amount), 0);
            const tipTotal = sales?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.tip_amount), 0);

            const grandTotal = sales?.reduce((partialSum: number, a: any) => partialSum + parseFloat(a?.tip_amount) + parseFloat(a?.sale_amount) + parseFloat(a?.surcharge_amount), 0);

            return (
                <Card style={styles.transactionContainer}>
                    <>
                        <KeyValueRow keyStr="Clerk/Server ID" value={item} boldKey fontSize={20} textColor="#000" />
                        <KeyValueRow keyStr="Sales Total" value={`$ ${salesTotal?.toFixed(2)}`} boldKey fontSize={20} textColor="#000" />
                        <KeyValueRow keyStr="Tip Total" value={`$ ${tipTotal?.toFixed(2)}`} boldKey fontSize={20} textColor="#000" />
                        <KeyValueRow keyStr="Refunds Total" value={`$ ${refundsTotal?.toFixed(2)}`} boldKey fontSize={20} textColor="#000" />
                        <KeyValueRow keyStr="Grand Total" value={`$ ${grandTotal?.toFixed(2)}`} boldKey fontSize={20} textColor="#000" />
                    </>
                </Card>
            );
        }
        return <></>;
    };

    return (
        <>
            <Wrapper>
                <VerticalSpacer />
                <View style={styles.listsContainer}>
                    <ScrollView>
                        <ViewShot options={{ format: 'png' }} ref={ref}>
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
                            {Object.keys(_getFilteredClerksData())?.map((item, index) => {
                                return <View key={index}>{_renderItem(item)}</View>;
                            })}
                        </ViewShot>
                    </ScrollView>
                </View>
                <VerticalSpacer spaceFactor={2} />
            </Wrapper>
        </>
    );
});

const styles = StyleSheet.create({
    listsContainer: {
        paddingHorizontal: 16,
        flex: 1,
    },
    transactionContainer: {
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#000',
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

export default SummaryScreenshot;

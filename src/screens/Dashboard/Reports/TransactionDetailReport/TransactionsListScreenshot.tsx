import React, { useCallback, useState } from 'react';
import { AppText, VerticalSpacer, Wrapper } from '@components';
import { FlatList, Image, ScrollView, StyleSheet, View } from 'react-native';
import Card from '../components/Card';
import KeyValueRow from '../components/KeyValueRow';
import { getFormattedDate, getFormattedTime, getMarkedCardNumber, getReceiptHeader } from '../helpers/functions';
import { store } from '@redux';
import ViewShot from 'react-native-view-shot';
import { useSelector } from 'react-redux';

interface Props {
    transactionData?: any;
}

const TransactionListScreenshot = React.forwardRef(({ transactionData }: Props, ref: any) => {
    const { tms_settings } = useSelector((state: any) => state?.pr);
    const printerConfiguration = tms_settings?.printer;
    const _renderTransactionItem = (item: any) => {
        return (
            <Card style={styles.transactionContainer}>
                <>
                    <KeyValueRow keyStr={`Reference #${item?.reference_id}`} value={item?.status} boldKey fontSize={20} textColor="#000" />
                    <VerticalSpacer spaceFactor={0.4} />
                    {item?.card_type ? (
                        <>
                            <AppText title={`${item?.card_type}: ${getMarkedCardNumber(item?.card_number)}`} size={20} colorText="#000" />
                            <VerticalSpacer spaceFactor={0.4} />
                        </>
                    ) : (
                        <></>
                    )}
                    <KeyValueRow keyStr="Date" value={`${getFormattedDate(item?.created_at)}`} fontSize={20} textColor="#000" />
                    <VerticalSpacer spaceFactor={0.4} />
                    <KeyValueRow keyStr="Time" fontSize={20} textColor="#000" value={`${getFormattedTime(item?.created_at)}`} />
                    <VerticalSpacer spaceFactor={0.4} />
                    <KeyValueRow
                        keyStr={`$${item?.surcharge_amount > 0 ? (item?.sale_amount + item?.surcharge_amount).toFixed(2) : item?.sale_amount?.toFixed(2)}`}
                        value={`Tip: $${item?.tip_amount?.toFixed(2)}`}
                        fontSize={20}
                        textColor="#000"
                    />
                </>
            </Card>
        );
    };

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
                        {transactionData?.map((item: any, index: number) => {
                            return <View key={index?.toString()}>{_renderTransactionItem(item)}</View>;
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

export default TransactionListScreenshot;

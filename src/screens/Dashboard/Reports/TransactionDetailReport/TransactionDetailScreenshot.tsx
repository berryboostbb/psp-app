import React from 'react';
import { AppText, VerticalSpacer, Wrapper } from '@components';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Card from '../components/Card';
import KeyValueRow from '../components/KeyValueRow';
import { getFormattedDate, getFormattedTime, getReceiptHeader, getTimezoneStr } from '../helpers/functions';
import { store } from '@redux';
import ViewShot from 'react-native-view-shot';
import { useSelector } from 'react-redux';

const timezone = getTimezoneStr();

interface Props {
    transaction?: any;
}

const TransactionDetailScreenshot = React.forwardRef(({ transaction }: Props, ref: any) => {
    const { tms_settings } = useSelector((state: any) => state?.pr);
    const printerConfiguration = tms_settings?.printer;
    const _renderTransactionItem = (item: any) => {
        return (
            <Card style={styles.transactionContainer}>
                <>
                    <KeyValueRow keyStr="Merchant ID:" value="136200499100000" boldKey fontSize={20} textColor="#000" />
                    <VerticalSpacer spaceFactor={0.4} />
                    <KeyValueRow keyStr="Terminal ID:" value="10015843" boldKey fontSize={20} textColor="#000" />
                    <VerticalSpacer spaceFactor={0.4} />
                    <KeyValueRow keyStr="Clerk/Server ID:" value={item?.clerk_id} boldKey fontSize={20} textColor="#000" />
                    <VerticalSpacer spaceFactor={0.4} />
                    <KeyValueRow keyStr={`${item?.card_type}`} value={`${item?.status}`} boldKey fontSize={20} textColor="#000" />
                    <KeyValueRow keyStr="Account Type:" value={item?.account_type} boldKey fontSize={20} textColor="#000" />
                    <VerticalSpacer spaceFactor={0.4} />
                    <KeyValueRow keyStr="Ref #:" value={item?.reference_id} boldKey fontSize={20} textColor="#000" />
                    <VerticalSpacer spaceFactor={0.4} />
                    <KeyValueRow keyStr="Date: " value={getFormattedDate(item?.created_at)} boldKey fontSize={20} textColor="#000" />
                    <VerticalSpacer spaceFactor={0.4} />
                    <KeyValueRow keyStr="Time: " value={`${getFormattedTime(item?.created_at)} ${timezone}`} boldKey fontSize={20} textColor="#000" />
                    <VerticalSpacer spaceFactor={1} />
                    <KeyValueRow keyStr="Amount:" boldKey value={`$${item?.sale_amount?.toFixed(2)}`} fontSize={20} textColor="#000" />
                    <VerticalSpacer spaceFactor={0.4} />
                    <KeyValueRow keyStr="Tip:" value={`$${item?.tip_amount?.toFixed(2)}`} boldKey fontSize={20} textColor="#000" />
                    <VerticalSpacer spaceFactor={0.4} />
                    <KeyValueRow keyStr="Surcharge:" value={`$${item?.surcharge_amount?.toFixed(2)}`} fontSize={20} textColor="#000" />
                    <VerticalSpacer spaceFactor={0.4} />
                    <View style={styles.topBorder} />
                    <KeyValueRow keyStr="Total Amount:" value={`$${(item?.sale_amount + item?.tip_amount + item?.surcharge_amount)?.toFixed(2)}`} boldKey fontSize={24} textColor="#000" />
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
                        {_renderTransactionItem(transaction)}
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
    topBorder: {
        borderTopWidth: 1,
        borderTopColor: '#000',
        borderStyle: 'dashed',
        marginTop: 6,
    },
});

export default TransactionDetailScreenshot;

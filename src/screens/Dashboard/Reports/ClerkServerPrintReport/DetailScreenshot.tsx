import React from 'react';
import { AppText, VerticalSpacer, Wrapper } from '@components';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { RF } from '@theme';
import Card from '../components/Card';
import KeyValueRow from '../components/KeyValueRow';
import { getReceiptHeader } from '../helpers/functions';

import ViewShot from 'react-native-view-shot';
import { useSelector } from 'react-redux';

const DetailScreenshot = React.forwardRef((props: any, ref: any) => {
    const data: any = props?.data;
    const { tms_settings } = useSelector((state: any) => state?.pr);
    const printerConfiguration = tms_settings?.printer;

    const _renderItem = (d: any) => {
        return (
            <Card style={styles.transactionContainer}>
                <View>
                    <KeyValueRow keyStr={d?.card_type} value={d?.status} fontSize={20} textColor="#000" style={styles.clerkItemRow} />
                    <KeyValueRow keyStr="Clerk/Server ID#" value={d?.clerk_id} fontSize={20} textColor="#000" style={styles.clerkItemRow} boldKey />
                    <KeyValueRow keyStr={`Invoice #: ${d?.invoice_no}`} value={`Reference #: ${d?.reference_id}`} fontSize={20} textColor="#000" style={styles.clerkItemRow} />
                    <KeyValueRow keyStr="Amount" value={`$ ${d?.sale_amount?.toFixed(2)}`} fontSize={20} textColor="#000" style={styles.clerkItemRow} boldKey />
                    <KeyValueRow keyStr="Tip" value={`$ ${d?.tip_amount?.toFixed(2)}`} fontSize={20} textColor="#000" style={styles.clerkItemRow} boldKey />
                    <KeyValueRow keyStr="Surcharge" value={`$ ${d?.surcharge_amount?.toFixed(2)}`} fontSize={20} textColor="#000" style={styles.clerkItemRow} boldKey />
                    <View style={styles.borderred} />
                    <KeyValueRow
                        keyStr="Total"
                        value={`$ ${(d?.sale_amount + d?.surcharge_amount + d?.tip_amount).toFixed(2)} - ${d?.transactionStatus}`}
                        fontSize={22}
                        textColor="#000"
                        style={styles.clerkItemRow}
                        boldKey
                    />
                </View>
            </Card>
        );
    };

    return (
        <>
            <Wrapper>
                <VerticalSpacer />
                <View style={styles.listsContainer}>
                    <ScrollView contentContainerStyle={styles.listContainer}>
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
                            {data != null && data?.length > 0 ? <View>{data?.map((d: any) => _renderItem(d))}</View> : <></>}
                        </ViewShot>
                    </ScrollView>
                </View>
            </Wrapper>
        </>
    );
});

const styles = StyleSheet.create({
    listsContainer: {
        paddingHorizontal: 16,
        flex: 1,
    },
    listContainer: {
        paddingBottom: 36,
        paddingTop: 12,
    },
    transactionContainer: {
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#000',
    },
    clerkItemRow: {
        marginVertical: 2,
    },
    borderred: {
        marginVertical: 2,
        borderTopWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#000',
    },
    divider: {
        marginVertical: 6,
        borderBottomWidth: 2,
        borderColor: '#000',
        width: '100%',
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

export default DetailScreenshot;

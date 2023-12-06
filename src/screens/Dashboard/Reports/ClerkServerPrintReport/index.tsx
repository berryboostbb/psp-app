import React, { useCallback, useRef, useState } from 'react';
import { AppHeader, AppText, AppView, VerticalSpacer, Wrapper } from '@components';
import { languagePicker } from '@utils';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { backArrowDark, printer } from '@assets';
import { RF, Typography } from '@theme';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import SearchField from '../components/SearchField';
import Card from '../components/Card';
import KeyValueRow from '../components/KeyValueRow';
import useTransactionList from '../../../../db/hooks/useTransactionList';
import { printClerkServerListReport, printSingleClerkServerReport } from '../helpers/functions';
import PrintClerkServerModal from '../components/PrintClerkServerModal';
import SummaryScreenshot from './SummaryScreenshot';
import SuccessModal from '../components/SuccessModal';
import Pax from 'react-native-pax-library';
import DetailScreenshot from './DetailScreenshot';
var RNFS = require('react-native-fs');

const ClerkServerPrintReport = () => {
    const { tms_settings } = useSelector((state: any) => state?.pr);
    const printerConfiguration = tms_settings?.printer;
    const summaryScreenshotRef = useRef(null);
    const detailScreenshotRef = useRef(null);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const language = useSelector((state: any) => state.user.languageType);
    const theme: any = useTheme();
    const navigation = useNavigation();
    const [searchKey, setSearchKey] = useState<string>('');
    const { transactionList } = useTransactionList();
    const [selectedClerkId, setSelectedClerkId] = useState(null);
    const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

    // const { createTransaction } = useCreateTransaction();

    // useEffect(() => {
    //   let res = createTransaction(dummyTransactionObject);
    // }, []);

    const _handleClosePrintModal = () => {
        setShowPrintModal(false);
    };
    // console.log('printerConfiguration?.receipt_header_lines?.line_1: ', printerConfiguration?.receipt_header_lines?.line_1);

    const _printReport = (type: string) => {
        const screenshotRef: any = type === 'detailed' ? detailScreenshotRef : summaryScreenshotRef;
        screenshotRef?.current?.capture()?.then((uri: any) => {
            RNFS.readFile(uri, 'base64')
                .then((res: any) => {
                    let base64String = `data:image/jpeg;base64,${res}`;
                    // console.log("UrlString: ", base64String);
                    Pax.printStr('Report', base64String, '', Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);
                })
                .catch((ex: any) => {
                    console.log('Exception', ex);
                });
        });
        // if (type === "detailed" && selectedClerkId !== null) {
        //   printSingleClerkServerReport(_getSingleClerkData(selectedClerkId));
        // } else if (type === "summary") {
        //   printClerkServerListReport(_getFilteredClerksData());
        // }
        _handleClosePrintModal();
        _handleSuccessPrintMessge();
    };

    const _getFilteredClerksData = useCallback(() => {
        const data: any = {};
        transactionList.forEach(d => {
            if (d?.clerk_id in data) {
                data[d.clerk_id].push(d);
            } else {
                data[d.clerk_id] = [d];
            }
        });
        if (searchKey === null || searchKey?.length === 0) {
            return data;
        }
        const filteredKeys = Object.keys(data)?.filter((d: string) => d?.includes(searchKey));
        if (filteredKeys?.length === 0) {
            return [];
        }
        let filteredObj = {};
        filteredKeys.forEach((k: string) => {
            filteredObj = { ...filteredObj, [k]: data[k] };
        });
        return filteredObj;
    }, [searchKey]);

    const _handleSetClerkId = (id: any) => {
        if (selectedClerkId === null) {
            setSelectedClerkId(id);
        } else if (selectedClerkId === id) {
            setSelectedClerkId(null);
        }
    };

    const _handleSuccessPrintMessge = () => {
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 4000);
    };

    const _renderItem = ({ item }: any) => {
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
                <Card style={styles.transactionContainer} onPress={() => _handleSetClerkId(item)}>
                    {selectedClerkId === item ? (
                        <>
                            {_getSingleClerkData(item)?.map((d: any, index: number) => {
                                return (
                                    <View key={index.toString()}>
                                        <KeyValueRow keyStr={d?.card_type} value={d?.status} fontSize={15} style={styles.clerkItemRow} />
                                        <KeyValueRow keyStr="Clerk/Server ID#" value={d?.clerk_id} fontSize={15} style={styles.clerkItemRow} boldKey />
                                        <KeyValueRow keyStr={`Invoice #: ${d?.invoice_no}`} value={`Reference #: ${d?.reference_id}`} fontSize={15} style={styles.clerkItemRow} />
                                        <KeyValueRow keyStr="Amount" value={`$ ${d?.sale_amount?.toFixed(2)}`} fontSize={15} style={styles.clerkItemRow} boldKey />
                                        <KeyValueRow keyStr="Tip" value={`$ ${d?.tip_amount?.toFixed(2)}`} fontSize={15} style={styles.clerkItemRow} boldKey />
                                        <KeyValueRow keyStr="Surcharge" value={`$ ${d?.surcharge_amount?.toFixed(2)}`} fontSize={15} style={styles.clerkItemRow} boldKey />
                                        <View style={styles.borderred} />
                                        <KeyValueRow
                                            keyStr="Total"
                                            value={`$ ${(d?.sale_amount + d?.surcharge_amount + d?.tip_amount).toFixed(2)} - ${d?.transactionStatus}`}
                                            fontSize={16}
                                            style={styles.clerkItemRow}
                                            boldKey
                                        />
                                        {index !== _getSingleClerkData(item)?.length - 1 && <View style={styles.borderView} />}
                                    </View>
                                );
                            })}
                        </>
                    ) : (
                        <>
                            <KeyValueRow keyStr="Clerk/Server ID" value={item} boldKey />
                            <KeyValueRow keyStr="Sales Total" value={`$ ${salesTotal?.toFixed(2)}`} boldKey />
                            <KeyValueRow keyStr="Tip Total" value={`$ ${tipTotal?.toFixed(2)}`} boldKey />
                            <KeyValueRow keyStr="Refunds Total" value={`$ ${refundsTotal?.toFixed(2)}`} boldKey />
                            <KeyValueRow keyStr="Grand Total" value={`$ ${grandTotal?.toFixed(2)}`} boldKey />
                        </>
                    )}
                </Card>
            );
        }
        return <></>;
    };

    const _getSingleClerkData = (clerkId: string | null) => {
        if (clerkId === null || clerkId.length === 0) {
            return [];
        }
        const data = _getFilteredClerksData();
        const clerkData = data?.[clerkId];
        if (clerkData && clerkData?.length > 0) {
            return clerkData?.sort((a: any, b: any) => b?.card_type - a?.card_type);
        }
        return [];
    };

    const _renderEmptyClerks = () => {
        return (
            <View style={styles.emptyContainer}>
                <AppText title="No item found" center size={20} />
            </View>
        );
    };

    return (
        <>
            <View style={styles.headerView}>
                <AppHeader
                    title={languagePicker(language, 'Clerk Server Report')}
                    showLeftIcon
                    backAction={() => navigation.goBack()}
                    source={backArrowDark}
                    size={Typography.FONTS.SIZE.HEADER}
                    textColor={theme.colors.grey}
                    showRightIcon
                    rightIcon={printer}
                    rightIconStyle={{ width: 20, height: 20 }}
                    onPressRightIcon={() => setShowPrintModal(true)}
                />
            </View>
            <Wrapper>
                <VerticalSpacer spaceFactor={2} />
                <View style={styles.searchField}>
                    <SearchField onPressFilterIcon={() => {}} placeholder="Search Clerk/Server ID" onChangeText={value => setSearchKey(value)} showFilterIcon={false} />
                </View>
                <VerticalSpacer />
                <View style={styles.listsContainer}>
                    <FlatList data={Object.keys(_getFilteredClerksData())} contentContainerStyle={styles.listContainer} renderItem={_renderItem} ListEmptyComponent={_renderEmptyClerks()} />
                </View>
                <VerticalSpacer spaceFactor={2} />
                <PrintClerkServerModal
                    visible={showPrintModal}
                    showDetailedButton={selectedClerkId !== null}
                    onCloseModal={_handleClosePrintModal}
                    onPressPrintDetailedReport={() => _printReport('detailed')}
                    onPressPrintSummaryReport={() => _printReport('summary')}
                />
                {showSuccessModal && <SuccessModal />}

                <View>
                    <SummaryScreenshot ref={summaryScreenshotRef} />
                </View>
                <View>
                    <DetailScreenshot ref={detailScreenshotRef} data={_getSingleClerkData(selectedClerkId)} />
                </View>
            </Wrapper>
        </>
    );
};

const styles = StyleSheet.create({
    headerView: {
        paddingHorizontal: RF(30),
        paddingTop: RF(20),
        backgroundColor: '#FFF',
    },
    searchField: {
        paddingHorizontal: 16,
        paddingTop: 12,
    },
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
    },
    emptyContainer: {
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clerkItemRow: {
        marginVertical: 2,
    },
    borderred: {
        marginVertical: 2,
        borderTopWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#A0D800',
    },
    divider: {
        marginVertical: 6,
        borderBottomWidth: 2,
        borderColor: '#D9D9D9',
        width: '100%',
    },
    card: {
        borderWidth: 0.6,
        borderColor: 'rgba(74, 85, 104, 0.4)',
        borderRadius: 12,
        padding: 12,
        paddingBottom: 6,
    },
    borderView: {
        width: '100%',
        height: 1,
        backgroundColor: '#D9D9D9',
        marginVertical: 10,
    },
});

export default ClerkServerPrintReport;

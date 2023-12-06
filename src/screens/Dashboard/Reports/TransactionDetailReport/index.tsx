import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppHeader, AppText, AppView, VerticalSpacer, Wrapper } from '@components';
import { languagePicker } from '@utils';
import { FlatList, StyleSheet, View } from 'react-native';
import { backArrowDark, printer } from '@assets';
import { RF, Typography } from '@theme';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import SearchField from '../components/SearchField';
import SectionBar from '../components/SectionBar';
import { SectionType } from '../types';
import Card from '../components/Card';
import KeyValueRow from '../components/KeyValueRow';
import ReportRowItem from '../components/ReportRowItem';
import SearchFilterModal from '../components/SearchFilterModal';
import useTransactionList from '../../../../db/hooks/useTransactionList';
import { getFormattedDate, getFormattedTime, getMarkedCardNumber, getTimezoneStr, getTransactionSummaryReport } from '../helpers/functions';
import SuccessModal from '../components/SuccessModal';
import TransactionListScreenshot from './TransactionsListScreenshot';
import Pax from 'react-native-pax-library';
import TransactionDetailScreenshot from './TransactionDetailScreenshot';
import SummaryScreenshot from './SummaryScreenshot';
var RNFS = require('react-native-fs');

const summaryDataKeys = ['Transaction Type', 'Count', 'Currency', 'Sub-Totals'];
const skippedKeysFromHead = ['Transaction Type', 'Currency'];

const timezone = getTimezoneStr();

const TransactionDetailReport = () => {
    const { tms_settings } = useSelector((state: any) => state?.pr);
    const printerConfiguration = tms_settings?.printer;
    const transactionListScreenshotRef = useRef(null);
    const transactionDetailScreenshotRef = useRef(null);
    const summaryScreenshotRef = useRef(null);
    const language = useSelector((state: any) => state.user.languageType);
    const theme: any = useTheme();
    const navigation = useNavigation();
    const [searchValue, setSearchValue] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<SectionType>('Transactions');
    const [selectedFilter, setSelectedFilter] = useState<string>('All Transactions');
    const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
    const { transactionList } = useTransactionList();
    const [transactionData, setTransactionData] = useState<any>([]);
    const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

    useEffect(() => {
        setTransactionData(transactionList);
        const _filterData = () => {
            let transactionKey: string | null = null;
            switch (selectedFilter) {
                case 'Invoice Number': {
                    transactionKey = 'invoice_no';
                    break;
                }
                case 'Reference Number': {
                    transactionKey = 'reference_id';
                    break;
                }
                case 'Approval Code': {
                    transactionKey = null;
                    break;
                }
                case 'Card Number': {
                    transactionKey = 'card_number';
                    break;
                }
                case 'Declined Transactions': {
                    transactionKey = null;
                    break;
                }
                default: {
                    transactionKey = null;
                    break;
                }
            }
            const declinedTransactions = transactionList?.filter((d: any) => d?.transactionStatus === 'Declined');
            let tList = transactionList;
            if (selectedFilter === 'Declined Transactions') {
                tList = declinedTransactions;
            }
            const searchValueLC = searchValue.toLowerCase();
            if (transactionKey === null) {
                const filterredData = tList.filter(transaction => {
                    return (
                        transaction?.['invoice_no']?.toString()?.toLowerCase()?.includes(searchValueLC) ||
                        transaction?.['reference_id']?.toString()?.toLowerCase()?.includes(searchValueLC) ||
                        transaction?.['card_number']?.toString()?.toLowerCase()?.includes(searchValueLC)
                    );
                });
                setTransactionData(filterredData);
            } else {
                const filterredData = transactionList.filter(transaction => {
                    return transaction?.[transactionKey!]?.toString()?.toLowerCase()?.includes(searchValueLC);
                });
                setTransactionData(filterredData);
            }
        };
        _filterData();
    }, [searchValue, selectedFilter]);

    const _printReport = () => {
        let ref: any;
        if (selectedSection === 'Transactions') {
            if (selectedTransactionId !== null) {
                ref = transactionDetailScreenshotRef;
                // printTransactionDetailsReport(
                //   transactionData?.find((d: any) => d?._id === selectedTransactionId)
                // );
            } else {
                ref = transactionListScreenshotRef;
                // printTransactionList(transactionData);
            }
        } else {
            ref = summaryScreenshotRef;
            // printTransactionSummaryReport(_prepareSummaryData());
        }

        ref?.current?.capture()?.then((uri: any) => {
            RNFS.readFile(uri, 'base64')
                .then((res: any) => {
                    let base64String = `data:image/jpeg;base64,${res}`;
                    Pax.printStr('Report', base64String, '', Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);
                })
                .catch((ex: any) => {
                    console.log('Exception', ex);
                });
        });

        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 4000);
    };

    const _handleUpdateSection = (section: SectionType) => {
        setSelectedSection(section);
    };

    const _handleShowFilterModal = useCallback(() => {
        setFilterModalVisible(true);
    }, []);

    const _handleHideFilterModal = () => {
        setFilterModalVisible(false);
    };

    const _handleUpdatePressed = (value: string) => {
        setSelectedFilter(value);
        _handleHideFilterModal();
    };

    const _prepareSummaryData = useCallback(() => {
        return getTransactionSummaryReport(transactionList);
    }, [transactionList]);

    const _renderTransactionItem = useCallback(
        ({ item }) => {
            return (
                <Card
                    style={styles.transactionContainer}
                    onPress={() => {
                        if (selectedTransactionId === item?._id) {
                            setSelectedTransactionId(null);
                        } else {
                            setSelectedTransactionId(item?._id);
                        }
                    }}>
                    {selectedTransactionId === item?._id ? (
                        <>
                            <KeyValueRow keyStr="Merchant ID:" value="136200499100000" boldKey />
                            <VerticalSpacer spaceFactor={0.4} />
                            <KeyValueRow keyStr="Terminal ID:" value="10015843" boldKey />
                            <VerticalSpacer spaceFactor={0.4} />
                            <KeyValueRow keyStr="Clerk/Server ID:" value={item?.clerk_id} boldKey />
                            <VerticalSpacer spaceFactor={0.4} />
                            <KeyValueRow keyStr={`${item?.card_type}`} value={`${item?.status}`} boldKey />
                            <KeyValueRow keyStr="Account Type:" value={item?.account_type} boldKey />
                            <VerticalSpacer spaceFactor={0.4} />
                            <KeyValueRow keyStr="Ref #:" value={item?.reference_id} boldKey />
                            <VerticalSpacer spaceFactor={0.4} />
                            <KeyValueRow keyStr="Date: " value={getFormattedDate(item?.created_at)} boldKey />
                            <VerticalSpacer spaceFactor={0.4} />
                            <KeyValueRow keyStr="Time: " value={`${getFormattedTime(item?.created_at)} ${timezone}`} boldKey />
                            <VerticalSpacer spaceFactor={1} />
                            <KeyValueRow keyStr="Amount:" boldKey value={`$${item?.sale_amount?.toFixed(2)}`} />
                            <VerticalSpacer spaceFactor={0.4} />
                            <KeyValueRow keyStr="Tip:" value={`$${item?.tip_amount?.toFixed(2)}`} boldKey />
                            <VerticalSpacer spaceFactor={0.4} />
                            <KeyValueRow keyStr="Surcharge:" value={`$${item?.surcharge_amount?.toFixed(2)}`} />
                            <VerticalSpacer spaceFactor={0.4} />
                            <View style={styles.topBorder} />
                            <KeyValueRow keyStr="Total Amount:" value={`$${(item?.sale_amount + item?.tip_amount + item?.surcharge_amount)?.toFixed(2)}`} boldKey fontSize={18} />
                        </>
                    ) : (
                        <>
                            <KeyValueRow keyStr={`Reference #${item?.reference_id}`} value={item?.status} boldKey />
                            <VerticalSpacer spaceFactor={0.4} />
                            {item?.card_type ? (
                                <>
                                    <AppText title={`${item?.card_type}: ${getMarkedCardNumber(item?.card_number)}`} size={16} colorText="#4A5568" />
                                    <VerticalSpacer spaceFactor={0.4} />
                                </>
                            ) : (
                                <></>
                            )}
                            <KeyValueRow keyStr="Date" value={`${getFormattedDate(item?.created_at)}`} />
                            <VerticalSpacer spaceFactor={0.4} />
                            <KeyValueRow keyStr="Time" value={`${getFormattedTime(item?.created_at)}`} />
                            <VerticalSpacer spaceFactor={0.4} />
                            <KeyValueRow
                                keyStr={`$${item?.surcharge_amount > 0 ? (item?.sale_amount + item?.surcharge_amount).toFixed(2) : item?.sale_amount?.toFixed(2)}`}
                                value={`Tip: $${item?.tip_amount?.toFixed(2)}`}
                            />
                        </>
                    )}
                </Card>
            );
        },
        [selectedTransactionId]
    );

    const _renderSummaryItem = useCallback(({ item }) => {
        const data = item.data;
        return (
            <AppView style={styles.summaryItemContainer}>
                <AppText title={item.title} center colorText="#4A5568" size={18} />
                <VerticalSpacer />
                <Card>
                    <View style={styles.reportItemContainer}>
                        {summaryDataKeys.map((d: any, index: number) => {
                            return <ReportRowItem title={skippedKeysFromHead.includes(d) ? ' ' : d} alignLeft={index === 0} flex2={[0, 3].includes(index)} bold />;
                        })}
                    </View>
                    {data.map((d: any) => {
                        const k = summaryDataKeys;
                        return (
                            <View style={[styles.reportItemContainer, ['Total', 'Grand Total'].includes(d[k[0]]) && styles.topBorder]}>
                                <ReportRowItem title={d[k[0]]} alignLeft bold flex2 />
                                <ReportRowItem title={d[k[1]]} />
                                <ReportRowItem title={d[k[2]]} />
                                <ReportRowItem title={d[k[3]]} flex2 />
                            </View>
                        );
                    })}
                </Card>
            </AppView>
        );
    }, []);

    return (
        <>
            <View style={styles.headerView}>
                <AppHeader
                    title={languagePicker(language, 'Transaction Detail Report')}
                    showLeftIcon
                    backAction={() => navigation.goBack()}
                    source={backArrowDark}
                    size={Typography.FONTS.SIZE.HEADER}
                    textColor={theme.colors.grey}
                    showRightIcon
                    rightIcon={printer}
                    rightIconStyle={{ width: 20, height: 20 }}
                    onPressRightIcon={_printReport}
                />
            </View>
            <Wrapper>
                <VerticalSpacer spaceFactor={1.5} />
                <SectionBar
                    title1="Transactions"
                    title2="Summary Report"
                    selectedSection={selectedSection}
                    onPressToday={() => _handleUpdateSection('Transactions')}
                    onPressYesterday={() => _handleUpdateSection('Summary Report')}
                />
                <VerticalSpacer />
                {selectedSection === 'Transactions' ? (
                    <>
                        <View style={styles.searchField}>
                            <SearchField value={searchValue} onChangeText={setSearchValue} onPressFilterIcon={_handleShowFilterModal} />
                        </View>
                        <FlatList
                            // ListHeaderComponent={_renderHeader}
                            data={transactionData}
                            contentContainerStyle={styles.listContainer}
                            renderItem={_renderTransactionItem}
                        />
                    </>
                ) : (
                    <FlatList data={_prepareSummaryData()} contentContainerStyle={styles.listContainer} renderItem={_renderSummaryItem} />
                )}
                <SearchFilterModal onCloseModal={_handleHideFilterModal} visible={filterModalVisible} selected={selectedFilter} onUpdatePressed={_handleUpdatePressed} />
                {showSuccessModal && <SuccessModal />}
                <View>
                    <TransactionListScreenshot transactionData={transactionList} ref={transactionListScreenshotRef} />
                </View>
                <View>
                    <TransactionDetailScreenshot ref={transactionDetailScreenshotRef} transaction={transactionData?.find((d: any) => d?._id === selectedTransactionId)} />
                </View>
                <View>
                    <SummaryScreenshot summaryData={_prepareSummaryData()} ref={summaryScreenshotRef} />
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
    listContainer: {
        padding: 16,
        paddingBottom: 36,
        paddingTop: 12,
    },
    searchField: {
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    transactionContainer: {
        marginVertical: 8,
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
        borderTopColor: '#A0D800',
        borderStyle: 'dashed',
        marginTop: 6,
    },
});

export default TransactionDetailReport;

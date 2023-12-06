import React, { useCallback, useRef, useState } from 'react';
import { AppHeader, AppText, AppView, VerticalSpacer, Wrapper } from '@components';
import getStyle from './style';
import { useNavigation, useTheme } from '@react-navigation/native';
import { FlatList, SectionList, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { languagePicker } from '@utils';
import { backArrowDark, filterLinesIcon, printer, searchLine } from '@assets';
import { Typography } from '@theme';
import SectionBar from '../components/SectionBar';
import { SectionType } from '../types';
import Card from '../components/Card';
import KeyValueRow from '../components/KeyValueRow';
import OrganizeByModal from '../components/OrganizeByModal';
import ReportRowItem from '../components/ReportRowItem';
import useTransactionList from '../../../../db/hooks/useTransactionList';
import moment from 'moment';
import {
    getCardBrandsTotalsSettlementData,
    getClerkSettlementReport,
    getFormattedDate,
    getFormattedTime,
    getTimezoneStr,
    getTransactionTotalsData,
    printCardsDataSettlementReport,
    printClerkServerSettlementReport,
    printTransactionSettlementReport,
} from '../helpers/functions';
import PrintSettlementModal from '../components/PrintSettlementModal';
import SuccessModal from '../components/SuccessModal';
import TransactionsScreenshot from './TransactionsScreenshot';
import Pax from 'react-native-pax-library';
import ClerkServerScreenshot from './ClerkServerScreenshot';
import CardBrandScreenshot from './CardBrandScreenshot';
var RNFS = require('react-native-fs');

const cardDataKeys: any = {
    'Card Brand Totals': ['Card Type', 'Count', 'Currency', 'Totals'],
    'Interac Totals': ['Interac', 'Count', 'Currency', 'Totals'],
    'Visa Totals': ['Visa', 'Count', 'Currency', 'Totals'],
    'MasterCard Totals': ['MasterCard', 'Count', 'Currency', 'Totals'],
};

const skippedKeysFromHead = ['Currency'];

const timezone = getTimezoneStr();

const DailyReport = ({ route }: any) => {
    const { tms_settings } = useSelector((state: any) => state?.pr);
    const printerConfiguration = tms_settings?.printer;

    const transactionScreenshotRef: any = useRef(null);
    const clerkServerScreenshotRef: any = useRef(null);
    const cardBrandScreenshotRef: any = useRef(null);
    const reportType = route?.params?.reportType;
    const currentDate = useRef(new Date()).current;
    const navigation = useNavigation();
    const theme: any = useTheme();
    const language = useSelector((state: any) => state.user.languageType);
    const [selectedSection, setSelectedSection] = useState<SectionType>('Today');
    const [selectedFilter, setSelectedFilter] = useState<string>('Transactions');
    const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
    const style = getStyle(theme.colors);
    const { getTransactionsByDate } = useTransactionList();
    const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

    const _handleUpdateSection = (section: SectionType) => {
        setSelectedSection(section);
    };

    const _getStartEndDate = () => {
        let startDate = new Date();
        let endDate = new Date();
        if (reportType === 'Close') {
            if (selectedSection === 'Today') {
                startDate = moment().subtract(1, 'days').hours(21).minutes(0).seconds(0).toDate();
                endDate = moment().hours(20).minutes(59).seconds(59).toDate();
            } else if (selectedSection === 'Yesterday') {
                startDate = moment().subtract(2, 'days').hours(21).minutes(0).seconds(0).toDate();
                endDate = moment().subtract(1, 'days').hours(20).minutes(59).seconds(59).toDate();
            }
        } else if (reportType === 'Sales') {
            if (selectedSection === 'Today') {
                startDate = moment().hours(0).minutes(0).seconds(0).toDate();
                endDate = moment().hours(23).minutes(59).seconds(59).toDate();
            } else if (selectedSection === 'Yesterday') {
                startDate = moment().subtract(1, 'days').hours(0).minutes(0).seconds(0).toDate();
                endDate = moment().subtract(1, 'days').hours(23).minutes(59).seconds(59).toDate();
            }
        }
        return { startDate, endDate };
    };

    const _getLatestTransactionDate = () => {
        const { startDate, endDate } = _getStartEndDate();
        const trs = getTransactionsByDate(startDate, endDate);
        if (trs?.length > 0) {
            return trs?.[trs?.length - 1]?.created_at;
        }
        return undefined;
    };

    const _getInDateTransactions = () => {
        const { startDate, endDate } = _getStartEndDate();
        const transactions = getTransactionsByDate(startDate, endDate);
        return transactions;
    };

    const _getTransactionData = useCallback(() => {
        const transactions = _getInDateTransactions();
        return getTransactionTotalsData(transactions);
    }, [selectedSection]);

    const _getClerkServerData = useCallback(() => {
        const transactions = _getInDateTransactions();
        return getClerkSettlementReport(transactions);
    }, [selectedSection]);

    const _getCardBrandsData = useCallback(() => {
        const transactions = _getInDateTransactions();
        return getCardBrandsTotalsSettlementData(transactions);
    }, [selectedSection]);

    const _printReport = () => {
        _handleHidePrintModal();
        let ref;
        if (selectedFilter === 'Card Brands') {
            ref = cardBrandScreenshotRef;
            // printCardsDataSettlementReport(
            //   getFormattedDate(_getStartEndDate().startDate.toString()),
            //   getFormattedDate(_getStartEndDate().endDate.toString()),
            //   `${getFormattedTime(
            //     _getStartEndDate().startDate.toString()
            //   )} ${timezone}`,
            //   `${getFormattedTime(
            //     _getStartEndDate().endDate.toString()
            //   )} ${timezone}`,
            //   _getLatestTransactionDate()
            //     ? `${getFormattedTime(_getLatestTransactionDate())} ${timezone}`
            //     : "N/A",
            //   _getCardBrandsData()
            // );
        } else if (selectedFilter === 'Transactions') {
            ref = transactionScreenshotRef;
            // printTransactionSettlementReport(
            //   getFormattedDate(_getStartEndDate().startDate.toString()),
            //   getFormattedDate(_getStartEndDate().endDate.toString()),
            //   `${getFormattedTime(
            //     _getStartEndDate().startDate.toString()
            //   )} ${timezone}`,
            //   `${getFormattedTime(
            //     _getStartEndDate().endDate.toString()
            //   )} ${timezone}`,
            //   _getLatestTransactionDate()
            //     ? `${getFormattedTime(_getLatestTransactionDate())} ${timezone}`
            //     : "N/A",
            //   _getTransactionData()
            // );
        } else if (selectedFilter === 'Clerk/Server') {
            ref = clerkServerScreenshotRef;
            // printClerkServerSettlementReport(
            //   getFormattedDate(_getStartEndDate().startDate.toString()),
            //   getFormattedDate(_getStartEndDate().endDate.toString()),
            //   `${getFormattedTime(
            //     _getStartEndDate().startDate.toString()
            //   )} ${timezone}`,
            //   `${getFormattedTime(
            //     _getStartEndDate().endDate.toString()
            //   )} ${timezone}`,
            //   _getLatestTransactionDate()
            //     ? `${getFormattedTime(_getLatestTransactionDate())} ${timezone}`
            //     : "N/A",
            //   _getClerkServerData()
            // );
        }
        ref?.current?.capture()?.then((uri: any) => {
            RNFS.readFile(uri, 'base64')
                .then((res: any) => {
                    let base64String = `data:image/jpeg;base64,${res}`;
                    Pax.printStr('Report', base64String, '', Pax.FULL_CUT, '', printerConfiguration?.receipt_header_lines?.line_1);
                    // Pax.printStr('', '', '', Pax.FULL_CUT, '', base64String);
                })
                .catch((ex: any) => {
                    console.log('Exception', ex);
                });
        });
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 4000);
    };

    const _handleShowPrintModal = () => {
        setShowPrintModal(true);
    };

    const _handleHidePrintModal = () => {
        setShowPrintModal(false);
    };

    const _handleShowFilterModal = () => {
        setFilterModalVisible(true);
    };

    const _handleHideFilterModal = () => {
        setFilterModalVisible(false);
    };

    const _handleUpdatePressed = (value: string) => {
        setSelectedFilter(value);
        _handleHideFilterModal();
    };

    const _renderHeader = useCallback(() => {
        return (
            <AppView>
                <KeyValueRow keyStr="Merchant ID:" value="136200499100000" />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="Terminal ID:" value="10015843" />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="Start Date:" value={getFormattedDate(_getStartEndDate().startDate.toString())} />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="Start Time:" value={`${getFormattedTime(_getStartEndDate().startDate.toString())} ${timezone}`} />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="End Date:" value={getFormattedDate(_getStartEndDate().endDate.toString())} />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="End Time:" value={`${getFormattedTime(_getStartEndDate().endDate.toString())} ${timezone}`} />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="Last Transaction:" value={_getLatestTransactionDate() ? `${getFormattedTime(_getLatestTransactionDate()?.toString())} ${timezone}` : 'N/A'} />
                <VerticalSpacer />
            </AppView>
        );
    }, [selectedSection]);

    const _renderSectionHeader = useCallback(({ section }) => {
        return (
            <View style={styles.sectionHeaderContainer}>
                <AppText title={section.title} center colorText="#4A5568" size={18} />
            </View>
        );
    }, []);

    const _renderCardBrandItem = useCallback(({ item }) => {
        return (
            <View>
                <View style={styles.sectionHeaderContainer}>
                    <AppText title={item.title} center size={18} />
                </View>
                <Card style={styles.itemContainer}>
                    <View style={styles.reportItemContainer}>
                        {cardDataKeys[item.title].map((d: any, index: number) => {
                            return <ReportRowItem title={skippedKeysFromHead.includes(d) ? ' ' : d} alignLeft={index === 0} flex2={[0, 3].includes(index)} bold />;
                        })}
                    </View>
                    {item?.data?.map((d: any) => {
                        const k = cardDataKeys[item.title];
                        return (
                            <View style={[styles.reportItemContainer, ['Sub Total', 'Grand Total'].includes(d[k[0]]) && styles.topBorder]}>
                                <ReportRowItem title={d[k[0]]} alignLeft bold flex2 />
                                <ReportRowItem title={d[k[1]]} />
                                <ReportRowItem title={d[k[2]]} />
                                <ReportRowItem title={d[k[3]]} flex2 />
                            </View>
                        );
                    })}
                </Card>
            </View>
        );
    }, []);

    const _renderItem = useCallback(
        ({ item }) => {
            return (
                <Card style={styles.itemContainer}>
                    {Object.keys(item).map(k => {
                        return (
                            <View style={[styles.item, k.toString() === 'Total Refunds' && styles.marginTop]}>
                                <KeyValueRow keyStr={k.toString() === 'No. of Refunds' ? 'No. of Transactions' : k.toString()} value={item[k].toString()} boldKey={selectedFilter === 'Clerk/Server'} />
                            </View>
                        );
                    })}
                </Card>
            );
        },
        [selectedFilter]
    );

    return (
        <>
            <View style={style.headerView}>
                <AppHeader
                    title={languagePicker(language, reportType === 'Close' ? 'Daily Close Report' : 'Daily Sales Report')}
                    showLeftIcon
                    backAction={() => navigation.goBack()}
                    source={backArrowDark}
                    size={Typography.FONTS.SIZE.HEADER}
                    textColor={theme.colors.grey}
                    showRightIcon
                    rightIcon={filterLinesIcon}
                    showSecondaryRightIcon
                    secondaryRightIcon={printer}
                    rightIconStyle={{ width: 20, height: 20 }}
                    onPressRightIcon={_handleShowFilterModal}
                    onPressSecondaryRightIcon={_handleShowPrintModal}
                />
            </View>
            <Wrapper>
                <VerticalSpacer spaceFactor={1.5} />
                <SectionBar
                    title1="Today"
                    title2="Yesterday"
                    selectedSection={selectedSection}
                    onPressToday={() => _handleUpdateSection('Today')}
                    onPressYesterday={() => _handleUpdateSection('Yesterday')}
                />
                <VerticalSpacer />

                {selectedFilter === 'Card Brands' ? (
                    <FlatList ListHeaderComponent={_renderHeader} data={_getCardBrandsData()} contentContainerStyle={styles.listContainer} renderItem={_renderCardBrandItem} />
                ) : (
                    <SectionList
                        contentContainerStyle={styles.listContainer}
                        ListHeaderComponent={_renderHeader}
                        sections={selectedFilter === 'Transactions' ? _getTransactionData() : selectedFilter === 'Clerk/Server' ? _getClerkServerData() : []}
                        renderSectionHeader={_renderSectionHeader}
                        renderItem={_renderItem}
                    />
                )}

                <OrganizeByModal onCloseModal={_handleHideFilterModal} visible={filterModalVisible} selected={selectedFilter} onUpdatePressed={_handleUpdatePressed} />
                <PrintSettlementModal visible={showPrintModal} onCloseModal={_handleHidePrintModal} onPressPrint={_printReport} />
                {showSuccessModal && <SuccessModal />}
                <View>
                    <TransactionsScreenshot
                        ref={transactionScreenshotRef}
                        startDate={getFormattedDate(_getStartEndDate().startDate.toString())}
                        endDate={getFormattedDate(_getStartEndDate().endDate.toString())}
                        startTime={`${getFormattedTime(_getStartEndDate().startDate.toString())} ${timezone}`}
                        endTime={`${getFormattedTime(_getStartEndDate().endDate.toString())} ${timezone}`}
                        lastTransactionDate={_getLatestTransactionDate() ? `${getFormattedTime(_getLatestTransactionDate()?.toString())} ${timezone}` : 'N/A'}
                        transactionData={_getTransactionData()}
                    />
                </View>
                <View>
                    <ClerkServerScreenshot
                        ref={clerkServerScreenshotRef}
                        startDate={getFormattedDate(_getStartEndDate().startDate.toString())}
                        endDate={getFormattedDate(_getStartEndDate().endDate.toString())}
                        startTime={`${getFormattedTime(_getStartEndDate().startDate.toString())} ${timezone}`}
                        endTime={`${getFormattedTime(_getStartEndDate().endDate.toString())} ${timezone}`}
                        lastTransactionDate={_getLatestTransactionDate() ? `${getFormattedTime(_getLatestTransactionDate()?.toString())} ${timezone}` : 'N/A'}
                        transactionData={_getClerkServerData()}
                    />
                </View>
                <View>
                    <CardBrandScreenshot
                        ref={cardBrandScreenshotRef}
                        startDate={getFormattedDate(_getStartEndDate().startDate.toString())}
                        endDate={getFormattedDate(_getStartEndDate().endDate.toString())}
                        startTime={`${getFormattedTime(_getStartEndDate().startDate.toString())} ${timezone}`}
                        endTime={`${getFormattedTime(_getStartEndDate().endDate.toString())} ${timezone}`}
                        lastTransactionDate={_getLatestTransactionDate() ? `${getFormattedTime(_getLatestTransactionDate()?.toString())} ${timezone}` : 'N/A'}
                        transactionData={_getCardBrandsData()}
                    />
                </View>
            </Wrapper>
        </>
    );
};

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
        borderTopColor: '#A0D800',
        borderStyle: 'dashed',
        marginTop: 6,
    },
    marginTop: {
        marginTop: 12,
    },
});

export default DailyReport;

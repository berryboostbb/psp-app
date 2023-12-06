import React, { useCallback, useRef, useState } from 'react';
import { AppHeader, AppText, AppView, VerticalSpacer, Wrapper } from '@components';
import { languagePicker } from '@utils';
import { FlatList, StyleSheet, View, ToastAndroid } from 'react-native';
import { backArrowDark, printer } from '@assets';
import { RF, Typography } from '@theme';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import KeyValueRow from '../components/KeyValueRow';
import Card from '../components/Card';
import ReportRowItem from '../components/ReportRowItem';
import useTransactionList from '../../../../db/hooks/useTransactionList';
import { getFormattedDate, getFormattedTime, getTipReportData } from '../helpers/functions';
import Pax from 'react-native-pax-library';
import SuccessModal from '../components/SuccessModal';
import TipScreenshot from './Screenshot';
import SectionBar from '../components/SectionBar';
import { SectionType } from '../types';
import moment from 'moment';
import { store } from '@redux';
var RNFS = require('react-native-fs');

const dataKeys = ['Transaction', 'Tip Count', 'Currency', 'Total'];
const skippedKeysFromHead = ['Currency'];

const getStartEndDate = (selectedSection: SectionType) => {
    let startDate = new Date();
    let endDate = new Date();
    if (selectedSection === 'Today') {
        startDate = moment().hours(0).minutes(0).seconds(0).toDate();
        endDate = moment().hours(23).minutes(59).seconds(59).toDate();
    } else if (selectedSection === 'Yesterday') {
        startDate = moment().subtract(1, 'days').hours(0).minutes(0).seconds(0).toDate();
        endDate = moment().subtract(1, 'days').hours(23).minutes(59).seconds(59).toDate();
    }
    return { startDate, endDate };
};

const TipTotalsReport = () => {
    const { tms_settings } = useSelector((state: any) => state?.pr);
    const printerConfiguration = tms_settings?.printer;
    const screenshotRef: any = useRef(null);
    const [selectedSection, setSelectedSection] = useState<SectionType>('Today');
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const language = useSelector((state: any) => state?.root?.user?.languageType ?? 'ENG');
    const theme: any = useTheme();
    const navigation = useNavigation();
    const { transactionList, getTransactionsByDate } = useTransactionList();

    const _getInDateTransactions = () => {
        const { startDate, endDate } = getStartEndDate(selectedSection);
        const transactions = getTransactionsByDate(startDate, endDate);
        return transactions;
    };

    const _getData = useCallback(() => {
        return getTipReportData(_getInDateTransactions());
    }, [selectedSection]);

    const _printReceipt = () => {
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
        // printTipsReport(
        //   getFormattedDate(new Date().toString()),
        //   getFormattedTime(new Date().toString()),
        //   _getData()
        // );
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 4000);
    };

    const _handleUpdateSection = (section: SectionType) => {
        setSelectedSection(section);
    };

    const _renderHeader = useCallback(() => {
        return (
            <AppView>
                <KeyValueRow keyStr="Merchant ID:" value="136200499100000" />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="Terminal ID:" value="10015843" />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="Current Date:" value={getFormattedDate(new Date().toString())} />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="Time:" value={getFormattedTime(new Date().toString())} />
                <VerticalSpacer />
            </AppView>
        );
    }, []);

    const _renderItem = useCallback(({ item }) => {
        return (
            <AppView>
                <AppView style={styles.sectionHeaderContainer}>
                    <AppText title={item.title} colorText="#4A5568" center size={20} />
                </AppView>
                {item.tips.map((tip: any, index: number) => {
                    return (
                        <Card style={styles.itemContainer} key={index.toString()}>
                            {tip?.['Card Type'] ? <AppText title={tip['Card Type']} bold size={17} colorText="#4A5568" /> : <></>}
                            <AppView style={styles.reportItemContainer}>
                                {dataKeys.map((d: any, index: number) => {
                                    return <ReportRowItem key={index.toString()} title={skippedKeysFromHead.includes(d) ? ' ' : d} alignLeft={index === 0} flex2={[0, 1].includes(index)} bold />;
                                })}
                            </AppView>
                            <View style={styles.divider} />
                            <AppView style={styles.reportItemContainer}>
                                <ReportRowItem title={tip[dataKeys[0]]} alignLeft flex2 />
                                <ReportRowItem title={tip[dataKeys[1]]} flex2 />
                                <ReportRowItem title={tip[dataKeys[2]]} />
                                <ReportRowItem title={tip[dataKeys[3]]} />
                            </AppView>
                        </Card>
                    );
                })}
            </AppView>
        );
    }, []);

    return (
        <>
            <View style={styles.headerView}>
                <AppHeader
                    title={languagePicker(language, 'Tip Report')}
                    showLeftIcon
                    backAction={() => navigation.goBack()}
                    source={backArrowDark}
                    size={Typography.FONTS.SIZE.HEADER}
                    textColor={theme.colors.grey}
                    showRightIcon
                    rightIcon={printer}
                    rightIconStyle={{ width: 20, height: 20 }}
                    onPressRightIcon={_printReceipt}
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
                <FlatList contentContainerStyle={styles.listContainer} ListHeaderComponent={_renderHeader} renderItem={_renderItem} data={_getData()} />
                <VerticalSpacer spaceFactor={3} />
                {showSuccessModal && <SuccessModal />}
                <View style={styles.screenshot}>
                    <TipScreenshot ref={screenshotRef} data={_getData()} />
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
    reportItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        borderWidth: 0,
        borderBottomWidth: 1,
        borderColor: '#A0D800',
        borderStyle: 'dashed',
        marginVertical: 2,
    },
    screenshot: {
        // display: "none",
    },
});

export default TipTotalsReport;

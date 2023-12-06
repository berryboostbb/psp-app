import React, { useCallback, useRef, useState } from 'react';
import { AppHeader, AppText, AppView, VerticalSpacer, Wrapper } from '@components';
import { languagePicker } from '@utils';
import { StyleSheet, View } from 'react-native';
import { backArrowDark, printer } from '@assets';
import { RF, Typography } from '@theme';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import KeyValueRow from '../components/KeyValueRow';
import { FlatList } from 'react-native';
import { getFormattedDate, getFormattedTime, getTerminalConfigurationData } from '../helpers/functions';
import Card from '../components/Card';
import TerminalConfigurationScreenshot from './Screenshot';
import Pax from 'react-native-pax-library';
import SuccessModal from '../components/SuccessModal';
var RNFS = require('react-native-fs');

const TerminalTotals = () => {
    const { tms_settings } = useSelector((state: any) => state?.pr);
    const printerConfiguration = tms_settings?.printer;
    const screenshotRef: any = useRef(null);
    const currentDate = useRef(new Date()).current;
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const language = useSelector((state: any) => state.user.languageType);
    const theme: any = useTheme();
    const navigation = useNavigation();

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
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 4000);
        // printTerminalConfigurationReport();
    };

    const _renderHeader = useCallback(() => {
        return (
            <AppView>
                <KeyValueRow keyStr="Merchant ID:" value="136200499100000" />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr="Terminal ID:" value="10015843" />
                <VerticalSpacer spaceFactor={0.4} />
                <KeyValueRow keyStr={`Date: ${getFormattedDate(currentDate.toString())}`} value={`Time: ${getFormattedTime(currentDate.toString())}`} />
                <VerticalSpacer />
            </AppView>
        );
    }, []);

    const _renderItem = ({ item }: any) => {
        const itemData = item?.data;
        return (
            <View>
                <AppText title={item?.title} center size={18} colorText="#4A5568" />
                <VerticalSpacer spaceFactor={0.7} />
                <Card>
                    {Object.keys(itemData)?.map(d => {
                        return <KeyValueRow keyStr={d} value={itemData?.[d]} />;
                    })}
                </Card>
                <VerticalSpacer />
            </View>
        );
    };

    return (
        <>
            <View style={styles.headerView}>
                <AppHeader
                    title={languagePicker(language, 'Terminal Configuration Report')}
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
                <VerticalSpacer spaceFactor={0.6} />
                <FlatList contentContainerStyle={styles.listContainer} ListHeaderComponent={_renderHeader} renderItem={_renderItem} data={getTerminalConfigurationData()} />
                {/* <VerticalSpacer spaceFactor={3} /> */}
                {showSuccessModal && <SuccessModal />}
                <View>
                    <TerminalConfigurationScreenshot ref={screenshotRef} />
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
});

export default TerminalTotals;

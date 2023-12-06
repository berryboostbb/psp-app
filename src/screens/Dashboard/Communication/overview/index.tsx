import React from 'react';
import { RF } from '@theme';
import { backArrow, cross } from '@assets';
import { View } from 'react-native';
import { navigate } from '@services';
import { AppHeader, Pressable_Box, Wrapper } from '@components';
import { languagePicker } from '@utils';
import { useSelector } from 'react-redux';

const Communication = ({ navigation }: any) => {
    const language = useSelector((state: any) => state.user.languageType);
    const { tms_settings } = useSelector((state: any) => state.pr);
    let communicationSettings = tms_settings?.communication;

    const onClick = (type: any) => {
        if (type === 'host') {
            navigate('Host');
        } else if (type === 'network') {
            navigate('Network');
        } else if (type === 'batch') {
            navigate('Batch');
        }
    };

    return (
        <Wrapper isPaddingH isTop>
            <AppHeader title={languagePicker(language, 'Communications')} showLeftIcon source={cross} backAction={() => navigate('Admin_Settings', { type: '' })} />
            <View style={{ marginTop: RF(30) }} />
            {communicationSettings?.host_setting?._v && <Pressable_Box title={languagePicker(language, 'Host Settings')} onPress={() => onClick('host')} />}

            {communicationSettings?.network_connection?._v && <Pressable_Box title={languagePicker(language, 'Network Connection')} onPress={() => onClick('network')} />}

            {/* <Pressable_Box
        title={languagePicker(language, "Batch Close Parameter")}
        onPress={() => onClick("batch")}
      /> */}
        </Wrapper>
    );
};

export default Communication;

import React from 'react';
import { Cart, ErrorImageWrapper } from '@components';
import { navigate } from '@services';
import { RouteProp, useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setOrderData, setPrePrinted } from '@redux';
import { languagePicker } from '@utils';
import { wifi } from '@assets';
import printCancelReceipt from '../../../shared/utils/cancelReceipt';
var currencyFormatter = require('currency-formatter');

interface Props {
    navigation: any;
    route: RouteProp<{
        params: {
            type?: any;
        };
    }>;
}

const Merchant_Cart = ({ route, navigation }: Props) => {
    const language = useSelector((state: any) => state.user.languageType);
    const myTheme: any = useTheme();
    const { type } = route?.params;
    const { cancelReceipt } = printCancelReceipt();
    const orderData = useSelector((state: any) => state.common.orderData);

    const dispatch = useDispatch();
    const { settings, internet_Connected } = useSelector((state: any) => state.user);
    const { tms_settings } = useSelector((state: any) => state.pr);
    const merchant_passcode = tms_settings?.terminal_configuration?.merchant_passcode;

    const onClick = () => {
        navigate('TapProcess');
    };

    const handleCancel = () => {
        cancelReceipt();
        if (merchant_passcode?.value) {
            navigate('LockScreen', { type: 'merchant' });
        } else {
            navigate('TransactionMenu');
        }
        dispatch(setPrePrinted(false));
    };
    !internet_Connected && navigate('Offline');

    return (
        <Cart
            type={'pending'}
            total={languagePicker(language, 'Total')}
            tipAmount={currencyFormatter.format(parseFloat(orderData?.tip), {
                code: 'CAD',
            })}
            title={languagePicker(language, 'Summary')}
            subTotal={currencyFormatter.format(parseFloat(orderData?.orderAmount) + parseFloat(orderData?.tip), {
                code: 'CAD',
            })}
            saleAmount={currencyFormatter.format(parseFloat(orderData?.orderAmount), {
                code: 'CAD',
            })}
            leftBtnTitle={languagePicker(language, 'Cancel')}
            rightBtnTitle={languagePicker(language, 'Continue')}
            onPressRightBtn={() => onClick()}
            onPressLeftBtn={handleCancel}
        />
    );
};
export default Merchant_Cart;

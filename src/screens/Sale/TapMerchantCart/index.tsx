import React from 'react';
import { Cart, ErrorImageWrapper, TouchInactivityDetector } from '@components';
import { navigate } from '@services';
import { setOrderData, store } from '@redux';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp } from '@react-navigation/native';
import { NativeModules } from 'react-native';
import { languagePicker } from '@utils';
import SInfo from 'react-native-sensitive-info';
import printCancelReceipt from '../../../shared/utils/cancelReceipt';
const { tmsTime } = store.getState().tms;

var currencyFormatter = require('currency-formatter');

interface Props {
    navigation: any;
    route: RouteProp<{
        params: {
            type?: any;
            cardType?: any;
        };
    }>;
}

const Tap_Merchant_Cart = ({ route, navigation }: Props) => {
    const { PaxPaymentModule } = NativeModules;
    const language = useSelector((state: any) => state.user.languageType);
    const { cardType, type } = route?.params;
    const { flowType } = useSelector((state: any) => state.user);
    const orderData = useSelector((state: any) => state.common.orderData);
    const { settings, internet_Connected } = useSelector((state: any) => state.user);
    const { tms_settings } = useSelector((state: any) => state.pr);
    const surchargeConfig = tms_settings?.transaction_settings?.surcharge;
    const { cancelReceipt } = printCancelReceipt();

    const dispatch = useDispatch();

    function formatAmount(orderData: any) {
        let nu = (orderData.orderAmount ?? 0) + (orderData.tip ?? 0) + ((orderData.entry_mode === 'T' ? parseFloat(orderData.surcharge) : 0) ?? 0);
        return (Math.round((nu + Number.EPSILON) * 100) / 100).toFixed(2).toString().split('.').join('');
    }

    const onPress = async () => {
        let data = { ...orderData };
        data.surcharge =
            orderData.orderAmount > surchargeConfig?.debit_surcharge?.limit
                ? 0.0
                : cardType === 'debit'
                ? surchargeConfig?.debit_surcharge?.fee
                : (parseFloat(orderData.orderAmount) / 100) * parseFloat(surchargeConfig?.credit_surcharge?.fee);
        let amount = formatAmount(data);

        data.amount = amount;

        dispatch(setOrderData(data));
        authorizecardCallback();
    };

    const authorizecardCallback = () => {
        if (orderData?.entry_mode == 'S') {
            navigate('LoadingProcess', { type: 'swipe' });
        } else if (orderData?.entry_mode == 'T') {
            navigate('LoadingProcess', { type: 'tap' });
        } else {
            if (cardType == 'credit') {
                navigate('SelectAccount', { type: 'insert' });
            } else {
                navigate('SelectAccount', { type: 'insert' });
            }
        }
    };

    !internet_Connected && navigate('Offline');

    return (
        <TouchInactivityDetector>
            <Cart
                total={languagePicker(language, 'Total')}
                type={'surcharge'}
                tipAmount={currencyFormatter.format(orderData.tip, {
                    code: 'CAD',
                })}
                subTotal={currencyFormatter.format(
                    parseFloat(orderData?.orderAmount) + parseFloat(orderData?.tip) + (orderData.orderAmount > surchargeConfig?.debit_surcharge?.fee ? 0 : surchargeConfig?.debit_surcharge?.fee),
                    {
                        code: 'CAD',
                    }
                )}
                saleAmount={currencyFormatter.format(orderData?.orderAmount, {
                    code: 'CAD',
                })}
                cardType={cardType}
                rightBtnTitle={languagePicker(language, 'Accept')}
                leftBtnTitle={languagePicker(language, 'Cancel')}
                onPressRightBtn={onPress}
                onPressLeftBtn={() => {
                    cancelReceipt();
                    navigate('TransactionMenu');
                    //  navigate("DeclinedTransaction", { type: "login" })
                }}
                title={languagePicker(language, 'This sale includes an additional surcharge fee')}
            />
        </TouchInactivityDetector>
    );
};
export default Tap_Merchant_Cart;

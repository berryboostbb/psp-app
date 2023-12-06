import React from 'react';
import { backArrow, cross } from '@assets';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { CurveHeader, AppText, Wrapper, PrimaryButton, TouchInactivityDetector } from '@components';
import { GST, RF, Typography, verticalScale, horizontalScale } from '@theme';
import { useSelector } from 'react-redux';
import { setOrderData, store } from '@redux';
import { languagePicker } from '@utils';

var currencyFormatter = require('currency-formatter');

const Cart = ({
    total,
    type,
    title,
    subTotal,
    tipAmount,
    saleAmount,
    leftBtnTitle,
    rightBtnTitle,
    onPressLeftBtn,
    onPressRightBtn,
    cardType,
}: {
    type?: any;
    total?: any;
    title?: any;
    subTotal?: any;
    tipAmount?: any;
    saleAmount?: any;
    leftBtnTitle?: any;
    rightBtnTitle?: any;
    onPressLeftBtn?: any;
    onPressRightBtn?: any;
    cardType?: any;
}) => {
    const myTheme = useTheme();
    const colorTheme = myTheme.colors;
    const { flowType, settings } = useSelector((state: any) => state.user);
    const orderData = useSelector((state: any) => state.common.orderData);
    const language = useSelector((state: any) => state.user.languageType);
    const { tms_settings } = useSelector((state: any) => state.pr);
    const tipConfiguration = tms_settings?.transaction_settings?.tip_configuration;
    const surchargeConfig = tms_settings?.transaction_settings?.surcharge;
    const isRefund = useSelector((state: any) => state.common.isRefund);
    const { tmsTime } = store.getState().tms;

    var surcharge = 0;
    if (surchargeConfig?.debit_surcharge?.value || surchargeConfig?.credit_surcharge?.value) {
        if (orderData.orderAmount > surchargeConfig?.debit_surcharge?.limit && orderData.cardType === 'debit') surcharge = 0;
        else if (orderData?.cardType === 'debit' && surchargeConfig?.debit_surcharge?.value) {
            surcharge = surchargeConfig?.debit_surcharge?.fee;
        } else if (orderData?.cardType === 'debit' && !surchargeConfig?.debit_surcharge?.value) {
            surcharge = 0;
        } else if (surchargeConfig?.credit_surcharge?.value) surcharge = surchargeConfig?.credit_surcharge?.fee;
        else surcharge = 0;
    } else {
        surcharge = 0;
    }

    return (
        <Wrapper viewStyle={styles.main}>
            <TouchInactivityDetector>
                <CurveHeader
                    visible
                    adminVisible
                    backVisible={type == 'pending' ? true : false}
                    title={
                        type == 'pending'
                            ? currencyFormatter.format(parseFloat(orderData.orderAmount) + parseFloat(orderData.tip), {
                                  code: 'CAD',
                              })
                            : cardType === 'debit'
                            ? currencyFormatter.format(parseFloat(orderData.orderAmount) + parseFloat(orderData.tip) + parseFloat(surcharge), {
                                  code: 'CAD',
                              })
                            : currencyFormatter.format(parseFloat(orderData.orderAmount) + parseFloat(orderData.tip) + (parseFloat(orderData.orderAmount) / 100) * parseFloat(surcharge), {
                                  code: 'CAD',
                              })
                    }
                    source={type == 'pending' ? backArrow : cross}
                    total={isRefund ? 'Refund Total' : type === 'pending' ? 'Sale Total' : 'Sale Total'}
                />
                <View style={styles.view}>
                    {((surchargeConfig?.debit_surcharge?.value && cardType === 'debit') || (surchargeConfig?.credit_surcharge?.value && cardType === 'credit')) && (
                        <AppText medium title={title} defaultTextColor textStyle={styles.wd} size={RF(30)} />
                    )}

                    <View style={styles.rowView}>
                        <AppText defaultTextColor title={languagePicker(language, isRefund ? 'Refund' : 'Sale')} size={Typography.FONTS.SIZE.XLARGE} medium />
                        <View style={styles.row}>
                            <AppText semiBold defaultTextColor title={saleAmount} size={Typography.FONTS.SIZE.XLARGE} />
                        </View>
                    </View>

                    <View style={[styles.lineView, { borderBottomColor: colorTheme.border }]} />

                    {!isRefund && tipConfiguration?.tip_screen?.value && (
                        <View style={[styles.rowView, { paddingTop: verticalScale(18) }]}>
                            <AppText defaultTextColor title={languagePicker(language, 'Tip Amount')} size={Typography.FONTS.SIZE.XLARGE} />
                            <View style={styles.row}>
                                <AppText semiBold defaultTextColor title={tipAmount} size={Typography.FONTS.SIZE.XLARGE} />
                            </View>
                        </View>
                    )}

                    {!isRefund && (surchargeConfig?.debit_surcharge?.value || surchargeConfig?.credit_surcharge?.value) && (
                        <View style={[styles.rowView, { paddingTop: verticalScale(5) }]}>
                            <>
                                {type === 'pending' ? (
                                    <AppText colorText="#D74120" title={languagePicker(language, 'Merchant Surcharge')} size={Typography.FONTS.SIZE.XLARGE} />
                                ) : (
                                    <>
                                        {((surchargeConfig?.debit_surcharge?.value && cardType === 'debit') || (surchargeConfig?.credit_surcharge?.value && cardType === 'credit')) && (
                                            <AppText defaultTextColor title={languagePicker(language, 'Merchant Surcharge')} size={Typography.FONTS.SIZE.XLARGE} />
                                        )}
                                    </>
                                )}

                                <View style={styles.row}>
                                    {type === 'pending' ? (
                                        <AppText semiBold colorText="#D74120" title={languagePicker(language, 'Pending')} size={Typography.FONTS.SIZE.LARGE} />
                                    ) : (
                                        ((surchargeConfig?.debit_surcharge?.value && cardType === 'debit') || (surchargeConfig?.credit_surcharge?.value && cardType === 'credit')) && (
                                            <AppText
                                                semiBold
                                                defaultTextColor
                                                title={
                                                    cardType === 'debit'
                                                        ? currencyFormatter.format(parseFloat(surcharge), {
                                                              code: 'CAD',
                                                          })
                                                        : currencyFormatter.format((parseFloat(orderData.orderAmount) / 100) * parseFloat(surchargeConfig?.credit_surcharge?.fee), {
                                                              code: 'CAD',
                                                          })
                                                }
                                                size={Typography.FONTS.SIZE.XLARGE}
                                            />
                                        )
                                    )}
                                </View>
                            </>
                        </View>
                    )}

                    <View style={styles.total}>
                        <AppText medium title={total} defaultTextColor size={Typography.FONTS.SIZE.XXLARGE} />

                        <View style={{ ...GST.ROW }}>
                            <AppText
                                medium
                                defaultTextColor
                                title={
                                    type === 'pending'
                                        ? subTotal
                                        : cardType === 'debit'
                                        ? currencyFormatter.format(parseFloat(orderData.orderAmount) + parseFloat(orderData.tip) + parseFloat(surcharge), {
                                              code: 'CAD',
                                          })
                                        : currencyFormatter.format(parseFloat(orderData.orderAmount) + parseFloat(orderData.tip) + (parseFloat(orderData.orderAmount) / 100) * parseFloat(surcharge), {
                                              code: 'CAD',
                                          })
                                }
                                size={Typography.FONTS.SIZE.XXXLARGE}
                            />
                        </View>
                    </View>

                    <View style={[styles.wrapButton]}>
                        <PrimaryButton clr={'#D74120'} title={leftBtnTitle} onPress={onPressLeftBtn} disableBackgroundColor={true} bgColor={'#fff'} buttonStyle={styles.btn} />
                        <PrimaryButton title={rightBtnTitle} onPress={onPressRightBtn} bgColor={colorTheme.primary} disableBackgroundColor={false} buttonStyle={styles.btn} />
                    </View>
                </View>
            </TouchInactivityDetector>
        </Wrapper>
    );
};

export default Cart;

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center' },
    wd: { width: RF(350), fontFamily: 'Plus Jakarta Sans', fontWeight: '500' },
    total: {
        paddingTop: verticalScale(32),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btn: {
        width: RF(142),
        height: RF(50),
        fontFamily: 'Plus Jakarta Sans',
        borderColor: '#4A55681A',
        borderWidth: 2,
    },
    view: { marginHorizontal: 25, marginTop: 40 },
    main: { paddingTop: 0, paddingHorizontal: 0 },
    wrapButton: {
        ...GST.mid_row,
        paddingTop: verticalScale(90),
        paddingHorizontal: RF(20),
    },
    rowView: {
        ...GST.mid_row,
        paddingTop: verticalScale(45),
    },
    lineView: {
        borderBottomWidth: horizontalScale(0.25),
        paddingTop: verticalScale(18),
        borderColor: '#4A55681A',
        opacity: 0.5,
    },
});

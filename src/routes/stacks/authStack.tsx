import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import {
    TransactionMenu,
    ManagerPassword,
    Dashboard,
    ClerkId,
    InvoiceNumber,
    EnterAmount,
    TipDoller,
    Merchant_Cart,
    TapProcess,
    LoadingProcess,
    Receipt,
    QRCode,
    Tap_Merchant_Cart,
    SelectAccount,
    SaleWelcome,
    LockScreen,
    Merchant_Login,
    Settings,
    PaymentMethod,
    CustomerPayWithPoint,
    Admin_Settings,
    Login,
    Communication,
    Host,
    Network,
    Batch,
    Transaction_Settings,
    Tip_Configuration,
    Edit_Tip_Amount,
    PrinterConfiguration,
    EditFooterLines,
    ReportsSection,
    BatchClose,
    OpenBatchTerminal,
    Cashback_Config,
    Surcharge_Config,
    Terminal_Configuration,
    Clerk,
    Language,
    Add_Clerk,
    Clerk_List,
    Delete_Clerk,
    TransactionDetailReport,
    SummaryReport,
    TipTotals,
    SearchFilter,
    ClerkServerReport,
    TerminalConfigurationReport,
    ClerkServerPrintReport,
    DeclineTransactionReport,
    EMVParameterReport,
    Offline,
    ClerkServerMaintenance,
    InvoiceNumberConfig,
    DeclinedTransaction,
    MerchantPasscodeSettings,
    ManualCard,
    Signature,
    RecieptMail,
    DailyReport,
    TerminalTotals,
    EmvParametersReport,
} from '@screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

const Stack = createStackNavigator();
const Drawer2 = createDrawerNavigator();

const AuthStack = () => {
    const [passcode, setPasscode] = useState(null);
    const [role, setRole] = useState(null);
    const { tms_settings } = useSelector((state: any) => state.pr);
    const merchant_passcode = tms_settings?.terminal_configuration?.merchant_passcode;

    useEffect(() => {
        checkRoles();
    }, []);

    const checkRoles = async () => {
        const passcodeValue: any = await AsyncStorage.getItem('passcode');
        const roleValue: any = await AsyncStorage.getItem('role');
        setPasscode(passcodeValue);
        setRole(roleValue);
    };

    return (
        // role !== null && (
        <Stack.Navigator
            {...{
                initialRouteName: merchant_passcode?.value ? 'LockScreen' : 'TransactionMenu',
            }}>
            <Stack.Screen
                name="LockScreen"
                component={LockScreen}
                options={{ header: (props: any) => null }}
                initialParams={{
                    type: role === 'Merchant' && passcode == null ? 'login' : 'merchant',
                }}
            />

            <Stack.Screen name="Drawer" component={Login} options={{ header: (props: any) => null }} />
            <Stack.Screen name="DeclinedTransaction" component={DeclinedTransaction} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Delete_Clerk" component={Delete_Clerk} options={{ header: (props: any) => null }} />
            <Stack.Screen name="Clerk_List" component={Clerk_List} options={{ header: (props: any) => null }} />
            <Stack.Screen name="Surcharge_Config" component={Surcharge_Config} options={{ header: (props: any) => null }} />
            <Stack.Screen name="Add_Clerk" component={Add_Clerk} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Language" component={Language} options={{ header: (props: any) => null }} />
            <Stack.Screen name="Clerk" component={Clerk} options={{ header: (props: any) => null }} />
            <Stack.Screen name="Terminal_Configuration" component={Terminal_Configuration} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Cashback_Config" component={Cashback_Config} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Tip_Configuration" component={Tip_Configuration} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Edit_Tip_Amount" component={Edit_Tip_Amount} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Transaction_Settings" component={Transaction_Settings} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Communication" component={Communication} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Batch" component={Batch} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Network" component={Network} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Host" component={Host} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Merchant_Login" component={Merchant_Login} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Admin_Settings" component={Admin_Settings} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Receipt" component={Receipt} options={{ header: (props: any) => null }} />

            <Stack.Screen name="SaleWelcome" component={SaleWelcome} options={{ header: (props: any) => null }} />

            <Stack.Screen name="LoadingProcess" component={LoadingProcess} options={{ header: (props: any) => null }} />

            <Stack.Screen name="TipDoller" component={TipDoller} options={{ header: (props: any) => null }} />

            <Stack.Screen name="SelectAccount" component={SelectAccount} options={{ header: (props: any) => null }} />

            <Stack.Screen name="TapProcess" component={TapProcess} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Signature" component={Signature} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Tap_Merchant_Cart" component={Tap_Merchant_Cart} options={{ header: (props: any) => null }} />

            <Stack.Screen name="TransactionMenu" component={TransactionMenu} options={{ header: (props: any) => null }} />

            <Stack.Screen name="ManagerPassword" component={ManagerPassword} options={{ header: (props: any) => null }} />

            <Stack.Screen name="ClerkId" component={ClerkId} options={{ header: (props: any) => null }} />

            <Stack.Screen name="InvoiceNumber" component={InvoiceNumber} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Merchant_Cart" component={Merchant_Cart} options={{ header: (props: any) => null }} />

            <Stack.Screen name="EnterAmount" component={EnterAmount} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Dashboard" component={Dashboard} options={{ header: (props: any) => null }} />

            <Stack.Screen name="Settings" component={Settings} options={{ header: (props: any) => null }} />
            <Stack.Screen name="PaymentMethod" component={PaymentMethod} options={{ header: (props: any) => null }} />
            <Stack.Screen name="CustomerPayWithPoint" component={CustomerPayWithPoint} options={{ header: (props: any) => null }} />
            <Stack.Screen name="QRCode" component={QRCode} options={{ header: (props: any) => null }} />

            <Stack.Screen name="PrinterConfiguration" component={PrinterConfiguration} options={{ header: (props: any) => null }} />
            <Stack.Screen name="EditFooterLines" component={EditFooterLines} options={{ header: (props: any) => null }} />

            <Stack.Screen name="ReportsSection" component={ReportsSection} options={{ header: (props: any) => null }} />
            <Stack.Screen name="BatchClose" component={BatchClose} options={{ header: (props: any) => null }} />
            <Stack.Screen name="OpenBatchTerminal" component={OpenBatchTerminal} options={{ header: (props: any) => null }} />
            <Stack.Screen name="TransactionDetailReport" component={TransactionDetailReport} options={{ header: (props: any) => null }} />
            <Stack.Screen name="SummaryReport" component={SummaryReport} options={{ header: (props: any) => null }} />

            {/* huzaifa-dev */}
            <Stack.Screen name="TipTotals" component={TipTotals} options={{ header: (props: any) => null }} />
            <Stack.Screen name="SearchFilter" component={SearchFilter} options={{ header: (props: any) => null }} />

            <Stack.Screen name="TerminalConfigurationReport" component={TerminalConfigurationReport} options={{ header: (props: any) => null }} />
            <Stack.Screen name="EmvParametersReport" component={EmvParametersReport} options={{ header: (props: any) => null }} />
            <Stack.Screen name="ClerkServerPrintReport" component={ClerkServerPrintReport} options={{ header: (props: any) => null }} />
            <Stack.Screen name="ClerkServerReport" component={ClerkServerReport} options={{ header: (props: any) => null }} />
            <Stack.Screen name="DeclineTransactionReport" component={DeclineTransactionReport} options={{ header: (props: any) => null }} />
            <Stack.Screen name="EMVParameterReport" component={EMVParameterReport} options={{ header: (props: any) => null }} />
            <Stack.Screen name="Offline" component={Offline} options={{ header: (props: any) => null }} />
            <Stack.Screen name="ClerkServerMaintenance" component={ClerkServerMaintenance} options={{ header: (props: any) => null }} />
            <Stack.Screen name="InvoiceNumberConfig" component={InvoiceNumberConfig} options={{ header: (props: any) => null }} />
            <Stack.Screen name="ManualCard" component={ManualCard} options={{ header: (props: any) => null }} />
            <Stack.Screen name="MerchantPasscodeSettings" component={MerchantPasscodeSettings} options={{ header: (props: any) => null }} />
            <Stack.Screen name="RecieptMail" component={RecieptMail} options={{ header: (props: any) => null }} />
            <Stack.Screen name="DailyReport" component={DailyReport} options={{ header: (props: any) => null }} />
            <Stack.Screen name="TerminalTotals" component={TerminalTotals} options={{ header: (props: any) => null }} />
        </Stack.Navigator>
    );
};

export default AuthStack;
const styles = StyleSheet.create({
    drawer: {
        borderTopWidth: 1,
        width: '85%',
    },
});

import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
    isLoading: false,
    orderData: {
        tip: 0.0,
        clerkId: '',
        invoiceNumber: '',
        merchantPasscode: '',
        tipType: '',
        surcharge: 0,
        orderAmount: 0.0,
        cardType: '',
        accountType: '',
        emitter: null,
        transactionResponse: null,
        finalTransaction: null,
        referenceNumber: null,
    },
    isRefund: false,
    signature: null,
    refundData: null,
    orderId: null,
};

export const commonReducer = createSlice({
    name: 'common',
    initialState,
    reducers: {
        toggleLoader: (state, action) => {
            state.isLoading = action.payload.isLoading;
        },
        setTransactionResponse: (state, action) => {
            state.transactionResponse = action.payload;
        },

        setIsRefund: (state, action) => {
            state.isRefund = action.payload;
        },
        setRefundData: (state, action) => {
            state.refundData = action.payload;
        },

        setOrderData: (state, action) => {
            state.orderData = action.payload;
        },
        setFinalTransaction: (state, action) => {
            state.finalTransaction = action.payload;
        },
        setOrderId: (state, action) => {
            state.orderId = action.payload;
        },
        setRefNumber: (state, action) => {
            state.orderData.referenceNumber = action.payload.referenceNumber;
        },
        setSignature: (state, action) => {
            state.signature = action.payload;
        },
    },
});

export const { toggleLoader, setSignature, setRefNumber, setTransactionResponse, setFinalTransaction, setOrderData, setOrderId, setIsRefund, setRefundData } = commonReducer.actions;

export default commonReducer.reducer;

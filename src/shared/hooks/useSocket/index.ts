import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {
    setUpdatedConfigs,
    setNotifyConfigUpdate,
    set_bin_ranges,
    setTmsTime,
    setUsers,
    setDeviceName,
    setManualCardEntry,
    setTerminalStatus,
    store,
    setIsLoggedIn,
    setTerminalActivated,
    setTerminalInfo,
} from '@redux';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SInfo from 'react-native-sensitive-info';
import DeviceInfo from 'react-native-device-info';

type Socket = any;

interface UseSocketResult {
    socket: Socket | null;
    printModalVisible: boolean;
    terminalStatus: string;
    appState: string;
    joinRoom: (serialNo: any) => void;
    leaveRoom: () => void;
    _handleAfterReportPrint: () => void;
}

interface SocketOptions {
    showUpdate: (msg: string) => void;
}

let socket = io('wss://psp.plastk.ca', {
    secure: true,
    multiplex: false,
    path: '/websocketsu',
    auth: {
        token: '',
    },
});

/**
 * @description Custom hook for managing socket events and state.
 * @param {SocketOptions} options - Options for the socket.
 * @returns {UseSocketResult} The socket instance and relevant functions and states.
 */

export const useSocket = ({ showUpdate }: SocketOptions): UseSocketResult => {
    const { temrinalInfo } = store.getState().tms;
    const { terminalActivated, terminal_status, storeId } = store.getState().pr;
    const dispatch = store.dispatch;

    const [printModalVisible, setPrintModalVisible] = useState(false);
    const [terminalStatus, set_Terminal_Status] = useState(terminal_status);
    const [appState, setAppState] = useState(AppState.currentState);

    let version = DeviceInfo.getVersion();
    /**
     * @description Joins a room with the specified serial number.
     * @param {string | number} serialNo - The serial number to join the room with.
     */
    const joinRoom = async (serialNo: string | number) => {
        if (!socket.connected) await socket.connect();
        socket.emit('join', {
            room: `store_${storeId}`,
            serial_number: serialNo,
        });
    };

    /**
     * @description Leaves the room.
     */
    const leaveRoom = () => {
        if (!temrinalInfo?.serialNo) return;
        if (!socket.connected) socket.connect();
        socket.emit('leave', {
            room: `store_${storeId}`,
            serial_number: temrinalInfo?.serialNo,
        });
    };

    /**
     * @description Logs out the user by removing relevant data from AsyncStorage and updating Redux store.
     */
    const logoutUser = async () => {
        await AsyncStorage.removeItem('passcode');
        await AsyncStorage.removeItem('role');
        await AsyncStorage.removeItem('isLoggedIn');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('passcode');
        await AsyncStorage.removeItem('role');
        await AsyncStorage.removeItem('merchantID');
        await AsyncStorage.removeItem('clerkID');
        dispatch(setIsLoggedIn(false));
        dispatch(setTerminalActivated(false));
    };

    /**
     * @description Handles actions after the report is printed.
     */
    const _handleAfterReportPrint = async () => {
        setPrintModalVisible(false);
        if (!socket.connected) await socket.connect();

        const gettingAllKeys: any = await SInfo.getAllItems({
            sharedPreferencesName: 'SharedPreferenceHelper',
            keychainService: '',
        });
        socket?.emit('printed_receipt', {
            date: new Date(),
            serial_number: gettingAllKeys?.serialNo,
        });
    };

    useEffect(() => {
        const initSocket = async (serialNo: any) => {
            if (terminalActivated) {
                socket.connect();
                socket.on('connect', () => {
                    socket.emit('version_pushed', {
                        serial_number: serialNo,
                        app_version: version,
                    });
                    socket.on('config_update', (msg: any) => {
                        dispatch(setUpdatedConfigs(msg[1]?.configuration?.configuration));
                        dispatch(setNotifyConfigUpdate(true));
                        dispatch(set_bin_ranges(msg[3]?.bin_ranges));
                        dispatch(setTmsTime(msg[1]?.configuration?.configuration?.screen_times));
                        dispatch(setUsers(msg[0]?.users));

                        if (!msg[1]?.configuration?.configuration?.terminal_configuration?.language_and_terminal_mode?.terminal_mode?.manual_entry?.value) {
                            dispatch(setManualCardEntry(false));
                        }
                    });

                    socket.on('passcode_changed', (msg: any) => {
                        dispatch(setUsers(msg));
                    });

                    socket.on('terminal_status_changed', (msg: any) => {
                        dispatch(setTerminalStatus(msg.status));
                        set_Terminal_Status(msg.status);
                    });

                    socket.on('error', (msg: any) => {
                        console.log('socket error: ', msg);
                    });

                    socket.on('device_deleted', (msg: any) => {
                        logoutUser();
                    });

                    socket.on('user_deleted', (msg: any) => {
                        console.log('user_deleted....', msg);
                    });

                    socket.on('terminal_update', (msg: any) => {
                        dispatch(setDeviceName(msg?.store_title));
                    });

                    socket.on('user_updated', (msg: any) => {
                        dispatch(setUsers(msg));
                    });

                    socket.on('psp_error', (msg: any) => {
                        console.log('psp_error', msg);
                    });

                    socket.on('device_deactivated_forcefully', (msg: any) => {
                        console.log('msg.....', msg?.message);
                        showUpdate(msg?.message);
                        logoutUser();
                    });

                    socket.on('print_receipt', () => {
                        console.log('ON PRINT RECEIPT');
                        setPrintModalVisible(true);
                    });
                });

                socket.on('bin_ranges_updated', (msg: any) => {
                    dispatch(set_bin_ranges(msg));
                });

                socket.on('disconnect', () => {
                    socket.off('passcode_changed');
                    socket.off('config_update');
                    socket.off('terminal_status_changed');
                    socket.off('psp');
                    socket.off('psp_error');
                    socket.off('connect');
                });
                joinRoom(serialNo);
            }
        };
        const handleAppStateChange = (nextAppState: any) => {
            if (nextAppState === 'background' || nextAppState === 'inactive') {
                leaveRoom();
            }

            if (nextAppState === 'active') {
                initSocket(temrinalInfo?.serialNo);
            }

            setAppState(nextAppState);
        };
        if (terminalActivated && temrinalInfo?.serialNo && !socket.connected) {
            initSocket(temrinalInfo.serialNo);
        } else if (temrinalInfo == null || JSON.stringify(temrinalInfo) == '{}') {
            const _ = async () => {
                const gettingAllKeys: any = await SInfo.getAllItems({
                    sharedPreferencesName: 'SharedPreferenceHelper',
                    keychainService: '',
                });
                initSocket(gettingAllKeys?.serialNo);
                dispatch(setTerminalInfo(gettingAllKeys));
            };
            _();
        }
        AppState.addEventListener('change', handleAppStateChange);
        return () => {
            if (socket) {
                socket.disconnect();
                socket.off('passcode_changed');
                socket.off('config_update');
                socket.off('terminal_status_changed');
                socket.off('connect');
            }
        };
    }, [dispatch, terminalActivated, storeId, temrinalInfo]);

    return { socket, printModalVisible, terminalStatus, appState, joinRoom, leaveRoom, _handleAfterReportPrint };
};

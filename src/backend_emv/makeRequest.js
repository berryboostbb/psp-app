import TcpSocket from 'react-native-tcp-socket';
var Buffer = require('buffer/').Buffer;
const EMV_PARSER = require('./main');
const ISO = require('./iso8583/main');
const FUNC = require('./request');
const UTIL = require('./numberFormatUtils');
const ISO8583 = require('iso_8583');
import { ErrorCodes } from './error_codes';

async function generateBytesData(function_name, card_data) {
    let dataElements = await FUNC[function_name](card_data);
    const optionalConfig = {
        55: {
            fixedLength: true,
            contentLength: 0,
            minLength: 0,
            maxLength: 255,
            contentType: 'b',
            slug: null,
            nestedElements: {},
        },
    };
    let iso8583Parser = new ISO(optionalConfig);

    let packed = iso8583Parser.pack(dataElements.mti, dataElements.DE);
    const messageBuffer = Buffer.from(packed.isoMessage, 'binary');
    const prefix = Buffer.from(packed.hexadecimalBitmap, 'binary');
    let messageLength = messageBuffer.length - 8;
    let lengthString = messageLength.toString().padStart(4, '0');
    let headerBuffer = Buffer.from(lengthString, 'ascii');
    let headerPrefix = Buffer.from(headerBuffer, 'binary');
    let bufferMessage = Buffer.concat([headerBuffer, messageBuffer]);
    let bytesData = UTIL.bytesToHex(bufferMessage);

    bytesData = bytesData.replace(prefix.toString('hex'), packed.hexadecimalBitmap);

    if (card_data?.['Entry Mode'] != '1') {
        const field55Data = card_data.EMVData;
        let field55Hex = Buffer.from(field55Data, 'binary');
        bytesData = bytesData.replace(field55Hex.toString('hex'), `${UTIL.calculateLength(field55Data)}${field55Data}`);
    }

    const length = Buffer.byteLength(bytesData, 'hex');
    bytesData = bytesData.replace(headerPrefix.toString('hex'), Buffer.from((length - 4).toString().padStart(4, '0'), 'ascii').toString('hex'));

    console.log('transaction_request', JSON.stringify({ transaction_request: bytesData }));

    return bytesData;
}

function onData(data, card_data) {
    const custom_format = require('./custom_formats');
    let iso = new ISO8583(null, custom_format);
    let received = null;
    console.log('transaction_response:', JSON.stringify({ transaction_response: data }));

    received = iso.getIsoJSON(data.slice(4), { lenHeader: false });
    console.log('Parsed Message:', JSON.stringify(received, null, 2));

    const keys = Object.keys(received);
    let fieldDefinitions = ISO8583.getFieldDescription(keys);
    //replace the keys of received object with the values of fieldDefinitions both have same keys.
    let newObj = {};
    keys.forEach(e => {
        if (fieldDefinitions[e] === 'Response code') {
            newObj['Response code'] = `${received[e]} (${ErrorCodes(received[e])})`;
        } else newObj[fieldDefinitions[e]] = received[e];
    });
    let tags = {};
    if (card_data.EMVData) {
        EMV_PARSER.parse(card_data.EMVData, _ => (tags = _.reduce((acc, { tag, value }) => ({ ...acc, [tag]: value }), {})));
        tags = { ...tags, ...received };
        newObj['tid'] = tags['11'];
        newObj['aid'] = tags['4F'];
        newObj['tvr'] = tags['95'];
        newObj['tsi'] = tags['9B'];
    }

    console.log('TID, AID, TVR, TSI', JSON.stringify(newObj, null, 2));
    return {
        fieldDefinitions,
        received,
        newObj,
    };
}

async function createConnection(bytesData, onData, onTimeout, onError) {
    // --------- TCP Solution --------
    const socket = TcpSocket.connect(
        {
            host: '15.156.11.238',
            port: 33666,
        },
        () => {
            console.log('Connected to server'); // resolve(socket);
            socket.write(bytesData, 'hex');
        }
    );
    socket.on('data', data => {
        onData(data);
        socket?.destroy();
    });
    socket.on('timeout', () => {
        console.log('TRANSACTION_TIMEOUT');
        socket?.destroy();
    });
    socket.on('error', er => {
        console.log('TRANSACTION_SOCKET_ERROR');
        onError(er);
        socket?.destroy();
    });
}

async function makeRequest({ function_name = 'purchase_request', mac = null, card_data, serial_number = null, amount = 12.4, clear_pin = null, terminal_id = null, merchant_id = null, san = null }) {
    let data = await new Promise(async (RESOLVE, REJECT) => {
        try {
            let parsed = {};
            if (card_data?.EMVData) {
                parsed = EMV_PARSER.getParsedEMV(card_data.EMVData);
            }
            card_data = {
                ...card_data,
                ...parsed,
                pin: clear_pin,
                serial_number,
                amount,
                clear_pin,
                terminal_id,
                merchant_id,
                san,
                mac,
            };

            let bytesData = await generateBytesData(function_name, card_data);
            const _onData = data => {
                console.log('socket DATA:::', data);
                let { fieldDefinitions, received, newObj } = onData(data, card_data);

                console.log('fieldDefinitions: ', JSON.stringify(fieldDefinitions, null, 2));
                RESOLVE({ fieldDefinitions, received, newObj });
            };
            const _onTimeout = async () => {
                console.log('Socket timeout Occurred');
                REJECT(new Error('Socket timeout'));
            };
            const _onError = err => {
                console.log('Socket error', err);
                REJECT(err);
            };
            createConnection(bytesData, _onData, _onTimeout, _onError);
        } catch (e) {
            console.log('Error occurred', JSON.stringify(e));
        }
    });
    console.log('DDDDDataaa: ', JSON.stringify(data, null, 2));
    return data;
}

export default makeRequest;

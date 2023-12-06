// import { setSyncDate, setTms_settings, setUsers, store } from "@redux";
// import { arraysAreEqual } from "./objectHelper";
// import io from 'socket.io-client';

// export const Socket = () => {
//   const { deviceMacAddress } = store.getState().user;
//   const { apiKey, syncDate, users } = store.getState().tms;

//   let socket = {};

//   socket = io('wss://psp.plastk.ca/websocketsu?terminal=', {
//     allowEIO3: true,
//     secure: true,
//     multiplex: false,
//     path: '/websockets',
//     auth: {

//     },
//   });

//   const LeaveRoom = async room => {
//     if (!socket.connected) await socket.connect();
//     socket.emit('leave', {
//       room,
//     });
//     return null;
//   };

//   const JoinRoom = async room => {
//     if (!socket.connected) await socket.connect();
//     socket.emit('join', {
//       room,
//     });
//   };

// //   const newSocket = new WebSocket(
// //     "wss://psp.plastk.ca/websocketsu?terminal=" +
// //       mac +
// //       "&terminal_id=" +
// //       apiKey +
// //       "&sync_date=" +
// //       syncDate
// //   );

//   newSocket.onopen = () => {
//     console.log("Connected to server!");
//   };

//   newSocket.onmessage = async (event: any) => {
//     let res = JSON.parse(event.data);

//     // console.log("event", res, "  " + syncDate);
//     res?.map((obj: any) => {
//       if (obj?.type == "ACTIVE_USERS") {
//         if (users?.length != obj?.users?.length) {
//           store.dispatch(setUsers(obj?.users));
//         } else {
//           if (!arraysAreEqual(users, obj?.users ?? []))
//             store.dispatch(setUsers(obj?.users));
//         }
//       } else if (obj?.type == "DEVICE_CONFIGURATIONS") {
//         if (syncDate !== obj?.configuration?.updated_at) {
//           store.dispatch(setTms_settings(obj?.configuration?.configuration));
//           store.dispatch(
//             setSyncDate(obj?.configuration?.configuration?.updated_at)
//           );
//         }
//       }
//     });

//     newSocket.onmessage = null;
//   };

//   newSocket.onclose = () => {
//     console.log("WebSocket connection closed");
//   };
// };

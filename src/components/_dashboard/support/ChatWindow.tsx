import { useEffect, useState } from 'react';
// material
/* eslint-disable import/no-duplicates */
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { firebaseConfig } from 'config';
import { setCollection } from 'firebase/setCollection';
import { Box, Divider } from '@material-ui/core';
// redux

// routes
// @types
import { SendMessage } from '../../../@types/chat';
//
import ChatMessageList from './ChatMessageList';
import ChatHeaderDetail from './ChatHeaderDetail';
import ChatMessageInput from './ChatMessageInput';

// ----------------------------------------------------------------------

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore();
}

export default function ChatWindow({ selectedChat }: { selectedChat: any }) {
  const { addMessageCollection } = setCollection('messages');
  const [messagesRealtime, setMessagesRealtime] = useState([]);
  console.log(selectedChat);
  useEffect(() => {
    const subscriber = firebase
      .firestore()
      .collection('messages')
      .doc('1')
      .collection('with-user')
      .doc(selectedChat.userIdSent)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot((querySnapshot) => {
        const messages: any = [];
        querySnapshot.forEach((doc) => {
          messages.push(doc.data());
        });
        console.log(messages);
        setMessagesRealtime(messages);
      });
    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [selectedChat.userIdSent]);

  const handleSendMessage = async (value: SendMessage) => {
    const info = {
      phone: '18008080',
      email: 'admin@gmail.com',
      userIdSent: '1',
      username: 'Nhân viên hỗ trợ',
      content: value.message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    console.log(info, '1', selectedChat.userIdSent, {
      ...selectedChat,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    await addMessageCollection(info, '1', selectedChat.userIdSent, {
      ...selectedChat,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  };

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <ChatHeaderDetail participant={selectedChat} />

      <Divider />

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}>
          <ChatMessageList conversation={messagesRealtime} />

          <Divider />

          <ChatMessageInput
            // @ts-ignore
            conversationId={selectedChat.userIdSent}
            onSend={handleSendMessage}
            disabled={false}
          />
        </Box>

        {/* {mode === 'DETAIL' && (
          <ChatRoom conversation={conversation} participants={displayParticipants} />
        )} */}
      </Box>
    </Box>
  );
}

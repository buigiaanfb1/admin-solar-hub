/* eslint-disable import/no-duplicates */
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
// @types
import { firebaseConfig } from '../config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore();
}

export const setCollection = (collection: string) => {
  const addMessageCollection = async (
    doc: any,
    userID: string,
    otherUserID: string,
    otherUser: any
  ) => {
    let docCopy = { ...otherUser };
    docCopy = {
      ...docCopy,
      content: doc.content
    };
    try {
      await firebase
        .firestore()
        .collection(collection)
        .doc(userID)
        .collection('with-user')
        .doc(otherUserID)
        .collection(collection)
        .add(doc);
      // Khi gửi tin nhắn thì bên sẽ add vào
      // doc của người nhận tin nhắn cái mới nhất
      // messages => otherUser => with-user => currentUser => messages => doc
      await firebase
        .firestore()
        .collection(collection)
        .doc(otherUserID)
        .collection('with-user')
        .doc(userID)
        .collection(collection)
        .add(doc);
      // Khi gửi tin nhắn thì bên sẽ add vào
      // doc của người nhận tin nhắn cái mới nhất
      // messages-notification => otherUser => newest-message => currentUser
      await firebase
        .firestore()
        .collection('messages-notification')
        .doc(otherUserID)
        .collection('newest-message')
        .doc(userID)
        .set({ ...doc, seen: false });
      // Khi gửi tin nhắn thì bên sẽ add vào
      // doc của người nhắn tin nhắn cái mới nhất
      // messages-notification => otherUser => newest-message => currentUser
      await firebase
        .firestore()
        .collection('messages-notification')
        .doc(userID)
        .collection('newest-message')
        .doc(otherUserID)
        .set({ ...docCopy, seen: true });
    } catch (err) {
      console.log(err);
    }
  };

  const updateSeenMessageField = async (userID: string, otherUserID: string) => {
    try {
      await firebase
        .firestore()
        .collection(collection)
        .doc(userID)
        .collection('newest-message')
        .doc(otherUserID)
        .update({
          seen: true
        });
    } catch (err) {
      console.log(err);
    }
  };

  return {
    addMessageCollection,
    updateSeenMessageField
  };
};

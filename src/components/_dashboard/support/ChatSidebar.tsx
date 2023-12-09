import { Icon } from '@iconify/react';
/* eslint-disable import/no-duplicates */
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

import { setCollection } from 'firebase/setCollection';
import { firebaseConfig } from 'config';
import useAuth from 'hooks/useAuth';

// @types
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// material
import { useTheme, styled } from '@material-ui/core/styles';
import { Box, useMediaQuery } from '@material-ui/core';

// utils
import axios from '../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// @types
import { Contact } from '../../../@types/chat';
//
import { MIconButton } from '../../@material-extend';
import Scrollbar from '../../Scrollbar';
import ChatAccount from './ChatAccount';
import ChatConversationList from './ChatConversationList';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  width: 320,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  transition: theme.transitions.create('width'),
  borderRight: `1px solid ${theme.palette.divider}`
}));

// ----------------------------------------------------------------------

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore();
}

export default function ChatSidebar({
  handleSetSelectedChatId
}: {
  handleSetSelectedChatId: (id: string) => void;
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openSidebar, setOpenSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setSearchFocused] = useState(false);
  // const displayResults = isSearchFocused;
  const { user } = useAuth();

  const { updateSeenMessageField } = setCollection('messages-notification');
  const firstRef = useRef(false);
  const [messages, setMessages] = useState<any>({
    messages: null,
    alert: false,
    selectedID: null
  });

  useEffect(() => {
    let subscriber: any = null;
    try {
      subscriber = firebase
        .firestore()
        .collection('messages-notification')
        .doc('1')
        .collection('newest-message')
        .orderBy('createdAt', 'desc')
        .onSnapshot((querySnapshot) => {
          const messagesRealtime: any = [];
          let seen = 0;
          querySnapshot.forEach((doc) => {
            if (doc.exists) {
              // eslint-disable-next-line
              const id = doc.id;
              const data: any = { ...doc.data(), id };
              if (!data.seen) seen += 1;
              messagesRealtime.push(data);
            }
          });
          if (messagesRealtime.length > 0) {
            console.log(messagesRealtime.length, firstRef.current);
            if (!firstRef.current) {
              console.log(messagesRealtime.length, firstRef.current, messagesRealtime[0]);
              handleClickMessage(messagesRealtime[0]);
              firstRef.current = true;
            }
            setMessages({
              alert: seen,
              messages: messagesRealtime
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  useEffect(() => {
    if (isMobile) {
      return setOpenSidebar(false);
    }
    return setOpenSidebar(true);
  }, [isMobile]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (!openSidebar) {
      return setSearchFocused(false);
    }
  }, [openSidebar]);

  const handleClickAwaySearch = () => {
    setSearchFocused(false);
  };

  // Call firebase đổi seen thành true
  /**
   * hierarchy:
   * messages-notification => currentUserID => newest-messages => otherUserID
   * @param {id} otherUserID
   */
  const handleClickMessage = (account: any) => {
    setMessages({
      ...messages,
      selectedID: account.userIdSent
    });
    updateSeenMessageField('1', account.userIdSent);
    handleSetSelectedChatId(account);
  };

  const handleChangeSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const { value } = event.target;
      // setSearchQuery(value);
      if (value) {
        const response = await axios.get('/api/chat/search', {
          params: { query: value }
        });
        setSearchResults(response.data.results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
  };

  const handleSearchSelect = (username: string) => {
    setSearchFocused(false);
    setSearchQuery('');
    navigate(`${PATH_DASHBOARD.chat.root}/${username}`);
  };

  const handleSelectContact = (result: Contact) => {
    if (handleSearchSelect) {
      handleSearchSelect(result.username);
    }
  };

  return (
    <RootStyle sx={{ ...(!openSidebar && { width: 96 }) }}>
      <Box sx={{ py: 2, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {openSidebar && (
            <>
              <ChatAccount />
              <Box sx={{ flexGrow: 1 }} />
            </>
          )}

          <MIconButton onClick={() => setOpenSidebar(!openSidebar)}>
            <Icon
              width={20}
              height={20}
              icon={openSidebar ? arrowIosBackFill : arrowIosForwardFill}
            />
          </MIconButton>
        </Box>

        {/* {openSidebar && (
          <ChatContactSearch
            query={searchQuery}
            onFocus={handleSearchFocus}
            onChange={handleChangeSearch}
            onClickAway={handleClickAwaySearch}
          />
        )} */}
      </Box>

      <Scrollbar>
        {/* {!displayResults ? (
          <ChatConversationList
            onSelectMessage={handleClickMessage}
            conversations={messages}
            isOpenSidebar={openSidebar}
            activeConversationId={messages.selectedID}
            sx={{ ...(isSearchFocused && { display: 'none' }) }}
          />
        ) : (
          <ChatSearchResults
            query={searchQuery}
            results={searchResults}
            onSelectContact={handleSelectContact}
          />
        )} */}

        <ChatConversationList
          onSelectMessage={handleClickMessage}
          conversations={messages.messages}
          isOpenSidebar={openSidebar}
          activeConversationId={messages.selectedID}
          sx={{ ...(isSearchFocused && { display: 'none' }) }}
        />
      </Scrollbar>
    </RootStyle>
  );
}

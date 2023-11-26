import { useEffect, useState } from 'react';
// material
import { Card, Container } from '@material-ui/core';
// redux
import { useDispatch } from '../../redux/store';
import { getConversations, getContacts } from '../../redux/slices/chat';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { ChatSidebar, ChatWindow } from '../../components/_dashboard/support';

// ----------------------------------------------------------------------

export default function Chat() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const [selectedChat, setSelectedChat] = useState(null);

  // useEffect(() => {
  //   dispatch(getConversations());
  //   dispatch(getContacts());
  // }, [dispatch]);

  const handleSetSelectedChatId = (account: any) => {
    setSelectedChat(account);
  };

  return (
    <Page title="Chat | Minh Phát">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Chat"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Chat' }]}
        />
        <Card sx={{ height: '72vh', display: 'flex' }}>
          <ChatSidebar handleSetSelectedChatId={handleSetSelectedChatId} />
          {selectedChat && <ChatWindow selectedChat={selectedChat} />}
        </Card>
      </Container>
    </Page>
  );
}

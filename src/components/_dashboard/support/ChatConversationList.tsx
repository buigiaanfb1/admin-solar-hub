// material
import { List, ListProps } from '@material-ui/core';
// @types
//
import ChatConversationItem from './ChatConversationItem';

// ----------------------------------------------------------------------

interface ChatConversationListProps extends ListProps {
  conversations: any[];
  isOpenSidebar: boolean;
  activeConversationId: string | null;
  onSelectMessage: (accountId: string) => void;
}

export default function ChatConversationList({
  conversations,
  isOpenSidebar,
  activeConversationId,
  onSelectMessage,
  ...other
}: ChatConversationListProps) {
  console.log(conversations);
  const handleSelectConversation = (account: any) => {
    onSelectMessage(account);
  };

  return (
    <List disablePadding {...other}>
      {conversations?.length > 0 &&
        conversations.map((conversation, index) => (
          <ChatConversationItem
            key={index}
            isOpenSidebar={isOpenSidebar}
            conversation={conversation}
            isSelected={activeConversationId === conversation.userIdSent}
            onSelectConversation={handleSelectConversation}
          />
        ))}
    </List>
  );
}

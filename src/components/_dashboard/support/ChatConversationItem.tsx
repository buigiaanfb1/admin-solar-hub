import { last } from 'lodash';
import { formatDistanceToNowStrict } from 'date-fns';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Avatar, ListItemButton, ListItemText, ListItemAvatar } from '@material-ui/core';
// @types
import { formatTime } from 'utils/formatTime';

import { Conversation } from '../../../@types/chat';
//
import BadgeStatus from '../../BadgeStatus';

// ----------------------------------------------------------------------

const AVATAR_SIZE = 48;
const AVATAR_SIZE_GROUP = 32;

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  transition: theme.transitions.create('all')
}));

const AvatarWrapperStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  '& .MuiAvatar-img': { borderRadius: '50%' },
  '& .MuiAvatar-root': { width: '100%', height: '100%' }
}));

// ----------------------------------------------------------------------

type ChatConversationItemProps = {
  isSelected: boolean;
  conversation: any;
  isOpenSidebar: boolean;
  onSelectConversation: (userId: string) => void;
};

export default function ChatConversationItem({
  isSelected,
  conversation,
  onSelectConversation,
  isOpenSidebar
}: ChatConversationItemProps) {
  const isUnread = !conversation.seen;

  return (
    <RootStyle
      disableGutters
      onClick={() => onSelectConversation(conversation)}
      sx={{
        ...(isSelected && { bgcolor: 'action.selected' })
      }}
    >
      <ListItemAvatar>
        <Box>
          <AvatarWrapperStyle className="avatarWrapper" key={conversation.userIDSent}>
            <Avatar alt={conversation.username} src={conversation.username} />
          </AvatarWrapperStyle>
        </Box>
      </ListItemAvatar>

      {isOpenSidebar && (
        <>
          <ListItemText
            primary={conversation.username}
            primaryTypographyProps={{
              noWrap: true,
              variant: 'subtitle2'
            }}
            secondary={conversation.content}
            secondaryTypographyProps={{
              noWrap: true,
              variant: isUnread ? 'subtitle2' : 'body2',
              color: isUnread ? 'textPrimary' : 'textSecondary'
            }}
          />
          <Box
            sx={{
              ml: 2,
              height: 44,
              display: 'flex',
              alignItems: 'flex-end',
              flexDirection: 'column'
            }}
          >
            <Box
              sx={{
                mb: 1.25,
                fontSize: 12,
                lineHeight: '22px',
                whiteSpace: 'nowrap',
                color: 'text.disabled'
              }}
            >
              {formatTime(conversation.createdAt)}
            </Box>
            {isUnread && <BadgeStatus status="unread" size="small" />}
          </Box>
        </>
      )}
    </RootStyle>
  );
}

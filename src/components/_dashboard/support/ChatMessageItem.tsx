// material
import { styled } from '@material-ui/core/styles';
import { Avatar, Box, Typography } from '@material-ui/core';
import { formatTime } from 'utils/formatTime';

// @types

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary
}));

const MessageImgStyle = styled('img')(({ theme }) => ({
  height: 200,
  minWidth: 296,
  width: '100%',
  cursor: 'pointer',
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius
}));

// ----------------------------------------------------------------------

type ChatMessageItemProps = {
  message: any;
  // onOpenLightbox: (value: string) => void;
};

export default function ChatMessageItem({
  message
}: // onOpenLightbox
ChatMessageItemProps) {
  const senderDetails =
    message.userIdSent === '1'
      ? { type: 'me' }
      : { avatar: message.username, name: message.username };

  const isMe = senderDetails.type === 'me';
  const firstName = senderDetails.name && senderDetails.name.split(' ')[0];

  return (
    <RootStyle>
      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto'
          })
        }}
      >
        {senderDetails.type !== 'me' && (
          <Avatar
            alt={senderDetails.name}
            src={senderDetails.avatar}
            sx={{ width: 32, height: 32 }}
          />
        )}

        <Box sx={{ ml: 2 }}>
          <InfoStyle noWrap variant="caption" sx={{ ...(isMe && { justifyContent: 'flex-end' }) }}>
            {!isMe && `${firstName},`}&nbsp;
            {formatTime(message.createdAt)}
          </InfoStyle>

          <ContentStyle
            sx={{
              ...(isMe && {
                color: 'grey.800',
                bgcolor: 'primary.lighter'
              })
            }}
          >
            <Typography variant="body2">{message.content}</Typography>
          </ContentStyle>
        </Box>
      </Box>
    </RootStyle>
  );
}

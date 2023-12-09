// material
import { styled } from '@material-ui/core/styles';
import { Box, Avatar, Typography } from '@material-ui/core';
// utils
import { formatTime } from '../../../utils/formatTime';
// @types
//

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  flexShrink: 0,
  minHeight: 92,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 3)
}));

// ----------------------------------------------------------------------

function OneAvatar({ participant }: any) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar src={participant.username} alt={participant.username} />
      </Box>
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{participant.username}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {formatTime(participant.createdAt || '')}
        </Typography>
      </Box>
    </Box>
  );
}

export default function ChatHeaderDetail({ participant }: { participant: any }) {
  console.log(participant);
  return (
    <RootStyle>
      <OneAvatar participant={participant} />

      <Box sx={{ flexGrow: 1 }} />
      {/* <MIconButton>
        <Icon icon={phoneFill} width={20} height={20} />
      </MIconButton>
      <MIconButton>
        <Icon icon={videoFill} width={20} height={20} />
      </MIconButton>
      <MIconButton>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </MIconButton> */}
    </RootStyle>
  );
}

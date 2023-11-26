import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import videoFill from '@iconify/icons-eva/video-fill';
import phoneFill from '@iconify/icons-eva/phone-fill';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Link, Avatar, Typography, AvatarGroup } from '@material-ui/core';
// utils
import { formatTime, fToNow } from '../../../utils/formatTime';
// @types
import { Participant } from '../../../@types/chat';
//
import { MIconButton } from '../../@material-extend';
import BadgeStatus from '../../BadgeStatus';

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

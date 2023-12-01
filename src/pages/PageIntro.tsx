import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Button, Typography, Container } from '@material-ui/core';
// components
import useAuth from 'hooks/useAuth';

import { MotionContainer, varBounceIn } from '../components/animate';
import Page from '../components/Page';
import { MotivationIllustration } from '../assets';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center'
}));

// ----------------------------------------------------------------------

export default function PageIntro() {
  const { user } = useAuth();
  return (
    <RootStyle title="Bảng điều khiển | Minh Phát">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Chào {user?.userInfo.lastname} {user?.userInfo.firstname},
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
              Hãy chọn tuỳ chọn những quản lí ở thanh bên trái để thống kế số liệu, doanh số của cửa
              hàng.
            </Typography>

            <motion.div variants={varBounceIn}>
              <MotivationIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
            </motion.div>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}

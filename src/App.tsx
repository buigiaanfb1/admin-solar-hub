// routes
import Router from './routes';
// theme
// import ThemeConfig from './theme';
// hooks
import useAuth from './hooks/useAuth';
// components
import Settings from './components/settings';
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import GoogleAnalytics from './components/GoogleAnalytics';
import ThemePrimaryColor from './components/ThemePrimaryColor';
import ThemeLocalization from './components/ThemeLocalization';

// ----------------------------------------------------------------------

export default function App() {
  const { isInitialized } = useAuth();

  return (
    <ThemePrimaryColor>
      <ThemeLocalization>
        <RtlLayout>
          <Settings />
          <ScrollToTop />
          <GoogleAnalytics />
          {isInitialized ? <Router /> : <LoadingScreen />}
        </RtlLayout>
      </ThemeLocalization>
    </ThemePrimaryColor>
  );
}

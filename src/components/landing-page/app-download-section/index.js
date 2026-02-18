import {
  alpha,
  Box,
  Button,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import CustomContainer from "../../container";
import LargerScreen from "./LargerScreen";
import SmallerScreen from "./SmallerScreen";

const Wrapper = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(153, 245, 202, 0.15) 40%, ${alpha(
    theme.palette.primary.main,
    0.12
  )} 70%, rgba(255, 255, 255, 0.3) 100%)`,
  width: "100%",
  position: "relative",
  borderRadius: "24px",
  overflow: "hidden",
  padding: "8px",
}));
export const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: "14px",
  gap: "10px",
  padding: "14px 20px",
  fontSize: "15px",
  fontWeight: 600,
  maxWidth: "400px",
  letterSpacing: "0.01em",
  background: `linear-gradient(135deg, ${theme.palette.primary.customType1} 0%, ${theme.palette.primary.main} 60%)`,
  color: theme.palette.whiteContainer.main,
  boxShadow: "0px 4px 20px rgba(3, 157, 85, 0.25)",
  transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0px 8px 32px rgba(3, 157, 85, 0.35)",
  },
  [theme.breakpoints.down("md")]: {
    padding: "12px 15px",
    fontSize: "14px",
    gap: "8px",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "10px 14px",
    fontSize: "12px",
    gap: "5px",
    borderRadius: "12px",
  },
}));

const AppDownloadSection = ({ configData, landingPageData }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const primaryColor = theme.palette.primary.dark;
  const { t } = useTranslation();
  const goToApp = (s) => {
    window.open(s);
  };
  return (
    <CustomContainer>
      <Wrapper>
        <CustomStackFullWidth>
          {isSmall ? (
            <SmallerScreen
              theme={theme}
              landingPageData={landingPageData}
              goToApp={goToApp}
              t={t}
            />
          ) : (
            <LargerScreen
              landingPageData={landingPageData}
              goToApp={goToApp}
              t={t}
            />
          )}
        </CustomStackFullWidth>
      </Wrapper>
    </CustomContainer>
  );
};

AppDownloadSection.propTypes = {};

export default AppDownloadSection;

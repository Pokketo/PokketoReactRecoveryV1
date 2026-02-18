import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import {
  alpha,
  Button,
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { IsSmallScreen } from "utils/CommonValues";
import CustomContainer from "../container";
import DollarSignHighlighter from "../DollarSignHighlighter";
import DeliveryImage from "./svg-components/deliveryImage";

export const CustomButton = styled(Button)(({ theme, boxshadow }) => ({
  backgroundColor: theme.palette.primary.main,
  height: "48px",
  borderRadius: "12px",
  boxShadow: "0px 4px 24px rgba(3, 157, 85, 0.2)",
  color: theme.palette.whiteContainer.main,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 600,
  letterSpacing: "0.01em",
  padding: "0 28px",
  transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
  "&:hover": {
    backgroundColor: theme.palette.primary.deep,
    transform: "translateY(-2px)",
    boxShadow: "0px 8px 32px rgba(3, 157, 85, 0.3)",
  },
  [theme.breakpoints.down("sm")]: {
    height: "40px",
    borderRadius: "10px",
    padding: "0 20px",
  },
}));
const ComponentOne = ({ landingPageData, configData, handleOrderNow }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const handleButtonClick = () => {
    router.push(landingPageData?.company_button_url);
  };
  return (
    <>
      <CustomContainer>
        <CustomBoxFullWidth
          className="premium-fade-in"
          sx={{
            position: "relative",
            marginTop: { xs: "2rem", md: "3rem" },
            marginBottom: { xs: "1rem", md: "1.5rem" },
          }}
        >
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            flexDirection={{ xs: "column-reverse", md: "row" }}
          >
            <Grid item xs={12} sm={12} md={6}>
              <CustomStackFullWidth
                spacing={isSmall ? 2 : 3}
                paddingBottom={{ xs: "1rem", sm: "2rem", md: "0px" }}
              >
                <CustomStackFullWidth spacing={0.5}>
                  <Typography
                    variant={isSmall ? "h6" : "h4"}
                    color="primary.main"
                    component="h2"
                    sx={{ letterSpacing: "-0.01em" }}
                  >
                    <DollarSignHighlighter
                      theme={theme}
                      text={landingPageData?.company_title}
                    />
                  </Typography>
                  <Typography
                    variant={isSmall ? "h6" : "h4"}
                    sx={{ opacity: ".85", letterSpacing: "-0.01em" }}
                    component="h3"
                  >
                    <DollarSignHighlighter
                      theme={theme}
                      text={landingPageData?.company_sub_title}
                    />
                  </Typography>
                </CustomStackFullWidth>
                <Typography
                  fontSize={{ xs: "13px", md: "17px" }}
                  fontWeight="400"
                  lineHeight={1.7}
                  sx={{
                    color: (theme) => alpha(theme.palette.neutral[500], 0.75),
                  }}
                >
                  <DollarSignHighlighter
                    theme={theme}
                    text={landingPageData?.company_description}
                  />
                </Typography>
                {landingPageData?.company_button_name && (
                  <CustomStackFullWidth
                    alignItems="flex-start"
                    justifyContent="flex-start"
                  >
                    <CustomButton onClick={handleButtonClick}>
                      <Typography
                        variant={IsSmallScreen() ? "body2" : "body1"}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >
                        {" "}
                        {landingPageData?.company_button_name}
                        {/*<DollarSignHighlighter theme={theme} text={landingPageData?.company_button_name} />*/}
                        <ArrowRightAltIcon />
                      </Typography>
                    </CustomButton>
                  </CustomStackFullWidth>
                )}
              </CustomStackFullWidth>
            </Grid>
            <Grid item xs={12} sm={12} md={6} align="right">
              <DeliveryImage />
            </Grid>
          </Grid>
        </CustomBoxFullWidth>
      </CustomContainer>
    </>
  );
};

ComponentOne.propTypes = {};

export default ComponentOne;

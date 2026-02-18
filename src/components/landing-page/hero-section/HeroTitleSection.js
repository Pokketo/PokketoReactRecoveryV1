import { useEffect, useState } from "react";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";

import {
  alpha,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { getCurrentModuleType } from "../../../helper-functions/getCurrentModuleType";
import { getLanguage } from "../../../helper-functions/getLanguage";
import DollarSignHighlighter from "../../DollarSignHighlighter";
import DownArrow from "../assets/DownArrow";
import DownArrowRTL from "../assets/DownArrowRTL";
import HeroLocationForm from "./HeroLocationForm";
import ModuleSelectionRaw from "./module-selection/ModuleSelectionRaw";

const HeroTitleSection = ({ configData, landingPageData, handleOrderNow }) => {
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentLocation, setCurrentLocation] = useState(null);
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentLocation(window.localStorage.getItem("location"));
    }
  }, []);
  const getSearchOrModulesBySelectedModules = () => {
    if (currentLocation) {
      return <ModuleSelectionRaw />;
    } else {
      return (
        <CustomStackFullWidth mt="15px">
          <HeroLocationForm />
        </CustomStackFullWidth>
      );
    }
  };

  return (
    <CustomStackFullWidth>
      <CustomStackFullWidth spacing={0.5}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          spacing={0.5}
          flexWrap="wrap"
        >
          <Typography
            sx={{
              color: (theme) => theme.palette.primary.main,
              fontSize: isXSmall ? "22px" : "56px",
              lineHeight: isXSmall ? "28px" : "64px",
              fontWeight: 700,
              letterSpacing: isXSmall ? "-0.01em" : "-0.025em",
            }}
            component="h1"
          >
            <DollarSignHighlighter
              theme={theme}
              text={landingPageData?.header_title}
            />
          </Typography>
        </Stack>
        <Typography
          color={alpha(theme.palette.neutral[700], 0.75)}
          fontSize={isXSmall ? "15px" : "32px"}
          lineHeight={isXSmall ? "22px" : "44px"}
          fontWeight="400"
          letterSpacing="-0.01em"
          component="h2"
        >
          <DollarSignHighlighter
            theme={theme}
            text={landingPageData?.header_sub_title}
          />
        </Typography>
      </CustomStackFullWidth>
      <CustomStackFullWidth
        flexDirection="row"
        spacing={2}
        justifyContent="space-between"
        mt="18px"
        sx={{ position: "relative" }}
      >
        <Typography
          sx={{
            fontSize: { xs: "12px", md: "18px" },
            color: (theme) => alpha(theme.palette.neutral[500], 0.6),
            lineHeight: 1.6,
          }}
          fontWeight="400"
        >
          <DollarSignHighlighter
            theme={theme}
            text={landingPageData?.header_tag_line}
          />
        </Typography>
        {!getCurrentModuleType() && !isXSmall && (
          <Stack sx={{}}>
            {lanDirection === "rtl" ? <DownArrowRTL /> : <DownArrow />}
          </Stack>
        )}
      </CustomStackFullWidth>
      {!isXSmall && getSearchOrModulesBySelectedModules()}
    </CustomStackFullWidth>
  );
};

export default HeroTitleSection;

import { Box } from "@mui/system";
import React from "react";
import CustomImageContainer from "../CustomImageContainer";
import CustomContainer from "../container";

const DiscountBanner = ({ bannerImage, isSmall }) => {
  return (
    <>
      {isSmall ? (
        <CustomContainer>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              borderRadius: "16px",
              marginBottom: "24px",
              marginTop: "24px",
              overflow: "hidden",
              boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.06)",
              transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <CustomImageContainer
              src={bannerImage}
              alt="banner"
              height="100%"
              width="100%"
              obejctfit="contained"
              borderRadius="16px"
            />
          </Box>
        </CustomContainer>
      ) : (
        <CustomContainer>
          <Box
            sx={{
              width: "100%",
              borderRadius: "20px",
              marginBottom: "48px",
              overflow: "hidden",
              boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.06)",
              transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0px 16px 48px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <CustomImageContainer
              src={bannerImage}
              alt="banner"
              height="100%"
              width="100%"
              obejctfit="contained"
            />
          </Box>
        </CustomContainer>
      )}
    </>
  );
};

export default DiscountBanner;

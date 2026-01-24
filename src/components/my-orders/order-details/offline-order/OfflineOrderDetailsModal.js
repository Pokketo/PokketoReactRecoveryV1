import React from "react";
import {
  Button,
  Grid,
  Skeleton,
  Stack,
  Typography,
  alpha,
  useTheme,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { t } from "i18next";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

import { CustomStackFullWidth } from "../../../../styled-components/CustomStyles.style";
import DotSpin from "../../../DotSpin";
import {
  ItemWrapper,
  ModalCustomTypography,
} from "../../../order-details-modal/OrderDetailsModal.style";

const OfflineOrderDetailsModal = ({
  trackData,
  handleOfflineClose,
  trackDataIsLoading,
  trackDataIsFetching,
  page,
}) => {
  const theme = useTheme();
  const router = useRouter();

  const handleCopyId = () => {
    if (trackData?.id) {
      navigator.clipboard.writeText(trackData?.id);
      toast.success(t("Copied!"));
    }
  };

  const handleClickToRoute = (href) => {
    handleOfflineClose();
    router.push(href, undefined, { shallow: true });
  };

  return (
    <CustomStackFullWidth
      sx={{
        position: "relative",
        p: 0,
        overflow: "hidden",
        borderRadius: "16px",
      }}
    >
      <IconButton
        onClick={handleOfflineClose}
        sx={{
          zIndex: "99",
          position: "absolute",
          top: 12,
          right: 12,
          color: theme.palette.neutral[500],
          backgroundColor: alpha(theme.palette.neutral[200], 0.5),
          "&:hover": {
            backgroundColor: alpha(theme.palette.neutral[200], 0.8),
          },
        }}
      >
        <CloseIcon sx={{ fontSize: "20px" }} />
      </IconButton>

      <CustomStackFullWidth
        padding="40px 24px 30px"
        alignItems="center"
        gap="16px"
      >
        <CheckCircleIcon
          sx={{
            fontSize: "72px",
            color: theme.palette.primary.main,
            filter: `drop-shadow(0px 4px 10px ${alpha(
              theme.palette.primary.main,
              0.3
            )})`,
          }}
        />
        <Typography
          fontSize="22px"
          fontWeight="700"
          textAlign="center"
          color={theme.palette.neutral[1000]}
          mt={1}
        >
          {t("Order placed successfully.")}
        </Typography>

        {trackDataIsLoading ? (
            <DotSpin />
        ) : (
            <Typography
              fontSize="14px"
              color={theme.palette.neutral[500]}
              textAlign="center"
              lineHeight="1.6"
              maxWidth="90%"
            >
              {t("We will begin processing your order shortly.")} {t("Your Order ID is")}{" "}
              <Typography component="span" fontWeight="700" color="text.primary">
                {trackData?.id}
              </Typography>
              , {t("placed using the phone number")}{" "}
              <Typography component="span" fontWeight="700" color="text.primary">
                  {trackData?.delivery_address?.contact_person_number || trackData?.customer?.phone || ""}
              </Typography>
              .
            </Typography>
        )}
        
        <Typography
            fontSize="12px"
            color={theme.palette.neutral[400]}
            textAlign="center"
            sx={{ mt: -1 }}
        >
            {t("Please keep this Order ID for future tracking.")} <br/>
            {t("We’ve also emailed the order details.")}
        </Typography>
        
        {/* Copy Order ID Box */}
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            sx={{
            border: `1px dashed ${theme.palette.neutral[400]}`, // Dashed border
            borderRadius: "12px",
            padding: "12px 16px",
            backgroundColor: theme.palette.neutral[100],
            mt: 1,
            }}
        >
            <Typography
            fontSize="15px"
            fontWeight="600"
            color={theme.palette.neutral[700]}
            >
            {t("Order ID")}#{trackData?.id}
            </Typography>
            <Button
            size="small"
            onClick={handleCopyId}
            startIcon={<ContentCopyIcon fontSize="small" />}
            sx={{
                textTransform: "none",
                backgroundColor: theme.palette.primary.main, // Green copy button
                color: "#fff",
                borderRadius: "20px",
                padding: "4px 16px",
                fontSize: "12px",
                boxShadow: "none",
                "&:hover": {
                backgroundColor: theme.palette.primary.dark,
                boxShadow: "none",
                },
            }}
            >
            {t("Copy")}
            </Button>
        </Stack>

         <Button
            onClick={() => handleClickToRoute("/track-order")}
            variant="contained"
            fullWidth
            sx={{
            borderRadius: "30px", // Pill style
            padding: "12px",
            fontSize: "16px",
            fontWeight: "600",
            textTransform: "none",
            boxShadow: `0px 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
            mt: 1,
            "&:hover": {
                boxShadow: `0px 6px 15px ${alpha(theme.palette.primary.main, 0.5)}`,
            }
            }}
        >
            {t("Track Order")}
        </Button>
      </CustomStackFullWidth>
      
      {trackData?.offline_payment && (
        <CustomStackFullWidth
            padding="20px 24px"
            backgroundColor={alpha(theme.palette.neutral[200], 0.3)}
        >
           <Typography variant="subtitle2" fontWeight="600" mb={1}>{t("Payment Info")}</Typography>
            {/* Minimal Payment Info Display to Not Clutter */}
            <Typography fontSize="12px" color="text.secondary">
                {t("Status")}: {trackData?.offline_payment?.data?.status}
            </Typography>
             {trackData?.offline_payment?.data?.customer_note && (
                <Typography fontSize="12px" color="text.secondary">
                {t("Note")}: {trackData?.offline_payment?.data?.customer_note}
                </Typography>
             )}
        </CustomStackFullWidth>
      )}
    </CustomStackFullWidth>
  );
};

export default OfflineOrderDetailsModal;

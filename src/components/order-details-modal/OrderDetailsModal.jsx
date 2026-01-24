import React, { useEffect, useState } from "react";
import CustomModal from "../modal";
import {
  alpha,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Zoom,
  Box,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useDispatch, useSelector } from "react-redux";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { setOrderDetailsModalOpen } from "../../redux/slices/utils";
import { getGuestId } from "../../helper-functions/getToken";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import jwt from "base-64";
import CheckoutFailed from "../checkout/CheckoutFailed";
import toast from "react-hot-toast";

const OrderDetailsModal = ({ orderDetailsModalOpen }) => {
  const dispatch = useDispatch();
  const { configData } = useSelector((state) => state.configData);
  const theme = useTheme();
  const guestId = getGuestId();
  const router = useRouter();
  const { status, totalAmount, order_id, token, flag } = router.query;
  const { t } = useTranslation();
  const { total } = router.query;
  const [attributeId, setAttributeId] = useState("");
  const { guestUserOrderId, guestUserInfo } = useSelector(
    (state) => state.guestUserInfo
  );
  const { orderInformation } = useSelector((state) => state.utilsData);

  const handleOrderDetailsClose = () => {
    dispatch(setOrderDetailsModalOpen(false));
  };

  const handleClickToRoute = (href) => {
    dispatch(setOrderDetailsModalOpen(false));
    router.push(href, undefined, { shallow: true });
  };

  const handleCopyId = () => {
    if (guestUserOrderId) {
      navigator.clipboard.writeText(guestUserOrderId);
      toast.success(t("Copied!"));
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwt.decode(token);
        if (typeof decodedToken === "string") {
          const keyValuePairs = decodedToken.split("&&");
          for (const pair of keyValuePairs) {
            const [key, value] = pair.split("=");
            if (key === "attribute_id") {
              setAttributeId(value);
              return;
            }
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  return (
    <CustomModal
      openModal={orderDetailsModalOpen}
      handleClose={() => handleOrderDetailsClose()}
      maxWidth="420px"
      TransitionComponent={Zoom}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          width: "100%",
          maxWidth: "420px",
          overflow: "visible", // Allow close button potential overlap if needed, though we position inside
          boxShadow: theme.shadows[10],
          m: 1, // Margin for mobile
        },
      }}
    >
      <CustomStackFullWidth
        sx={{
          position: "relative",
          p: 0,
          overflow: "hidden",
          borderRadius: "16px",
        }}
      >
        <IconButton
          onClick={() => handleOrderDetailsClose()}
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

        {(flag && flag === "fail") || flag === "cancel" ? (
          <CheckoutFailed
            id={order_id ? order_id : attributeId}
            configData={configData}
            handleOrderDetailsClose={handleOrderDetailsClose}
          />
        ) : (
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

            <Typography
              fontSize="14px"
              color={theme.palette.neutral[500]}
              textAlign="center"
              lineHeight="1.6"
              maxWidth="90%"
            >
              {t("We will begin processing your order shortly.")} {t("Your Order ID is")}{" "}
              <Typography component="span" fontWeight="700" color="text.primary">
                {guestUserOrderId}
              </Typography>
              , {t("placed using the phone number")}{" "}
              <Typography component="span" fontWeight="700" color="text.primary">
                {guestUserInfo?.contact_person_number || ""}
              </Typography>
              .
            </Typography>

            {/* Helper Text */}
            <Typography
              fontSize="12px"
              color={theme.palette.neutral[400]}
              textAlign="center"
              sx={{ mt: -1 }}
            >
              {t("Please keep this Order ID for future tracking.")} <br />
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
                {t("Order ID")}#{guestUserOrderId}
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
        )}
      </CustomStackFullWidth>
    </CustomModal>
  );
};

export default OrderDetailsModal;

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  Box,
  Stack,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";

const AddressConfirmationPopup = ({ open, handleClose, onConfirm, address }) => {
  const { t } = useTranslation();

  if (!address) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="address-confirmation-title"
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          padding: "10px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Box position="absolute" top={8} right={8}>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ paddingTop: "20px" }}>
        <Stack spacing={2}>
          <Typography
            variant="h6"
            component="h2"
            align="center"
            fontWeight="bold"
            gutterBottom
          >
            {t("Review Delivery Address")}
          </Typography>

          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.neutral[200],
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <CustomStackFullWidth spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                 <Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight="bold">
                    {t(address?.address_type || "Address")}
                  </Typography>
              </Stack>
           
              <Divider />

              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  {address?.contact_person_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {address?.contact_person_number}
                </Typography>
              </Box>

              <Box>
                {(address?.house || address?.floor || address?.road) && (
                   <Typography variant="body2" color="text.secondary" gutterBottom>
                     {[
                       address?.house && `${t("House")}: ${address.house}`,
                       address?.floor && `${t("Floor")}: ${address.floor}`,
                       address?.road && `${t("Road")}: ${address.road}`
                     ].filter(Boolean).join(", ")}
                   </Typography>
                )}
                
                <Typography variant="body1" fontWeight="500">
                   {address?.address}
                </Typography>

                {(address?.city || address?.pincode) && (
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {[
                       address?.city,
                       address?.pincode
                     ].filter(Boolean).join(" - ")}
                  </Typography>
                )}
              </Box>
            </CustomStackFullWidth>
          </Box>
           
           <Typography variant="body2" color="text.secondary" align="center">
              {t("Please confirm this is the correct address for your order.")}
           </Typography>

        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", paddingBottom: "20px" }}>
        <Button
          variant="contained"
          onClick={onConfirm}
          fullWidth
          size="large"
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold",
            padding: "12px",
          }}
        >
          {t("OK, Place Order")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddressConfirmationPopup;

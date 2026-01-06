import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import AddNewAddressButton from "./add-new-address/AddNewAddressButton";
import { useDispatch } from "react-redux";
import { setOpenAddressModal } from "../../redux/slices/addAddress";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { t } from "i18next";

const AddressSelectionSection = ({
  addresses,
  selectedAddress,
  setSelectedAddress,
  handleEditAddress,
  handleDeleteAddress,
  configData,
  refetch,
}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const handleAddressChange = (event) => {
    const selectedId = event.target.value;
    const address = addresses.find((addr) => addr.id === Number(selectedId));
    if (address) {
      setSelectedAddress(address);
    }
  };

  const handleAddressModal = () => {
    dispatch(setOpenAddressModal(true));
  };

  return (
    <CustomStackFullWidth spacing={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          // Responsive styles for the Add Address button
          "& .MuiButton-root": {
            height: { xs: "auto", md: "40px" }, // Allow height to adjust
            minHeight: { xs: "32px", md: "40px" },
            padding: { xs: "4px 8px", md: "6px 16px" }, // Optimized padding
            minWidth: "fit-content", // Allow button to expand to fit text
            "& .MuiTypography-root": {
              width: "auto !important", // Override fixed width from child component
              fontSize: { xs: "11px", md: "0.875rem" }, 
              whiteSpace: "nowrap",
              lineHeight: 1.2,
            }
          },
          "& .MuiSvgIcon-root": {
             width: { xs: "16px", md: "20px" }, 
             height: { xs: "16px", md: "20px" },
          }
        }}
      >
        <Typography variant="h6" fontWeight="600">
          {t("Select Delivery Address")}
        </Typography>
        <AddNewAddressButton
          handleAddressModal={handleAddressModal}
          fromModal="true"
        />
      </Box>

      {addresses && addresses.length > 0 ? (
        <RadioGroup
          value={selectedAddress?.id ? selectedAddress.id.toString() : ""}
          onChange={handleAddressChange}
        >
          {/* Scrollable container: scrolling enabled only if addresses > 4 */}
          <Box
            sx={{
              maxHeight: addresses.length > 4 ? "320px" : "none",
              overflowY: addresses.length > 4 ? "auto" : "visible",
              paddingRight: addresses.length > 4 ? "5px" : "0px", // Avoid scrollbar overlap
            }}
          >
            <Grid container spacing={2}>
            {addresses.map((address) => (
              <Grid item xs={12} md={6} key={address.id}>
                <Paper
                  elevation={selectedAddress?.id === address.id ? 3 : 1}
                  sx={{
                    p: 2,
                    border:
                      selectedAddress?.id === address.id
                        ? `1px solid ${theme.palette.primary.main}`
                        : "1px solid #e0e0e0",
                    borderRadius: "8px",
                    position: "relative",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <FormControlLabel
                    value={address.id.toString()}
                    control={<Radio />}
                    label={
                      <Box sx={{ ml: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight="600"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {address.address_type}
                          </Typography>
                          {address.default === 1 && (
                            <Box
                              sx={{
                                ml: 1,
                                px: 1,
                                py: 0.2,
                                bgcolor: "primary.light",
                                borderRadius: "4px",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="primary.main"
                                fontWeight="500"
                              >
                                {t("Default")}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <Typography variant="body2" gutterBottom>
                          {address.contact_person_name}{" "}
                          {address.last_name && address.last_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {address.house && `${address.house}, `}
                          {address.floor && `${address.floor}, `}
                          {address.road && `${address.road}, `}
                          {address.address_2 && `${address.address_2}, `}
                          {address.city && `${address.city}, `}
                          {address.state && `${address.state}, `}
                          {address.country && `${address.country} `}
                          {address.pincode && `- ${address.pincode}`}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {t("Phone")}: {address.contact_person_number}
                        </Typography>
                      </Box>
                    }
                    sx={{ alignItems: "flex-start", width: "100%" }}
                  />
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ minWidth: 0, p: "4px" }}
                      onClick={() => handleEditAddress(address)}
                    >
                      <EditIcon fontSize="small" />
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      sx={{ minWidth: 0, p: "4px" }}
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            ))}
            </Grid>
          </Box>
        </RadioGroup>
      ) : (
        <Paper
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
          }}
        >
          <LocationOnIcon
            sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            {t("No Addresses Found")}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 2 }}
          >
            {t("Please add a delivery address to proceed with your order")}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddressModal}
          >
            {t("Add New Address")}
          </Button>
        </Paper>
      )}
    </CustomStackFullWidth>
  );
};

export default AddressSelectionSection;

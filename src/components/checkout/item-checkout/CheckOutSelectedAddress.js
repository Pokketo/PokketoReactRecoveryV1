import React from "react";
import {
  CustomListItem,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import Radio from "@mui/material/Radio";
import ListItemText from "@mui/material/ListItemText";
import { IconButton, Typography } from "@mui/material";
import { setOpenAddressModal } from "redux/slices/addAddress";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete"; // Add this import
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import AddNewAddress from "../../address/add-new-address";

const CheckOutSelectedAddress = ({
  address,
  refetch,
  configData,
  editAddress,
  setEditAddress,
  handleDeleteAddress, // Add this prop
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { openAddressModal } = useSelector((state) => state.addressModel);
  
  const handleClick = () => {
    setEditAddress(address);
    dispatch(setOpenAddressModal(true));
  };
  
  // Add a function to handle address deletion
  const onDeleteClick = () => {
    if (address?.id && handleDeleteAddress) {
      handleDeleteAddress(address.id);
    }
  };
  
  return (
    <div>
      <CustomListItem
        border={`1px solid ${theme.palette.primary.main}`}
        alignItems="flex-start"
      >
        <CustomStackFullWidth direction="row" alignItems="flex-start">
          <Radio
            checked
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            sx={{ marginTop: "-4px" }}
          />
          <ListItemText
            primary={
              <Typography
                textTransform="capitalize"
                fontSize="16px"
                fontWeight="600"
              >
                {t(address?.address_type)}
              </Typography>
            }
            secondary={<>{address?.address}</>}
          />
          <Stack direction="row">
            <IconButton onClick={handleClick}>
              <CreateIcon
                sx={{
                  width: "16px",
                  height: "16px",
                  color: (theme) => theme.palette.neutral[400],
                }}
              />
            </IconButton>
            {/* Add delete button */}
            {handleDeleteAddress && (
              <IconButton onClick={onDeleteClick}>
                <DeleteIcon
                  sx={{
                    width: "16px",
                    height: "16px",
                    color: (theme) => theme.palette.error.main,
                  }}
                />
              </IconButton>
            )}
          </Stack>
        </CustomStackFullWidth>
      </CustomListItem>
      {/* Only render the AddNewAddress component when openAddressModal is true */}
      {openAddressModal && (
        <AddNewAddress
          openAddressModal={openAddressModal}
          refetch={refetch}
          t={t}
          configData={configData}
          editAddress={editAddress}
          setEditAddress={setEditAddress}
        />
      )}
    </div>
  );
};

export default CheckOutSelectedAddress;

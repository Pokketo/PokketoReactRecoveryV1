import React, { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import "simplebar-react/dist/simplebar.min.css";
import { DeliveryCaption } from "../CheckOut.style";
import useGetAddressList from "../../../api-manage/hooks/react-query/address/useGetAddressList";
import AddressSelectionList from "./AddressSelectionList";
import { IconButton, Typography, useTheme, Box } from "@mui/material";
import { Stack } from "@mui/system";
import AddNewAddress from "../../address/add-new-address";
import AdditionalAddresses from "../item-checkout/AdditionalAddresses";
import CustomModal from "../../modal";
import SaveAddressModal from "../item-checkout/SaveAddressModal";
import { initialState, reducer } from "../../address/states";
import usePostAddress from "../../../api-manage/hooks/react-query/address/usePostAddress";
import toast from "react-hot-toast";
import { onErrorResponse } from "../../../api-manage/api-error-response/ErrorResponses";
import { useDispatch, useSelector } from "react-redux";
import AddNewAddressButton from "../../address/add-new-address/AddNewAddressButton";
import { setOpenAddressModal } from "../../../redux/slices/addAddress";
import CheckOutSelectedAddress from "../item-checkout/CheckOutSelectedAddress";
import CheckoutSelectedAddressGuest from "../item-checkout/CheckoutSelectedAddressGuest";
import AddressSelectionSection from "../../address/AddressSelectionSection";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import useDeleteAddress from "../../../api-manage/hooks/react-query/address/useDeleteAddress";

const getZoneWiseAddresses = (addresses, restaurantId) => {
  const newArray = [];
  addresses?.forEach(
    (item) => item.zone_ids.includes(restaurantId) && newArray.push(item)
  );
  return newArray;
};

const DeliveryAddress = ({
  setAddress,
  address,
  renderOnNavbar,
  configData,
  storeZoneId,
  orderType,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [allAddress, setAllAddress] = useState();
  const [data, setData] = useState(null);
  const reduxDispatch = useDispatch();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const [openSaveAddress, setOpenSaveAddress] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const token = localStorage.getItem("token");

  const { mutate: deleteAddress } = useDeleteAddress();
  
  // Add a function to handle address deletion
  const handleDeleteAddress = (addressId) => {
    deleteAddress(addressId, {
      onSuccess: (response) => {
        toast.success(response?.message || t("Address deleted successfully"));
        refetch();
      },
      onError: onErrorResponse,
    });
  };
  
  const saveAddressModalClose = () => {
    setOpenSaveAddress(false);
  };
  const { openAddressModal } = useSelector((state) => state.addressModel);
  const mainAddress = {
    ...address,
  };
  const handleSuccess = (addressData) => {
    if (storeZoneId) {
      const newObj = {
        ...addressData,
        addresses: getZoneWiseAddresses(addressData?.addresses, storeZoneId),
      };

      setData(newObj);
    } else {
      setData(addressData);
    }
  };
  const { refetch, isRefetching, isLoading } = useGetAddressList(handleSuccess);

  useEffect(() => {
    refetch();
  }, []);
  useEffect(() => {
    // handleSize(data.total_size)
    data && setAllAddress([mainAddress, ...data.addresses]);
  }, [data]);

  const handleLatLng = (values) => {
    // Only set the address if it's a valid saved address with an ID
    if (values?.id) {
      if(renderOnNavbar === "true"){
        setAddress({ ...values, lat: values.latitude, lng: values.longitude });
        window.location.reload();
      } else {
        setAddress({ ...values, lat: values.latitude, lng: values.longitude });
      }
    } else if (values) {
      // If it's a valid address but not saved (no ID), still set it but show a message
      if(renderOnNavbar === "true"){
        setAddress({ ...values, lat: values.latitude, lng: values.longitude });
        window.location.reload();
      } else {
        setAddress({ ...values, lat: values.latitude, lng: values.longitude });
        toast.info(t('Consider saving this address for future use'));
      }
    } else {
      // If no address is provided, show an error
      toast.error(t('Please select a delivery address'));
    }
  };

  const showMainAddButton = token && renderOnNavbar !== "true" && orderType !== "take_away";

  const { mutate } = usePostAddress();

  const saveAddress = () => {
    let formData = {
      address: address?.address,
      address_type: address?.address_type,
      contact_person_name: `${profileInfo?.f_name} ${profileInfo.l_name}`,
      contact_person_number: profileInfo?.phone,
      latitude: address?.lat,
      longitude: address?.lng,
      additional_information: "",
      house: state?.houseNumber,
      floor: state?.floor,
      road: state?.streetNumber,
    };
    mutate(formData, {
      onSuccess: (response) => {
        toast.success(response?.message);
        refetch?.();
      },
      onError: onErrorResponse,
    });
  };
  
  const handleAddressModal = () => {
    setEditAddress(null);
    reduxDispatch(setOpenAddressModal(true));
  };
  
  const handleEditAddress = (address) => {
    setEditAddress(address);
    reduxDispatch(setOpenAddressModal(true));
  };
  
  // Component to show when no addresses are available
  const NoAddressComponent = () => (
    <CustomStackFullWidth
      spacing={3}
      alignItems="center"
      justifyContent="center"
      sx={{ py: 4 }}
    >
      <LocationOnIcon sx={{ fontSize: 60, color: "text.disabled" }} />
      <Typography variant="h6" align="center">
        {t("No delivery addresses found")}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        {t("Please add a delivery address to proceed with your order")}
      </Typography>
      <AddNewAddressButton
        handleAddressModal={handleAddressModal}
        fromModal="true"
      />
    </CustomStackFullWidth>
  );
  
  return (
    <>
    {/*Comment this button Beacuse alreadt we have Add Address Button*/}
    {/*
      <Stack
        direction="row"
        justifyContent="space-between"
        pt={{ xs: "18px", md: "0px" }}
        pb={{ xs: "8px", md: "0px" }}
      >
        {renderOnNavbar !== "true" && orderType !== "take_away" && (
          <DeliveryCaption>{t("Delivery Addresses")}</DeliveryCaption>
        )}
        {token && renderOnNavbar !== "true" && orderType !== "take_away" && data?.addresses?.length > 0 && (
          <AddNewAddressButton
            align="right"
            handleAddressModal={handleAddressModal}
          />
        )}

        {openAddressModal && (
          <AddNewAddress
            refetch={refetch}
            t={t}
            configData={configData}
            openAddressModal={openAddressModal}
            editAddress={editAddress}
            setEditAddress={setEditAddress}
          />
        )}
      </Stack>
      */}
      
      {renderOnNavbar === "true" ? (
        <>
          <AddressSelectionList
            data={data}
            allAddress={allAddress}
            handleLatLng={handleLatLng}
            t={t}
            address={address}
            refetch={refetch}
            configData={configData}
            renderOnNavbar={renderOnNavbar}
            handleDeleteAddress={handleDeleteAddress}
          />
        </>
      ) : (
        <>
          {token && orderType !== "take_away" ? (
            <>
              {data?.addresses && data.addresses.length > 0 ? (
                <AddressSelectionSection
                addresses={data.addresses}
                selectedAddress={address}
                setSelectedAddress={(selectedAddress) => {
                  handleLatLng(selectedAddress);
                }}
                handleEditAddress={handleEditAddress}
                handleDeleteAddress={handleDeleteAddress}
                configData={configData}
                refetch={refetch}
              />
            ) : (
              // Show the NoAddressComponent instead of CheckOutSelectedAddress when no addresses are available
              <NoAddressComponent />
            )}
          </>
        ) : (
          <>
            {!token && (
              <Stack>
                <CheckoutSelectedAddressGuest
                  address={address}
                  configData={configData}
                  editAddress={editAddress}
                  setEditAddress={setEditAddress}
                  orderType={orderType}
                />
              </Stack>
            )}
          </>
        )}
      </>
    )}
    
    
    {/* 
{renderOnNavbar !== "true" && token && orderType !== "take_away" && data?.addresses?.length > 0 && (
  <AdditionalAddresses
    t={t}
    additionalInformationDispatch={dispatch}
    additionalInformationStates={state}
    saveAddress={saveAddress}
    address={address}
    setAddress={setAddress}
  />
)}
*/}


    {openAddressModal && (
      <AddNewAddress
        refetch={refetch}
        t={t}
        configData={configData}
        openAddressModal={openAddressModal}
        editAddress={editAddress}
        setEditAddress={setEditAddress}
      />
    )}

    <CustomModal
      openModal={openSaveAddress}
      handleClose={saveAddressModalClose}
    >
      <SaveAddressModal
        handleAddressModal={handleAddressModal}
        handleClose={saveAddressModalClose}
        dispatch={dispatch}
        data={data}
        allAddress={allAddress}
        handleLatLng={handleLatLng}
        t={t}
        address={address}
        isRefetching={isRefetching}
        refetch={refetch}
        configData={configData}
        setAddress={setAddress}
        openAddressModal={openAddressModal}
        handleDeleteAddress={handleDeleteAddress}
      />
    </CustomModal>
  </>
);
};
export default DeliveryAddress;


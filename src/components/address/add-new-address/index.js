import React, { useEffect, useReducer, useState } from "react";
import { Box, Stack } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CustomModal from "../../modal";
import CloseIcon from "@mui/icons-material/Close";
import {
  AddressTypeStack,
  CustomIconButton,
  CustomStackFullWidth,
} from "../../../styled-components/CustomStyles.style";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { ACTIONS, initialState, reducer } from "../states";
import { useGeolocated } from "react-geolocated";
import useGetAutocompletePlace from "../../../api-manage/hooks/react-query/google-api/usePlaceAutoComplete";
import useGetGeoCode from "../../../api-manage/hooks/react-query/google-api/useGetGeoCode";
import useGetZoneId from "../../../api-manage/hooks/react-query/google-api/useGetZone";
import useGetPlaceDetails from "../../../api-manage/hooks/react-query/google-api/useGetPlaceDetails";
// import GoogleMapComponent from "../../Map/GoogleMapComponent"; // Comment out or remove
import AddressForm from "./AddressForm";
import CustomImageContainer from "../../CustomImageContainer";
import home from "../../checkout/assets/image 1256.png";
import office from "../assets/office.png";
import plusIcon from "../assets/plus.png";
import { useDispatch, useSelector } from "react-redux";
import { setOpenAddressModal } from "redux/slices/addAddress";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import LocationOnIcon from "@mui/icons-material/LocationOn"; // Add this import
import toast from "react-hot-toast"; // Add this import if not already present

const AddNewAddress = (props) => {
  const {
    configData,
    refetch,
    t,
    openAddressModal,
    editAddress,
    setEditAddress,
  } = props;
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [state, dispatch] = useReducer(reducer, initialState);
  const { profileInfo } = useSelector((state) => state.profileInfo);
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const [editAddressLocation, setEditAddressLocation] = useState({
    lat: editAddress?.latitude,
    lng: editAddress?.longitude,
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false); // Add this state
  const token = localStorage.getItem("token");
  const reduxDispatch = useDispatch();
  const [addressType, setAddressType] = useState(
    guestUserInfo ? guestUserInfo?.address_type : ""
  );
  const personName = `${profileInfo?.f_name} ${profileInfo?.l_name}`;

  //useEffect calls for getting data
  //****getting current location/***/
  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
      isGeolocationEnabled: true,
    });

  useEffect(() => {
    setEditAddressLocation(state?.location);
  }, [state?.location]);

  useEffect(() => {
    if (editAddress) {
      setEditAddressLocation({
        lat: editAddress?.latitude,
        lng: editAddress?.longitude,
      });
    }
  }, [editAddress]);
  
  useEffect(() => {
    dispatch({
      type: ACTIONS.setLocation,
      payload: configData?.default_location,
    });
  }, []);

  const { data: places, isLoading } = useGetAutocompletePlace(
    state.searchKey,
    state.enabled
  );
  useEffect(() => {
    if (places) {
      dispatch({ type: ACTIONS.setPredictions, payload: places?.predictions });
    }
  }, [places]);
  
  const { data: geoCodeResults, isFetching: isFetchingGeoCode } = useGetGeoCode(
    state.location,
    state.geoLocationEnable
  );
  
  useEffect(() => {
    if (geoCodeResults?.results) {
      dispatch({
        type: ACTIONS.setCurrentLocation,
        payload: geoCodeResults?.results[0]?.formatted_address,
      });
      
      // Extract address components from geocode results
      const addressComponents = geoCodeResults?.results[0]?.address_components || [];
      let city = '';
      let state = '';
      let country = '';
      let postalCode = '';
       
      addressComponents.forEach(component => {
        const types = component.types;
             
        if (types.includes('locality')) {
          city = component.long_name;
        } else if (types.includes('administrative_area_level_1')) {
          state = component.long_name;
        } else if (types.includes('country')) {
          country = component.long_name;
        } else if (types.includes('postal_code')) {
          postalCode = component.long_name;
        }
      });
      
      // Store these values to pass to AddressForm
      dispatch({
        type: ACTIONS.setAddressDetails,
        payload: {
          city,
          state,
          country,
          postalCode
        }
      });
    }
  }, [geoCodeResults, state.location]);
  

  
  const { data: zoneData } = useGetZoneId(state.location, state.zoneIdEnabled);
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (zoneData) {
        localStorage.setItem("zoneid", zoneData?.zone_id);
      }
    }
  }, [zoneData]);
  
  // //********************Pick Location */
  const { isLoading: isLoading2, data: placeDetails } = useGetPlaceDetails(
    state.placeId,
    state.placeDetailsEnabled
  );
  //
  useEffect(() => {
    if (placeDetails) {
      dispatch({
        type: ACTIONS.setLocation,
        payload: placeDetails?.result?.geometry?.location,
      });
    }
  }, [placeDetails]);

  // const orangeColor = theme.palette.primary.main;

  useEffect(() => {
    if (state.placeDescription) {
      dispatch({
        type: ACTIONS.setCurrentLocation,
        payload: state.placeDescription,
      });
    }
  }, [state.placeDescription]);

  const handleClick = (name) => {
    setAddressType(name);
    if (editAddress) {
      setEditAddress({ ...editAddress, address_type: name });
    }
  };
  
  const closePopover = () => {
    reduxDispatch(setOpenAddressModal(false));
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      if (coords) {
        const locObj = { lat: coords?.latitude, lng: coords?.longitude };
        dispatch({
          type: ACTIONS.setLocation,
          payload: locObj,
        });
        dispatch({
          type: ACTIONS.setGeoLocationEnable,
          payload: true,
        });
      } else {
        // If coords not available, try to get position
        getPosition();
        toast.error(t("Could not get your current location. Please try again."));
      }
    } catch (error) {
      toast.error(t("Error getting location"));
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <Box>
      {openAddressModal && (
        <CustomModal
          openModal={openAddressModal}
          handleClose={() => reduxDispatch(setOpenAddressModal(false))}
        >
          <Paper
            sx={{
              position: "relative",
              width: { xs: "300px", sm: "450px", md: "550px", lg: "730px" },
              p: "1.4rem",
            }}
          >
            <IconButton
              onClick={() => reduxDispatch(setOpenAddressModal(false))}
              sx={{ position: "absolute", top: 0, right: 0 }}
            >
              <CloseIcon sx={{ fontSize: "16px" }} />
            </IconButton>

            <CustomStackFullWidth spacing={2}>
              <Typography variant="h6" fontWeight="600" textAlign="center">
                {editAddress ? t("Edit Address") : t("Add New Address")}
              </Typography>
              
              {/* Replace Google Map with Fill Current Location button */}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<LocationOnIcon />}
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
                fullWidth
                sx={{ py: 1 }}
              >
                {isLoadingLocation ? t("Getting location...") : t("Fill with current location")}
              </Button>

              <CustomStackFullWidth pt="20px">
                <Typography>{t("Label As")}</Typography>
                <Stack direction="row" spacing={2.5} pt="10px">
                  <AddressTypeStack
                    value="home"
                    addressType={
                      guestUserInfo
                        ? addressType
                        : editAddress?.address_type
                        ? editAddress?.address_type
                        : addressType
                    }
                    onClick={() => handleClick("home")}
                  >
                    <CustomImageContainer
                      src={home.src}
                      width="24px"
                      height="24px"
                    />
                  </AddressTypeStack>
                  <AddressTypeStack
                    value="office"
                    addressType={
                      editAddress?.address_type
                        ? editAddress?.address_type
                        : addressType
                    }
                    onClick={() => handleClick("office")}
                  >
                    <CustomImageContainer
                      src={office.src}
                      width="24px"
                      height="24px"
                    />
                  </AddressTypeStack>
                  <AddressTypeStack
                    value="other"
                    addressType={
                      editAddress?.address_type
                        ? editAddress?.address_type
                        : addressType
                    }
                    onClick={() => handleClick("other")}
                  >
                    <CustomImageContainer
                      src={plusIcon.src}
                      width="24px"
                      height="24px"
                    />
                  </AddressTypeStack>
                </Stack>
              </CustomStackFullWidth>
              
              <CustomStackFullWidth mt="1.3rem">
                <AddressForm
                  atModal="true"
                  setAddressType={setAddressType}
                  addressType={
                    editAddress?.address_type
                      ? editAddress?.address_type
                      : addressType
                  }
                  configData={configData}
                  deliveryAddress={geoCodeResults?.results[0]?.formatted_address}
                  personName={
                    editAddress ? editAddress?.contact_person_name : personName
                  }
                  phone={
                    editAddress
                      ? editAddress?.contact_person_number
                      : profileInfo?.phone
                  }
                  email={profileInfo?.email}
                  lat={editAddress ? editAddress?.lat : state.location?.lat}
                  lng={editAddress ? editAddress?.lng : state.location?.lng}
                  popoverClose={closePopover}
                  refetch={refetch}
                  isRefetcing={isFetchingGeoCode}
                  editAddress={editAddress}
                  addressDetails={state.addressDetails} // Pass address details to form
                />
              </CustomStackFullWidth>
            </CustomStackFullWidth>
          </Paper>
        </CustomModal>
      )}
    </Box>
  );
};

AddNewAddress.propTypes = {};

export default AddNewAddress;

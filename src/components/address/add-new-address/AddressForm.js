import React, { useEffect } from "react";
import { Grid, Stack } from "@mui/material";
import { useFormik } from "formik";
import CustomTextFieldWithFormik from "../../form-fields/CustomTextFieldWithFormik";

import CustomPhoneInput from "../../custom-component/CustomPhoneInput";
import ValidationSchemaForAddAddress from "./ValidationSchemaForAddAddress";

import usePostAddress from "../../../api-manage/hooks/react-query/address/usePostAddress";
import toast from "react-hot-toast";
import { onErrorResponse } from "../../../api-manage/api-error-response/ErrorResponses";
import { getLanguage } from "../../../helper-functions/getLanguage";
import FormSubmitButton from "../../profile/FormSubmitButton";

import useUpdatedAddress from "../../../api-manage/hooks/react-query/address/useUpdatedAddress";
import { useDispatch, useSelector } from "react-redux";
import { setGuestUserInfo } from "../../../redux/slices/guestUserInfo";
import { setOpenAddressModal } from "../../../redux/slices/addAddress";
import { t } from "i18next";

const AddressForm = ({
  configData,
  deliveryAddress,
  personName,
  phone,
  lat,
  lng,
  popoverClose,
  refetch,
  isRefetcing,
  atModal,
  addressType,
  editAddress,
  setAddAddress,
  email,
  addressDetails,
}) => {
  const typeData = [
    {
      label: t("Home"),
      value: "home",
    },
    {
      label: t("Office"),
      value: "Office",
    },
    {
      label: t("Others"),
      value: "Others",
    },
  ];
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const { guestUserInfo } = useSelector((state) => state.guestUserInfo);
  const { mutate, isLoading } = usePostAddress();
  const { mutate: updateMutate, isLoading: isUpdateLoading } =
    useUpdatedAddress();

  const addAddressFormik = useFormik({
    initialValues: {
      contact_person_email: token
        ? email
          ? email
          : editAddress?.contact_person_email || ""
        : guestUserInfo
          ? guestUserInfo.contact_person_email
          : "",
      email: token  // Add this new field
        ? email
          ? email
          : editAddress?.email || ""
        : guestUserInfo
          ? guestUserInfo.email
          : "",
      address: token
        ? editAddress
          ? editAddress?.address
          : deliveryAddress || ""
        : guestUserInfo
          ? guestUserInfo.address
          : deliveryAddress || "",
      address_type: token
        ? addressType
          ? addressType
          : ""
        : guestUserInfo
          ? guestUserInfo.address_type
          : "",
      address_label: token
        ? editAddress?.address_label || ""
        : guestUserInfo
          ? guestUserInfo.address_label
          : "",
      contact_person_name: token
        ? personName
          ? personName
          : ""
        : guestUserInfo
          ? guestUserInfo.contact_person_name
          : "",
      contact_person_number: token
        ? editAddress
          ? editAddress?.contact_person_number
          : phone
            ? phone
            : ""
        : guestUserInfo
          ? guestUserInfo.contact_person_number
          : "",
      additional_information: token
        ? editAddress
          ? editAddress?.additional_information
          : ""
        : guestUserInfo
          ? guestUserInfo.additional_information
          : "",
      latitude: lat,
      longitude: lng,
      road: token
        ? editAddress
          ? editAddress?.road
          : ""
        : guestUserInfo
          ? guestUserInfo.road
          : "",
      house: token
        ? editAddress
          ? editAddress?.house
          : ""
        : guestUserInfo
          ? guestUserInfo.house
          : "",
      floor: token
        ? editAddress
          ? editAddress?.floor || "" // Ensure it's an empty string if null
          : ""
        : guestUserInfo
          ? guestUserInfo.floor || "" // Ensure it's an empty string if null
          : "",
      // Shiprocket fields
      last_name: token
        ? editAddress
          ? editAddress?.last_name
          : ""
        : guestUserInfo
          ? guestUserInfo.last_name
          : "",
      address_2: token
        ? editAddress
          ? editAddress?.address_2
          : ""
        : guestUserInfo
          ? guestUserInfo.address_2
          : "",
      city: token
        ? editAddress
          ? editAddress?.city
          : addressDetails?.city || ""
        : guestUserInfo
          ? guestUserInfo.city
          : addressDetails?.city || "",
      state: token
        ? editAddress
          ? editAddress?.state
          : addressDetails?.state || ""
        : guestUserInfo
          ? guestUserInfo.state
          : addressDetails?.state || "",
      country: token
        ? editAddress
          ? editAddress?.country
          : addressDetails?.country || ""
        : guestUserInfo
          ? guestUserInfo.country
          : addressDetails?.country || "",
      pincode: token
        ? editAddress
          ? editAddress?.pincode
          : addressDetails?.postalCode || ""
        : guestUserInfo
          ? guestUserInfo.pincode
          : addressDetails?.postalCode || "",
      latitude: lat || editAddress?.latitude || 0,
      longitude: lng || editAddress?.longitude || 0,
    },
    validationSchema: ValidationSchemaForAddAddress(),
    onSubmit: async (values, helpers) => {
      try {
        let newData = {
          ...values,
          address_type:
            values.address_label !== ""
              ? values.address_label
              : values.address_type,
              email: values.contact_person_email,
        };
        formSubmitOnSuccess(newData);
      } catch (err) { }
    },
  });

  const formSubmitOnSuccess = (values) => {
    if (token) {
      if (editAddress && editAddress?.address_type) {
        const newValue = {
          ...values,
          id: editAddress?.id,
          // Add these fields explicitly to ensure they're included
          latitude: values.latitude || editAddress?.latitude || 0,
          longitude: values.longitude || editAddress?.longitude || 0,
          email: values.contact_person_email // Explicitly add email field

        };
        updateMutate(newValue, {
          onSuccess: (response) => {
            if (atModal === "true") {
              toast.success(response?.message);
              popoverClose();
              refetch?.();
            } else {
              toast.success(response?.message);
              refetch?.();
              setAddAddress(false);
            }
          },
          onError: onErrorResponse,
        });
      } else {
        const newValues = {
          ...values,
          latitude: values.latitude || 0,
          longitude: values.longitude || 0,
          email: values.contact_person_email
        };
        mutate(values, {
          onSuccess: (response) => {
            if (response) {
              if (atModal === "true") {
                toast.success(response?.message);
                popoverClose?.();
                refetch?.();
              } else {
                toast.success(response?.message);
                refetch?.();
                setAddAddress(false);
              }
            }
          },
          onError: onErrorResponse,
        });
      }
    } else {
      dispatch(setGuestUserInfo(values));
      dispatch(setOpenAddressModal(false));
    }
  };

  const nameHandler = (value) => {
    addAddressFormik.setFieldValue("contact_person_name", value);
  };
  const numberHandler = (value) => {
    addAddressFormik.setFieldValue("contact_person_number", value);
  };
  const addressTypeHandler = (value) => {
    addAddressFormik.setFieldValue("address_type", value);
  };
  const addressLabelHandler = (value) => {
    addAddressFormik.setFieldValue("address_label", value);
  };
  const additionalHandler = (value) => {
    addAddressFormik.setFieldValue("additional_information", value);
  };
  const roadHandler = (value) => {
    addAddressFormik.setFieldValue("road", value);
    // Also update the address field with the same value
    addAddressFormik.setFieldValue("address", value);
  };
  const houseHandler = (value) => {
    addAddressFormik.setFieldValue("house", value);
  };
  const floorHandler = (value) => {
    addAddressFormik.setFieldValue("floor", value || ""); // Ensure it's an empty string if null
  };
  const emailHandler = (value) => {
    addAddressFormik.setFieldValue("contact_person_email", value);
    addAddressFormik.setFieldValue("email", value);
  };

  // Handlers for Shiprocket fields
  const lastNameHandler = (value) => {
    addAddressFormik.setFieldValue("last_name", value);
  };
  const address2Handler = (value) => {
    addAddressFormik.setFieldValue("address_2", value);
  };
  const cityHandler = (value) => {
    addAddressFormik.setFieldValue("city", value);
  };
  const stateHandler = (value) => {
    addAddressFormik.setFieldValue("state", value);
  };
  const countryHandler = (value) => {
    addAddressFormik.setFieldValue("country", value);
  };
  const pincodeHandler = (value) => {
    addAddressFormik.setFieldValue("pincode", value);
  };
  const addressHandler = (value) => {
    addAddressFormik.setFieldValue("address", value);
  };

  useEffect(() => {
    // We're not setting address from deliveryAddress anymore
    // Instead, we'll use the road field value for address
    addAddressFormik.setFieldValue("address_type", addressType);
    addAddressFormik.setFieldValue("latitude", lat);
    addAddressFormik.setFieldValue("longitude", lng);

    // Set address details from geolocation if available
    if (addressDetails) {
      addAddressFormik.setFieldValue("city", addressDetails.city || '');
      addAddressFormik.setFieldValue("state", addressDetails.state || '');
      addAddressFormik.setFieldValue("country", addressDetails.country || '');
      addAddressFormik.setFieldValue("pincode", addressDetails.postalCode || '');
    }
  }, [addressType, lat, lng, addressDetails]);

  const lanDirection = getLanguage() ? getLanguage() : "ltr";

  const handleReset = () => {
    addAddressFormik.setFieldValue("contact_person_name", "");
    addAddressFormik.setFieldValue("contact_person_number", "");
    addAddressFormik.setFieldValue("contact_person_email", "");
    addAddressFormik.setFieldValue("additional_information", "");
    addAddressFormik.setFieldValue("house", "");
    addAddressFormik.setFieldValue("floor", "");
    addAddressFormik.setFieldValue("road", "");
    addAddressFormik.setFieldValue("address", "");
    addAddressFormik.setFieldValue("last_name", "");
    addAddressFormik.setFieldValue("address_2", "");
    addAddressFormik.setFieldValue("city", "");
    addAddressFormik.setFieldValue("state", "");
    addAddressFormik.setFieldValue("country", "");
    addAddressFormik.setFieldValue("pincode", "");
  };

  return (
    <Stack>
      <form noValidate onSubmit={addAddressFormik.handleSubmit}>
        <Grid container spacing={2.8}>
          {addressType === "other" && (
            <Grid item xs={12} md={12}>
              {" "}
              <CustomTextFieldWithFormik
                type="text"
                label={t("Label Name(Optional)")}
                touched={addAddressFormik.touched.address_label}
                errors={addAddressFormik.errors.address_label}
                fieldProps={addAddressFormik.getFieldProps("address_label")}
                onChangeHandler={addressLabelHandler}
                value={addAddressFormik.values.address_label}
              />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              required="true"
              type="text"
              label={t("First Name")}
              touched={addAddressFormik.touched.contact_person_name}
              errors={addAddressFormik.errors.contact_person_name}
              fieldProps={addAddressFormik.getFieldProps("contact_person_name")}
              onChangeHandler={nameHandler}
              value={addAddressFormik.values.contact_person_name}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              type="text"
              label={t("Last Name")}
              touched={addAddressFormik.touched.last_name}
              errors={addAddressFormik.errors.last_name}
              fieldProps={addAddressFormik.getFieldProps("last_name")}
              onChangeHandler={lastNameHandler}
              value={addAddressFormik.values.last_name}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomPhoneInput
              value={addAddressFormik.values.contact_person_number}
              onHandleChange={numberHandler}
              initCountry={configData?.country}
              touched={addAddressFormik.touched.contact_person_number}
              errors={addAddressFormik.errors.contact_person_number}
              rtlChange="true"
              lanDirection={lanDirection}
              height="45px"
              required="true"
              // Add this prop if the component supports it
              maxLength={15} // Allow up to 15 digits for international numbers
            />
          </Grid>

          {/* Add email field for all users */}
          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              required="true"
              type="email"
              label={t("Email")}
              touched={addAddressFormik.touched.contact_person_email}
              errors={addAddressFormik.errors.contact_person_email}
              fieldProps={addAddressFormik.getFieldProps("contact_person_email")}
              onChangeHandler={emailHandler}  // Use the updated handler
              value={addAddressFormik.values.contact_person_email}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              type="text"
              label={t("House/Flat Number")}
              touched={addAddressFormik.touched.house}
              errors={addAddressFormik.errors.house}
              fieldProps={addAddressFormik.getFieldProps("house")}
              onChangeHandler={houseHandler}
              value={addAddressFormik.values.house}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              type="text"
              label={t("Floor")}
              touched={addAddressFormik.touched.floor}
              errors={addAddressFormik.errors.floor}
              fieldProps={addAddressFormik.getFieldProps("floor")}
              onChangeHandler={floorHandler}
              value={addAddressFormik.values.floor}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <CustomTextFieldWithFormik
              required="true"
              type="text"
              label={t("Full Address")} // Changed from "Street Address" to "Full Address"
              touched={addAddressFormik.touched.address}
              errors={addAddressFormik.errors.address}
              fieldProps={addAddressFormik.getFieldProps("address")}
              onChangeHandler={addressHandler}
              value={addAddressFormik.values.address}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <CustomTextFieldWithFormik
              type="text"
              label={t("Address Line 2 (Optional)")}
              touched={addAddressFormik.touched.address_2}
              errors={addAddressFormik.errors.address_2}
              fieldProps={addAddressFormik.getFieldProps("address_2")}
              onChangeHandler={address2Handler}
              value={addAddressFormik.values.address_2}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              required="true"
              type="text"
              label={t("City")}
              touched={addAddressFormik.touched.city}
              errors={addAddressFormik.errors.city}
              fieldProps={addAddressFormik.getFieldProps("city")}
              onChangeHandler={cityHandler}
              value={addAddressFormik.values.city}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              required="true"
              type="text"
              label={t("State/Province")}
              touched={addAddressFormik.touched.state}
              errors={addAddressFormik.errors.state}
              fieldProps={addAddressFormik.getFieldProps("state")}
              onChangeHandler={stateHandler}
              value={addAddressFormik.values.state}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              required="true"
              type="text"
              label={t("Country")}
              touched={addAddressFormik.touched.country}
              errors={addAddressFormik.errors.country}
              fieldProps={addAddressFormik.getFieldProps("country")}
              onChangeHandler={countryHandler}
              value={addAddressFormik.values.country}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextFieldWithFormik
              required="true"
              type="text"
              label={t("Postal Code/ZIP")}
              touched={addAddressFormik.touched.pincode}
              errors={addAddressFormik.errors.pincode}
              fieldProps={addAddressFormik.getFieldProps("pincode")}
              onChangeHandler={pincodeHandler}
              value={addAddressFormik.values.pincode}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <CustomTextFieldWithFormik
              type="text"
              label={t("Additional Information")}
              touched={addAddressFormik.touched.additional_information}
              errors={addAddressFormik.errors.additional_information}
              fieldProps={addAddressFormik.getFieldProps(
                "additional_information"
              )}
              onChangeHandler={additionalHandler}
              value={addAddressFormik.values.additional_information}
              height="60px"
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} align="end">
            <FormSubmitButton
              handleReset={handleReset}
              isLoading={
                editAddress && editAddress?.address_type
                  ? isUpdateLoading
                  : isLoading
              }
              reset={t("Reset")}
              margin="8px"
              submit={
                token
                  ? editAddress && editAddress?.address_type
                    ? t("Update Address")
                    : t("Add Address")
                  : guestUserInfo
                    ? t("Update Address")
                    : t("Add Address")
              }
            />
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
};
export default AddressForm;


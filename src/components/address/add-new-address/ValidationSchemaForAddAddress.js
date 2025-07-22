import * as Yup from "yup";
import { t } from "i18next";

const ValidationSchemaForAddAddress = () => {
  return Yup.object({
    contact_person_name: Yup.string().required(
      t("First name is required")
    ),
    last_name: Yup.string().nullable(),
    contact_person_number: Yup.string()
      .required(t("Phone number is required"))
      .min(10, t("Phone number must be at least 10 digits")),
    contact_person_email: Yup.string()
      .email(t("Invalid email format"))
      .required(t("Email is required")),
    address: Yup.string()
      .required(t("Full address is required")),
    address_2: Yup.string().nullable(),
    house: Yup.string().nullable(),
    floor: Yup.string().nullable(), // Make floor nullable
    address_type: Yup.string(),
    address_label: Yup.string().nullable(),
    city: Yup.string()
      .required(t("City is required")),
    state: Yup.string()
      .required(t("State is required")),
    country: Yup.string()
      .required(t("Country is required")),
    pincode: Yup.string()
      .required(t("Postal code is required"))
      .matches(/^[0-9]+$/, t("Postal code must contain only numbers"))
      .min(5, t("Postal code must be at least 5 digits")),
    additional_information: Yup.string().nullable(),
    road: Yup.string().nullable(),
  });
};

export default ValidationSchemaForAddAddress;

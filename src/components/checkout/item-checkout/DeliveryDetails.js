import React from "react";

import { useTranslation } from "react-i18next";

import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { DeliveryCaption } from "../CheckOut.style";
import DeliveryAddress from "../delivery-address";
import { Stack } from "@mui/system";
import { DeliveryOptionButton } from "styled-components/CustomButtons.style";
import homeImg from "../assets/image 1256.png";
import takeaway from "../assets/takeaway.png";
import schedule from "../assets/schedule.png";
import CustomImageContainer from "../../CustomImageContainer";
import {
	Checkbox,
	FormControlLabel,
	Grid,
	InputAdornment,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import RestaurantScheduleTime from "./RestaurantScheduleTime";

import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import { getToken } from "helper-functions/getToken";
import LockIcon from "@mui/icons-material/Lock";

const DeliveryDetails = (props) => {
	const {
		storeData,
		setOrderType,
		orderType,
		setAddress,
		address,
		configData,
		forprescription,
		setDeliveryTip,
		customDispatch,
		scheduleTime,
		setDayNumber,
		handleChange,
		today,
		tomorrow,
		numberOfDay,
		setScheduleAt,
		formik,
		confirmPasswordHandler,
		passwordHandler,
		check,
		setCheck,
	} = props;

	const { t } = useTranslation();
	const theme = useTheme();
	const isSmall = useMediaQuery("(max-width:490px)");
	const [anchorEl, setAnchorEl] = React.useState(null);

	// Ensure "Home Delivery" is selected by default logic
	React.useEffect(() => {
		if (orderType === "take_away") {
			setOrderType("delivery");
		}
	}, [orderType, setOrderType]);

	const handleClick = (event) => {
		setOrderType("schedule_order");
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	const open = Boolean(anchorEl);

	const handleOrderType = (value) => {
		// Logic related to "I'll Pick It Up Myself" (take_away) option is disabled
		// if (value === "take_away") {
		// 	setDeliveryTip(0);
		// }
		setOrderType(value);
	};
	const handleCheckbox = (e) => {
		setCheck(e.target.checked);
	};
	return (
		<CustomStackFullWidth spacing={{ xs: 1.5, md: 3 }}>
			{storeData?.schedule_order && (
				<>
					<DeliveryCaption const id="demo-row-radio-buttons-group-label">
						{t("Delivery Options")}
					</DeliveryCaption>
					<Stack
						direction="row"
						width="100%"
						justifyContent={{ xs: "flex-start", md: "space-between" }}
						gap={{ xs: "5px", md: "10px" }}
						sx={{ flexWrap: { xs: "wrap", sm: "wrap", md: "nowrap" } }}
					>
						<DeliveryOptionButton
							fullwidth="true"
							orderType={orderType === "delivery"}
							onClick={() => handleOrderType("delivery")}
							hover="true"
							// Improved UI for Home Delivery: Compact, cleaner, and user-friendly
							sx={{
								padding: "10px 15px", // Soft padding
								height: "auto", // Compact height
								minHeight: "40px",
								width: "fit-content", // Allow button to wrap content snugly
								minWidth: { xs: "120px", md: "150px" }, // Responsive minimum width
								borderRadius: "8px", // Clean border radius
								border: (theme) =>
									orderType === "delivery"
										? `1px solid ${theme.palette.primary.main}`
										: "1px solid transparent",
								"&:hover": {
									color: (theme) =>
										theme.palette.whiteContainer.main,
								},
							}}
						>
							<CustomImageContainer
								src={homeImg.src}
								width="25px" // Slightly smaller icon
								height="25px"
								smWidth="20px"
								smHeight="20px"
							/>
							<Typography
								className="text"
								fontSize={{ xs: "12px", md: "14px" }}
								fontWeight={
									orderType === "delivery" ? "600" : "500"
								}
								color={
									orderType === "delivery"
										? theme.palette.whiteContainer.main
										: theme.palette.neutral[700]
								}
							>
								{t("Home Delivery")}
							</Typography>
						</DeliveryOptionButton>
						{/* "I'll Pick It Up Myself" option - Disabled/Removed as per requirement */}
						{/* {!forprescription && configData?.takeaway_status === 1 ? (
						<>
							{storeData?.take_away && (
								<DeliveryOptionButton
									fullwidth="true"
									orderType={orderType === "take_away"}
									onClick={() => handleOrderType("take_away")}
								 >
									{" "}
									<CustomImageContainer
										src={takeaway.src}
										width="30px"
										height="30px"
										smWidth="20px"
										smHeight="20px"
									/>
									<Typography
										className="text"
										fontSize={{ xs: "12px", md: "14px" }}
										fontWeight={
											orderType === "take_away"
												? "600"
												: "400"
										}
										color={
											orderType === "take_away"
												? theme.palette.whiteContainer
														.main
												: theme.palette.neutral[700]
										}
									>
										{t("I’ll Pick It Up MySelf")}
									</Typography>
								</DeliveryOptionButton>
							)}
						</>
					) : null} */}
						{storeData?.schedule_order && (
							<DeliveryOptionButton
								fullwidth="true"
								orderType={orderType === "schedule_order"}
								onClick={handleClick}
							>
								{" "}
								<CustomImageContainer
									src={schedule.src}
									width="30px"
									height="30px"
									smWidth="20px"
									smHeight="20px"
								/>
								<Typography
									className="text"
									fontSize={{ xs: "12px", md: "14px" }}
									fontWeight={
										orderType === "schedule_order"
											? "600"
											: "400"
									}
									color={
										orderType === "schedule_order"
											? theme.palette.whiteContainer.main
											: theme.palette.neutral[700]
									}
								>
									{t("Schedule Delivery")}
								</Typography>
							</DeliveryOptionButton>
						)}
					</Stack>
				</>
			)}
			{orderType === "schedule_order" && (
				<RestaurantScheduleTime
					storeData={storeData}
					handleChange={handleChange}
					today={today}
					tomorrow={tomorrow}
					numberOfDay={numberOfDay}
					configData={configData}
					setScheduleAt={setScheduleAt}
				/>
			)}
			<DeliveryAddress
				setAddress={setAddress}
				address={address}
				configData={configData}
				storeZoneId={storeData?.zone_id}
				orderType={orderType}
			/>
			{!getToken() &&
				configData?.centralize_login?.manual_login_status === 1 && (
					<Stack>
						<Stack>
							<FormControlLabel
								onChange={(e) => handleCheckbox(e)}
								control={<Checkbox />}
								label={
									<Typography
										fontWeight="500"
										fontSize="16px"
										color={theme.palette.neutral[1000]}
									>
										{t("Create account with exiting info.")}
									</Typography>
								}
							/>
						</Stack>
						{check && (
							<Grid container spacing={2} pt="10px">
								<Grid item sm={12} md={6}>
									<CustomTextFieldWithFormik
										required="true"
										type="password"
										label={t("Password")}
										placeholder={t("Password")}
										touched={formik.touched.password}
										errors={formik.errors.password}
										fieldProps={formik.getFieldProps(
											"password"
										)}
										onChangeHandler={passwordHandler}
										value={formik.values.password}
										startIcon={
											<InputAdornment position="start">
												<LockIcon
													sx={{
														color: (theme) =>
															theme.palette
																.neutral[400],
													}}
												/>
											</InputAdornment>
										}
									/>
								</Grid>
								<Grid item sm={12} md={6}>
									<CustomTextFieldWithFormik
										label={t("Confirm Password")}
										required="true"
										type="password"
										placeholder={t("Confirm Password")}
										touched={
											formik.touched.confirm_password
										}
										errors={formik.errors.confirm_password}
										fieldProps={formik.getFieldProps(
											"confirm_password"
										)}
										onChangeHandler={confirmPasswordHandler}
										value={formik.values.confirm_password}
										startIcon={
											<InputAdornment position="start">
												<LockIcon
													sx={{
														color: (theme) =>
															theme.palette
																.neutral[400],
													}}
												/>
											</InputAdornment>
										}
									/>
								</Grid>
							</Grid>
						)}
					</Stack>
				)}
		</CustomStackFullWidth>
	);
};

DeliveryDetails.propTypes = {};

export default DeliveryDetails;

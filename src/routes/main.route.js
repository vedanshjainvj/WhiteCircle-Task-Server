// -------------------- PACKAGE IMPORT FILES -------------------- //
import express from "express";

// --------------- Importing Other Files --------------- //
import logout from "../utilities/logout.js";
import upload from "../config/multer.config.js";
import userToken from "../middlewares/userToken.js";
import asyncHandler from "../utilities/asyncHandler.js";
import userController from "../controllers/user.controller.js";
import adminController from "../controllers/admin.controller.js";
import resourceController from "../controllers/resource.controller.js";

const router = express.Router();

// -------------------- ADMIN ROUTES -------------------- //
router.route("/admin/login").post(asyncHandler(adminController.adminLogin));

router.route("/admin/get-users").get(userToken.tokenverify, asyncHandler(adminController.getUsers));

router.route("/admin/get-resources").get(userToken.tokenverify, asyncHandler(adminController.getResources));

router.route("/admin/get-resourcesbyid/:userId").get(userToken.tokenverify, asyncHandler(resourceController.getResourcesByUserId));

router.route("/admin/get-all-users-summary").get(userToken.tokenverify, asyncHandler(adminController.getAllUsersSummary));

router.route("/admin/get-all-users-monthly-summary").get(userToken.tokenverify, asyncHandler(adminController.getAllUsersMonthlySummary));

router.route('/admin/send-mail-manual').post(userToken.tokenverify, asyncHandler(adminController.sendMailManual));

// -------------------- AUTH ROUTES -------------------- //
router.route("/register").post(asyncHandler(userController.registerUser));

router.route("/verify-otp").post(asyncHandler(userController.verifyOtp));

router.route("/login").post(asyncHandler(userController.loginUser));

router.route('/verify-token').get(userToken.tokenverify, asyncHandler(userController.verifyToken));

router.route("/logout").post(asyncHandler(logout));

router.route("/get-user-summary").get(userToken.tokenverify, asyncHandler(userController.getUserSummary));

router.route("/get-user-monthly-summary").get(userToken.tokenverify, asyncHandler(userController.getUserMonthlySummary));

// -------------------- RESOURCE ROUTES -------------------- //
router.route("/upload-document").post([userToken.tokenverify, upload.single("resourceFile")], asyncHandler(resourceController.createResource));

router.route('/update-resource/:id').patch([userToken.tokenverify, upload.single("resourceFile")], asyncHandler(resourceController.updateResource));

router.route("/delete-resource/:id").delete(userToken.tokenverify, asyncHandler(resourceController.deleteResource));

router.route("/get-resources").get(userToken.tokenverify, asyncHandler(resourceController.getResources));

router.route("/get-resource/:id").get(userToken.tokenverify, asyncHandler(resourceController.getResourceById));

export default router;

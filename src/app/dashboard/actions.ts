// Re-export all domain actions for backward compatibility
export {
  updateUserProfile,
  setCustomDomain,
  updateUserTheme,
} from "./actions/profile";

export {
  createUserProduct,
  updateUserProduct,
  deleteUserProduct,
  updateCustomProductPrice,
} from "./actions/products";

export {
  addUserService,
  deleteUserService,
  updateUserService,
  addUserFaq,
  deleteUserFaq,
} from "./actions/services";

export {
  addUserGalleryImage,
  deleteUserGalleryImage,
  updateUserGalleryImage,
  addUserCarouselItem,
  deleteCarouselItem,
  addUserTestimonial,
  deleteTestimonial,
  addUserPartner,
  deletePartner,
} from "./actions/media";

export {
  sendAdminSuggestion,
  toggleAdminSuggestionRead,
  deleteAdminSuggestion,
  requestUsernameChange,
  adminApproveUsernameChange,
  adminRejectUsernameChange,
  updateAdminSuggestionStatus,
} from "./actions/suggestions";

export {
  updateUserSubscriptionDetails,
  adminManualActivateSubscription,
  requestUserSubscription,
  adminValidateSubscription,
  adminRefuseSubscription,
  adminSuspendSubscription,
  adminReactivateSubscription,
  adminExtendSubscription,
  adminDirectAssignSubscription,
  adminUpdateSubscription,
} from "./actions/subscriptions";

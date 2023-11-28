import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import blogReducer from './slices/blog';
import userReducer from './slices/user';
import userListReducer from './slices/admin/user';
import promotionListReducer from './slices/admin/promotion';
import productListReducer from './slices/admin/product';
import requestListReducer from './slices/admin/request';
import packageListReducer from './slices/admin/package';
import bracketListReducer from './slices/admin/bracket';
import staffRequestListReducer from './slices/staff/request';
import staffSurveyListReducer from './slices/staff/survey';
import contractListReducer from './slices/admin/contract';
import feedbackListReducer from './slices/admin/feedback';
import paymentListReducer from './slices/admin/payment';
import productReducer from './slices/product';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: []
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout']
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  blog: blogReducer,
  user: userReducer,
  userList: userListReducer,
  promotionList: promotionListReducer,
  productList: productListReducer,
  packageList: packageListReducer,
  bracketList: bracketListReducer,
  requestList: requestListReducer,
  staffRequestList: staffRequestListReducer,
  staffSurveyList: staffSurveyListReducer,
  feedbackList: feedbackListReducer,
  paymentList: paymentListReducer,
  contractList: contractListReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  product: persistReducer(productPersistConfig, productReducer)
});

export { rootPersistConfig, rootReducer };

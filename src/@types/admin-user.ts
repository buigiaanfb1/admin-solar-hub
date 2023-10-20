// ----------------------------------------------------------------------

import { FormikProps } from 'formik';

export type UserManager = {
  accountId: string;
  username: string;
  email: string;
  firstname: string;
  password: string;
  lastname: string;
  phone: string;
  status: boolean;
  address: string;
  roleId: string;
  createAt: string;
  gender: boolean;
  isGoogleProvider: boolean;
  role: {
    roleId: string;
    roleName: string;
    status: boolean;
    account: Array<any>;
  };
  constructionContractCustomer: Array<any>;
  constructionContractStaff: Array<any>;
  paymentProcess: Array<any>;
  request: Array<any>;
  survey: Array<any>;
  warrantyReport: Array<any>;
};

export type UserData = {
  id: string;
  avatarUrl: string;
  cover: string;
  name: string;
  follower: number;
  following: number;
  totalPost: number;
  position: string;
};

export type NotificationSettings = {
  activityComments: boolean;
  activityAnswers: boolean;
  activityFollows: boolean;
  applicationNews: boolean;
  applicationProduct: boolean;
  applicationBlog: boolean;
};

export type Friend = {
  id: string;
  avatarUrl: string;
  name: string;
  role: string;
};

export type UserPost = {
  id: string;
  author: {
    id: string;
    avatarUrl: string;
    name: string;
  };
  isLiked: boolean;
  createdAt: Date;
  media: string;
  message: string;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    author: {
      id: string;
      avatarUrl: string;
      name: string;
    };
    createdAt: Date;
    message: string;
  }[];
};

export type AccountBillingFormikProps = FormikProps<{
  cardName: string;
  cardNumber: string;
  cardExpired: string;
  cardCvv: string;
}>;

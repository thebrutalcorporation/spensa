import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  id: Scalars['String'];
  type: Scalars['String'];
  name: Scalars['String'];
  transactions: Array<Transaction>;
};


export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTransaction: Transaction;
  updateTransaction?: Maybe<Transaction>;
  deleteTransaction: Scalars['Boolean'];
  ChangePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
};


export type MutationCreateTransactionArgs = {
  options: TransactionInput;
};


export type MutationUpdateTransactionArgs = {
  title: Scalars['String'];
  id: Scalars['String'];
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  transactions: Array<Transaction>;
  transaction?: Maybe<Transaction>;
  me?: Maybe<User>;
  categories: Array<Category>;
};


export type QueryTransactionArgs = {
  id: Scalars['String'];
};

export type Transaction = {
  __typename?: 'Transaction';
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  id: Scalars['String'];
  amount: Scalars['Float'];
  currency: Scalars['String'];
  details: Scalars['String'];
  isDiscretionary: Scalars['Boolean'];
  title: Scalars['String'];
  txnDate: Scalars['String'];
  type: Scalars['String'];
  user: User;
  category: Category;
};

export type TransactionInput = {
  amount: Scalars['Float'];
  category: Scalars['String'];
  currency: Scalars['String'];
  details?: Maybe<Scalars['String']>;
  isDiscretionary: Scalars['Boolean'];
  title: Scalars['String'];
  txnDate: Scalars['DateTime'];
  type: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  id: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  transactions: Array<Transaction>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  email: Scalars['String'];
};

export type RegularErrorFragment = (
  { __typename?: 'FieldError' }
  & Pick<FieldError, 'field' | 'message'>
);

export type ShortUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username'>
);

export type UserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { errors?: Maybe<Array<(
    { __typename?: 'FieldError' }
    & RegularErrorFragment
  )>>, user?: Maybe<(
    { __typename?: 'User' }
    & ShortUserFragment
  )> }
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { ChangePassword: (
    { __typename?: 'UserResponse' }
    & UserResponseFragment
  ) }
);

export type CreateTransactionMutationVariables = Exact<{
  options: TransactionInput;
}>;


export type CreateTransactionMutation = (
  { __typename?: 'Mutation' }
  & { createTransaction: (
    { __typename?: 'Transaction' }
    & Pick<Transaction, 'id' | 'amount' | 'currency' | 'details' | 'isDiscretionary' | 'title' | 'txnDate' | 'type' | 'createdAt' | 'updatedAt'>
    & { category: (
      { __typename?: 'Category' }
      & Pick<Category, 'id'>
    ) }
  ) }
);

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgotPassword'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & UserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & UserResponseFragment
  ) }
);

export type AllCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllCategoriesQuery = (
  { __typename?: 'Query' }
  & { categories: Array<(
    { __typename?: 'Category' }
    & Pick<Category, 'id' | 'type' | 'name' | 'createdAt' | 'updatedAt'>
  )> }
);

export type AllTransactionsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllTransactionsQuery = (
  { __typename?: 'Query' }
  & { transactions: Array<(
    { __typename?: 'Transaction' }
    & Pick<Transaction, 'id' | 'title' | 'createdAt' | 'updatedAt'>
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & ShortUserFragment
  )> }
);

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const ShortUserFragmentDoc = gql`
    fragment ShortUser on User {
  id
  username
}
    `;
export const UserResponseFragmentDoc = gql`
    fragment UserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...ShortUser
  }
}
    ${RegularErrorFragmentDoc}
${ShortUserFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  ChangePassword(token: $token, newPassword: $newPassword) {
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreateTransactionDocument = gql`
    mutation createTransaction($options: TransactionInput!) {
  createTransaction(options: $options) {
    id
    amount
    category {
      id
    }
    currency
    details
    isDiscretionary
    title
    txnDate
    type
    createdAt
    updatedAt
  }
}
    `;

export function useCreateTransactionMutation() {
  return Urql.useMutation<CreateTransactionMutation, CreateTransactionMutationVariables>(CreateTransactionDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...UserResponse
  }
}
    ${UserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const AllCategoriesDocument = gql`
    query allCategories {
  categories {
    id
    type
    name
    createdAt
    updatedAt
  }
}
    `;

export function useAllCategoriesQuery(options: Omit<Urql.UseQueryArgs<AllCategoriesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<AllCategoriesQuery>({ query: AllCategoriesDocument, ...options });
};
export const AllTransactionsDocument = gql`
    query allTransactions {
  transactions {
    id
    title
    createdAt
    updatedAt
  }
}
    `;

export function useAllTransactionsQuery(options: Omit<Urql.UseQueryArgs<AllTransactionsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<AllTransactionsQuery>({ query: AllTransactionsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...ShortUser
  }
}
    ${ShortUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
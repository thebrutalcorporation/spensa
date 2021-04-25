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
  register: UserResponse;
  login: UserResponse;
};


export type MutationCreateTransactionArgs = {
  title: Scalars['String'];
};


export type MutationUpdateTransactionArgs = {
  title: Scalars['String'];
  id: Scalars['String'];
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationLoginArgs = {
  options: UsernamePasswordInput;
};

export type Query = {
  __typename?: 'Query';
  transactions: Array<Transaction>;
  transaction?: Maybe<Transaction>;
  me?: Maybe<User>;
};


export type QueryTransactionArgs = {
  id: Scalars['String'];
};

export type Transaction = {
  __typename?: 'Transaction';
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  id: Scalars['String'];
  title: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  id: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type LoginMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>>, user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username'>
    )> }
  ) }
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'createdAt' | 'updatedAt' | 'username'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'FieldError' }
      & Pick<FieldError, 'field' | 'message'>
    )>> }
  ) }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'username'>
  )> }
);


export const LoginDocument = gql`
    mutation Login($options: UsernamePasswordInput!) {
  login(options: $options) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const RegisterDocument = gql`
    mutation register($username: String!, $password: String!) {
  register(options: {username: $username, password: $password}) {
    user {
      id
      createdAt
      updatedAt
      username
    }
    errors {
      field
      message
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    id
    username
  }
}
    `;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
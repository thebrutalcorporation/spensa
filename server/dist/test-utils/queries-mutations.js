"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_QUERIES_AND_MUTATIONS = exports.TXN_QUERIES_AND_MUTATIONS = void 0;
exports.TXN_QUERIES_AND_MUTATIONS = {
    CREATE_TXN: `mutation createTransaction($title:String!){
  createTransaction(title:$title) {
    id
    title
    createdAt
    updatedAt
  }
}`,
    DELETE_TXN: `mutation deleteTransaction($id:String!){
deleteTransaction(id:$id)
}`,
    GET_ALL_TXNS: `query allTransactions{
  transactions {
    id
    title
    createdAt
    updatedAt

  }
}`,
    GET_TXN: `query getTransactionById($id:String!) {
  transaction(id:$id){
    id
    title
    createdAt
    updatedAt
  }
}`,
    UPDATE_TXN: `mutation updateTransaction($id:String!, $title:String!){
  updateTransaction(id:$id ,title:$title){
    id
    title
    createdAt
    updatedAt
  }
}`,
};
exports.USER_QUERIES_AND_MUTATIONS = {
    CHANGE_PASSWORD: `mutation ChangePassword($token: String!, $newPassword: String!) {
  ChangePassword(token: $token, newPassword: $newPassword) {
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
`,
    FORGOT_PASSWORD: `mutation ForgotPassword($email:String!) {
  forgotPassword(email:$email )
}`,
    LOGIN: `mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
},
`,
    LOGOUT: `mutation Logout{
  logout
}`,
    ME: `query me {
  me {
    id
    username    
  }
}
`,
    REGISTER: `mutation register($options: UsernamePasswordInput!) {
  register(options: $options) {
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
`,
};
//# sourceMappingURL=queries-mutations.js.map
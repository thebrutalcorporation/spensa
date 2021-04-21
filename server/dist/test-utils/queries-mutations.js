"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_QUERIES_AND_MUTATIONS = exports.TXN_QUERIES_AND_MUTATIONS = void 0;
exports.TXN_QUERIES_AND_MUTATIONS = {
    GET_ALL_TXNS: `query allTransactions{
  transactions {
    id
    title
    createdAt
    updatedAt

  }
}`,
    CREATE_TXN: `mutation createTransaction($title:String!){
  createTransaction(title:$title) {
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
    DELETE_TXN: `mutation deleteTransaction($id:String!){
  deleteTransaction(id:$id)
}`,
};
exports.USER_QUERIES_AND_MUTATIONS = {
    REGISTER: `mutation register($options: UsernamePasswordInput!) {
  register(options: $options) {
    user {
      id      
      username
    }
    errors {
      field
      message
    }
  }
}
`,
    LOGIN: `mutation login($options:UsernamePasswordInput!) {
  login(options:$options) {
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
    ME: `query me {
  me {
    id
    username    
  }
}
`,
};
//# sourceMappingURL=queries-mutations.js.map
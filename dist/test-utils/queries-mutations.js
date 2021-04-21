"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_QUERIES_AND_MUTATIONS = void 0;
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
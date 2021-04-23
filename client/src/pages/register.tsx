import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { useMutation } from "urql";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";

interface registerProps {}

const REGISTER_MUTATION = `
mutation register($username:String!, $password:String!) {
  register(options: {username:$username, password:$password}) {
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

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useMutation(REGISTER_MUTATION);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => register(values)}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              colorScheme="teal"
              isLoading={isSubmitting}
              mt={4}
              type="submit"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;

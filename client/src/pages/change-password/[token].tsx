import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  CloseButton,
  Flex,
  Link,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { NextComponentType, withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token,
          });
          if (response.data?.ChangePassword.errors) {
            const errorMap = toErrorMap(response.data.ChangePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            } else {
              setErrors(errorMap);
            }
          } else if (response.data?.ChangePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {tokenError && (
              <Alert mb={4} status="error">
                <AlertIcon />
                <AlertDescription>{tokenError}</AlertDescription>
                <CloseButton
                  onClick={() => setTokenError("")}
                  position="absolute"
                  right="8px"
                  top="8px"
                />
              </Alert>
            )}
            <Box>
              <InputField
                name="newPassword"
                placeholder="new password"
                label="New Password"
                type="password"
              />
            </Box>
            <Flex alignItems="baseline">
              <Button
                colorScheme="teal"
                isLoading={isSubmitting}
                mt={4}
                type="submit"
              >
                Change Password
              </Button>
              {tokenError && (
                <NextLink href="/forgot-password">
                  <Link ml={3}>Get a New Password Token</Link>
                </NextLink>
              )}
            </Flex>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

//Need to get teh token from the URL and to do this in next, we set getInitialProps
ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient)(
  (ChangePassword as unknown) as NextComponentType //messy fix for type error
);

import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { useCreateTransactionMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const CreateTxn: React.FC<{}> = ({}) => {
  useIsAuth(); //redirect user to /login if not authenticated
  const router = useRouter();
  const [, createPost] = useCreateTransactionMutation();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "" }}
        onSubmit={async (values) => {
          const { error } = await createPost({ title: values.title });
          if (!error) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            {/* <Box mt={4}>
              <InputField
                textarea
                name="details"
                placeholder="details..."
                label="Details"
              />
            </Box> */}
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              colorScheme="teal"
            >
              Create Transaction
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreateTxn);

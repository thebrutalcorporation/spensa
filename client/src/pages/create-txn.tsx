import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberInput,
  NumberInputField,
  Select,
  Switch,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { useCreateTransactionMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";
import * as Yup from "yup";

const CreateTxn: React.FC<{}> = ({}) => {
  useIsAuth(); //redirect user to /login if not authenticated
  const router = useRouter();
  const [, createTxn] = useCreateTransactionMutation();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{
          title: "",
          amount: 0,
          type: "",
          currency: "ars",
          discretionary: true,
          details: "",
        }}
        validationSchema={Yup.object({
          title: Yup.string()
            .max(15, "Must be 15 characters or less")
            .required("Required"),
          amount: Yup.number().max(100000000).positive().required("Required"),
          currency: Yup.string().required("Required"),
          type: Yup.string().required("Required"),
          discretionary: Yup.bool(),
        })}
        onSubmit={async (values) => {
          console.log(values);
          // const { error } = await createTxn({ title: values.title });
          // if (!error) {
          //   router.push("/");
          // }
        }}
      >
        {({ isSubmitting, isValid, touched }) => (
          <Form>
            <Box mt={4}>
              <InputField
                name="title"
                placeholder="title/store"
                label="Title"
              />
            </Box>
            <Box mt={4}>
              <Field name="amount">
                {({ field, form }) => (
                  <FormControl
                    id="amount"
                    isInvalid={form.errors.amount && form.touched.amount}
                  >
                    <FormLabel htmlFor="amount">Amount</FormLabel>
                    <NumberInput
                      {...field}
                      // defaultValue={0}
                      // min={0}
                      precision={2}
                      // step={1}
                      onChange={(val) => form.setFieldValue(field.name, val)}
                    >
                      <NumberInputField />
                    </NumberInput>
                    {form.errors.amount && (
                      <FormErrorMessage>{form.errors.amount}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Field>
            </Box>
            <Box mt={4}>
              <Field name="currency">
                {({ field, form }) => (
                  <FormControl
                    id="currency"
                    isInvalid={form.errors.currency && form.touched.currency}
                  >
                    <FormLabel htmlFor="currency">Currency</FormLabel>
                    <Select
                      {...field}
                      id="currency"
                      placeholder="Select option"
                    >
                      <option value="ars">ARS</option>
                      <option value="usd">USD</option>
                    </Select>
                    {form.errors.currency && (
                      <FormErrorMessage>
                        {form.errors.currency}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Field>
            </Box>
            <Box mt={4}>
              <Field name="discretionary">
                {({ field, form }) => (
                  <FormControl
                    id="discretionary"
                    display="flex"
                    alignItems="center"
                    isInvalid={
                      form.errors.discretionary && form.touched.discretionary
                    }
                  >
                    <FormLabel htmlFor="discretionary" mb="0">
                      Discretionary?
                    </FormLabel>
                    <Switch
                      id="discretionary"
                      {...field}
                      size="md"
                      isChecked={field.value}
                    />
                    {form.errors.discretionary && (
                      <FormErrorMessage>
                        {form.errors.discretionary}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Field>
            </Box>
            <Box mt={4}>
              <Field name="type">
                {({ field, form }) => (
                  <FormControl
                    id="type"
                    isInvalid={form.errors.type && form.touched.type}
                  >
                    <FormLabel htmlFor="type">Type</FormLabel>
                    <Select {...field} id="type" placeholder="Select option">
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </Select>
                    {form.errors.type && (
                      <FormErrorMessage>{form.errors.type}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              </Field>
            </Box>
            <Box mt={4}>
              <InputField
                textarea
                name="details"
                placeholder="details..."
                label="Details"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              disabled={
                !isValid ||
                (Object.keys(touched).length === 0 &&
                  touched.constructor === Object)
              }
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

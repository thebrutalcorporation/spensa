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
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Field, FieldAttributes, Form, Formik, FormikProps } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import * as Yup from "yup";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import {
  useAllCategoriesQuery,
  useCreateTransactionMutation,
} from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

interface FormValues {
  title: string;
  amount: number;
  type: string;
  category: string;
  currency: string;
  details: string;
  isDiscretionary: boolean;
  txnDate: Date;
}

const CreateTxn: React.FC<{}> = ({}) => {
  useIsAuth(); //redirect user to /login if not authenticated
  const router = useRouter();
  const [, createTxn] = useCreateTransactionMutation();
  const [{ data }] = useAllCategoriesQuery();
  const categories = data?.categories;
  const [date, setDate] = useState(new Date());

  return (
    <Layout variant="small">
      <Formik
        initialValues={{
          title: "",
          amount: 0,
          type: "",
          category: "",
          currency: "ars",
          details: "",
          isDiscretionary: true,
          txnDate: date,
        }}
        validationSchema={Yup.object({
          amount: Yup.number().max(100000000).positive().required("Required"),
          category: Yup.string().required("Requird"),
          currency: Yup.string().required("Required"),
          discretionary: Yup.bool(),
          title: Yup.string()
            .max(15, "Must be 15 characters or less")
            .required("Required"),
          type: Yup.string().required("Required"),
        })}
        onSubmit={async (values) => {
          const { error } = await createTxn({
            options: {
              amount: values.amount * 100,
              category: values.category,
              currency: values.currency,
              details: values.details,
              isDiscretionary: values.isDiscretionary,
              title: values.title,
              txnDate: new Date().toISOString(),
              type: values.type,
            },
          });
          if (!error) {
            router.push("/");
          }
        }}
      >
        {(props: FormikProps<FormValues>) => {
          const { isSubmitting, isValid, touched, values } = props;
          return (
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
                  {({ field, form }: FieldAttributes<any>) => (
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
                        <FormErrorMessage>
                          {form.errors.amount}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  )}
                </Field>
              </Box>
              <Box mt={4}>
                <Field name="txnDate">
                  {({ field, form }: FieldAttributes<any>) => (
                    <FormControl
                      id="txnDate"
                      isInvalid={form.errors.txnDate && form.touched.txnDate}
                    >
                      <FormLabel htmlFor="txnDate">Date</FormLabel>
                      <SingleDatepicker
                        {...field}
                        name="date-input"
                        date={date}
                        onDateChange={setDate}
                      />

                      {form.errors.txnDate && (
                        <FormErrorMessage>
                          {form.errors.txnDate}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  )}
                </Field>
              </Box>

              <Box mt={4}>
                <Field name="currency">
                  {({ field, form }: FieldAttributes<any>) => (
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
                <Field name="isDiscretionary">
                  {({ field, form }: FieldAttributes<any>) => (
                    <FormControl
                      id="isDiscretionary"
                      display="flex"
                      alignItems="center"
                      isInvalid={
                        form.errors.isDiscretionary &&
                        form.touched.isDiscretionary
                      }
                    >
                      <FormLabel htmlFor="isDiscretionary" mb="0">
                        Discretionary?
                      </FormLabel>
                      <Switch
                        id="isDiscretionary"
                        {...field}
                        size="md"
                        isChecked={field.value}
                      />
                      {form.errors.isDiscretionary && (
                        <FormErrorMessage>
                          {form.errors.isDiscretionary}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  )}
                </Field>
              </Box>
              <Box mt={4}>
                <Field name="type">
                  {({ field, form }: FieldAttributes<any>) => (
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
                <Field name="category">
                  {({ field, form }: FieldAttributes<any>) => (
                    <FormControl
                      id="category"
                      isInvalid={form.errors.category && form.touched.category}
                    >
                      <FormLabel htmlFor="category">Category</FormLabel>
                      <Select
                        {...field}
                        id="category"
                        placeholder="Select option"
                      >
                        {values.type &&
                          categories
                            ?.filter(
                              (category) => category.type === values.type
                            )
                            .sort((cat1, cat2) => {
                              if (cat1.name < cat2.name) return -1;
                              else if (cat1.name > cat2.name) return +1;
                              else return 0;
                            })
                            .map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                      </Select>
                      {form.errors.category && (
                        <FormErrorMessage>
                          {form.errors.category}
                        </FormErrorMessage>
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
          );
        }}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreateTxn);

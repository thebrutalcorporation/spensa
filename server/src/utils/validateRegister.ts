import { UsernamePasswordInput } from "../resolvers/InputTypes/UsernamePasswordInput";
import { validateEmail } from "./validateEmail";

export const validateRegister = async (options: UsernamePasswordInput) => {
  const { valid: isEmailValid } = await validateEmail(options.email);

  if (!isEmailValid) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "length must be greater than 2",
      },
    ];
  }

  //TODO: add validation to tests
  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "cannot include an @",
      },
    ];
  }

  if (options.password.length <= 5) {
    //TODO: add more robust password handling, perhaps magic links
    return [
      {
        field: "password",
        message: "length must be at least 6 characters",
      },
    ];
  }

  return null;
};

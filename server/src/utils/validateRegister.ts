import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  //@TODO: Add proper validation of email
  if (!options.email.includes("@")) {
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

  //@TODO: add validation to tests
  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "cannot include an @",
      },
    ];
  }

  if (options.password.length <= 5) {
    //@TODO: add more robust password handling, perhaps magic links
    return [
      {
        field: "password",
        message: "length must be at least 6 characters",
      },
    ];
  }

  return null;
};

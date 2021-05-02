import validate from "deep-email-validator";

export const validateEmail = async (email: string) => {
  const response = await validate({
    email,
    validateRegex: true,
    validateMx: false,
    validateTypo: true,
    validateDisposable: true,
    validateSMTP: true,
  });

  return response;
};

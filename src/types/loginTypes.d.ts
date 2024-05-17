interface IFormValidatorResult {
  success: boolean;
  errors: string[];
}

interface ILoginResult {
  success: true | false;
  message: string;
  errors?: string[];
}

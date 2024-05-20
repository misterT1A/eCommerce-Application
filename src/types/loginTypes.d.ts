interface IFormValidatorResult {
  success: boolean;
  errors: string[];
}

interface ILoginData {
  email: string;
  password: string;
}

interface ILoginResult {
  success: true | false;
  message: string;
  errors?: string[];
}

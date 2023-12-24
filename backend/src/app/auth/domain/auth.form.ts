import { IsEmail, IsOptional, IsString, MinLength, validate } from "class-validator";

export class AuthForm {
  @IsEmail()
  email: string;

  @MinLength(6, {
    message: ' Password must be at least 6 characters long'
  })
  @IsString()
  password: string;

  @IsOptional()
  name: string;

  static from(form?: AuthForm) {
    const it = new AuthForm();
    it.email = form?.email;
    it.password = form?.password;
    it.name = form?.name;
    return it;
  }

  static async validate(form: AuthForm) {
    const errors = await validate(form);
    return errors.length ? errors.join('.  ') : false;
  }
}

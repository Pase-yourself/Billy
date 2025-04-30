import { SignIn, SignUp } from "@clerk/clerk-react";

export const SignInPage = () => <SignIn routing="path" path="/sign-in" />;
export const SignUpPage = () => <SignUp routing="path" path="/sign-up" />;

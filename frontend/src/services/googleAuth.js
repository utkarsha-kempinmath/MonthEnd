import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: "298605633-u5khvgj5c2mkp16l7u5hkktuqobnm4uq.apps.googleusercontent.com",
  androidClientId: "298605633-b5a79mmqb26jgsnvmigko1ouvkr4re9u.apps.googleusercontent.com",
  offlineAccess: false,
});

export async function getGoogleIdToken() {
  await GoogleSignin.hasPlayServices();
  await GoogleSignin.signOut();
  await GoogleSignin.signIn();
  const { idToken } = await GoogleSignin.getTokens();
  return idToken;
}
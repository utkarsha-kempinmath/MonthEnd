import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "298605633-u5khvgj5c2mkp16l7u5hkktuqobnm4uq.apps.googleusercontent.com",
    webClientId: "298605633-u5khvgj5c2mkp16l7u5hkktuqobnm4uq.apps.googleusercontent.com",
    androidClientId: "298605633-b5a79mmqb26jgsnvmigko1ouvkr4re9u.apps.googleusercontent.com",

    redirectUri: AuthSession.makeRedirectUri({
      scheme: "com.monthend",
      path: "",
    }),
  });

  return { request, response, promptAsync };
}
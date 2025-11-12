import * as SecureStore from "expo-secure-store";

export async function secureSet(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}
export async function secureGet(key: string) {
  return SecureStore.getItemAsync(key);
}
export async function secureDel(key: string) {
  await SecureStore.deleteItemAsync(key);
}

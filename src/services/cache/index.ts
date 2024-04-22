export default class Cache {
  public static async set(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  public static async get(key: string) {
    return sessionStorage.getItem(key) || null;
  }

  public static async remove(key: string) {
    const value = this.get(key);
    sessionStorage.removeItem(key);
    return value;
  }
}

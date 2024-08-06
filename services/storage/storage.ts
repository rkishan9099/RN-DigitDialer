import AsyncStorage from '@react-native-async-storage/async-storage';
class StorageService {
  // Save data to AsyncStorage with a custom key
  static async saveData(key: string, data: object): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save data for key ${key}:`, error);
    }
  }

  // Load data from AsyncStorage with a custom key
  static async getData(key: string): Promise<any> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Failed to load data for key ${key}:`, error);
      return null;
    }
  }

  // Remove data from AsyncStorage with a custom key
  static async removeData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove data for key ${key}:`, error);
    }
  }
}

export default StorageService;
import { SafeAreaView } from 'react-native';

export const SafeAreaContainer = ({ children }: { children: React.ReactNode }) => {
  return <SafeAreaView className={styles.container}>{children}</SafeAreaView>;
};

const styles = {
  container: 'flex flex-1',
};

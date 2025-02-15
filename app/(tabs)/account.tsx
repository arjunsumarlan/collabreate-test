import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView as SafeAreaViewContext } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { HapticButton } from '@/components/HapticButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useUser } from '@/hooks/useUser';

const AccountScreen = () => {
  const { user, loading } = useUser();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    router.replace('/login');
  };

  if (loading) {
    return (
      <SafeAreaViewContext style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.container}>
          <ThemedText>Loading...</ThemedText>
        </ThemedView>
      </SafeAreaViewContext>
    );
  }

  return (
    <SafeAreaViewContext style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Account</ThemedText>
        
        <ThemedView style={styles.userInfo}>
          <ThemedText style={styles.label}>Name</ThemedText>
          <ThemedText style={styles.value}>{user?.name || 'N/A'}</ThemedText>
          
          <ThemedText style={styles.label}>Email</ThemedText>
          <ThemedText style={styles.value}>{user?.email}</ThemedText>
        </ThemedView>

        <HapticButton style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText style={styles.logoutText}>Logout</ThemedText>
        </HapticButton>
      </ThemedView>
    </SafeAreaViewContext>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  userInfo: {
    marginTop: 20,
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AccountScreen; 
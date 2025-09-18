import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { COLORS } from '../../constants/colors';
import { useMedicationContext } from '../../context/MedicationContext';

const ChatIcon = require('../../assets/images/NBICON2.png');

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { medications, refreshMedications, isLoading, error } = useMedicationContext();
  const [refreshing, setRefreshing] = React.useState(false);

  const todaysMedications = medications.slice(0, 2);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshMedications();
    } catch (error) {
      console.error('Failed to refresh medications:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshMedications]);


  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>NurseBot</Text>
          <View style={styles.headerIcons}>
            <Ionicons name="notifications-outline" size={24} color="black" />
            <View style={styles.profileIcon}>
              <Ionicons name="person" size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#111827"
          />
        }>
        <Button
          title="Emergency Call"
          variant="primary"
          onPress={() => console.log('Emergency call')}
          style={styles.emergencyButton}
          icon={<Ionicons name="call" size={20} color="white" />}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today&apos;s Medications</Text>
          <TouchableOpacity 
            style={styles.medicationCard}
            onPress={() => router.push('/meds')}
            activeOpacity={0.7}
          >
            {todaysMedications.length === 0 ? (
              <View style={styles.noMedicationsContainer}>
                <Text style={styles.noMedicationsText}>
                  No medicines have been added yet.
                </Text>
              </View>
            ) : (
              todaysMedications.map((med, index) => (
                <View
                  key={med.id}
                  style={[
                    styles.medicationItem,
                    index < todaysMedications.length - 1 && styles.medicationDivider
                  ]}
                >
                  <View>
                    <Text style={styles.medicationName}>{med.name}</Text>
                    <Text style={styles.medicationDosage}>
                      {med.dosage.amount} {med.dosage.unit}
                      {med.dosage.form && ` (${med.dosage.form})`}
                    </Text>
                  </View>
                  <Text style={styles.medicationTime}>
                    {med.schedule?.times?.[0] || 'Not scheduled'}
                  </Text>
                </View>
              ))
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.healthChatSection}>
          <TouchableOpacity 
            style={styles.healthChatCard}
            onPress={() => router.push('/chat')}
          >
            <Image
              source={ChatIcon}
              style={styles.healthChatImage}
              resizeMode="contain"
            />
            <Text style={styles.healthChatText}>Chat with NurseBot</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Tips</Text>
          <View style={styles.tipsCard}>
            <View style={[styles.tipItem, styles.tipDivider]}>
              <Ionicons name="heart" size={20} color="black" style={styles.tipIcon} />
              <Text style={styles.tipText}>Stay hydrated: Drink 8 glasses of water daily</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="moon" size={20} color="black" style={styles.tipIcon} />
              <Text style={styles.tipText}>Get 7-8 hours of sleep every night</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emergencyButton: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  medicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  medicationDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  medicationDosage: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  medicationTime: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  healthChatSection: {
    marginTop: 24,
  },
  healthChatCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 24,
    paddingVertical: 32,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  healthChatImage: {
    width: 48,
    height: 48,
    tintColor: '#FFFFFF',
  },
  healthChatText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  tipDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tipIcon: {
    marginRight: 12,
  },
  tipText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  noMedicationsContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noMedicationsText: {
    fontSize: 16,
    color: COLORS.secondary,
    textAlign: 'center',
  },
});


export default HomeScreen;

import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { useMedicationContext } from '../../context/MedicationContext';

const ChatIcon = require('../../assets/images/remove.photos-removed-background.png');

const HomeScreen: React.FC = () => {
  const statusBarHeight = Constants.statusBarHeight;
  const router = useRouter();
  const { medications } = useMedicationContext();

  const todaysMedications = medications.slice(0, 2);


  return (
    <View className="flex-1 bg-primary3 bg-light-background">
      <View
        className="flex-row items-center justify-between px-4 bg-white border-b border-light-background"
        style={{ paddingTop: Platform.OS === 'android' ? 16 : statusBarHeight + 8, paddingBottom: 16 }}
      >
        <Text className="text-3xl font-bold text-primary">NurseBot</Text>
        <View className="flex-row items-center space-x-2">
          <Ionicons name="notifications-outline" size={30} color="#2d3748" />
          <View className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center">
             <Ionicons name="person" size={30} color="white" />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}>
        <TouchableOpacity className="flex-row items-center justify-center w-full bg-primary rounded-md py-4 mt-5">
          <FontAwesome name="phone" size={20} color="white" className="mr-2" />
          <Text className="text-white text-base font-semibold">Emergency Call</Text>
        </TouchableOpacity>

        <View className="mt-6 mb-4">
          <Text className="text-xl font-bold text-text mb-4">Today&#39;s Medications</Text>
          <Pressable
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-borders"
            onPress={() => router.push('/meds')}
          >
            {todaysMedications.length === 0 ? (
               <View style={styles.noMedicationsContainer}>
                 <Text style={styles.noMedicationsText}>
                   no medicines has been added yet. ;)
                 </Text>
               </View>
            ) : (
              todaysMedications.map((med, index) => (
                <View
                  key={med.id}
                  className={`px-4 py-4 ${index < todaysMedications.length - 1 ? 'border-b border-borders' : ''}`}
                >
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-base font-semibold text-text">{med.name}</Text>
                      <Text className="text-sm text-secondary mt-1">{med.dosage}</Text>
                    </View>
                    <Text className="text-base font-medium text-text">{med.times[0]}</Text>
                  </View>
                </View>
              ))
            )}
          </Pressable>
        </View>

        <TouchableOpacity
          className="mt-8 items-center w-full bg-white rounded-xl shadow-sm border border-borders py-6"
          onPress={() => router.push('/chat')}
        >
            <View className="w-14 h-14 rounded-full bg-light-background items-center justify-center">
               <Image
                 source={ChatIcon}
                 style={{ width: 50, height: 50 }}
               />
            </View>
            <Text className="text-base font-medium text-text mt-2">Health Chat</Text>
        </TouchableOpacity>

        <View className="mt-6 mb-4">
          <Text className="text-xl font-bold text-text mb-4">Health Tips</Text>
          <View className="bg-white rounded-xl shadow-sm overflow-hidden border border-borders">
            <View className="flex-row items-start px-4 py-4 border-b border-borders">
              <Ionicons name="heart" size={20} color="black" className="mr-3 mt-px" />
              <Text className="flex-1 text-base text-text">Stay hydrated: Drink 8 glasses of water daily</Text>
            </View>
            <View className="flex-row items-start px-4 py-4">
              <Ionicons name="moon" size={20} color="black" className="mr-3 mt-px" />
              <Text className="flex-1 text-base text-text">Get 7-8 hours of sleep every night</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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

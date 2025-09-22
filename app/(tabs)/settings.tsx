import { router } from "expo-router";
import { ScrollView, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { commonStyles } from '../../components/ui/theme';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { signOut } = useAuth();
  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.screenHeader}>
        <Text style={commonStyles.screenTitle}>Settings</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <View style={commonStyles.card}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 16 }}>Account</Text>
          <Button
            title="Profile Settings"
            variant="outline"
            onPress={() => console.log('Profile settings')}
            style={{ marginBottom: 12 }}
          />
          <Button
            title="Notification Preferences"
            variant="outline"
            onPress={() => console.log('Notification settings')}
            style={{ marginBottom: 12 }}
          />
          <Button
            title="Privacy Settings"
            variant="outline"
            onPress={() => console.log('Privacy settings')}
          />
        </View>

        <View style={[commonStyles.card, { marginTop: 16 }]}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 16 }}>Help & Support</Text>
          <Button
            title="Contact Support"
            variant="outline"
            onPress={() => console.log('Contact support')}
            style={{ marginBottom: 12 }}
          />
          <Button
            title="FAQs"
            variant="outline"
            onPress={() => console.log('FAQs')}
          />
        </View>

        <Button
          title="Sign Out"
          variant="secondary"
          onPress={async () => {
            await signOut();
            router.replace("/LoginPage");
          }}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </View>
  );
};

export default Settings;
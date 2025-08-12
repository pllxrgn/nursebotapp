import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';


export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  modalContainer: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    top: '5%',
    bottom: '5%',
    backgroundColor: COLORS.primary2,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.chatbot,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 2,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 18,
    textAlign: 'center',
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.chatbot,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.primary3,
  },
  inputRow: {
    borderWidth: 1,
    borderColor: COLORS.chatbot,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary3,
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 16,
    color: COLORS.text,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelBtn: {
    backgroundColor: COLORS.chatbot,
    borderRadius: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginRight: 12,
  },
  cancelBtnText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  addBtnText: {
    color: COLORS.primary2,
    fontWeight: '600',
    fontSize: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  // Style for the Pressable that closes the dropdown
  frequencyDropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5, // Lower zIndex than the dropdown list (zIndex: 10) but above other content
  },
  // Styles for the absolutely positioned dropdown options list
  frequencyDropdownOptions: {
    position: 'absolute',
    backgroundColor: COLORS.primary3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.chatbot,
    zIndex: 10, // Higher zIndex than the closer
    maxHeight: 200, // Limit height and make it scrollable if needed
    overflow: 'hidden',
  },
  frequencyDropdownOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.chatbot,
  },
  frequencyDropdownLastOption: {
    borderBottomWidth: 0,
  },
  frequencyDropdownOptionText: {
    fontSize: 16,
    color: COLORS.text,
  },
});
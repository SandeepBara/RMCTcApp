import { Dimensions, StyleSheet } from "react-native";
import Colors from "./Colors";
import { responsiveHeight,responsiveWidth,responsiveFontSize} from "react-native-responsive-dimensions";
const { width, height } = Dimensions.get('window');

const getNumColumns = () => {
  if (width >= 900) return 4; // tablet big screen
  if (width >= 600) return 3; // medium devices
  return 2; // default mobile
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'blue',
    height: responsiveHeight(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, 
    paddingTop: responsiveHeight(5),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',

    height: 100,
    paddingHorizontal: 15,
    paddingTop: 30,
    backgroundColor: Colors.primary,
    borderBottomWidth: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  navButton: {
    backgroundColor: '#ffffff20', // transparent white overlay
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  navButtonPlaceholder: {
    width: 60, // To keep title centered
  },
  navText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2, // 👈 border thickness
    borderColor: Colors.primary, // 👈 border color (light gray)
  },
  cardText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContainer: {},
  box: {
    flex: 1,
    backgroundColor: '#edf2feff',
    borderRadius: 16,
    padding: 10,
    margin: 5,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    borderLeftWidth: 6,
    borderLeftColor: Colors.primary,
    minHeight: 50,
    maxWidth: (width - 64) / getNumColumns(),
  },
  iconContainer: {
    marginBottom: 2,
  },
  boxText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a11414ff',
    textAlign: 'center',
  },
  icon: {
    color: Colors.primary,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF', // 👈 your dynamic color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    width: responsiveWidth(50),
    alignSelf: 'center',
  },

  previewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  label1: {
    color: 'white',
  },
  input: {
    height: responsiveHeight(5),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  addButton: {
    backgroundColor: 'darkblue',
    padding: 10,
    borderRadius: 8,
    margin: 20,
  },
  removeButton: {
    backgroundColor: 'darkred',
    padding: 10,
    borderRadius: 8,
    margin: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rowlabel: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: '5',
    paddingLeft: 15,
    backgroundColor: 'rgba(13, 148, 136, 1)',
    marginBottom: 5,
  },
  extraFloorContainer: {
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // background color for the whole section
    marginLeft: responsiveWidth(2),
    marginRight: responsiveWidth(2),
    paddingLeft: responsiveWidth(3),
    borderRadius: 10,
    marginVertical: 10,
  },
  labelCheckbox: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    color: '#000',
    marginRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uncheckedBox: {
    width: 16,
    height: 16,
    backgroundColor: 'white',
  },
  checkedBox: {
    width: 16,
    height: 16,
    backgroundColor: 'blue',
  },
  card: {
    backgroundColor: '#fff',
    padding: responsiveWidth(4),
    margin: responsiveWidth(4),
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginTop: 10,
  },
  surveyContainer: {
    backgroundColor: 'white',
    flex: 1,
    paddingBottom: responsiveHeight(10),
  },
  gradientWrapper: {
    marginHorizontal: responsiveWidth(4),
    marginTop: responsiveHeight(2),
  },
  gradient: {
    borderRadius: 8,
    padding: responsiveWidth(3),
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    marginBottom: responsiveHeight(1),
    fontWeight: '500',
  },
  value: {
    fontWeight: 'bold',
    color: '#000',
  },
  gradientContainer: {
    borderRadius: 10,
    margin: 10,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Android shadow
    elevation: 5,
  },
  dropdown: {
    height: 50,
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  placeholder: {
    color: '#999',
    fontSize: 16,
  },
  selectedText: {
    color: '#000',
    fontSize: 16,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 12,
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalContent: {
    marginBottom: 20,
  },
  tableContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  table: {
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tableHeaderText: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableRowAlternate: {
    backgroundColor: '#f9f9f9',
  },
  tableCellLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    paddingRight: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  remarksBox: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    margin: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  remarksText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#6c757d',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  remarksContainer: {
    marginHorizontal: responsiveWidth(3),
    marginVertical: responsiveHeight(2),
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: responsiveWidth(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  remarksLabel: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: responsiveHeight(1),
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: responsiveWidth(3),
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    minHeight: responsiveHeight(12),
    backgroundColor: '#f9f9f9',
  },
  remarksPreviewText: {
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    lineHeight: responsiveHeight(3),
    paddingHorizontal: responsiveWidth(2),
  },
  cardContainer: {
    backgroundColor: '#ffffffff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    elevation: 3, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0f3969',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    paddingBottom: 4,
  },
  cardLabel: {
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  cardValue: {
    color: '#555',
    flex: 1,
    textAlign: 'right',
  },
});
export default styles;
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { stylesAll } from "../../style";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "@/Redux/reducer/UserInfo";
import { AppDispatch, RootState } from "@/Redux/reducer/store";
import { url } from "@/Api";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Header from "@/components/Main/HeaderAll";
import { colors } from "@/assets/styles/components/colors";
import ButtonLayouts from "@/assets/tabs/buttonLayouts";

interface DropdownItem {
  label: string;
  value: string;
}

const gender: DropdownItem[] = [
  { label: "Мужской", value: "Мужской" },
  { label: "Женский", value: "Женский" },
];

const language: DropdownItem[] = [
  { label: "Кыргызча", value: "Кыргызча" },
  { label: "Русский", value: "Русский" },
];

const married: DropdownItem[] = [
  { label: "Холост/не замужем", value: "Холост/не замужем" },
  { label: "Женат/замужем", value: "Женат/замужем" },
];

const cities: DropdownItem[] = [
  { label: "Бишкек", value: "Бишкек" },
  { label: "Кант", value: "Кант" },
  { label: "Токмок", value: "Токмок" },
  { label: "Чолпон-ата", value: "Чолпон-ата" },
  { label: "Кара-Балта", value: "Кара-Балта" },
  { label: "Сокулук", value: "Сокулук" },
  { label: "Бостери", value: "Бостери" },
  { label: "Балыкчы", value: "Балыкчы" },
  { label: "Белеводское", value: "Белеводское" },
  { label: "Ош", value: "Ош" },
  { label: "Каракол", value: "Каракол" },
  { label: "Базар-Коргон", value: "Базар-Коргон" },
  { label: "Другой город", value: "Другой город" },
];

const MyDetails = () => {
  const [isPetOne, setIsPetOne] = useState(false);
  const [isPetTwo, setIsPetTwo] = useState(false);
  const [genderValue, setGenderValue] = useState<string | null>(null);
  const [languageValue, setLanguageValue] = useState<string | null>(null);
  const [marriedValue, setMarriedValue] = useState<string | null>(null);
  const [cityValue, setCityValue] = useState<string | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [info, setInfo] = useState({
    phone: "",
    first_name: "",
    last_name: "",
    birthday: new Date(),
    gender: "",
    language: "",
    married: "",
    status: "",
    city: "",
    animal: false,
    car: false,
  });

  const [loading, setLoading] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const [local, setLocal] = useState("");

  const getToken = async (): Promise<void> => {
    try {
      const storedToken = await AsyncStorage.getItem("tokenActivation");
      setLocal(storedToken);
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  };
  useEffect(() => {
    const loadUserInfo = async () => {
      await getToken();
      if (local) {
        dispatch(fetchUserInfo());
      }
    };

    loadUserInfo();
  }, [dispatch, local]);

  const headers = {
    Authorization: `Token ${local}`,
  };

  const data = useSelector((state: RootState) => state.users);
  const user = data?.user;

  useEffect(() => {
    if (user) {
      setInfo({
        phone: user.phone,
        last_name: user.last_name,
        first_name: user.first_name,
        language: user.language,
        birthday: new Date(user.birthday),
        married: user.married,
        gender: user.gender,
        status: user.status,
        city: user.city,
        animal: user.animal,
        car: user.car,
      });
      setGenderValue(user.gender);
      setLanguageValue(user.language);
      setMarriedValue(user.married);
      setCityValue(user.city);
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    setInfo((prev) => ({ ...prev, [field]: value }));
    setIsModified(true);
  };

  const createPerson = async () => {
    if (local) {
      setLoading(true);
      const post = {
        phone: info.phone,
        first_name: info.first_name,
        last_name: info.last_name,
        birthday: info.birthday.toISOString().split("T")[0],
        gender: info.gender,
        language: info.language,
        married: info.married,
        status: info.status,
        city: info.city,
        car: info.car,
        animal: info.animal,
      };
      try {
        const response = await axios.patch(
          `${url}/auth/update-user-detail`,
          post,
          {
            headers,
          }
        );
        setLoading(false);
        if (response.data.response === true) {
          setIsModified(false);

          Alert.alert("Успешно изменён!");
        } else {
          Alert.alert("Ошибка", "Не удалось сохранить изменения.");
        }
      } catch (error) {
        console.error("Error saving user details:", error);
        Alert.alert("Ошибка", "Не удалось сохранить изменения.");
        setLoading(false);
      }
    }
  };
  const toggleSwitchONe = async () => {
    const newValue = !isPetOne;
    setIsPetOne(newValue);
    try {
      if (newValue) {
        await AsyncStorage.setItem(
          "Toggle_block_one",
          JSON.stringify(newValue)
        );
      } else {
        await AsyncStorage.removeItem("Toggle_block_one");
      }
    } catch (error) {
      console.error("Failed to update switch state in AsyncStorage:", error);
    }
  };

  const toggleSwitchTwo = async () => {
    const newValue = !isPetTwo;
    setIsPetTwo(newValue);
    try {
      if (newValue) {
        await AsyncStorage.setItem(
          "Toggle_block_two",
          JSON.stringify(newValue)
        );
      } else {
        await AsyncStorage.removeItem("Toggle_block_two");
      }
    } catch (error) {
      console.error("Failed to save switch state to AsyncStorage:", error);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const saveDateToStorage = async (date: Date) => {
    try {
      await AsyncStorage.setItem("selectedDate", date.toISOString());
      setSelectedDate(date);
    } catch (error) {
      console.error("Error saving date:", error);
    }
  };

  const loadDateFromStorage = async () => {
    try {
      const savedDate = await AsyncStorage.getItem("selectedDate");
      if (savedDate) {
        const date = new Date(savedDate);
        setSelectedDate(date);
      }
    } catch (error) {
      console.error("Error loading date:", error);
    }
  };

  useEffect(() => {
    loadDateFromStorage();
  }, []);

  const handleDateChange = (date: Date) => {
    saveDateToStorage(date);
    setInfo((prev) => ({ ...prev, birthday: date }));
    setIsModified(true);
    hideDatePicker();
  };
  return (
    <ButtonLayouts handle={createPerson} title={'Сохранить'} color={isModified ? colors.feuillet : colors.gray} loading={loading} disabled={!isModified}>
    <View style={[stylesAll.background_block]}>
      <Header container={true} back={true}>Личные данные</Header>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={stylesAll.container}>
          <View
            style={[
              stylesAll.input_block_all,
              { marginTop: 0, marginBottom: 50 },
            ]}
          >
            <View style={styles.input_block}>
              <Text style={stylesAll.label}>Имя</Text>
              <TextInput
                style={[stylesAll.input, styles.input_box]}
                placeholder="Имя"
                value={info.first_name}
                onChangeText={(text) => handleInputChange("first_name", text)}
              />
            </View>
            <View style={styles.input_block}>
              <Text style={stylesAll.label}>Фамилия</Text>
              <TextInput
                style={[stylesAll.input, styles.input_box]}
                placeholder="Фамилия"
                value={info.last_name}
                onChangeText={(text) => handleInputChange("last_name", text)}
              />
            </View>
            <View style={styles.input_block}>
              <Text style={stylesAll.label}>Номер телефона</Text>
              <TextInput
                style={[stylesAll.input, styles.input_box]}
                value={info.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
                placeholder="Номер телефона"
                keyboardType="numeric"
                editable={false}
              />
            </View>
            <View style={styles.input_block}>
              <Text style={stylesAll.label}>Дата рождения</Text>
              <TouchableOpacity
                onPress={showDatePicker}
                style={[
                  stylesAll.input,
                  styles.input_box,
                  styles.input_date,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                  },
                ]}
              >
                <Text style={stylesAll.label}>
                  {selectedDate
                    ? selectedDate.toLocaleDateString()
                    : "Выберите дату рождения"}
                </Text>
                <Image
                  style={styles.more_date}
                  source={require("../../assets/images/more_bottom.png")}
                />
              </TouchableOpacity>
            </View>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateChange}
              onCancel={hideDatePicker}
              date={selectedDate || new Date()}
            />

            <View style={styles.input_block}>
              <Text style={stylesAll.label}>Пол</Text>
              <Dropdown
                style={[stylesAll.input, styles.input_box]}
                placeholder="Выберите пол"
                data={gender}
                labelField="label"
                valueField="value"
                value={genderValue}
                onChange={(item) => {
                  setGenderValue(item.value);
                  handleInputChange("gender", item.value);
                }}
              />
            </View>
            <View style={styles.input_block}>
              <Text style={stylesAll.label}>Язык</Text>
              <Dropdown
                style={[stylesAll.input, styles.input_box]}
                placeholder="Выберите язык"
                data={language}
                labelField="label"
                valueField="value"
                value={languageValue}
                onChange={(item) => {
                  setLanguageValue(item.value);
                  handleInputChange("language", item.value);
                }}
              />
            </View>
            <View style={styles.input_block}>
              <Text style={stylesAll.label}>Семейное положение</Text>
              <Dropdown
                style={[stylesAll.input, styles.input_box]}
                placeholder="Выберите семейное положение"
                data={married}
                labelField="label"
                valueField="value"
                value={marriedValue}
                onChange={(item) => {
                  setMarriedValue(item.value);
                  handleInputChange("married", item.value);
                }}
              />
            </View>
            <View style={styles.input_block}>
              <Text style={stylesAll.label}>Город</Text>
              <Dropdown
                style={[stylesAll.input, styles.input_box]}
                placeholder="Выберите город"
                data={cities}
                labelField="label"
                valueField="value"
                value={cityValue}
                onChange={(item) => {
                  setCityValue(item.value);
                  handleInputChange("city", item.value);
                  setIsModified(true);
                }}
              />
            </View>
            <View
              style={[
                styles.input_box,
                stylesAll.input,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              ]}
            >
              <Text style={styles.switch_text}>Наличие домашних животных</Text>
              <Switch
                trackColor={{ false: "#3e3e3e", true: "#9519AD" }}
                value={info.car}
                onValueChange={(value) => {
                  setInfo((prev) => ({ ...prev, car: value }));
                  toggleSwitchONe();
                  setIsModified(true);
                }}
              />
            </View>
            <View
              style={[
                stylesAll.input,
                styles.input_box,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              ]}
            >
              <Text style={styles.switch_text}>Наличие автомобиля</Text>
              <Switch
                trackColor={{ false: "#3e3e3e", true: "#9519AD" }}
                value={info.animal}
                onValueChange={(value) => {
                  setInfo((prev) => ({ ...prev, animal: value }));
                  toggleSwitchTwo();
                  setIsModified(true);
                }}
              />
            </View>
            {isModified && (
              <Text style={styles.saveReminder}>
                Есть несохраненные изменения
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      </View>
    </ButtonLayouts>

  );
};

const styles = StyleSheet.create({
  input_date: {
    position: "relative",
  },
  more_date: {
    width: 18,
    height: 18,
    position: "absolute",
    right: 10,
  },
  my_btn: {
    height: 45,
    backgroundColor: "#6B6B6B",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  switch_text: {
    fontSize: 16,
    fontWeight: "700",
    color: "#191919",
  },
  saveReminder: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  input_block: {
    flexDirection: "column",
  },
  input_box: {
    backgroundColor: colors.phon,
  },
  input_box_date: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date_picker: {
    height: 45,
    marginLeft: 0,
  },
  select_box: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 10,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#AAAAAA",
  },
  icon: {
    marginRight: 5,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default MyDetails;






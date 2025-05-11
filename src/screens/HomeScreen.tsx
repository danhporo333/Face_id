import React, { useEffect, useState } from "react";
import HomeScreenStyles from "../components/style/HomeScreen.style";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { getUserInfo } from "../services/authService";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import weekday from "dayjs/plugin/weekday";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekday);

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Login">>();
  const route = useRoute<RouteProp<RootStackParamList, "Home">>();
  const [schedule, setSchedule] = useState<any[]>([]);
  const [startOfWeek, setStartOfWeek] = useState(() =>
    dayjs().startOf("week").add(1, "day")
  ); // Thứ 2
  const [endOfWeek, setEndOfWeek] = useState(() =>
    dayjs().startOf("week").add(7, "day")
  ); // Chủ nhật

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        if (route.params?.token) {
          const data = await getUserInfo(route.params.token);
          const tkbs = data.data.tkbs;

          // 1. Tạo danh sách 7 ngày trong tuần (Thứ 2 đến Chủ nhật)
          const daysOfWeek: { label: string; date: dayjs.Dayjs }[] = [];
          for (let i = 0; i < 7; i++) {
            const d = startOfWeek.add(i, "day");
            // Lấy thứ (Thứ 2, Thứ 3, ..., Chủ nhật)
            const thu =
              d.day() === 0
                ? "Chủ nhật"
                : `Thứ ${d.day() + 1 === 8 ? 1 : d.day() + 1}`;
            daysOfWeek.push({
              label: `${thu}, ${d.format("DD/MM/YYYY")}`,
              date: d,
            });
          }

          // 2. Gom nhóm các tiết học theo ngày (dạng "DD/MM/YYYY")
          const lessonsByDate: { [date: string]: any[] } = {};
          tkbs.forEach((lesson: any) => {
            const dateStr = lesson.ngay.trim();
            if (!lessonsByDate[dateStr]) lessonsByDate[dateStr] = [];
            lessonsByDate[dateStr].push({
              period: `${lesson.tietBD}-${lesson.tietKT}`,
              subject: lesson.monHoc.tenmh,
              room: lesson.phong.tenPhong,
              thu: lesson.thu,
            });
          });

          // 3. Tạo schedule cho từng ngày trong tuần, chỉ lấy ngày có lessons
          const schedule = daysOfWeek
            .map((d) => {
              const dateStr = d.date.format("DD/MM/YYYY");
              const lessons = lessonsByDate[dateStr] || [];
              return lessons.length > 0
                ? {
                    day: d.label,
                    items: lessons,
                  }
                : null;
            })
            .filter(Boolean);

          setSchedule(schedule);
        }
      } catch (error) {
        console.log("Get schedule error:", error);
      }
    };
    fetchSchedule();
  }, [route.params, startOfWeek, endOfWeek]);

  // Chuyển tuần
  const handlePrevWeek = () => {
    setStartOfWeek((prev) => prev.subtract(7, "day"));
    setEndOfWeek((prev) => prev.subtract(7, "day"));
  };
  const handleNextWeek = () => {
    setStartOfWeek((prev) => prev.add(7, "day"));
    setEndOfWeek((prev) => prev.add(7, "day"));
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  // Hiển thị từng ngày và các tiết học trong ngày
  const renderItem = ({ item }: any) => (
    <View style={HomeScreenStyles.dayBlock}>
      <Text style={HomeScreenStyles.dayText}>{item.day}</Text>
      {item.items.map((lesson: any, idx: number) => (
        <View key={idx} style={HomeScreenStyles.lessonBlock}>
          <Text style={HomeScreenStyles.lessonLabel}>
            Tiết: <Text style={HomeScreenStyles.period}>{lesson.period}</Text>
          </Text>
          <Text style={HomeScreenStyles.lessonSubject}>
            Môn: {lesson.subject}
          </Text>
          <Text style={HomeScreenStyles.roomText}>
            Phòng: <Text style={HomeScreenStyles.roomBold}>{lesson.room}</Text>
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={HomeScreenStyles.container}>
      {/* Header */}
      <View style={HomeScreenStyles.header}>
        <Text style={HomeScreenStyles.headerTitle}>Thời khóa biểu</Text>
        <TouchableOpacity
          style={HomeScreenStyles.logoutBtn}
          onPress={handleLogout}
        >
          <Text style={HomeScreenStyles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
      {/* Thanh chuyển tuần */}
      <View style={HomeScreenStyles.weekBar}>
        <TouchableOpacity onPress={handlePrevWeek}>
          <Text style={HomeScreenStyles.arrow}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={HomeScreenStyles.weekText}>
          {startOfWeek.format("DD/MM/YYYY")} đến{" "}
          {endOfWeek.format("DD/MM/YYYY")}
        </Text>
        <TouchableOpacity onPress={handleNextWeek}>
          <Text style={HomeScreenStyles.arrow}>{">"}</Text>
        </TouchableOpacity>
      </View>
      {/* Danh sách thời khóa biểu */}
      <FlatList
        data={schedule}
        renderItem={renderItem}
        keyExtractor={(item) => item.day}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 0 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40, color: "#888" }}>
            Không có lịch học trong tuần này
          </Text>
        }
      />
    </View>
  );
};

export default HomeScreen;

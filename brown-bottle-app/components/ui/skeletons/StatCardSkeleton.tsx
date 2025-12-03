// import React from "react";
// import { View, ViewStyle } from "react-native";
// // import { MotiView } from "moti";

// type Props = {
//   style?: ViewStyle;
// };

// const StatCardSkeleton: React.FC<Props> = ({ style }) => {
//   return (
//     <View
//       style={[
//         {
//           height: 90,
//           padding: 18,
//           borderRadius: 14,
//           backgroundColor: "#f3f3f3",
//           flexDirection: "row",
//           justifyContent: "space-between",
//           alignItems: "center",
//         },
//         style,
//       ]}
//     >
//       <View>
//         {/* <MotiView
//           from={{ opacity: 0.4 }}
//           animate={{ opacity: 1 }}
//           transition={{
//             loop: true,
//             type: "timing",
//             duration: 800,
//           }} */}
//           {/* style={{
//             width: 120,
//             height: 20,
//             backgroundColor: "#dcdcdc",
//             borderRadius: 4,
//           }} */}
          
//         />

//         <MotiView
//           from={{ opacity: 0.4 }}
//           animate={{ opacity: 1 }}
//           transition={{
//             loop: true,
//             type: "timing",
//             duration: 800,
//             delay: 150,
//           }}
//           style={{
//             width: 80,
//             height: 35,
//             backgroundColor: "#dcdcdc",
//             borderRadius: 6,
//             marginTop: 10,
//           }}
//         />
//       </View>

//       <MotiView
//         from={{ opacity: 0.4 }}
//         animate={{ opacity: 1 }}
//         transition={{
//           loop: true,
//           type: "timing",
//           duration: 800,
//           delay: 300,
//         }}
//         style={{
//           width: 45,
//           height: 45,
//           borderRadius: 10,
//           backgroundColor: "#dcdcdc",
//         }}
//       />
//     </View>
//   );
// };

// export default StatCardSkeleton;
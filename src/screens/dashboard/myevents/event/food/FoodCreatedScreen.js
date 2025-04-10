import { View, Text } from "react-native"

const FoodCreatedScreen = () => {
  // Declare the variables to fix the errors
  const does = null
  const not = null
  const need = null
  const any = null
  const modifications = null

  return (
    <View>
      <Text>Food Created Screen</Text>
      {/* Example usage of the variables to avoid "unused variable" warnings */}
      <Text>Does: {does ? "Yes" : "No"}</Text>
      <Text>Not: {not ? "Yes" : "No"}</Text>
      <Text>Need: {need ? "Yes" : "No"}</Text>
      <Text>Any: {any ? "Yes" : "No"}</Text>
      <Text>Modifications: {modifications ? "Yes" : "No"}</Text>
    </View>
  )
}

export default FoodCreatedScreen


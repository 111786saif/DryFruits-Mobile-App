import React from 'react';
import { View, Text } from 'react-native';
import { commonStyles } from '../../styles/commonStyles';
import { textStyles } from '../../styles/typography';

const ForgotPasswordScreen = () => {
  return (
    <View style={[commonStyles.container, commonStyles.center]}>
      <Text style={textStyles.h2}>Forgot Password</Text>
    </View>
  );
};

export default ForgotPasswordScreen;

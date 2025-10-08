import { View, Text, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';
import { GlobalStyles } from '@/constants/GlobalStyles';
import { useSession } from '@/utils/SessionContext';

import DefaultView from '@/components/DefaultView'
import DefaultScrollView from '@/components/DefaultScrollView';
import Card from '@/components/modular/Card';

import StaffSearch from '@/components/admin/Staff/StaffSearch';

const Staff = () => {

  const { user } = useSession();


  return (

    <DefaultScrollView>

      <View style={{ marginTop: 10, width: '90%'}}>
        <StaffSearch/>
      </View>

    </DefaultScrollView>

  );

};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default Staff;
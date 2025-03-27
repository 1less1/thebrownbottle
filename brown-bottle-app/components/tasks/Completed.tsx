import {View, Text, StyleSheet} from 'react-native';
import DefaultView from '@/components/DefaultView';
import { Colors } from '@/constants/Colors';
import Card from "@/components/Card";

export default function Completed() {

    return(
        <DefaultView>
            <Card style={styles.container}>
            
            <Text style={{ textAlign: 'center', fontSize:15, fontStyle: 'italic', color: Colors.gray }}>
                No Completed Tasks yet...
            </Text>

        </Card>
        </DefaultView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        alignItems: 'center',
        paddingHorizontal: 60,
        paddingVertical: 10,
        
      },
});
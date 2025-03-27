import {View, Text} from 'react-native';
import DefaultView from '@/components/DefaultView';
import TaskList from './features/TaskList';

export default function Active() {

    return(
        <DefaultView >
            <TaskList/>
        </DefaultView>
    )
}
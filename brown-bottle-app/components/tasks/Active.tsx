import {View, Text} from 'react-native';
import DefaultScrollView from '@/components/DefaultScrollView';
import TaskList from './features/TaskList';

export default function Active() {

    return(
        <DefaultScrollView >
            <TaskList/>
        </DefaultScrollView>
    )
}
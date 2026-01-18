
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { useSession } from '@/utils/SessionContext';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
    const { user } = useSession();

    return (

        <NativeTabs
            blurEffect="systemChromeMaterialLight"
            backgroundColor={null}
            disableTransparentOnScrollEdge={false}
            tintColor={Colors.iosTabTan}
        >

            {/* Home tab: default and selected SF Symbols */}
            <NativeTabs.Trigger name="home/index">
                <Icon sf={{ default: 'house', selected: 'house.fill' }} />
                <Label>Home</Label>
            </NativeTabs.Trigger>

            {/* Tasks tab: uses a tray icon for default and filled variant for selected */}
            <NativeTabs.Trigger name="tasks/index">
                <Icon sf={{ default: 'checklist', selected: 'checklist' }} />
                <Label>Tasks</Label>
            </NativeTabs.Trigger>

            {/* Calendar tab: the calendar icon does not have a filled variant, so the same symbol is used for both states */}
            <NativeTabs.Trigger name="calendar/index">
                <Icon sf={{ default: 'calendar', selected: 'calendar' }} />
                <Label>Calendar</Label>
            </NativeTabs.Trigger>

            {/* Profile tab: uses person and person.fill for default and selected */}
            <NativeTabs.Trigger name="profile/index">
                <Icon sf={{ default: 'person', selected: 'person.fill' }} />
                <Label>Profile</Label>
            </NativeTabs.Trigger>

            {/* Admin tab: conditionally rendered based on the session user’s admin flag */}
            {user?.admin === 1 && (
                <NativeTabs.Trigger name="admin/index">
                    <Icon sf={{ default: 'shield', selected: 'shield.fill' }} />
                    <Label>Admin</Label>
                </NativeTabs.Trigger>
            )}

        </NativeTabs>
    );
}
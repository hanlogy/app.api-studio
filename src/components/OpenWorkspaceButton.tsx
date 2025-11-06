import { Button, NativeModules } from 'react-native';
import { useStudioConext } from '../states/studio/context';

export const OpenWorkspaceButton = () => {
  const {
    state: { status },
    openWorkspace,
  } = useStudioConext();

  if (status === 'initializing') {
    return <></>;
  }

  return (
    <Button
      title="Open Workspace..."
      onPress={async () => {
        try {
          const dir = await pickFolder();
          if (dir) {
            openWorkspace(dir);
          }
        } catch (err) {
          //
        }
      }}
    />
  );
};

const pickFolder = async () => {
  const { FolderPicker } = NativeModules;

  return await FolderPicker.selectFolder();
};

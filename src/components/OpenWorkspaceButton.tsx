import {Button, NativeModules} from 'react-native';
import {useStudioConext} from '../states/studio/useStudioConext';

export const OpenWorkspaceButton = () => {
  const {status, openWorkspace} = useStudioConext();

  if (status === 'initializing') {
    return <></>;
  }

  return (
    <Button
      title="Open Workspace..."
      onPress={async () => {
        try {
          const path = await pickFolder();
          if (path) {
            openWorkspace(path);
          }
        } catch (err) {
          //
        }
      }}
    />
  );
};

const pickFolder = async () => {
  const {FolderPicker} = NativeModules;

  return await FolderPicker.selectFolder();
};

import { BlockEditorCode } from '@najit-najist/ui/editor';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

export const editorJsInstancesContext = createContext<
  Map<string, BlockEditorCode>
>(new Map());

export const useEditorJSInstances = () => useContext(editorJsInstancesContext);

export const EditorJsInstancesProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [value, setValue] = useState(new Map());

  useEffect(() => {
    return () => {
      // clean it up
      setValue(new Map());
    };
  }, []);

  return (
    <editorJsInstancesContext.Provider value={value}>
      {children}
    </editorJsInstancesContext.Provider>
  );
};

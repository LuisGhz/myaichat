import { message } from "antd";
import { useAppStoreActions } from "store/app/AppStore";

export const MessageProvider = () => {
  const { setMessageApi } = useAppStoreActions();
  const [messageApi, contextHolder] = message.useMessage();
  setMessageApi(messageApi);
  return <>{contextHolder}</>;
};

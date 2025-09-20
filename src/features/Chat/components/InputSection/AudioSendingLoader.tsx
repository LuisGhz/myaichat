import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export const AudioSendingLoader = () => {
  return (
    <div className="flex justify-center my-2">
      <Spin indicator={<LoadingOutlined />} size="large" />
    </div>
  );
};

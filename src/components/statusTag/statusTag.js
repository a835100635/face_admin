/**
 * 审核状态标签
 */
import { Tag } from 'antd';
import { STATUS_OPTIONS } from '@constants/index';
function StatusTag({ status }) {
  return (
    <Tag
      color={(() => {
        switch (status) {
          case 0:
            return '#2db7f5';
          case 1:
            return '#87d068';
          case 2:
            return '#f50';
          default:
            return '';
        }
      })()}
    >
      {STATUS_OPTIONS.find((item) => item.value === status).label}
    </Tag>
  );
}

export default StatusTag;

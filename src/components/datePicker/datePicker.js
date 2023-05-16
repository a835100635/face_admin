import { DatePicker, ConfigProvider } from 'antd';
import locale from 'antd/locale/zh_CN';

const { RangePicker } = DatePicker;
function FDataPicker({ onChange, format = 'YYYY-MM-DD' }) {
  const onDateChange = (dates, dateStrings) => {
    onChange(dates, dateStrings);
  };

  return (
    <ConfigProvider locale={locale}>
      <RangePicker
        format={format}
        onChange={(dates, dateStrings) => onDateChange(dates, dateStrings)}
      />
    </ConfigProvider>
  );
}

export default FDataPicker;

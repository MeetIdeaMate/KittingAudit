import { Input } from "antd";
import { lang_en_US as translation } from "../../config/locales";
const { Search } = Input;

const UiSearchBox = ({ placeholder, handleSearch, style, searchValue ,...restProp}) => {
  const defaultPH = translation.common.search;
  return (
    <Search
      style={style}
      placeholder={placeholder || defaultPH}
    //   className={`${searchBoxClass}`}
      onSearch={handleSearch}
      onChange={(e) => handleSearch(e.target.value)}
      value={searchValue}
      {...restProp}
    />
  );
};

export default UiSearchBox;

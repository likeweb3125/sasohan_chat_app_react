import DatePicker from "react-datepicker";
import { registerLocale } from  "react-datepicker";
import ko from 'date-fns/locale/ko';
import "react-datepicker/dist/react-datepicker.css";

const InputDatepicker = (props) => {
    registerLocale('ko', ko);

    return (
        <div className="date_input">
            <div className={`custom_input ${props.class}`}>
                <DatePicker
                    selected={props.selectedDate}
                    onChange={props.ChangeHandler}
                    locale="ko"
                    dateFormat="yyyy-MM-dd"
                    value={props.value}
                    name={props.name}
                    minDate={props.minDate}
                    maxDate={props.maxDate}
                    showMonthDropdown={props.monthDrop}
                    showYearDropdown={props.yearDrop}
                    scrollableYearDropdown
                />
            </div>
        </div>
    );
};

export default InputDatepicker;

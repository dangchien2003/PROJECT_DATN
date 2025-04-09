import { useEffect, useState } from 'react'
import QuillEditor from '../QuillEditor'
import { useSelector } from 'react-redux';
import { useMessageError } from '@/hook/validate';
import InputLabel from '../InputLabel';
import InputError from '../InputError';

const QuillEditorInput = ({
  label,
  defaultValue = "",
  callbackChangeValue,
  itemKey,
  disable,
  maxLength,
  minLength,
}) => {
  const [value, setValue] = useState(defaultValue);
  const fieldError = useSelector(state => state.fieldError);
  const requireKeys = useSelector(state => state.requireField);
  const [require, setRequire] = useState(false)
  const {pushMessage, deleteKey} = useMessageError();

  useEffect(()=> {
    if(Array.isArray(requireKeys) && itemKey) {
      setRequire(requireKeys.includes(itemKey))
    }
  }, [requireKeys, itemKey])

  useEffect(() => {
    if (value !== defaultValue) {
      setValue(defaultValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  const handleChangeValue = (newValue) => {
    if(require) {
      if(newValue.length === 0 || newValue === "<p><br></p>") {
        pushMessage(itemKey, "Không được để trống trường " + label?.toLowerCase());
      } else {
        deleteKey(itemKey);
      }
    }

    if(minLength) {
      if(newValue.length < minLength) {
        pushMessage(itemKey, "Dữ liệu " + label?.toLowerCase() + " chưa đủ " + minLength + " ký tự");
      } else if(fieldError) {
        deleteKey(itemKey);
      }
    }

    if(maxLength) {
      if(newValue.length > maxLength) {
        return;
      }
    }

    setValue(newValue);
    if (newValue === "<p><br></p>") {
      callbackChangeValue?.(itemKey, null)
    } else {
      callbackChangeValue?.(itemKey, newValue)
    }
  }
  return (
    <div style={{paddingTop: 8}}>
      <div
      style={{
        position: "relative",
        padding: "16px 8px",
        paddingBottom: 0,
        borderTop: "1px solid #B9B7B7",
        margin: 16,
      }}
    >
      <InputLabel label={label} require={require}/>
    </div>
      <QuillEditor
        itemKey={itemKey}
        value={value}
        onChange={handleChangeValue}
        readonly={disable}
        style={{margin: "15px 30px", marginTop: 0}} 
      />
      <div style={{marginTop: 50, paddingLeft: 30}}>
        <InputError itemKey={itemKey}/>
      </div>
    </div>
  )
}

export default QuillEditorInput

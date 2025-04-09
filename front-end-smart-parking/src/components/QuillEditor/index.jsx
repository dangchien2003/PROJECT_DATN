import { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new'
import 'react-quill/dist/quill.snow.css'
import { useSelector } from 'react-redux';

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
    ['link', 'image', 'video'],
    ['code-block'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false
  }
};


const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'indent',
  'link',
  'image',
  'video',
  'code-block',
  'align'
]
const QuillEditor = ({ onChange, value, readonly, itemKey, style = {} }) => {
  const keyFocus = useSelector((state) => state.focus);
  const inputRef = useRef();

  useEffect(()=> {
    if(keyFocus === itemKey) {
      inputRef.current?.focus();
    }
  }, [keyFocus, itemKey])
  return (
    <ReactQuill theme='snow' value={value}
      ref={inputRef}
      modules={modules}
      formats={formats}
      style={{ ...style, height: '400px', paddingBottom: '20px' }}
      onChange={onChange}
      readOnly={readonly}
    />
  )
}

export default QuillEditor

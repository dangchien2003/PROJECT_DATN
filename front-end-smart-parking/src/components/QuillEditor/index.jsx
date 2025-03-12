import ReactQuill from 'react-quill-new'
import 'react-quill/dist/quill.snow.css'

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }], // ✅ Định nghĩa chính xác
    [{ indent: '-1' }, { indent: '+1' }],
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
  'code-block'
]
const QuillEditor = ({ onChange, value, readonly, style = {} }) => {
  return (
    <ReactQuill theme='snow' value={value}
      modules={modules}
      formats={formats}
      style={{ ...style, height: '400px', paddingBottom: '20px' }}
      onChange={onChange}
      readOnly={readonly}
    />
  )
}

export default QuillEditor

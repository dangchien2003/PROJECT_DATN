import LoadingComponent from '@/components/LoadingComponent';
import ReactDOM from 'react-dom/client';

// Map refElement → root
const loadingRootMap = new Map();

export function componentLoading(ref, loading, background = null, transparent = true) {
  if (!ref?.current) return;

  if (loading) {
    const wrapperId = 'component-loading-wrapper';
    const existing = ref.current.querySelector(`#${wrapperId}`);
    if (existing) return; // đã render rồi thì bỏ qua

    const wrapper = document.createElement('div');
    wrapper.id = wrapperId;
    ref.current.appendChild(wrapper);

    const root = ReactDOM.createRoot(wrapper);
    root.render(<LoadingComponent background={background} transparent={transparent}/>);
    loadingRootMap.set(ref.current, root); // lưu root cho ref cụ thể
  } else {
    const wrapper = ref.current.querySelector('#component-loading-wrapper');
    if (wrapper) {
      const root = loadingRootMap.get(ref.current);
      if (root) {
        root.unmount();
        loadingRootMap.delete(ref.current);
      }
      wrapper.remove();
    }
  }
}

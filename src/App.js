import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { RouterNavigation } from './routers';
import { UiLoadingSpinner, UiToastNotification } from './components';
import { useSelector } from 'react-redux';

function App() {
    const spinner = useSelector(state => state.isLoading?.loading);

  return (
            <>
            <BrowserRouter>
                <UiLoadingSpinner spinning={spinner} />
                <RouterNavigation />
                {/* {openModal && <HardNotification isOpen={openModal} hardNotificationResult={hardResult} handleCloseNotification={handleCloseNotification} />} */}
            </BrowserRouter>
            <UiToastNotification/>
        </>
  );
}

export default App;

import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

function Layout({ children }) {
    return (
        <div>
            <Header />
            <div className="app-body">
                <Sidebar />
                <div className="page-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Layout;
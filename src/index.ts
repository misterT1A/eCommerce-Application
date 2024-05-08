import LoginPage from '@components/login/login-page';
import './index.html';
import './style.scss';

const loginPage = new LoginPage();
document.body.append(loginPage.getNode());
